'use client';
import { useState } from 'react';
import { Save, RotateCcw, Check, MessageCircle } from 'lucide-react';
import { trackLeadConversion } from '@/lib/gtag';

interface LeadFormProps {
    lead?: any;
    onSuccess: () => void;
    onCancel: () => void;
}

export default function LeadForm({ lead, onSuccess, onCancel }: LeadFormProps) {
    const [formData, setFormData] = useState({
        name: lead?.name || '',
        phone: lead?.phone || '',
        email: lead?.email || '',
        city: lead?.city || '',
        source: lead?.source || 'SITE',
        status: lead?.status || 'NEW',
        notes: lead?.notes || '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successData, setSuccessData] = useState<{ whatsapp_url: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const url = lead ? `/api/leads/${lead.id}` : '/api/leads';
            const method = lead ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                const data = await res.json();
                if (method === 'POST') {
                    // Track conversion in Google Ads for new leads only
                    trackLeadConversion();
                    setSuccessData(data); // Mostra modal de sucesso com WhatsApp
                } else {
                    onSuccess(); // Edição apenas fecha
                }
            } else {
                const data = await res.json();
                setError(data.error || 'Erro ao processar solicitação');
            }
        } catch (_err) {
            setError('Falha na comunicação com o servidor');
        } finally {
            setLoading(false);
        }
    };

    if (successData) {
        return (
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center space-y-6 animate-in zoom-in-95 duration-300">
                <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center shadow-sm">
                    <Check size={40} strokeWidth={3} />
                </div>

                <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-gray-800">Cadastro Realizado!</h3>
                    <p className="text-gray-500 max-w-xs mx-auto text-sm">
                        O lead foi salvo no sistema com sucesso. Clique abaixo para iniciar o atendimento.
                    </p>
                </div>

                <div className="w-full max-w-sm space-y-3 pt-2">
                    <a
                        href={successData.whatsapp_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-whatsapp w-full py-4 text-sm shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all"
                        onClick={() => setTimeout(onSuccess, 2000)} // Fecha o modal após clique (opcional)
                    >
                        <MessageCircle size={20} fill="white" />
                        Abrir WhatsApp do Cliente
                    </a>

                    <button
                        onClick={onSuccess}
                        className="w-full py-3 text-gray-400 hover:text-gray-600 text-xs font-medium uppercase tracking-wider hover:bg-gray-50 rounded-lg transition-colors"
                    >
                        Fechar e Voltar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Nome Completo</label>
                    <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="input-primary"
                        placeholder="Ex: João Silva"
                    />
                </div>

                <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">WhatsApp / Telefone</label>
                    <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="input-primary"
                        placeholder="Ex: (11) 99999-9999"
                    />
                </div>

                <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">E-mail</label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="input-primary"
                        placeholder="contato@exemplo.com"
                    />
                </div>

                <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Cidade / Região</label>
                    <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="input-primary"
                        placeholder="Ex: São Paulo - Brás"
                    />
                </div>

                <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Origem do Lead</label>
                    <select
                        value={formData.source}
                        onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                        className="input-primary appearance-none cursor-pointer"
                    >
                        <option value="SITE">Site Oficial</option>
                        <option value="WHATSAPP">WhatsApp Direto</option>
                        <option value="ADVERTISEMENT">Campanha / Anúncio</option>
                        <option value="MANUAL">Cadastro Manual</option>
                    </select>
                </div>

                <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Status Interno</label>
                    <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="input-primary appearance-none cursor-pointer"
                    >
                        <option value="NEW">Novo Registro</option>
                        <option value="CONTACTED">Em Contato / Sondagem</option>
                        <option value="PROPOSAL">Proposta Enviada</option>
                        <option value="CLOSED_WON">Venda Realizada</option>
                        <option value="CLOSED_LOST">Arquivado / Perdido</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Observações e Requisitos</label>
                <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="input-primary resize-none"
                    placeholder="Detalhes adicionais sobre o pedido ou cliente..."
                />
            </div>

            {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 text-[11px] font-bold uppercase tracking-wider px-4 py-3 rounded-lg text-center">
                    {error}
                </div>
            )}

            <div className="flex gap-4 pt-2">
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 btn-primary"
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <RotateCcw size={16} className="animate-spin" />
                            Processando...
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            <Save size={16} />
                            {lead ? 'Salvar Alterações' : 'Confirmar Cadastro'}
                        </span>
                    )}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-8 btn-secondary"
                >
                    Voltar
                </button>
            </div>
        </form>
    );
}
