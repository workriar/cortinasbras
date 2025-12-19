"""
Script de teste para gerar um PDF de exemplo com o novo logo
"""
import sys
from datetime import datetime

# Mock da classe Lead para teste
class MockLead:
    def __init__(self):
        self.id = 1
        self.nome = "Cliente Teste"
        self.telefone = "(11) 98765-4321"
        self.largura_parede = 3.5
        self.altura_parede = 2.8
        self.largura_janela = 2.0
        self.altura_janela = 1.5
        self.tecido = "Blackout Premium"
        self.instalacao = "Teto"
        self.observacoes = "Cliente prefere cores neutras e instalação na próxima semana."
        self.criado_em = datetime.now()

# Importar o gerador de PDF
try:
    from pdf_generator import generate_orcamento_pdf
    
    print("=" * 60)
    print("GERANDO PDF DE TESTE")
    print("=" * 60)
    
    # Criar lead de teste
    lead = MockLead()
    print(f"\nCliente: {lead.nome}")
    print(f"Telefone: {lead.telefone}")
    print(f"Medidas: {lead.largura_parede}m x {lead.altura_parede}m")
    
    # Gerar PDF
    print("\nGerando PDF...")
    pdf_buffer = generate_orcamento_pdf(lead)
    
    # Salvar PDF
    output_file = "teste_orcamento.pdf"
    with open(output_file, 'wb') as f:
        f.write(pdf_buffer.read())
    
    print(f"\n[OK] PDF gerado com sucesso!")
    print(f"Arquivo: {output_file}")
    print("\n" + "=" * 60)
    print("RESULTADO")
    print("=" * 60)
    print(f"\nO PDF foi salvo em: {output_file}")
    print("Abra o arquivo para verificar o logo marrom vinho!")
    print("=" * 60)
    
except ImportError as e:
    print(f"\n[ERRO] Nao foi possivel importar modulos necessarios:")
    print(f"  {e}")
    print("\nInstale as dependencias com: pip install reportlab")
    sys.exit(1)
except Exception as e:
    print(f"\n[ERRO] Erro ao gerar PDF:")
    print(f"  {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
