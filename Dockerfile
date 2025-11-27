# Use Python 3.11 slim image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies for mysqlclient and other packages
RUN apt-get update && apt-get install -y \
  gcc \
  default-libmysqlclient-dev \
  pkg-config \
  && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY . .

# Create instance directory for SQLite (development)
RUN mkdir -p instance

# Set environment variables
ENV FLASK_APP=app.py
ENV PYTHONUNBUFFERED=1

# Expose port
EXPOSE 8000

# Health check
# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD python -c "import requests, os; port = os.environ.get('PORT', '8000'); requests.get(f'http://localhost:{port}/', timeout=2)" || exit 1

# Run with gunicorn
# Run with gunicorn using PORT environment variable
CMD gunicorn --bind 0.0.0.0:${PORT:-8000} --workers 4 --timeout 120 app:app
