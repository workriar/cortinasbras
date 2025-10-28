import React from 'react';
import './Hero.css';

function Hero() {
  const scrollToForm = () => {
    document.getElementById('form-orcamento')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero">
      <div className="hero-content">
        <h2 className="hero-title">Decore seu ambiente com tradição, referência em SP</h2>
        <p className="hero-description">Solicite um orçamento rápido e personalizado!</p>
        <button className="btn-primary" onClick={scrollToForm}>
          Quero meu orçamento
        </button>
      </div>
    </section>
  );
}

export default Hero;
