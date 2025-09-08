// src/components/InfoBar.jsx
import React from 'react';
import '../styles/InfoBar.css';

function InfoBar() {
  return (
    <div className="info-bar">
      <div className="info-bar-content">
        <div className="info-item">
          🏬 <strong>ElectroGalíndez</strong>
        </div>
        <div className="info-item">
          📍 Av. Tecnológica 123, Ciudad Electrónica
        </div>
        <div className="info-item">
          🔧 Especialistas en electrodomésticos y tecnología del hogar
        </div>
        <div className="info-item">
          🕒 Lunes a Sábado: 9:00 - 20:00
        </div>
      </div>
    </div>
  );
}

export default InfoBar;
