#!/bin/bash

# 🎯 Script Helper - Navegação entre Projetos
# Uso: source /root/project-helper.sh

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Função para mostrar projeto atual
show_current_project() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}📍 Projeto Atual:${NC}"
    echo -e "${YELLOW}Diretório:${NC} $(pwd)"
    
    if [ -d ".git" ]; then
        REPO=$(git remote get-url origin 2>/dev/null)
        if [ ! -z "$REPO" ]; then
            echo -e "${YELLOW}Repositório:${NC} $REPO"
        fi
    fi
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# Função para ir para Cortinas Brás
goto_cortinasbras() {
    cd /root
    echo -e "${GREEN}✅ Mudou para: Cortinas Brás${NC}"
    show_current_project
}

# Função para ir para Bresser
goto_bresser() {
    cd /root/projects/bresser
    echo -e "${GREEN}✅ Mudou para: Bresser${NC}"
    show_current_project
}

# Função para ir para Relluarte
goto_relluarte() {
    cd /root/projects/relluarte
    echo -e "${GREEN}✅ Mudou para: Relluarte${NC}"
    show_current_project
}

# Função para listar todos os projetos
list_projects() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}📂 Projetos Disponíveis:${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    echo -e "${YELLOW}1. Cortinas Brás${NC}"
    echo -e "   Domínio: https://cortinasbras.com.br"
    echo -e "   Diretório: /root"
    echo -e "   Comando: ${GREEN}goto_cortinasbras${NC} ou ${GREEN}cb${NC}"
    echo ""
    
    echo -e "${YELLOW}2. Bresser${NC}"
    echo -e "   Domínio: https://cortinasbresser.com.br"
    echo -e "   Diretório: /root/projects/bresser"
    echo -e "   Comando: ${GREEN}goto_bresser${NC} ou ${GREEN}br${NC}"
    echo ""
    
    echo -e "${YELLOW}3. Relluarte${NC}"
    echo -e "   Domínio: https://relluarte.com.br"
    echo -e "   Diretório: /root/projects/relluarte"
    echo -e "   Comando: ${GREEN}goto_relluarte${NC} ou ${GREEN}rl${NC}"
    
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# Aliases curtos
alias cb='goto_cortinasbras'
alias br='goto_bresser'
alias rl='goto_relluarte'
alias projects='list_projects'
alias current='show_current_project'

# Mostrar ajuda
show_help() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}🎯 Project Helper - Comandos Disponíveis${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "${YELLOW}Navegação:${NC}"
    echo -e "  ${GREEN}cb${NC} ou ${GREEN}goto_cortinasbras${NC}  → Ir para Cortinas Brás"
    echo -e "  ${GREEN}br${NC} ou ${GREEN}goto_bresser${NC}       → Ir para Bresser"
    echo -e "  ${GREEN}rl${NC} ou ${GREEN}goto_relluarte${NC}     → Ir para Relluarte"
    echo ""
    echo -e "${YELLOW}Informações:${NC}"
    echo -e "  ${GREEN}projects${NC}                  → Listar todos os projetos"
    echo -e "  ${GREEN}current${NC}                   → Mostrar projeto atual"
    echo -e "  ${GREEN}project_help${NC}              → Mostrar esta ajuda"
    echo ""
    echo -e "${YELLOW}Exemplo de uso:${NC}"
    echo -e "  $ ${GREEN}cb${NC}                       # Vai para Cortinas Brás"
    echo -e "  $ ${GREEN}git status${NC}               # Verifica mudanças"
    echo -e "  $ ${GREEN}br${NC}                       # Vai para Bresser"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

alias project_help='show_help'

# Mostrar mensagem de boas-vindas
echo -e "${GREEN}✅ Project Helper carregado!${NC}"
echo -e "Digite ${GREEN}project_help${NC} para ver os comandos disponíveis"
