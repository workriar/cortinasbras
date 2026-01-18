'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Plus, Trash2, Shield, User as UserIcon, Loader2, AlertCircle } from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    createdAt: string;
}

export default function UsersPage() {
    const { data: session } = useSession();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // Form states
    const [newName, setNewName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newRole, setNewRole] = useState('USER');

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/users');
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            } else {
                // Silently fail or console log, or alert if needed
                console.error('Erro ao carregar usuários');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreating(true);

        try {
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newName,
                    email: newEmail,
                    password: newPassword,
                    role: newRole
                })
            });

            if (res.ok) {
                alert('Usuário criado com sucesso!');
                setShowModal(false);
                setNewName('');
                setNewEmail('');
                setNewPassword('');
                setNewRole('USER');
                fetchUsers();
            } else {
                const data = await res.json();
                alert(data.error || 'Erro ao criar usuário');
            }
        } catch (error) {
            alert('Erro de conexão');
        } finally {
            setIsCreating(false);
        }
    };

    const handleDeleteUser = async (id: number) => {
        if (!confirm('Tem certeza que deseja excluir este usuário?')) return;

        try {
            const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
            if (res.ok) {
                alert('Usuário removido.');
                fetchUsers();
            } else {
                const data = await res.json();
                alert(data.error || 'Erro ao excluir');
            }
        } catch (error) {
            alert('Erro ao excluir');
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Carregando usuários...</div>;
    }

    return (
        <div className="max-w-5xl mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Gestão de Usuários</h1>
                    <p className="text-sm text-gray-500 mt-1">Gerencie quem tem acesso ao sistema de Cortinas Brás.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-stone-800 hover:bg-stone-900 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                >
                    <Plus size={16} />
                    Novo Usuário
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
                            <th className="px-6 py-4 font-semibold">Nome</th>
                            <th className="px-6 py-4 font-semibold">Email</th>
                            <th className="px-6 py-4 font-semibold">Acesso</th>
                            <th className="px-6 py-4 font-semibold text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 text-sm font-medium text-gray-800 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 font-bold text-xs border border-stone-200">
                                        {user.name?.charAt(0).toUpperCase()}
                                    </div>
                                    {user.name}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${user.role === 'ADMIN'
                                        ? 'bg-purple-50 text-purple-700 border-purple-100'
                                        : 'bg-blue-50 text-blue-700 border-blue-100'
                                        }`}>
                                        {user.role === 'ADMIN' ? <Shield size={12} /> : <UserIcon size={12} />}
                                        {user.role === 'ADMIN' ? 'Administrador' : 'Vendedor'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => handleDeleteUser(user.id)}
                                        className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg"
                                        title="Excluir Usuário"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal de Criação */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                            <h3 className="font-semibold text-gray-800">Novo Usuário</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>

                        <form onSubmit={handleCreateUser} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1.5">Nome Completo</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500/20 focus:border-stone-500 transition-all text-sm"
                                    placeholder="Ex: João da Silva"
                                    value={newName}
                                    onChange={e => setNewName(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1.5">E-mail de Acesso</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500/20 focus:border-stone-500 transition-all text-sm"
                                    placeholder="joao@cortinasbras.com.br"
                                    value={newEmail}
                                    onChange={e => setNewEmail(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1.5">Senha Inicial</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500/20 focus:border-stone-500 transition-all text-sm"
                                    placeholder="******"
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1.5">Nível de Acesso</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setNewRole('USER')}
                                        className={`px-3 py-2 rounded-lg border text-sm font-medium flex items-center justify-center gap-2 transition-all ${newRole === 'USER' ? 'bg-stone-800 text-white border-stone-800' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                                    >
                                        <UserIcon size={14} />
                                        Vendedor
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setNewRole('ADMIN')}
                                        className={`px-3 py-2 rounded-lg border text-sm font-medium flex items-center justify-center gap-2 transition-all ${newRole === 'ADMIN' ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                                    >
                                        <Shield size={14} />
                                        Admin
                                    </button>
                                </div>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isCreating}
                                    className="w-full bg-stone-800 hover:bg-stone-900 text-white font-medium py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isCreating ? <Loader2 className="animate-spin" size={18} /> : 'Criar Usuário'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
