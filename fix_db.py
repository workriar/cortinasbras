import sys
sys.path.insert(0, '/opt/meu-projeto')

# Ler o app.py atual
with open('/opt/meu-projeto/app.py', 'r') as f:
    content = f.read()

# Substituir o código de criação das tabelas
old_code = """# Configuração para produção
if __name__ == "__main__":
    with app.app_context():
        db.create_all()"""

new_code = """# Configuração para produção
if __name__ == "__main__":
    # Não recriar tabelas em produção - usar migrations ao invés
    pass"""

if old_code in content:
    content = content.replace(old_code, new_code)
    with open('/opt/meu-projeto/app.py', 'w') as f:
        f.write(content)
    print("✅ Código corrigido - db.create_all() removido")
else:
    print("⚠️ Código não encontrado ou já atualizado")
    # Tenta remover qualquer db.create_all()
    if 'db.create_all()' in content:
        lines = content.split('\n')
        new_lines = []
        skip_next = False
        for i, line in enumerate(lines):
            if 'db.create_all()' in line:
                skip_next = True
                continue
            if skip_next and line.strip().startswith('with app.app_context'):
                continue
            new_lines.append(line)
            skip_next = False
        with open('/opt/meu-projeto/app.py', 'w') as f:
            f.write('\n'.join(new_lines))
        print("✅ db.create_all() removido")
