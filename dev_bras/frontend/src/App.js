import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Carousel from './components/Carousel';
import Hero from './components/Hero';
import QuoteForm from './components/QuoteForm';
import Map from './components/Map';
import Footer from './components/Footer';

function App() {
  const [config, setConfig] = useState(null);
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    // Fetch config
    fetch('/api/config')
      .then(res => res.json())
      .then(data => setConfig(data))
      .catch(err => console.error('Error loading config:', err));

    // Fetch slides
    fetch('/api/slides')
      .then(res => res.json())
      .then(data => setSlides(data))
      .catch(err => console.error('Error loading slides:', err));
  }, []);

  if (!config) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="App">
      <Header config={config} />
      <Carousel slides={slides} />
      <main>
        <Hero />
        <QuoteForm whatsappNumber={config.whatsapp} />
        <Map address={config.address} />
      </main>
      <Footer config={config} />
    </div>
  );
}

export default App;
