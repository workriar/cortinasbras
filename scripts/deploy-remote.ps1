# Script de Deploy Remoto para Produção - Cortinas Brás
# Execute este script no Windows para fazer deploy no servidor Linux

param(
    [string]$ServerHost = "",
    [string]$ServerUser = "",
    [string]$ProjectPath = "/opt/cortinas-app"
)

Write-Host "🚀 Deploy Remoto - Cortinas Brás" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se SSH está disponível
if (-not (Get-Command ssh -ErrorAction SilentlyContinue)) {
    Write-Host "❌ SSH não encontrado!" -ForegroundColor Red
    Write-Host "Instale o OpenSSH Client no Windows ou use PuTTY" -ForegroundColor Yellow
    exit 1
}

# Solicitar informações se não fornecidas
if (-not $ServerHost) {
    $ServerHost = Read-Host "Digite o IP ou domínio do servidor (ex: cortinasbras.com.br)"
}

if (-not $ServerUser) {
    $ServerUser = Read-Host "Digite o usuário SSH (ex: root, ubuntu)"
}

Write-Host ""
Write-Host "📋 Configuração:" -ForegroundColor Green
Write-Host "   Servidor: $ServerHost" -ForegroundColor White
Write-Host "   Usuário: $ServerUser" -ForegroundColor White
Write-Host "   Projeto: $ProjectPath" -ForegroundColor White
Write-Host ""

$confirm = Read-Host "Continuar com o deploy? (S/N)"
if ($confirm -ne "S" -and $confirm -ne "s") {
    Write-Host "❌ Deploy cancelado" -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "🔗 Conectando ao servidor..." -ForegroundColor Cyan

# Criar script de deploy temporário
$deployScript = @"
#!/bin/bash
set -e

echo "🚀 Iniciando deploy da aplicação Cortinas Brás..."
echo ""

# Ir para o diretório do projeto
cd $ProjectPath || { echo "❌ Diretório não encontrado: $ProjectPath"; exit 1; }

echo "📥 1. Baixando alterações do GitHub..."
git pull origin main
echo "✅ Código atualizado"
echo ""

echo "🛑 2. Parando containers..."
docker-compose down
echo "✅ Containers parados"
echo ""

echo "🔨 3. Reconstruindo imagem Docker..."
docker-compose build --no-cache
echo "✅ Imagem reconstruída"
echo ""

echo "▶️  4. Iniciando containers..."
docker-compose up -d
echo "✅ Containers iniciados"
echo ""

echo "⏳ Aguardando inicialização..."
sleep 10
echo ""

echo "📊 5. Verificando status..."
docker-compose ps
echo ""

echo "📋 6. Últimas linhas do log:"
docker-compose logs --tail=50
echo ""

echo "✅ Deploy concluído!"
echo ""
echo "📝 Para ver logs em tempo real: docker-compose logs -f"
"@

# Salvar script temporário
$tempScript = [System.IO.Path]::GetTempFileName() + ".sh"
$deployScript | Out-File -FilePath $tempScript -Encoding ASCII

try {
    # Copiar script para o servidor
    Write-Host "📤 Enviando script de deploy..." -ForegroundColor Cyan
    scp $tempScript "${ServerUser}@${ServerHost}:/tmp/deploy-cortinas.sh"
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erro ao enviar script" -ForegroundColor Red
        exit 1
    }
    
    # Executar deploy no servidor
    Write-Host ""
    Write-Host "🚀 Executando deploy no servidor..." -ForegroundColor Cyan
    Write-Host "=================================" -ForegroundColor Cyan
    Write-Host ""
    
    ssh "${ServerUser}@${ServerHost}" "chmod +x /tmp/deploy-cortinas.sh && /tmp/deploy-cortinas.sh && rm /tmp/deploy-cortinas.sh"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Deploy concluído com sucesso!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📝 Próximos passos:" -ForegroundColor Cyan
        Write-Host "   1. Teste o site: https://cortinasbras.com.br" -ForegroundColor White
        Write-Host "   2. Teste o formulário" -ForegroundColor White
        Write-Host "   3. Verifique os logs: ssh ${ServerUser}@${ServerHost} 'cd $ProjectPath && docker-compose logs -f'" -ForegroundColor White
        Write-Host ""
    } else {
        Write-Host ""
        Write-Host "❌ Deploy falhou!" -ForegroundColor Red
        Write-Host "Verifique os logs acima para detalhes" -ForegroundColor Yellow
        exit 1
    }
} finally {
    # Limpar arquivo temporário
    if (Test-Path $tempScript) {
        Remove-Item $tempScript -Force
    }
}
