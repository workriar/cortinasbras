import { NextResponse } from "next/server";
import { leadService } from "@/services/lead.service";

export async function GET() {
    try {
        const { leads } = await leadService.getLeads({}, { skip: 0, take: 1000 });

        const stats = {
            total: leads.length,
            new: leads.filter(l => l.status === 'NEW').length,
            contacted: leads.filter(l => l.status === 'CONTACTED').length,
            proposal: leads.filter(l => l.status === 'PROPOSAL').length,
            converted: leads.filter(l => l.status === 'CLOSED_WON').length,
            lost: leads.filter(l => l.status === 'CLOSED_LOST').length,
            responseTime: calculateAverageResponseTime(leads),
            todayLeads: leads.filter(l => isToday(new Date(l.createdAt))).length,
            weekLeads: leads.filter(l => isThisWeek(new Date(l.createdAt))).length,
            monthLeads: leads.filter(l => isThisMonth(new Date(l.createdAt))).length,
            conversionRate: leads.length > 0
                ? ((leads.filter(l => l.status === 'CLOSED_WON').length / leads.length) * 100).toFixed(1)
                : '0',
        };

        return NextResponse.json(stats);
    } catch (error: any) {
        console.error("Erro ao buscar estatísticas:", error);
        return NextResponse.json({
            total: 0,
            new: 0,
            contacted: 0,
            proposal: 0,
            converted: 0,
            lost: 0,
            responseTime: '0min',
            todayLeads: 0,
            weekLeads: 0,
            monthLeads: 0,
            conversionRate: '0',
            error: error.message
        }, { status: 500 });
    }
}

function calculateAverageResponseTime(leads: any[]): string {
    // Simplified: return a mock value for now
    // In production, calculate based on actual response timestamps
    const contactedLeads = leads.filter(l => l.status !== 'NEW');
    if (contactedLeads.length === 0) return '0min';

    // Mock calculation - in production, use actual timestamps
    return '15min';
}

function isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
}

function isThisWeek(date: Date): boolean {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    return date >= weekAgo && date <= today;
}

function isThisMonth(date: Date): boolean {
    const today = new Date();
    return date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
}
