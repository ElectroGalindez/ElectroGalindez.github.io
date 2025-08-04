// src/pages/Privacy.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Privacy.css';

function Privacy() {
  return (
    <div className="privacy-container" aria-labelledby="privacy-title">
      <h1 id="privacy-title">Política de Privacidad</h1>
      <p className="privacy-intro">
        En <strong>ElectroGalíndez</strong>, protegemos tu privacidad.
      </p>

      <div className="privacy-section">
        <h2>1. Información que recopilamos</h2>
        <p>Recopilamos tu nombre, email, teléfono y dirección para procesar pedidos.</p>
      </div>

      <div className="privacy-section">
        <h2>2. Uso de la información</h2>
        <p>Usamos tus datos solo para gestionar pedidos, envíos y soporte.</p>
      </div>

      <div className="privacy-section">
        <h2>3. Compartición de datos</h2>
        <p>No compartimos tus datos con terceros.</p>
      </div>

      <div className="privacy-section">
        <h2>4. Seguridad</h2>
        <p>Protegemos tus datos con medidas técnicas y organizativas.</p>
      </div>

      <div className="privacy-section">
        <h2>5. Contacto</h2>
        <p>Para ejercer tus derechos, contáctanos por <Link to="/contact">nuestro formulario</Link>.</p>
      </div>
    </div>
  );
}

export default Privacy;