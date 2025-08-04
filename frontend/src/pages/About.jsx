// src/pages/About.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/About.css';

function About() {
  return (
    <div className="about-container" aria-labelledby="about-title">
      <div className="about-hero">
        <h1 id="about-title">Sobre ElectroGalíndez</h1>
        <p>La excelencia en electrodomésticos desde La Habana</p>
      </div>

      <div className="about-content">
        <section className="about-section">
          <h2>Quiénes somos</h2>
          <p>
            ElectroGalíndez es una tienda cubana líder en electrodomésticos de alta calidad. 
            Desde nuestros inicios, nos hemos comprometido con la innovación, el servicio al cliente 
            y la tecnología del hogar más avanzada.
          </p>
          <p>
            Trabajamos con marcas reconocidas y ofrecemos productos que combinan diseño, 
            eficiencia y durabilidad, adaptados a las necesidades del mercado cubano.
          </p>
        </section>

        <section className="about-section">
          <h2>Nuestra misión</h2>
          <p>
            Hacer accesible la tecnología del hogar para todos, con productos de calidad, 
            atención personalizada y envío a domicilio gratuito en La Habana.
          </p>
        </section>

        <section className="about-section">
          <h2>Compromiso con Cuba</h2>
          <p>
            Estamos orgullosos de ser una empresa 100% cubana, apoyando la economía local 
            y ofreciendo soluciones tecnológicas que mejoran la vida de las familias.
          </p>
        </section>

        <div className="about-cta">
          <Link to="/products" className="btn-primary">
            Ver productos
          </Link>
        </div>
      </div>
    </div>
  );
}

export default About;