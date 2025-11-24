# Corrige a rota /pre-orcamento.html no /opt/meu-projeto/app.py
from pathlib import Path
import sys

app_py = Path("/opt/meu-projeto/app.py")
if not app_py.exists():
    print("Arquivo /opt/meu-projeto/app.py não encontrado.")
    sys.exit(1)

with app_py.open("r", encoding="utf-8") as f:
    lines = f.readlines()

# Remove rotas quebradas ou duplicadas
new_lines = []
skip = False
for l in lines:
    if "/pre-orcamento.html" in l or "def pre_orcamento" in l:
        skip = True
    elif skip and l.strip() == "":
        skip = False
        continue
    if not skip:
        new_lines.append(l)

# Procura onde inserir (após a função index)
insert_idx = None
for i, l in enumerate(new_lines):
    if l.strip().startswith("def index("):
        # Procura o fim da função index
        for j in range(i+1, len(new_lines)):
            if new_lines[j].strip().startswith("@") or new_lines[j].strip().startswith("def "):
                insert_idx = j
                break
        if insert_idx is None:
            insert_idx = len(new_lines)
        break

if insert_idx is None:
    print("Não foi possível localizar a função index.")
    sys.exit(1)

route_code = '''\n\n@app.route('/pre-orcamento.html')\ndef pre_orcamento():\n    return render_template('pre-orcamento.html')\n'''

new_lines.insert(insert_idx, route_code)

with app_py.open("w", encoding="utf-8") as f:
    f.writelines(new_lines)

print("Rota corrigida com sucesso.")
