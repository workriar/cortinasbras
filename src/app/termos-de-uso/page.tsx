import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Termos de Uso | Cortinas Brás',
    description: 'Termos de Uso do site Cortinas Brás. Conheça as regras e condições para utilização de nossos serviços.',
    robots: 'index, follow',
};

export default function TermosDeUso() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Termos de Uso
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
                                1. Aceitação dos Termos
                            </h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Bem-vindo ao site da <strong>Cortinas Brás</strong> (<strong>cortinasbras.com.br</strong>).
                                Ao acessar e utilizar este site, você concorda em cumprir e estar vinculado aos seguintes
                                Termos de Uso.
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                                Se você não concordar com qualquer parte destes termos, por favor, não utilize nosso site.
                                Reservamo-nos o direito de modificar estes termos a qualquer momento, e tais modificações
                                entrarão em vigor imediatamente após sua publicação no site.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                2. Sobre a Cortinas Brás
                            </h2>
                            <div className="bg-gray-50 p-6 rounded-lg mb-4">
                                <p className="text-gray-700 mb-2">
                                    <strong>Razão Social:</strong>Cortinas Brás
                                </p>
                                <p className="text-gray-700 mb-2">
                                    <strong>Endereço:</strong> Avenida Celso Garcia, 129 - Brás, São Paulo - SP, CEP 03042-001
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

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                3. Uso do Site
                            </h2>

                            <h3 className="text-xl font-semibold text-gray-800 mb-3">
                                3.1. Finalidade
                            </h3>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Este site tem como finalidade fornecer informações sobre nossos produtos e serviços,
                                permitir solicitações de orçamento e facilitar o contato entre clientes e a Cortinas Brás.
                            </p>

                            <h3 className="text-xl font-semibold text-gray-800 mb-3">
                                3.2. Uso Permitido
                            </h3>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Você concorda em utilizar este site apenas para fins lícitos e de acordo com estes Termos.
                                É proibido:
                            </p>
                            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                                <li>Utilizar o site de qualquer maneira que possa danificar, desabilitar, sobrecarregar
                                    ou prejudicar nossos servidores ou redes</li>
                                <li>Tentar obter acesso não autorizado a qualquer parte do site, sistemas ou redes</li>
                                <li>Utilizar robôs, spiders, scrapers ou outras ferramentas automatizadas para acessar
                                    o site sem nossa autorização prévia</li>
                                <li>Reproduzir, duplicar, copiar, vender ou explorar comercialmente qualquer parte do
                                    site sem nossa autorização expressa</li>
                                <li>Transmitir vírus, malware ou qualquer código malicioso</li>
                                <li>Violar direitos de propriedade intelectual da Cortinas Brás ou de terceiros</li>
                                <li>Fornecer informações falsas, enganosas ou fraudulentas</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-gray-800 mb-3">
                                3.3. Cadastro e Informações
                            </h3>
                            <p className="text-gray-700 leading-relaxed">
                                Ao preencher formulários em nosso site, você se compromete a fornecer informações verdadeiras,
                                precisas, atuais e completas. Você é responsável por manter a confidencialidade de suas
                                informações de contato.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                4. Solicitação de Orçamentos
                            </h2>

                            <h3 className="text-xl font-semibold text-gray-800 mb-3">
                                4.1. Processo de Orçamento
                            </h3>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Os orçamentos solicitados através do site são gratuitos e não vinculam a Cortinas Brás
                                a qualquer obrigação de venda. Os orçamentos são elaborados com base nas informações
                                fornecidas por você e podem ser ajustados após visita técnica ou análise mais detalhada.
                            </p>

                            <h3 className="text-xl font-semibold text-gray-800 mb-3">
                                4.2. Validade
                            </h3>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Os orçamentos têm validade de 7 (sete) dias corridos a partir da data de emissão,
                                salvo disposição em contrário expressa no próprio orçamento.
                            </p>

                            <h3 className="text-xl font-semibold text-gray-800 mb-3">
                                4.3. Medidas e Especificações
                            </h3>
                            <p className="text-gray-700 leading-relaxed">
                                As medidas fornecidas por você são de sua responsabilidade. Recomendamos sempre a
                                confirmação por um profissional técnico antes da produção. A Cortinas Brás não se
                                responsabiliza por erros de medição fornecidos pelo cliente.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                5. Produtos e Serviços
                            </h2>

                            <h3 className="text-xl font-semibold text-gray-800 mb-3">
                                5.1. Descrições e Imagens
                            </h3>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Fazemos todos os esforços para exibir com precisão as cores, características e detalhes
                                de nossos produtos. No entanto, as cores reais podem variar ligeiramente devido às
                                configurações de monitor e iluminação. As imagens são meramente ilustrativas.
                            </p>

                            <h3 className="text-xl font-semibold text-gray-800 mb-3">
                                5.2. Disponibilidade
                            </h3>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Todos os produtos estão sujeitos a disponibilidade. Reservamo-nos o direito de descontinuar
                                qualquer produto a qualquer momento.
                            </p>

                            <h3 className="text-xl font-semibold text-gray-800 mb-3">
                                5.3. Preços
                            </h3>
                            <p className="text-gray-700 leading-relaxed">
                                Os preços exibidos no site são meramente informativos e podem sofrer alterações sem aviso
                                prévio. O preço final será sempre confirmado no orçamento oficial.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                6. Propriedade Intelectual
                            </h2>

                            <h3 className="text-xl font-semibold text-gray-800 mb-3">
                                6.1. Direitos Autorais
                            </h3>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Todo o conteúdo deste site, incluindo mas não se limitando a textos, gráficos, logos,
                                ícones, imagens, clipes de áudio, downloads digitais e compilações de dados, é propriedade
                                da Cortinas Brás ou de seus fornecedores de conteúdo e está protegido por leis brasileiras
                                e internacionais de direitos autorais.
                            </p>

                            <h3 className="text-xl font-semibold text-gray-800 mb-3">
                                6.2. Marcas Registradas
                            </h3>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                "Cortinas Brás" e outros logos e marcas exibidos neste site são marcas registradas ou
                                marcas comerciais da Cortinas Brás. Você não está autorizado a usar essas marcas sem
                                nossa permissão prévia por escrito.
                            </p>

                            <h3 className="text-xl font-semibold text-gray-800 mb-3">
                                6.3. Licença de Uso
                            </h3>
                            <p className="text-gray-700 leading-relaxed">
                                Concedemos a você uma licença limitada, não exclusiva e não transferível para acessar
                                e fazer uso pessoal deste site. Esta licença não inclui o direito de:
                            </p>
                            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                                <li>Revender ou fazer uso comercial do site ou seu conteúdo</li>
                                <li>Fazer qualquer uso derivado deste site ou seu conteúdo</li>
                                <li>Baixar ou copiar informações de conta para benefício de outro comerciante</li>
                                <li>Usar ferramentas de data mining, robôs ou similares</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                7. Privacidade e Proteção de Dados
                            </h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                O uso de informações pessoais coletadas através deste site está sujeito à nossa
                                <a href="/politica-de-privacidade" className="text-blue-600 hover:text-blue-800 underline ml-1">
                                    Política de Privacidade
                                </a>, que faz parte integrante destes Termos de Uso.
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                                Ao utilizar nosso site, você consente com a coleta e uso de suas informações conforme
                                descrito em nossa Política de Privacidade, em conformidade com a Lei Geral de Proteção
                                de Dados (LGPD).
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                8. Links para Sites de Terceiros
                            </h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Nosso site pode conter links para sites de terceiros (como WhatsApp, redes sociais,
                                fornecedores). Esses links são fornecidos apenas para sua conveniência.
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                                Não temos controle sobre o conteúdo desses sites e não nos responsabilizamos por eles
                                ou por qualquer perda ou dano que possa surgir do seu uso. A inclusão de qualquer link
                                não implica nossa aprovação ou associação com seus operadores.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                9. Isenção de Garantias
                            </h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Este site é fornecido "como está" e "conforme disponível", sem garantias de qualquer tipo,
                                expressas ou implícitas, incluindo, mas não se limitando a:
                            </p>
                            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                                <li>Garantias de comercialização</li>
                                <li>Adequação a um propósito específico</li>
                                <li>Não violação de direitos de terceiros</li>
                                <li>Disponibilidade ininterrupta ou livre de erros</li>
                            </ul>
                            <p className="text-gray-700 leading-relaxed">
                                Não garantimos que o site estará sempre disponível ou que será livre de vírus ou outros
                                componentes prejudiciais.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                10. Limitação de Responsabilidade
                            </h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Na extensão máxima permitida pela lei aplicável, a Cortinas Brás não será responsável por:
                            </p>
                            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                                <li>Quaisquer danos diretos, indiretos, incidentais, especiais, consequenciais ou punitivos</li>
                                <li>Perda de lucros, receitas, dados ou uso</li>
                                <li>Danos resultantes do uso ou incapacidade de usar o site</li>
                                <li>Danos causados por vírus, erros, omissões, interrupções ou atrasos</li>
                                <li>Ações de terceiros</li>
                            </ul>
                            <p className="text-gray-700 leading-relaxed">
                                Esta limitação se aplica independentemente da teoria legal sob a qual a responsabilidade
                                é baseada, seja em contrato, responsabilidade civil ou de outra forma.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                11. Indenização
                            </h2>
                            <p className="text-gray-700 leading-relaxed">
                                Você concorda em indenizar, defender e isentar a Cortinas Brás, seus diretores, funcionários,
                                agentes e fornecedores de e contra todas as reivindicações, responsabilidades, danos, perdas,
                                custos e despesas (incluindo honorários advocatícios) decorrentes de:
                            </p>
                            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                                <li>Seu uso do site</li>
                                <li>Violação destes Termos de Uso</li>
                                <li>Violação de qualquer direito de terceiros</li>
                                <li>Informações falsas ou enganosas fornecidas por você</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                12. Modificações do Site e dos Termos
                            </h2>

                            <h3 className="text-xl font-semibold text-gray-800 mb-3">
                                12.1. Modificações do Site
                            </h3>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Reservamo-nos o direito de modificar, suspender ou descontinuar qualquer aspecto do site
                                a qualquer momento, sem aviso prévio.
                            </p>

                            <h3 className="text-xl font-semibold text-gray-800 mb-3">
                                12.2. Modificações dos Termos
                            </h3>
                            <p className="text-gray-700 leading-relaxed">
                                Podemos revisar estes Termos de Uso a qualquer momento, atualizando esta página.
                                Recomendamos que você revise esta página periodicamente. Seu uso continuado do site
                                após quaisquer alterações constitui sua aceitação dos novos Termos de Uso.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                13. Rescisão
                            </h2>
                            <p className="text-gray-700 leading-relaxed">
                                Podemos rescindir ou suspender seu acesso ao site imediatamente, sem aviso prévio ou
                                responsabilidade, por qualquer motivo, incluindo, sem limitação, se você violar os
                                Termos de Uso. Todas as disposições dos Termos que, por sua natureza, devem sobreviver
                                à rescisão, sobreviverão, incluindo, sem limitação, disposições de propriedade, isenções
                                de garantia, indenização e limitações de responsabilidade.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                14. Lei Aplicável e Jurisdição
                            </h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Estes Termos de Uso são regidos e interpretados de acordo com as leis da República
                                Federativa do Brasil, sem considerar conflitos de disposições legais.
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                                Você concorda que qualquer ação legal ou procedimento entre a Cortinas Brás e você
                                relacionado a estes Termos de Uso será resolvido exclusivamente nos tribunais da
                                Comarca de São Paulo, Estado de São Paulo, Brasil.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                15. Disposições Gerais
                            </h2>

                            <h3 className="text-xl font-semibold text-gray-800 mb-3">
                                15.1. Acordo Integral
                            </h3>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Estes Termos de Uso, juntamente com nossa Política de Privacidade, constituem o acordo
                                integral entre você e a Cortinas Brás em relação ao uso do site.
                            </p>

                            <h3 className="text-xl font-semibold text-gray-800 mb-3">
                                15.2. Divisibilidade
                            </h3>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Se qualquer disposição destes Termos for considerada inválida ou inexequível, essa
                                disposição será limitada ou eliminada na medida mínima necessária, e as disposições
                                restantes permanecerão em pleno vigor e efeito.
                            </p>

                            <h3 className="text-xl font-semibold text-gray-800 mb-3">
                                15.3. Renúncia
                            </h3>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                A falha da Cortinas Brás em exercer ou fazer cumprir qualquer direito ou disposição
                                destes Termos não constituirá uma renúncia a tal direito ou disposição.
                            </p>

                            <h3 className="text-xl font-semibold text-gray-800 mb-3">
                                15.4. Cessão
                            </h3>
                            <p className="text-gray-700 leading-relaxed">
                                Você não pode ceder ou transferir estes Termos, por força de lei ou de outra forma,
                                sem nosso consentimento prévio por escrito. Qualquer tentativa de cessão sem esse
                                consentimento será nula. Podemos ceder nossos direitos e obrigações sob estes Termos
                                sem restrições.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                16. Atendimento ao Cliente
                            </h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Para dúvidas, sugestões ou reclamações relacionadas ao uso do site ou aos nossos
                                serviços, entre em contato conosco:
                            </p>
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <p className="text-gray-700 mb-2">
                                    <div className="bg-gray-50 p-6 rounded-lg mb-4">
                                        <p className="text-gray-700 mb-2">
                                            <strong>Razão Social:</strong> Cortinas Brás
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

                                <section className="mb-8">
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                        17. Código de Defesa do Consumidor
                                    </h2>
                                    <p className="text-gray-700 leading-relaxed">
                                        Nada nestes Termos de Uso afeta seus direitos legais como consumidor sob o Código de
                                        Defesa do Consumidor brasileiro (Lei nº 8.078/1990) ou outras leis de proteção ao
                                        consumidor aplicáveis.
                                    </p>
                                </section>
                            </div>

                            {/* Footer Note */}
                            <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg">
                                <p className="text-amber-900 font-medium mb-2">
                                    Ao utilizar este site, você reconhece que leu, compreendeu e concorda em estar vinculado
                                    a estes Termos de Uso.
                                </p>
                                <p className="text-amber-800 text-sm">
                                    Se você tiver alguma dúvida sobre estes termos, entre em contato conosco antes de usar o site.
                                </p>
                            </div>
                    </div>
                </div>
        </main>
    );
}
