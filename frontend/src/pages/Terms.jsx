// src/pages/Terms.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Terms.css';

function Terms() {
  return (
    <div className="terms-container" aria-labelledby="terms-title">
      <h1 id="terms-title">Términos y Condiciones</h1>
      <p className="terms-intro">
        Bienvenido a <strong>ElectroGalíndez</strong>. Estos términos rigen el uso de nuestra tienda online.
      </p>

      <div className="terms-section">
        <h2>1. Uso del sitio</h2>
        <p>El uso de este sitio está reservado para personas mayores de 18 años.</p>
      </div>

      <div className="terms-section">
        <h2>2. Pedidos y pagos</h2>
        <p>Los pedidos se realizan por WhatsApp. El pago se coordina por Zelle o acuerdo directo.</p>
      </div>

      <div className="terms-section">
        <h2>3. Envíos</h2>
        <p>Ofrecemos envío gratuito a toda La Habana. La entrega se coordina por WhatsApp.</p>
      </div>

      <div className="terms-section">
        <h2>4. Cambios y devoluciones</h2>
        <p>Los cambios se gestionan dentro de los 7 días posteriores a la entrega.</p>
      </div>

      <div className="terms-section">
        <h2>5. Contacto</h2>
        <p>Para cualquier consulta, contáctanos por <Link to="/contact">nuestro formulario</Link>.</p>
      </div>
    </div>
  );
}

export default Terms;