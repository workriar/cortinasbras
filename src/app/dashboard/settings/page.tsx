'use client';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('profile');

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    if (status === 'loading') {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    const tabs = [
        { id: 'profile', name: 'Perfil', icon: '👤' },
        { id: 'security', name: 'Segurança', icon: '🔒' },
        { id: 'notifications', name: 'Notificações', icon: '🔔' },
        { id: 'integrations', name: 'Integrações', icon: '🔗' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
                <p className="text-gray-600 mt-1">Gerencie as configurações do sistema</p>
            </div>

            {/* Tabs */}
            <div className="glass-card rounded-xl overflow-hidden">
                <div className="border-b border-gray-200">
                    <nav className="flex -mb-px">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                                        ? 'border-purple-600 text-purple-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <span className="mr-2">{tab.icon}</span>
                                {tab.name}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="p-6">
                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-gray-900">Informações do Perfil</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                                    <input
                                        type="text"
                                        defaultValue={session?.user?.name || ''}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
                                    <input
                                        type="email"
                                        defaultValue={session?.user?.email || ''}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                            <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl">
                                Salvar Alterações
                            </button>
                        </div>
                    )}

                    {/* Security Tab */}
                    {activeTab === 'security' && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-gray-900">Segurança</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Senha Atual</label>
                                    <input
                                        type="password"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nova Senha</label>
                                    <input
                                        type="password"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar Nova Senha</label>
                                    <input
                                        type="password"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                            <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl">
                                Alterar Senha
                            </button>
                        </div>
                    )}

                    {/* Notifications Tab */}
                    {activeTab === 'notifications' && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-gray-900">Preferências de Notificação</h2>
                            <div className="space-y-4">
                                {[
                                    { id: 'email', label: 'Notificações por E-mail', description: 'Receba atualizações importantes por e-mail' },
                                    { id: 'push', label: 'Notificações Push', description: 'Receba notificações no navegador' },
                                    { id: 'leads', label: 'Novos Leads', description: 'Seja notificado quando houver novos leads' },
                                    { id: 'messages', label: 'Novas Mensagens', description: 'Receba notificações de novas mensagens no chat' },
                                ].map((item) => (
                                    <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-900">{item.label}</p>
                                            <p className="text-sm text-gray-500">{item.description}</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Integrations Tab */}
                    {activeTab === 'integrations' && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-gray-900">Integrações</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { name: 'WhatsApp Business API', icon: '💬', status: 'Não Conectado', color: 'bg-green-500' },
                                    { name: 'Google Analytics', icon: '📊', status: 'Não Conectado', color: 'bg-orange-500' },
                                    { name: 'Mailchimp', icon: '📧', status: 'Não Conectado', color: 'bg-yellow-500' },
                                    { name: 'Zapier', icon: '⚡', status: 'Não Conectado', color: 'bg-purple-500' },
                                ].map((integration) => (
                                    <div key={integration.name} className="glass-card p-6 rounded-lg hover:shadow-lg transition-shadow">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-12 h-12 ${integration.color} rounded-lg flex items-center justify-center text-2xl`}>
                                                    {integration.icon}
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                                                    <p className="text-sm text-gray-500">{integration.status}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <button className="w-full px-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors">
                                            Conectar
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
