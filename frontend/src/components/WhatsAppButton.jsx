// src/components/WhatsAppButton.jsx
import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import '../styles/WhatsAppButton.css';

const WhatsAppButton = () => {
  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      'Hola, estoy interesado en los productos de ElectroGalíndez. ¿Qué tienen disponibles?'
    );
    const url = `https://wa.me/5358956749?text=${message}`;
    window.open(url, '_blank');
  };

  return (
    <button
      onClick={handleWhatsApp}
      className="whatsapp-float"
      aria-label="Contactar por WhatsApp"
    >
      <FaWhatsapp size={32} />
    </button>
  );
};

export default WhatsAppButton;