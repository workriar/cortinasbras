'use client';
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface ChartCardProps {
    title: string;
    type: 'status' | 'source' | 'weekly';
}

const COLORS = ['#8b5cf6', '#3b82f6', '#f59e0b', '#10b981', '#ef4444'];

export default function ChartCard({ title, type }: ChartCardProps) {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [type]);

    const fetchData = async () => {
        try {
            const res = await fetch(`/api/reports/${type}`);
            const result = await res.json();
            setData(result.data || []);
        } catch (error) {
            console.error('Erro ao carregar gráfico:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="glass-card p-6 rounded-xl h-80 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="glass-card p-6 rounded-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
            <ResponsiveContainer width="100%" height={300}>
                {type === 'weekly' ? (
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#8b5cf6" />
                    </BarChart>
                ) : (
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                )}
            </ResponsiveContainer>
        </div>
    );
}
