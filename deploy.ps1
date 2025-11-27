# Script de Deploy Rápido - Cortinas Bresser (Windows)
# Para uso no EasyPanel via GitHub

Write-Host "🚀 Preparando deploy para EasyPanel..." -ForegroundColor Green

# Verificar se está em um repositório git
if (-not (Test-Path .git)) {
    Write-Host "❌ Não é um repositório git. Inicializando..." -ForegroundColor Yellow
    git init
    git branch -M main
}

# Adicionar todos os arquivos
Write-Host "📦 Adicionando arquivos..." -ForegroundColor Cyan
git add .

# Commit
Write-Host "💾 Criando commit..." -ForegroundColor Cyan
$commitMsg = Read-Host "Mensagem do commit"
git commit -m "$commitMsg"

# Verificar se tem remote
$hasOrigin = git remote | Select-String -Pattern "origin" -SimpleMatch
if (-not $hasOrigin) {
    Write-Host "❌ Remote 'origin' não configurado." -ForegroundColor Yellow
    $repoUrl = Read-Host "URL do repositório GitHub"
    git remote add origin $repoUrl
}

# Push
Write-Host "🌐 Enviando para GitHub..." -ForegroundColor Cyan
git push -u origin main

Write-Host ""
Write-Host "✅ Deploy enviado!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Próximos passos:" -ForegroundColor Yellow
Write-Host "1. Acesse seu EasyPanel"
Write-Host "2. O deploy será automático se configurado"
Write-Host "3. Ou clique em 'Rebuild' no serviço"
Write-Host ""
Write-Host "📖 Guia completo: DEPLOY-EASYPANEL.md" -ForegroundColor Cyan
