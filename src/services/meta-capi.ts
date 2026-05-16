// ============================================================
// meta-capi.ts — Meta Conversions API (CAPI) para CRM Leads
//
// Documentação:
//   https://developers.facebook.com/docs/marketing-api/conversions-api/
//
// Dataset ID : 1369616001422186
// Endpoint   : https://graph.facebook.com/v25.0/{dataset_id}/events
// ============================================================

import crypto from 'crypto';

// ─── Configuração ────────────────────────────────────────────────────────────

const META_API_VERSION = 'v25.0';
const META_DATASET_ID  = '1369616001422186';
const META_CAPI_URL    = `https://graph.facebook.com/${META_API_VERSION}/${META_DATASET_ID}/events`;

/**
 * Converte um status interno do CRM para o event_name esperado pela Meta.
 *
 * Estágios do funil mapeados:
 *   NEW          → Lead          (lead chegou no sistema)
 *   CONTACTED    → Contact       (primeiro contato realizado)
 *   PROPOSAL     → Schedule      (proposta/orçamento enviado)
 *   CLOSED_WON   → Purchase      (venda concluída)
 *   CLOSED_LOST  → (sem evento)  (descartado — não enviamos)
 */
const STATUS_TO_EVENT: Record<string, string | null> = {
    NEW:         'Lead',
    CONTACTED:   'Contact',
    PROPOSAL:    'Schedule',
    CLOSED_WON:  'Purchase',
    CLOSED_LOST: null, // Não dispara evento para leads perdidos
};

// ─── Hashing (SHA-256 normalizado) ───────────────────────────────────────────

/**
 * Normaliza e converte em hash SHA-256 uma string de PII.
 * A Meta exige: lowercase, sem espaços extras, sem acento → hash SHA-256 hex.
 */
function hashPII(value: string | null | undefined): string | null {
    if (!value) return null;
    const normalized = value.trim().toLowerCase();
    return crypto.createHash('sha256').update(normalized).digest('hex');
}

/**
 * Normaliza telefone para o formato E.164 sem o "+" antes de fazer hash.
 * Exemplo: "(11) 99289-1070" → "5511992891070"
 */
function hashPhone(phone: string | null | undefined): string | null {
    if (!phone) return null;
    // Remove tudo que não é dígito
    const digits = phone.replace(/\D/g, '');
    // Garante prefixo 55 (Brasil) se não tiver
    const e164 = digits.startsWith('55') ? digits : `55${digits}`;
    return crypto.createHash('sha256').update(e164).digest('hex');
}

// ─── Tipos ───────────────────────────────────────────────────────────────────

export interface MetaCapiLeadData {
    /** Status atual do lead (NEW, CONTACTED, PROPOSAL, CLOSED_WON, CLOSED_LOST) */
    status: string;
    /** E-mail do lead (será convertido em hash) */
    email?: string | null;
    /** Telefone do lead (será convertido em hash) */
    phone?: string | null;
    /** lead_id gerado pela Meta (se disponível — vem do formulário de leads do Facebook) */
    metaLeadId?: string | null;
    /** fbc — cookie _fbc do navegador (Click ID) */
    fbc?: string | null;
    /** fbp — cookie _fbp do navegador */
    fbp?: string | null;
    /** IP do cliente (para server-side matching) */
    clientIp?: string | null;
    /** User Agent do cliente */
    userAgent?: string | null;
    /** Nome do cliente (para hash de fn) */
    name?: string | null;
    /** Cidade do cliente */
    city?: string | null;
    /** test_event_code para testes no Events Manager (apenas dev) */
    testEventCode?: string;
}

export interface MetaCapiResult {
    success: boolean;
    eventId?: string;
    error?: string;
}

// ─── Função principal ─────────────────────────────────────────────────────────

/**
 * Dispara um evento de lead para a Meta Conversions API.
 *
 * @param leadData  Dados do lead a enviar
 * @returns         Resultado { success, eventId?, error? }
 */
export async function sendLeadEventToMeta(
    leadData: MetaCapiLeadData
): Promise<MetaCapiResult> {
    const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
    if (!accessToken) {
        // Silêncio em produção se a variável não estiver configurada
        if (process.env.NODE_ENV === 'development') {
            console.warn('[Meta CAPI] META_CAPI_ACCESS_TOKEN não configurado — evento ignorado.');
        }
        return { success: false, error: 'Token não configurado' };
    }

    // Determina o event_name com base no status do CRM
    const eventName = STATUS_TO_EVENT[leadData.status.toUpperCase()];
    if (!eventName) {
        // Status não mapeado (ex: CLOSED_LOST) — não envia
        return { success: true, eventId: 'skipped' };
    }

    // Identificador único do evento (idempotência)
    const eventId = crypto.randomUUID();
    const eventTime = Math.floor(Date.now() / 1000);

    // Monta user_data com valores em hash
    const userData: Record<string, unknown> = {};

    const hashedEmail = hashPII(leadData.email);
    if (hashedEmail) userData['em'] = [hashedEmail];

    const hashedPhone = hashPhone(leadData.phone);
    if (hashedPhone) userData['ph'] = [hashedPhone];

    // Nome: apenas o primeiro nome em hash (fn)
    if (leadData.name) {
        const firstName = leadData.name.trim().split(' ')[0];
        const hashedFn = hashPII(firstName);
        if (hashedFn) userData['fn'] = [hashedFn];
    }

    // Cidade em hash
    const hashedCity = hashPII(leadData.city);
    if (hashedCity) userData['ct'] = [hashedCity];

    // País (sempre Brasil)
    userData['country'] = [hashPII('br')!];

    // lead_id gerado pela Meta (ex: formulário de lead ads)
    if (leadData.metaLeadId) {
        userData['lead_id'] = leadData.metaLeadId;
    }

    // Click ID e fbp (cookies do browser)
    if (leadData.fbc) userData['fbc'] = leadData.fbc;
    if (leadData.fbp) userData['fbp'] = leadData.fbp;

    // Server-side matching
    if (leadData.clientIp)   userData['client_ip_address']  = leadData.clientIp;
    if (leadData.userAgent)  userData['client_user_agent']  = leadData.userAgent;

    // Monta o payload
    const payload: Record<string, unknown> = {
        data: [
            {
                event_id:      eventId,
                event_name:    eventName,
                event_time:    eventTime,
                action_source: 'system_generated',
                custom_data: {
                    event_source:      'crm',
                    lead_event_source: 'Cortinas Brás CRM',
                },
                user_data: userData,
            },
        ],
    };

    // test_event_code (opcional — lido do env ou passado explicitamente)
    const testCode = leadData.testEventCode ?? process.env.META_CAPI_TEST_CODE;
    if (testCode) {
        payload['test_event_code'] = testCode;
    }

    try {
        const url = `${META_CAPI_URL}?access_token=${accessToken}`;

        const res = await fetch(url, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(payload),
        });

        const json = await res.json() as Record<string, unknown>;

        if (!res.ok) {
            const err = JSON.stringify(json);
            console.error(`[Meta CAPI] Erro ${res.status}:`, err);
            return { success: false, error: err };
        }

        if (process.env.NODE_ENV === 'development') {
            console.log(`[Meta CAPI] ✅ Evento "${eventName}" enviado. ID: ${eventId}`, json);
        }

        return { success: true, eventId };

    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.error('[Meta CAPI] Erro de rede:', message);
        return { success: false, error: message };
    }
}
