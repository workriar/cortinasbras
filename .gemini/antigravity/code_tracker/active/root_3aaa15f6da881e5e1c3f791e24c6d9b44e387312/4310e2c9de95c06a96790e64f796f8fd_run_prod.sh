ð#!/usr/bin/env bash
# run_prod.sh - start Flask app with Gunicorn in production mode

# Activate virtual environment
source /root/venv/bin/activate

# Ensure .env is loaded (python-dotenv will load automatically when app starts)
# Start Gunicorn with 4 workers, binding to the PORT env var (default 8000)
export PORT=8000
exec gunicorn -w 4 -b 0.0.0.0:${PORT} app:app
ð"(3aaa15f6da881e5e1c3f791e24c6d9b44e3873122file:///root/run_prod.sh:file:///root