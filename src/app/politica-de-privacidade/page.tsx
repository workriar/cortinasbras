import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Política de Privacidade | Cortinas Brás',
    description: 'Política de Privacidade da Cortinas Brás. Saiba como coletamos, usamos e protegemos seus dados pessoais.',
    robots: 'index, follow',
};

export default function PoliticaPrivacidade() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex justify-start mb-6">
                        <a href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 transition-colors group">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 transform group-hover:-translate-x-1 transition-transform">
                                <path d="m15 18-6-6 6-6" />
                            </svg>
                            Voltar para Início
                        </a>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Política de Privacidade
                    </h1>
                    <p className="text-gray-600">
                        Última atualização: 24 de dezembro de 2024
                    </p>
                </div>

                {/* Content */}
                <div className="prose prose-lg max-w-none">
                    <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                1. Introdução
                            </h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                A <strong>Cortinas Brás</strong>, com sede na AVENIDA CELSO GARCIA, 129 - Brás, São Paulo - SP,
                                CEP 03015-000, está comprometida em proteger a privacidade e os dados pessoais de seus clientes
                                e visitantes do site <strong>cortinasbras.com.br</strong>.
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                                Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas
                                informações pessoais, em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018)
                                e demais legislações aplicáveis.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                2. Informações que Coletamos
                            </h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Coletamos as seguintes informações quando você utiliza nosso site ou serviços:
                            </p>

                            <h3 className="text-xl font-semibold text-gray-800 mb-3">
                                2.1. Informações Fornecidas por Você
                            </h3>
                            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                                <li><strong>Dados de Identificação:</strong> Nome completo</li>
                                <li><strong>Dados de Contato:</strong> Número de telefone/WhatsApp, e-mail</li>
                                <li><strong>Dados de Localização:</strong> Cidade e bairro</li>
                                <li><strong>Dados do Projeto:</strong> Medidas de cortinas, tipo de produto desejado,
                                    detalhes específicos do projeto, fotos do ambiente (quando fornecidas)</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-gray-800 mb-3">
                                2.2. Informações Coletadas Automaticamente
                            </h3>
                            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                                <li><strong>Dados de Navegação:</strong> Endereço IP, tipo de navegador, páginas visitadas,
                                    tempo de permanência no site</li>
                                <li><strong>Cookies:</strong> Utilizamos cookies para melhorar sua experiência de navegação
                                    (veja seção 7)</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                3. Como Utilizamos suas Informações
                            </h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Utilizamos suas informações pessoais para as seguintes finalidades:
                            </p>
                            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                                <li><strong>Atendimento de Solicitações:</strong> Processar orçamentos, responder dúvidas
                                    e fornecer informações sobre produtos e serviços</li>
                                <li><strong>Comunicação:</strong> Entrar em contato via WhatsApp, telefone ou e-mail para
                                    dar seguimento ao seu pedido</li>
                                <li><strong>Elaboração de Orçamentos:</strong> Preparar propostas personalizadas com base
                                    nas medidas e especificações fornecidas</li>
                                <li><strong>Melhoria de Serviços:</strong> Analisar o uso do site para aprimorar nossos
                                    produtos e serviços</li>
                                <li><strong>Cumprimento Legal:</strong> Atender obrigações legais e regulatórias</li>
                                <li><strong>Marketing:</strong> Enviar promoções e novidades (somente com seu consentimento
                                    prévio)</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                4. Base Legal para o Tratamento de Dados
                            </h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                O tratamento de seus dados pessoais é realizado com base nas seguintes hipóteses legais
                                previstas na LGPD:
                            </p>
                            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                                <li><strong>Consentimento:</strong> Ao preencher nossos formulários, você consente com
                                    o tratamento de seus dados</li>
                                <li><strong>Execução de Contrato:</strong> Para processar orçamentos e prestar serviços
                                    solicitados</li>
                                <li><strong>Legítimo Interesse:</strong> Para melhorar nossos serviços e comunicação com clientes</li>
                                <li><strong>Obrigação Legal:</strong> Para cumprir obrigações fiscais e regulatórias</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                5. Compartilhamento de Informações
                            </h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                A Cortinas Brás não vende, aluga ou compartilha suas informações pessoais com terceiros,
                                exceto nas seguintes situações:
                            </p>
                            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                                <li><strong>Prestadores de Serviços:</strong> Empresas que nos auxiliam na operação do site,
                                    processamento de pagamentos, envio de e-mails e armazenamento de dados (todos sujeitos
                                    a obrigações de confidencialidade)</li>
                                <li><strong>WhatsApp:</strong> Quando você opta por continuar o atendimento via WhatsApp,
                                    seus dados são compartilhados com a plataforma Meta</li>
                                <li><strong>Obrigações Legais:</strong> Quando exigido por lei, ordem judicial ou autoridades
                                    competentes</li>
                                <li><strong>Proteção de Direitos:</strong> Para proteger nossos direitos, privacidade,
                                    segurança ou propriedade</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                6. Armazenamento e Segurança dos Dados
                            </h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Implementamos medidas técnicas e organizacionais adequadas para proteger suas informações
                                pessoais contra acesso não autorizado, perda, destruição ou alteração:
                            </p>
                            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                                <li><strong>Criptografia:</strong> Utilizamos SSL/TLS para proteger a transmissão de dados</li>
                                <li><strong>Acesso Restrito:</strong> Apenas colaboradores autorizados têm acesso aos dados pessoais</li>
                                <li><strong>Servidores Seguros:</strong> Seus dados são armazenados em servidores protegidos</li>
                                <li><strong>Backup Regular:</strong> Realizamos backups periódicos para prevenir perda de dados</li>
                            </ul>
                            <p className="text-gray-700 leading-relaxed">
                                <strong>Retenção de Dados:</strong> Mantemos seus dados pessoais pelo tempo necessário para
                                cumprir as finalidades descritas nesta política, ou conforme exigido por lei. Após esse período,
                                os dados são eliminados de forma segura.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                7. Cookies e Tecnologias Similares
                            </h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Utilizamos cookies e tecnologias similares para:
                            </p>
                            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                                <li>Melhorar a funcionalidade do site</li>
                                <li>Analisar o tráfego e comportamento dos visitantes</li>
                                <li>Personalizar sua experiência de navegação</li>
                                <li>Lembrar suas preferências</li>
                            </ul>
                            <p className="text-gray-700 leading-relaxed">
                                Você pode configurar seu navegador para recusar cookies, mas isso pode afetar algumas
                                funcionalidades do site.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                8. Seus Direitos (LGPD)
                            </h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                De acordo com a LGPD, você tem os seguintes direitos em relação aos seus dados pessoais:
                            </p>
                            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                                <li><strong>Confirmação e Acesso:</strong> Confirmar se tratamos seus dados e acessá-los</li>
                                <li><strong>Correção:</strong> Solicitar a correção de dados incompletos, inexatos ou desatualizados</li>
                                <li><strong>Anonimização, Bloqueio ou Eliminação:</strong> Solicitar a anonimização, bloqueio
                                    ou eliminação de dados desnecessários ou excessivos</li>
                                <li><strong>Portabilidade:</strong> Solicitar a portabilidade de seus dados a outro fornecedor</li>
                                <li><strong>Revogação do Consentimento:</strong> Revogar seu consentimento a qualquer momento</li>
                                <li><strong>Informação sobre Compartilhamento:</strong> Saber com quem compartilhamos seus dados</li>
                                <li><strong>Oposição:</strong> Opor-se ao tratamento de dados em determinadas situações</li>
                            </ul>
                            <p className="text-gray-700 leading-relaxed">
                                Para exercer seus direitos, entre em contato conosco através do e-mail:
                                <strong> loja@cortinasbras.com.br</strong> ou WhatsApp: <strong>(11) 2081-1010</strong>
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                9. Links para Sites de Terceiros
                            </h2>
                            <p className="text-gray-700 leading-relaxed">
                                Nosso site pode conter links para sites de terceiros (como WhatsApp, redes sociais).
                                Não nos responsabilizamos pelas práticas de privacidade desses sites. Recomendamos que
                                você leia as políticas de privacidade de cada site que visitar.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                10. Menores de Idade
                            </h2>
                            <p className="text-gray-700 leading-relaxed">
                                Nossos serviços não são direcionados a menores de 18 anos. Não coletamos intencionalmente
                                dados de menores. Se você é pai/mãe ou responsável e acredita que seu filho forneceu dados
                                pessoais, entre em contato conosco para que possamos removê-los.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                11. Alterações nesta Política
                            </h2>
                            <p className="text-gray-700 leading-relaxed">
                                Podemos atualizar esta Política de Privacidade periodicamente. A data da última atualização
                                será sempre indicada no topo desta página. Recomendamos que você revise esta política
                                regularmente para se manter informado sobre como protegemos seus dados.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                12. Contato
                            </h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Se você tiver dúvidas, preocupações ou solicitações relacionadas a esta Política de Privacidade
                                ou ao tratamento de seus dados pessoais, entre em contato conosco:
                            </p>
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <p className="text-gray-700 mb-2">
                                    <strong>Cortinas Brás</strong>
                                </p>
                                <p className="text-gray-700 mb-2">
                                    <strong>Endereço:</strong> Avenida Celso Garcia, 129 - Brás, São Paulo - SP, CEP 03015-000
                                </p>
                                <p className="text-gray-700 mb-2">
                                    <strong>E-mail:</strong> loja@cortinasbras.com.br
                                </p>
                                <p className="text-gray-700 mb-2">
                                    <strong>WhatsApp:</strong> (11) 99289-1070
                                </p>
                                <p className="text-gray-700">
                                    <strong>Horário de Atendimento:</strong> Segunda a Sexta, das 8h às 17h | Sábado, das 9h às 18h
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                13. Encarregado de Dados (DPO)
                            </h2>
                            <p className="text-gray-700 leading-relaxed">
                                Para questões específicas sobre proteção de dados, você pode entrar em contato com nosso
                                Encarregado de Dados através do e-mail: <strong>loja@cortinasbras.com.br</strong>
                            </p>
                        </section>
                    </div>

                    {/* Footer Note */}
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
                        <p className="text-blue-900 font-medium mb-2">
                            Ao utilizar nosso site e serviços, você concorda com esta Política de Privacidade.
                        </p>
                        <p className="text-blue-800 text-sm">
                            Se você não concordar com qualquer parte desta política, por favor, não utilize nosso site.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
