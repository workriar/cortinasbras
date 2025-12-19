#!/bin/bash
# Script para diagnosticar e resolver problemas de pull no servidor

echo "=========================================="
echo "DIAGNÓSTICO DO SERVIDOR"
echo "=========================================="

cd /home/cortinasbras/public_html

echo ""
echo "1. Verificando status do Git:"
git status

echo ""
echo "2. Verificando branch atual:"
git branch

echo ""
echo "3. Verificando remote:"
git remote -v

echo ""
echo "4. Verificando últimos commits locais:"
git log --oneline -3

echo ""
echo "5. Verificando últimos commits remotos:"
git fetch origin
git log origin/main --oneline -3

echo ""
echo "=========================================="
echo "APLICANDO SOLUÇÃO"
echo "=========================================="

echo ""
echo "Guardando mudanças locais (se houver)..."
git stash

echo ""
echo "Fazendo pull..."
if git pull origin main; then
    echo ""
    echo "✅ Pull realizado com sucesso!"
    
    echo ""
    echo "Verificando se logo_pdf.png foi baixado:"
    if [ -f "static/logo_pdf.png" ]; then
        echo "✅ Logo PDF encontrado!"
        ls -lh static/logo_pdf.png
    else
        echo "❌ Logo PDF não encontrado!"
    fi
    
    echo ""
    echo "Reiniciando aplicação..."
    touch tmp/restart.txt
    echo "✅ Aplicação reiniciada!"
    
else
    echo ""
    echo "❌ Pull falhou. Tentando reset forçado..."
    git fetch origin
    git reset --hard origin/main
    
    echo ""
    echo "✅ Reset realizado com sucesso!"
    
    echo ""
    echo "Verificando logo_pdf.png:"
    if [ -f "static/logo_pdf.png" ]; then
        echo "✅ Logo PDF encontrado!"
        ls -lh static/logo_pdf.png
    else
        echo "❌ Logo PDF não encontrado!"
    fi
    
    echo ""
    echo "Reiniciando aplicação..."
    touch tmp/restart.txt
    echo "✅ Aplicação reiniciada!"
fi

echo ""
echo "=========================================="
echo "VERIFICAÇÃO FINAL"
echo "=========================================="
git log --oneline -1
echo ""
echo "Processo concluído!"
