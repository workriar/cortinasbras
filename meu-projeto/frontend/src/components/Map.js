import React from 'react';
import './Map.css';

function Map({ address }) {
  const addressString = `${address.street}+-+${address.neighborhood},+${address.city}-${address.state}`;

  return (
    <section className="map-section">
      <h3 className="map-title">Como chegar</h3>
      <div className="map-container">
        <iframe
          src={`https://www.google.com/maps?q=${addressString}&output=embed`}
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Mapa de localização"
        />
      </div>
    </section>
  );
}

export default Map;
