import React from 'react';
import '../styles/Hero.css';
import { Link } from 'react-router-dom';


const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Ofertas electrónicas</h1>
        <p>Explora nuestras mejores promociones del mes</p>
        <Link to="/products" className="hero-button">
          Ver productos
        </Link>
      </div>
    </section> 
  );
};

export default Hero;
