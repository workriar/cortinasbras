import React from 'react';

type Lead = {
    id: number;
    nome: string;
    telefone: string;
    cidade_bairro: string;
    largura_parede: number | null;
    altura_parede: number | null;
    tecido: string;
    observacoes: string;
    status: string;
    criado_em: string;
};

interface Props {
    leads: Lead[];
}

export const LeadsTable: React.FC<Props> = ({ leads }) => {
    return (
        <div className="overflow-x-auto rounded-lg shadow-md bg-white/90 backdrop-blur-sm">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                    <tr>
                        <th className="px-4 py-2 text-left">ID</th>
                        <th className="px-4 py-2 text-left">Nome</th>
                        <th className="px-4 py-2 text-left">Telefone</th>
                        <th className="px-4 py-2 text-left">Local</th>
                        <th className="px-4 py-2 text-left">Medidas (L×A)</th>
                        <th className="px-4 py-2 text-left">Tecido</th>
                        <th className="px-4 py-2 text-left">Status</th>
                        <th className="px-4 py-2 text-left">Criado em</th>
                    </tr>
                </thead>
                <tbody className="bg-white/80">
                    {leads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-gray-100 transition-colors">
                            <td className="px-4 py-2">{lead.id}</td>
                            <td className="px-4 py-2 font-medium text-gray-800">{lead.nome}</td>
                            <td className="px-4 py-2">{lead.telefone}</td>
                            <td className="px-4 py-2">{lead.cidade_bairro}</td>
                            <td className="px-4 py-2">
                                {lead.largura_parede ?? '-'} x {lead.altura_parede ?? '-'}
                            </td>
                            <td className="px-4 py-2">{lead.tecido}</td>
                            <td className="px-4 py-2">
                                <span
                                    className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${lead.status === 'concluido'
                                            ? 'bg-green-200 text-green-800'
                                            : lead.status === 'pendente'
                                                ? 'bg-yellow-200 text-yellow-800'
                                                : 'bg-gray-200 text-gray-800'
                                        }`}
                                >
                                    {lead.status}
                                </span>
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-600">
                                {new Date(lead.criado_em).toLocaleDateString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
