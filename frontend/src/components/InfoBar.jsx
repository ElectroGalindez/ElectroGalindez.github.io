// src/components/InfoBar.jsx
import React from 'react';
import '../styles/InfoBar.css';

function InfoBar() {
  return (
    <div className="info-bar">
      <div className="info-bar-content">
        <span className="info-item">
          🏬 <strong>ElectroGalíndez</strong>
        </span>
        <span className="info-item">
          📍 Av. Tecnológica 123, Ciudad Electrónica
        </span>
        <span className="info-item">
          🔧 Especialistas en electrodomésticos y tecnología del hogar
        </span>
        <span className="info-item">
          🕒 Lunes a Sábado: 9:00 - 20:00
        </span>
      </div>
    </div>
  );
}

export default InfoBar;