# Adiciona a rota /pre-orcamento.html ao Flask em /opt/meu-projeto/app.py
import sys
from pathlib import Path

app_py = Path("/opt/meu-projeto/app.py")
if not app_py.exists():
    print("Arquivo /opt/meu-projeto/app.py não encontrado.")
    sys.exit(1)

with app_py.open("r", encoding="utf-8") as f:
    lines = f.readlines()

# Verifica se a rota já existe
if any("/pre-orcamento.html" in l for l in lines):
    print("Rota já existe. Nada a fazer.")
    sys.exit(0)

# Procura onde inserir (após a função index)
insert_idx = None
for i, l in enumerate(lines):
    if l.strip().startswith("def index("):
        # Procura o fim da função index
        for j in range(i+1, len(lines)):
            if lines[j].strip().startswith("@") or lines[j].strip().startswith("def "):
                insert_idx = j
                break
        if insert_idx is None:
            insert_idx = len(lines)
        break

if insert_idx is None:
    print("Não foi possível localizar a função index.")
    sys.exit(1)

route_code = '''\n\n@app.route('/pre-orcamento.html')\ndef pre_orcamento():\n    return render_template('pre-orcamento.html')\n'''

lines.insert(insert_idx, route_code)

with app_py.open("w", encoding="utf-8") as f:
    f.writelines(lines)

print("Rota adicionada com sucesso.")
