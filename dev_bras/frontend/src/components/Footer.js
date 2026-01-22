import React from 'react';
import './Footer.css';

function Footer({ config }) {
  return (
    <footer className="footer" id="contato">
      <div className="footer-content">
        <address className="footer-address">
          {config.address.street} - {config.address.neighborhood}, {config.address.city}-{config.address.state}
          <br />
          WhatsApp: {config.contact.phone}
          <br />
          E-mail:{' '}
          <a href={`mailto:${config.contact.email}`} className="footer-link">
            {config.contact.email}
          </a>
        </address>
        <p className="footer-copyright">© 2025 Cortinas Brás - Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;
