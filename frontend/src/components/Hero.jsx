// src/components/Hero.jsx
import React, { useState, useEffect } from 'react';
import '../styles/Hero.css';

const Hero = () => {
  const slides = [
    {
    image: '/hero-2.jpg',
    title: 'Calidad y Puntualidad Garantizada',
    subtitle: 'Tu confianza, nuestra prioridad',
    description: 'Productos seleccionados con los más altos estándares, entregados siempre a tiempo y con soporte confiable.',
    cta: 'Comprar con confianza',
    link: '/products'
  },  
  {
    image: '/hero-1.jpg',
    title: 'Precios Mayoristas Personalizados',
    subtitle: 'Haz crecer tu negocio con nosotros',
    description: 'Compra al por mayor con tarifas exclusivas y planes adaptados a tus necesidades. Rentabilidad garantizada.',
    cta: 'Solicitar precios mayoristas',
    link: '/products'
  },
  {
    image: '/hero-3.jpg',
    title: 'Ofertas que No Puedes Dejar Pasar',
    subtitle: 'Descuentos exclusivos cada semana',
    description: 'Aprovecha nuestras promociones constantes en tus productos favoritos. ¡Ahorra más todos los días!',
    cta: 'Ver ofertas de hoy',
    link: '/products'
  }
];


  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => setCurrent(prev => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent(prev => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="hero">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`hero-slide ${index === current ? 'active' : ''}`}
        >
          <div className="hero-content">
            <h1>{slide.title}</h1>
            <h2>{slide.subtitle}</h2>
            <p>{slide.description}</p>
            <a href={slide.link} className="hero-cta">{slide.cta}</a>
          </div>

          <div className="hero-image">
            <img src={slide.image} alt={slide.title} />
          </div>
        </div>
      ))}

      {/* Flechas */}
      <button className="hero-arrow left" onClick={prevSlide}>&lt;</button>
      <button className="hero-arrow right" onClick={nextSlide}>&gt;</button>

      {/* Dots */}
      <div className="hero-dots">
        {slides.map((_, idx) => (
          <span
            key={idx}
            className={`dot ${idx === current ? 'active' : ''}`}
            onClick={() => setCurrent(idx)}
          ></span>
        ))}
      </div>
    </section>
  );
};

export default Hero;
