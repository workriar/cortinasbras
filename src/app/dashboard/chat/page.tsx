'use client';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Message {
    id: number;
    content: string;
    senderId: number;
    sender: { name: string; email: string };
    createdAt: string;
}

export default function ChatPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login', { scroll: false });
        }
    }, [status, router]);

    useEffect(() => {
        if (status === 'authenticated') {
            fetchMessages();
            const interval = setInterval(fetchMessages, 3000); // Poll a cada 3s
            return () => clearInterval(interval);
        }
    }, [status]);

    const fetchMessages = async () => {
        try {
            const res = await fetch('/api/chat');
            const data = await res.json();
            setMessages(data.messages || []);
        } catch (error) {
            console.error('Erro ao carregar mensagens:', error);
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: newMessage }),
            });
            setNewMessage('');
            fetchMessages();
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
        }
    };

    if (status === 'loading' || loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-200px)] flex flex-col">
            {/* Header */}
            <div className="glass-card p-6 rounded-t-xl border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900">Chat Interno</h1>
                <p className="text-gray-600 mt-1">Converse com sua equipe em tempo real</p>
            </div>

            {/* Messages */}
            <div className="flex-1 glass-card p-6 overflow-y-auto space-y-4">
                {messages.length === 0 ? (
                    <div className="text-center py-12">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma mensagem</h3>
                        <p className="mt-1 text-sm text-gray-500">Seja o primeiro a enviar uma mensagem!</p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.sender.email === session?.user?.email ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-md px-4 py-3 rounded-lg ${msg.sender.email === session?.user?.email
                                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                                : 'bg-white border border-gray-200 text-gray-900'
                                }`}>
                                <p className="text-xs opacity-75 mb-1">{msg.sender.name}</p>
                                <p>{msg.content}</p>
                                <p className="text-xs opacity-75 mt-1">
                                    {new Date(msg.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} className="glass-card p-4 rounded-b-xl border-t border-gray-200">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Digite sua mensagem..."
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <button
                        type="submit"
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </div>
            </form>
        </div>
    );
}
