// src/pages/Home.jsx
import React from 'react';
import CategoryRow from '../components/CategoryFilter';
import FeaturedProducts from '../components/FeaturedProducts';
import WhatsAppButton from '../components/WhatsAppButton';
import '../styles/Home.css';

function Home() {
  return (
    <main className="home-page">
      {/* Fila de categorías */}
      <section className="home-categories" aria-label="Categorías disponibles">
        <h2 className="sr-only">Categorías</h2>
        <CategoryRow />
      </section>

      {/* Productos destacados */}
      <section className="featured-section" aria-labelledby="featured-title">
        <h2 id="featured-title">Lo Más Solicitado</h2>
        <FeaturedProducts />
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-content">
          <h3>¿Tienes dudas?</h3>
          <p>Contáctanos por WhatsApp y te ayudamos a elegir el producto ideal.</p>
        </div>
        <a
          href="https://wa.me/5358956749?text=Hola,%20estoy%20interesado%20en%20sus%20productos"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-whatsapp-large"
        >
          💬 Habla con nosotros
        </a>
      </section>

      <WhatsAppButton />
    </main>
  );
}

export default Home;