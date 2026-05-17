// Declaração de tipos para o PDFKit usada em produção
// (o @types/pdfkit está em devDependencies e não é instalado com NODE_ENV=production)

declare module 'pdfkit' {
    interface PDFDocumentOptions {
        size?: string | [number, number];
        margin?: number;
        margins?: { top: number; bottom: number; left: number; right: number };
        layout?: 'portrait' | 'landscape';
        info?: {
            Title?: string;
            Author?: string;
            Subject?: string;
            Keywords?: string;
            Creator?: string;
            Producer?: string;
        };
        autoFirstPage?: boolean;
        bufferPages?: boolean;
        font?: string;
        compress?: boolean;
    }

    class PDFDocument {
        constructor(options?: PDFDocumentOptions);

        // Propriedades
        page: { width: number; height: number; margins: any };
        x: number;
        y: number;

        // Eventos
        on(event: 'data', handler: (chunk: Buffer) => void): this;
        on(event: 'end', handler: () => void): this;
        on(event: 'error', handler: (err: Error) => void): this;

        // Controle de páginas
        addPage(options?: PDFDocumentOptions): this;
        end(): void;

        // Texto
        font(src: string): this;
        registerFont(name: string, src?: string | Uint8Array | ArrayBuffer | any, family?: string): this;
        fontSize(size: number): this;
        fillColor(color: string): this;
        text(text: string, x?: number, y?: number, options?: {
            align?: 'left' | 'center' | 'right' | 'justify';
            width?: number;
            lineGap?: number;
            characterSpacing?: number;
            wordSpacing?: number;
            indent?: number;
            columns?: number;
            height?: number;
            ellipsis?: boolean | string;
        }): this;
        moveDown(lines?: number): this;
        moveUp(lines?: number): this;

        // Formas
        rect(x: number, y: number, w: number, h: number): this;
        roundedRect(x: number, y: number, w: number, h: number, r: number): this;
        circle(x: number, y: number, radius: number): this;
        moveTo(x: number, y: number): this;
        lineTo(x: number, y: number): this;

        // Estilos de forma
        fill(color?: string): this;
        stroke(color?: string): this;
        fillAndStroke(fillColor?: string, strokeColor?: string): this;
        strokeColor(color: string, opacity?: number): this;
        lineWidth(w: number): this;
        dash(length: number, options?: { space?: number; phase?: number }): this;
        undash(): this;

        // Imagens
        image(src: string | Buffer, x?: number, y?: number, options?: {
            width?: number;
            height?: number;
            fit?: [number, number];
            align?: string;
            valign?: string;
        }): this;

        // Salvar/Restaurar estado
        save(): this;
        restore(): this;
        translate(x: number, y: number): this;
        rotate(angle: number, options?: { origin?: [number, number] }): this;
        scale(xFactor: number, yFactor?: number, options?: { origin?: [number, number] }): this;

        // Links
        link(x: number, y: number, w: number, h: number, url: string): this;

        // Pipes
        pipe(dest: any): any;
    }

    export = PDFDocument;
}
