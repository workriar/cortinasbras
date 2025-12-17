import os
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from datetime import datetime
import io

def generate_orcamento_pdf(lead):
    """
    Gera um PDF profissional de orçamento com a identidade visual da Cortinas Brás.
    Retorna um buffer de bytes com o PDF.
    """
    buffer = io.BytesIO()
    
    # Configuração do documento
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=2*cm,
        leftMargin=2*cm,
        topMargin=2*cm,
        bottomMargin=2*cm,
        title=f"Orçamento - {lead.nome}"
    )
    
    # Estilos
    styles = getSampleStyleSheet()
    
    # Cores da marca
    COLOR_GOLD = colors.HexColor('#D4A93E')
    COLOR_DARK = colors.HexColor('#8B5C2A')
    COLOR_BG = colors.HexColor('#F8F5F1')
    
    # Estilos personalizados
    style_title = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=COLOR_GOLD,
        alignment=TA_CENTER,
        spaceAfter=20
    )
    
    style_subtitle = ParagraphStyle(
        'CustomSubtitle',
        parent=styles['Heading2'],
        fontSize=14,
        textColor=colors.gray,
        alignment=TA_CENTER,
        spaceAfter=30
    )
    
    style_section = ParagraphStyle(
        'SectionTitle',
        parent=styles['Heading3'],
        fontSize=14,
        textColor=COLOR_DARK,
        borderPadding=5,
        borderWidth=0,
        spaceBefore=15,
        spaceAfter=10
    )
    
    style_normal = ParagraphStyle(
        'CustomNormal',
        parent=styles['Normal'],
        fontSize=11,
        leading=14,
        spaceAfter=6
    )
    
    elements = []
    
    # 1. Logo (se existir) - versão marrom vinho para PDF
    logo_path = os.path.join(os.path.dirname(__file__), 'static', 'logo_pdf.png')
    if os.path.exists(logo_path):
        try:
            # Aumentar um pouco o logo
            img = Image(logo_path, width=5*cm, height=2*cm, kind='proportional')
            img.hAlign = 'CENTER'
            elements.append(img)
            elements.append(Spacer(1, 1*cm))
        except Exception:
            pass

    # 2. Título e Data
    elements.append(Paragraph("ORÇAMENTO DE CORTINAS", style_title))
    data_formatada = lead.criado_em.strftime('%d/%m/%Y às %H:%M')
    elements.append(Paragraph(f"Solicitação recebida em: {data_formatada}", style_subtitle))
    elements.append(Spacer(1, 0.5*cm))

    # 3. Dados do Cliente (Tabela) – com ícone dourado
    elements.append(Paragraph(f"<font color='{COLOR_GOLD}'>📋</font> DADOS DO CLIENTE", style_section))
    data_cliente = [
        ['Nome:', lead.nome],
        ['Telefone:', lead.telefone],
        ['ID do Orçamento:', f"#{lead.id}" ]
    ]
    table_cliente = Table(data_cliente, colWidths=[4*cm, 12*cm])
    table_cliente.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('TEXTCOLOR', (0, 0), (0, -1), colors.gray),
        ('TEXTCOLOR', (1, 0), (1, -1), colors.black),
        ('FONTSIZE', (0, 0), (-1, -1), 11),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('BACKGROUND', (0, 0), (-1, -1), COLOR_BG),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.white),
        ('BOX', (0, 0), (-1, -1), 1, COLOR_GOLD),  # Borda dourada
        ('ROUNDEDCORNERS', [8, 8, 8, 8]),
    ]))
    elements.append(table_cliente)
    elements.append(Spacer(1, 1*cm))

    # 4. Medidas e Especificações – com ícone dourado
    elements.append(Paragraph(f"<font color='{COLOR_GOLD}'>📐</font> MEDIDAS E ESPECIFICAÇÕES", style_section))
    data_specs = [
        ['ITEM', 'DETALHES'],
        ['Largura da Parede', f"{lead.largura_parede} metros"],
        ['Altura da Parede', f"{lead.altura_parede} metros"]
    ]
    
    # Adicionar Janela se houver medidas
    if lead.largura_janela > 0 or lead.altura_janela > 0:
        data_specs.append(['Largura da Janela', f"{lead.largura_janela} metros"])
        data_specs.append(['Altura da Janela', f"{lead.altura_janela} metros"])

    data_specs.extend([
        ['Tipo de Tecido', lead.tecido],
        ['Tipo de Instalação', lead.instalacao]
    ])

    table_specs = Table(data_specs, colWidths=[6*cm, 10*cm])
    table_specs.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), COLOR_GOLD),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('TOPPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.white),
        ('GRID', (0, 0), (-1, -1), 1, colors.lightgrey),
        ('FONTSIZE', (0, 1), (-1, -1), 11),
        ('PADDING', (0, 1), (-1, -1), 10),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, COLOR_BG]),
        ('BOX', (0, 0), (-1, -1), 1, COLOR_GOLD),
    ]))
    elements.append(table_specs)
    elements.append(Spacer(1, 1*cm))

    # 5. Observações e Endereço – com ícones dourados
    if lead.observacoes:
        elements.append(Paragraph(f"<font color='{COLOR_GOLD}'>📝</font> OBSERVAÇÕES", style_section))
        OBS_STYLE = ParagraphStyle('Obs', parent=style_normal, backColor=colors.HexColor('#FDFBF7'), borderPadding=10, borderColor=COLOR_GOLD, borderWidth=1, borderRadius=5)
        elements.append(Paragraph(lead.observacoes, OBS_STYLE))
        elements.append(Spacer(1, 0.5*cm))


    # 6. Rodapé
    elements.append(Spacer(1, 2*cm))
    footer_text = """
    <b>Cortinas Brás</b><br/>
    Qualidade e tradição há mais de 20 anos.<br/>
    www.cortinasbras.com.br
    """
    elements.append(Paragraph(footer_text, ParagraphStyle(
        'Footer',
        parent=styles['Normal'],
        alignment=TA_CENTER,
        textColor=colors.gray,
        fontSize=10
    )))

    # Construir PDF
    doc.build(elements)
    buffer.seek(0)
    return buffer
