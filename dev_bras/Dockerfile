FROM python:3.11-slim

# Set workdir
WORKDIR /app

# Copy project
COPY . /app

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose port
EXPOSE 5000

# Environment (override in production)
ENV FLASK_ENV=production

# Start the app with gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app", "--workers", "2"]
