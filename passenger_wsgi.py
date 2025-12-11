import sys, os

# Adiciona o diretório atual ao path para importar app.py
sys.path.append(os.getcwd())

from app import app as application
