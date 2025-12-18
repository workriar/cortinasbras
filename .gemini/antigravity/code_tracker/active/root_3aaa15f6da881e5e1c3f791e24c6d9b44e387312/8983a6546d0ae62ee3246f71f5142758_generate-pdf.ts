‹import type { NextApiRequest, NextApiResponse } from 'next';
import { generateOrcamentoPdf } from '../../services/pdf';
import { sendEmailWithPdf } from '../../services/email';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const lead = req.body;
    if (!lead) {
        return res.status(400).json({ error: 'Missing lead data' });
    }

    try {
        const pdfBuffer = await generateOrcamentoPdf(lead);
        await sendEmailWithPdf(lead, pdfBuffer);
        return res.status(200).json({ message: 'PDF generated and email sent' });
    } catch (error) {
        console.error('Error generating PDF or sending email:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
‹"(3aaa15f6da881e5e1c3f791e24c6d9b44e38731223file:///root/next-app/src/pages/api/generate-pdf.ts:file:///root