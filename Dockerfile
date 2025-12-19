FROM python:3.12-slim

WORKDIR /app

# Copia requirements primeiro (cache otimizado)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia código
COPY . .

# Cria diretórios persistentes
RUN mkdir -p /opt/meu-projeto && \
  chown -R www-data:www-data /opt/meu-projeto

# Variáveis de ambiente (build args do EasyPanel sobrescrevem)
ENV PRODUCTION=1
ENV DATABASE_URL=sqlite:////opt/meu-projeto/leads.db

# Roda Gunicorn (padrão para Flask em produção)
EXPOSE 8000
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "3", "app:app"]
