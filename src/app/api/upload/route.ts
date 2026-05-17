import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'Nenhum arquivo enviado.' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        
        // Criar pasta public/uploads caso não exista
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Sanitizar e criar nome único para o arquivo
        const originalName = file.name;
        const extension = path.extname(originalName);
        const cleanName = path.basename(originalName, extension)
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '_') + '_' + Date.now() + extension;

        const filePath = path.join(uploadDir, cleanName);
        fs.writeFileSync(filePath, buffer);

        // Retorna a URL pública local do arquivo
        const fileUrl = `/uploads/${cleanName}`;
        console.log(`[Upload API] Arquivo salvo com sucesso em: ${fileUrl}`);

        return NextResponse.json({ url: fileUrl });
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error('[Upload API] Erro ao processar upload:', message);
        return NextResponse.json(
            { error: 'Falha ao processar o upload do arquivo no servidor.', detail: message },
            { status: 500 }
        );
    }
}
