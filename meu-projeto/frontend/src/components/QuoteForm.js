import React, { useState } from 'react';
import './QuoteForm.css';

function QuoteForm({ whatsappNumber }) {
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    largura: '',
    altura: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const mensagem = `Olá! Gostaria de solicitar um orçamento:

*Nome:* ${formData.nome}
*Telefone:* ${formData.telefone}
*Largura da parede:* ${formData.largura}m
*Altura da parede:* ${formData.altura}m

Aguardo retorno!`;

    const mensagemCodificada = encodeURIComponent(mensagem);
    const urlWhatsApp = `https://wa.me/${whatsappNumber}?text=${mensagemCodificada}`;

    window.open(urlWhatsApp, '_blank');

    setShowSuccess(true);
    setFormData({ nome: '', telefone: '', largura: '', altura: '' });

    setTimeout(() => {
      setShowSuccess(false);
    }, 5000);
  };

  return (
    <section className="form-section" id="form-orcamento">
      <div className="form-container">
        <h3 className="form-title">Peça seu orçamento em poucos minutos!</h3>
        <form onSubmit={handleSubmit} className="quote-form">
          <div className="form-group">
            <label htmlFor="nome">Nome</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Seu nome"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="telefone">WhatsApp</label>
            <input
              type="tel"
              id="telefone"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              placeholder="(11) 99999-9999"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="largura">
                Largura da parede (m) <span className="input-example">Ex: 1,5</span>
              </label>
              <input
                type="text"
                id="largura"
                name="largura"
                value={formData.largura}
                onChange={handleChange}
                placeholder="Ex: 1,5"
                pattern="[0-9]+([\.,][0-9]+)?"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="altura">
                Altura da parede (m) <span className="input-example">Ex: 1,5</span>
              </label>
              <input
                type="text"
                id="altura"
                name="altura"
                value={formData.altura}
                onChange={handleChange}
                placeholder="Ex: 1,5"
                pattern="[0-9]+([\.,][0-9]+)?"
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary btn-submit">
            Solicitar orçamento
          </button>
        </form>

        {showSuccess && (
          <div className="success-message">
            ✓ Abrindo WhatsApp com sua solicitação!
          </div>
        )}
      </div>
    </section>
  );
}

export default QuoteForm;
