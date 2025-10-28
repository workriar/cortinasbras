import React, { useState } from 'react';

function OrcamentoForm() {
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    parede: '',
    altura_parede: '',
    janela_largura: '',
    janela_altura: '',
    tecido: '',
    instalacao: '',
    observacoes: '',
    endereco: '',
  });
  const [isValidated, setIsValidated] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const normalizeDecimal = (value) => {
    return value.trim().replace(',', '.');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsValidated(true);

    const form = event.target;
    if (!form.checkValidity()) {
      return;
    }

    const normalizedData = {
      nome: formData.nome,
      telefone: formData.telefone,
      largura_parede: normalizeDecimal(formData.larguraparede),
      altura_parede: normalizeDecimal(formData.alturaparede),
      largura_janela: normalizeDecimal(formData.janela_largura),
      altura_janela: normalizeDecimal(formData.janela_altura),
      tecido: formData.tecido,
      instalacao: formData.instalacao,
      observacoes: formData.observacoes,
      endereco: formData.endereco,
    };

    try {
      const response = await fetch('http://localhost:5001/enviar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(normalizedData).toString(),
      });

      if (response.ok) {
        setShowModal(true);
        let msg = `Olá! Gostaria de um orçamento de cortina sob medida:%0A`;
        msg += `*Nome:* ${normalizedData.nome}%0A`;
        msg += `*Telefone:* ${normalizedData.telefone}%0A`;
        msg += `*Parede:* ${normalizedData.larguraparede}m (L) x ${normalizedData.alturaparede}m (A)%0A`;
        msg += `*Janela:* ${normalizedData.janela_largura}m (L) x ${normalizedData.janela_altura}m (A)%0A`;
        msg += `*Tecido:* ${normalizedData.tecido}%0A`;
        msg += `*Instalação:* ${normalizedData.instalacao}%0A`;
        if (normalizedData.observacoes) msg += `*Observações:* ${normalizedData.observacoes}%0A`;
        if (normalizedData.endereco) msg += `*Endereço:* ${normalizedData.endereco}%0A`;

        // Google Ads conversion (adaptado para React)
        try {
          const p = parseFloat(normalizedData.larguraparede) || 0;
          const h = parseFloat(normalizedData.alturaparede) || 0;
          const jw = parseFloat(normalizedData.janela_largura) || 0;
          const jh = parseFloat(normalizedData.janela_altura) || 0;
          const area = Math.max(0, (p * h) - (jw * jh));
          const conversionValue = parseFloat(area.toFixed(2));
          if (window.gtag && typeof window.gtag === 'function') {
            window.gtag('event', 'conversion', {
              'send_to': 'AW-17672945118/AW-17672945118',
              'value': conversionValue,
              'currency': 'BRL'
            });
          }
        } catch (e) {
          console.warn('gtag conversion error', e);
        }

        setTimeout(() => {
          window.location.href = `https://wa.me/5511992891070?text=${msg}`;
        }, 1200);
      }
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
    }
  };

  // Lógica para atualizar o mapa (sem API, usando Google Maps search URL)
  const updateMapFromEndereco = () => {
    const endereco = formData.endereco.trim();
    const mapFrame = document.getElementById('mapFrame');
    if (!endereco || !mapFrame) return;

    const q = encodeURIComponent(endereco);
    const embed = `https://www.google.com/maps?q=${q}&output=embed`;
    mapFrame.src = embed;
  };

  // Efeito para atualizar o mapa quando o endereço muda (com debounce)
  React.useEffect(() => {
    const handler = setTimeout(() => {
      if (formData.endereco.trim()) {
        updateMapFromEndereco();
      }
    }, 700); // Debounce de 700ms

    return () => {
      clearTimeout(handler);
    };
  }, [formData.endereco]);

  return (
    <form id="orcamentoForm" onSubmit={handleSubmit} className={isValidated ? 'was-validated' : ''} noValidate autoComplete="off">
      <label for="nome">Nome</label>
      <input type="text" name="nome" id="nome" placeholder="Seu nome" required autocomplete="name" />
      <label for="telefone">Whatsapp</label>
      <input type="tel" name="telefone" id="telefone" placeholder="Telefone WhatsApp" required autocomplete="tel" />
      <label for="larguraparede">Largura da parede (m) <span className="input-example">Ex: 1,5</span></label>
      <input type="text" name="larguraparede" id="larguraparede" placeholder="Ex: 1,5" required pattern="[0-9]+([\.,][0-9]+)?" />
      <label for="alturaparede">Altura da parede (m) <span className="input-example">Ex: 1,5</span></label>
      <input type="text" name="alturaparede" id="alturaparede" placeholder="Ex: 1,5" required pattern="[0-9]+([\.,][0-9]+)?" />
      <button type="submit" className="btn-primary">Solicitar orçamento</button>
    </form>
  );
}

export default OrcamentoForm;
