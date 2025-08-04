// src/components/Hero.jsx
import React, { useState, useEffect } from 'react';
import '../styles/Hero.css';
import { Link } from 'react-router-dom';

const Hero = () => {
  // Lista de promociones con imágenes reales y mensajes atractivos
  const promotions = [
    {
      id: 1,
      title: 'Oferta del mes',
      subtitle: 'Refrigeradoras inteligentes',
      description: 'Hasta 35% de descuento en modelos con control por voz y Wi-Fi.',
      image: 'https://images.unsplash.com/photo-1585123334904-845d60e97b29?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      cta: 'Ver refrigeradoras',
    },
    {
      id: 2,
      title: 'Lavado premium',
      subtitle: 'Lavadoras con ahorro de energía',
      description: 'Tecnología inverter, bajo consumo y gran capacidad. ¡Envío gratis!',
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      cta: 'Ver lavadoras',
    },
    {
      id: 3,
      title: 'Cocina moderna',
      subtitle: 'Hornos y estufas inteligentes',
      description: 'Controla tu cocina desde el celular. Diseño elegante y máxima eficiencia.',
      image: 'https://images.unsplash.com/photo-1603133951472-d0b828383c5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      cta: 'Ver cocina',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Cambiar automáticamente cada 5 segundos
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % promotions.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, promotions.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % promotions.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + promotions.length) % promotions.length);
  };

  const current = promotions[currentIndex];

  return (
    <section
      className="hero"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slider de fondo */}
      <div className="hero-slider">
        {promotions.map((promo, index) => (
          <div
            key={promo.id}
            className={`hero-slide ${index === currentIndex ? 'active' : ''}`}
            style={{ backgroundImage: `url(${promo.image})` }}
          ></div>
        ))}
      </div>

      {/* Overlay oscuro para mejorar legibilidad */}
      <div className="hero-overlay"></div>

      {/* Contenido principal */}
      <div className="hero-content">
        <h1>{current.title}</h1>
        <h2>{current.subtitle}</h2>
        <p>{current.description}</p>
        <Link to="/products" className="hero-button">
          {current.cta}
        </Link>

        {/* Indicadores (dots) */}
        <div className="hero-dots">
          {promotions.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Ir a promoción ${index + 1}`}
            ></button>
          ))}
        </div>
      </div>

      {/* Flechas de navegación (visibles al hacer hover) */}
      {promotions.length > 1 && (
        <>
          <button
            className="hero-arrow left"
            onClick={(e) => {
              e.stopPropagation();
              prevSlide();
            }}
            aria-label="Promoción anterior"
          >
            ◀
          </button>
          <button
            className="hero-arrow right"
            onClick={(e) => {
              e.stopPropagation();
              nextSlide();
            }}
            aria-label="Siguiente promoción"
          >
            ▶
          </button>
        </>
      )}
    </section>
  );
};

export default Hero;