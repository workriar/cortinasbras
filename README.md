Cortinas Brás - Deploy

Arquivos criados para deploy:
- `requirements.txt` - dependências Python
- `Dockerfile` - imagem Docker para executar a aplicação
- `Procfile` - para deploy em plataformas como Heroku

Como rodar localmente (recomendado para testes):

1) Criar virtualenv e instalar dependências

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

2) Rodar a aplicação localmente

```bash
# cria o banco sqlite e inicia o servidor (rodará em http://127.0.0.1:5000)
python app.py
```

Como rodar com Docker

```bash
# build image
docker build -t cortinas-bras:latest .

# run container
docker run -p 5000:5000 --name cortinas-bras cortinas-bras:latest
```

Deploy em Heroku / Render / outros

- Heroku: faça `git push heroku main` (procfile presente). Configure variáveis de ambiente (MAIL_USERNAME, MAIL_PASSWORD, SECRET_KEY, DATABASE_URL se usar MySQL).
- Render: crie um Web Service apontando para este repositório; configure build command `pip install -r requirements.txt` e start command `gunicorn app:app`.

Notas e recomendações

- Em produção, configure variáveis de ambiente (MAIL_USERNAME, MAIL_PASSWORD, SECRET_KEY, PRODUCTION=1, DATABASE_URL).
- Para usar banco MySQL em produção, defina `DATABASE_URL` adequadamente.
- Se quiser geocoding preciso para o mapa, forneça uma chave de API do Google e eu posso integrar.
