#!/bin/bash

# Caminho base do projeto
PROJETO_DIR="/opt/cortinas-bras"

# Mensagem de commit padrão (pode ser personalizado)
COMMIT_MSG="Deploy automático - $(date '+%Y-%m-%d %H:%M:%S')"

# Função para executar e mostrar o comando
exec_cmd() {
    echo "Executando: $*"
    eval "$*"
    if [ $? -ne 0 ]; then
        echo "Erro ao executar: $*"
        exit 1
    fi
}

echo "Iniciando deploy..."

# Ir para o diretório do projeto
exec_cmd "cd $PROJETO_DIR"

# Atualizar repositório Git
exec_cmd "git add ."
exec_cmd "git commit -m \"$COMMIT_MSG\""
exec_cmd "git pull origin main"  # Altere 'main' para sua branch se necessário
exec_cmd "git push origin main"

# Atualizar venv e instalar dependências (opcional, baseada em requirements)
exec_cmd "source venv/bin/activate && pip install -r requirements.txt"

# Reiniciar serviço do Gunicorn via systemd
exec_cmd "sudo systemctl daemon-reload"
exec_cmd "sudo systemctl restart cortinas-bras"

# Testar se o serviço está ativo
exec_cmd "sudo systemctl status cortinas-bras --no-pager"

# Recarregar nginx para garantir configurações atualizadas
exec_cmd "sudo nginx -t"
exec_cmd "sudo systemctl reload nginx"

echo "Deploy concluído com sucesso!"

