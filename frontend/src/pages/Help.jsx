// src/pages/Help.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Help.css';

function Help() {
  return (
    <div className="help-container" aria-labelledby="help-title">
      <h1 id="help-title">Centro de Ayuda</h1>
      <p className="help-subtitle">Encuentra respuestas a las preguntas más frecuentes.</p>

      <div className="help-grid">
        <div className="help-card">
          <h3>¿Cómo realizo un pedido?</h3>
          <p>Agrega productos al carrito y haz clic en "Enviar pedido por WhatsApp". Te contactaremos para confirmar envío y pago.</p>
        </div>

        <div className="help-card">
          <h3>¿Cuál es el método de pago?</h3>
          <p>Aceptamos Zelle o acuerdos directos. Confirmaremos el pago por WhatsApp.</p>
        </div>

        <div className="help-card">
          <h3>¿Tienen envío a domicilio?</h3>
          <p>Sí, ofrecemos envío gratis a toda La Habana.</p>
        </div>

        <div className="help-card">
          <h3>¿Puedo cambiar o devolver un producto?</h3>
          <p>Los cambios se gestionan directamente con nuestro equipo por WhatsApp, dentro de los 7 días posteriores a la entrega.</p>
        </div>

        <div className="help-card">
          <h3>¿Cómo contacto al soporte?</h3>
          <p>Escríbenos por <Link to="/contact">nuestro formulario</Link> o por WhatsApp al +53 58956749.</p>
        </div>

        <div className="help-card">
          <h3>¿Mis datos están seguros?</h3>
          <p>Sí, protegemos tu información y no compartimos tus datos con terceros.</p>
        </div>
      </div>

      <div className="help-contact">
        <p>¿No encontraste lo que buscabas?</p>
        <Link to="/contact" className="btn-primary">Contáctanos</Link>
      </div>
    </div>
  );
}

export default Help;