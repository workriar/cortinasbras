Deploy para VPS (instruções)

Atenção: NÃO inclua credenciais em texto público. Execute os passos abaixo no seu VPS (ou copie os arquivos via scp/rsync).

Opção rápida (assumindo que o código já está em /opt/meu-projeto):

1) Conecte-se ao VPS

ssh root@your-server

2) Mova o projeto para /opt e rode o script de deploy

sudo mv ~/meu-projeto /opt/meu-projeto   # ou clone o repositório em /opt/meu-projeto
sudo bash /opt/meu-projeto/deploy_vps.sh

3) Configure variáveis de ambiente sensíveis

Crie um arquivo /etc/systemd/system/cortinas-bras.service.d/environment.conf ou use /etc/default/cortinas-bras
Exemplo de variáveis (NÃO coloque senhas em repositórios públicos):

MAIL_USERNAME=seu-email@dominio.com
MAIL_PASSWORD=sua_senha
SECRET_KEY=uma_chave_secreta
PRODUCTION=1
DATABASE_URL=mysql://user:pass@host/dbname

Após editar, reinicie o serviço:

sudo systemctl daemon-reload
sudo systemctl restart cortinas-bras.service

4) Configure DNS (se aplicável) e TLS

- Ajuste `server_name` no arquivo Nginx em /etc/nginx/sites-available/cortinas-bras
- Use Certbot para obter certificados Let's Encrypt:

sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d seu_dominio.com -d www.seu_dominio.com

5) Logs e troubleshooting

- Logs do systemd/Gunicorn:
  sudo journalctl -u cortinas-bras -f
- Logs do nginx:
  sudo tail -F /var/log/nginx/error.log

Alternativa: rodar com Docker

- Build local:
  docker build -t cortinas-bras:latest .
- Run:
  docker run -p 80:8000 --env-file .env -v /opt/meu-projeto/static:/app/static cortinas-bras:latest

Notas finais

Se quiser, posso gerar comandos personalizados para copiar o projeto via rsync/scp e executar o deploy com suas instruções. IMPORTANTE: não execute aqui comandos que contenham credenciais. Sempre rode os comandos de SSH a partir do seu terminal.