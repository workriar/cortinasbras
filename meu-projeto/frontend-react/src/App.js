import React from 'react';
import './App.css'; // Importar o CSS
import OrcamentoForm from './components/OrcamentoForm';
import InstagramIcon from './components/InstagramIcon';
import FacebookIcon from './components/FacebookIcon';
import WhatsAppIcon from './components/WhatsAppIcon';

function App() {
  return (
    <div className="App">
      <a className="skip-link" href="#maincontent">Pular para o conteúdo</a>
      <header>
        <div className="logo-container">
          <img src="/logo.png" alt="Logo Cortinas Brás" className="logo" />
        </div>
        <nav aria-label="Navegação principal">
          <a href="#form-orcamento">Orçamento</a>
          <a href="#contato">Contato</a>
        </nav>
        <h1>Cortinas sob medida em São Paulo</h1>
        <p>Transforme seu ambiente com sofisticação, tecidos nobres e instalação profissional.</p>
      </header>

      {/* Carrossel dinâmico */}
      <section className="carousel" aria-label="Galeria de cortinas">
        <div className="carousel-slides">
          {/* Slides serão inseridos aqui */}
        </div>
        <button className="carousel-btn prev" aria-label="Slide anterior">&#10094;</button>
        <button className="carousel-btn next" aria-label="Próximo slide">&#10095;</button>
      </section>

      <main>
        <section className="hero">
          <h2>Decore seu ambiente com tradição, referência em SP</h2>
          <p>Solicite um orçamento rápido e personalizado!</p>
          <button id="cta-btn" className="btn-primary">Quero meu orçamento</button>
        </section>
        <section className="form-section" id="form-orcamento">
          <h3>Peça seu orçamento em poucos minutos!</h3>
          <OrcamentoForm />
        </section>

        <section className="map-section" aria-label="Mapa do endereço">
          <h3>Como chegar</h3>
          <div className="map-container">
            <iframe src="https://www.google.com/maps?q=Av.+Celso+Garcia,+129+-+Br%C3%A1s,+S%C3%A3o+Paulo-SP&output=embed" width="100%" height="350" style={{border:0}} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
          </div>
        </section>
      </main>

      <footer id="contato">
        <address>
          Av. Celso Garcia, 129 - Brás, São Paulo-SP<br />
          WhatsApp: (11) 99289-1070 <br />
          E-mail: <a href="mailto:contato@cortinasbras.com.br">contato@cortinasbras.com.br</a>
        </address>
        <p>© 2025 Cortinas Brás - Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

export default App;
