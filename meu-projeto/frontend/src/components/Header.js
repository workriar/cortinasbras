import React from 'react';
import './Header.css';

function Header({ config }) {
  return (
    <header className="header">
      <div className="header-top">
        <div className="logo-container">
          <img src="/logobras.png" alt="Logo Cortinas Brás" className="logo" />
        </div>
        <nav className="nav">
          <a href="#form-orcamento" className="nav-link">Orçamento</a>
          <a href="#contato" className="nav-link">Contato</a>
        </nav>
      </div>
      <div className="header-content">
        <h1 className="header-title">{config.title}</h1>
        <p className="header-subtitle">{config.description}</p>
      </div>
    </header>
  );
}

export default Header;
