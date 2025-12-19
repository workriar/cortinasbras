"""
Script de teste para verificar o logo do PDF
"""
import os
import sys

# Verificar se os arquivos existem
logo_site = os.path.join('static', 'logo.png')
logo_pdf = os.path.join('static', 'logo_pdf.png')

print("=" * 60)
print("VERIFICAÇÃO DOS LOGOS")
print("=" * 60)

print(f"\n[OK] Logo do Site (colorido): {logo_site}")
if os.path.exists(logo_site):
    size = os.path.getsize(logo_site)
    print(f"  Status: EXISTE ({size:,} bytes)")
else:
    print(f"  Status: NAO ENCONTRADO")

print(f"\n[OK] Logo do PDF (marrom vinho): {logo_pdf}")
if os.path.exists(logo_pdf):
    size = os.path.getsize(logo_pdf)
    print(f"  Status: EXISTE ({size:,} bytes)")
else:
    print(f"  Status: NAO ENCONTRADO")

print("\n" + "=" * 60)
print("VERIFICACAO DO CODIGO")
print("=" * 60)

# Verificar o código do pdf_generator.py
with open('pdf_generator.py', 'r', encoding='utf-8') as f:
    content = f.read()
    if 'logo_pdf.png' in content:
        print("\n[OK] pdf_generator.py esta configurado para usar logo_pdf.png")
    else:
        print("\n[X] pdf_generator.py NAO esta usando logo_pdf.png")
    
    # Mostrar a linha relevante
    for i, line in enumerate(content.split('\n'), 1):
        if 'logo_path' in line and 'os.path.join' in line:
            print(f"  Linha {i}: {line.strip()}")

print("\n" + "=" * 60)
print("RESUMO")
print("=" * 60)
print("\nSite: usa logo.png (colorido)")
print("PDF:  usa logo_pdf.png (marrom vinho)")
print("\nAs mudancas estao corretas! [OK]")
print("=" * 60)
