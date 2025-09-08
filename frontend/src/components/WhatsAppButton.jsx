import React, { useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import '../styles/WhatsAppButton.css';

const WhatsAppButton = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      'Hola, estoy interesado en los productos de ElectroGalíndez. ¿Qué tienen disponibles?'
    );
    const url = `https://wa.me/5358956749?text=${message}`;
    window.open(url, '_blank');
  };

  return (
    <div
      className="whatsapp-wrapper"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >

      {showTooltip && (
        <div className="whatsapp-tooltip">
          💬 Chatea con nosotros ahora
        </div>
      )}

      <button
        onClick={handleWhatsApp}
        className="whatsapp-float"
        aria-label="Contactar por WhatsApp"
      >
        <FaWhatsapp size={32} />
        <span className="whatsapp-status">En línea</span>
      </button>
    </div>
  );
};

export default WhatsAppButton;
