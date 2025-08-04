// src/pages/OrderSuccess.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/OrderSuccess.css';

function OrderSuccess() {
  const navigate = useNavigate();
  const { getTotal, clearCart } = useCart();

  // Generar número de pedido (simulado)
  const orderId = `EG-${Math.floor(1000 + Math.random() * 9000)}`;
  const total = getTotal().toFixed(2);

  // Generar mensaje de WhatsApp
  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Hola, acabo de hacer un pedido en ElectroGalíndez.\n` +
      `Número de pedido: ${orderId}\n` +
      `Total: €${total}\n` +
      `Método de pago: Zelle o acuerdo.\n` +
      `Por favor, confírmenme envío y forma de pago.`
    );
    window.open(`https://wa.me/5358956749?text=${message}`, '_blank');
  };

  return (
    <div className="success-container" aria-labelledby="success-title">
      <div className="success-card">
        {/* Icono de éxito */}
        <div className="success-icon" aria-hidden="true">✅</div>

        {/* Contenido */}
        <div className="success-content">
          <h1 id="success-title">¡Pedido realizado con éxito!</h1>
          <p className="success-subtitle">
            Gracias por confiar en <strong>ElectroGalíndez</strong>. Tu pedido está en proceso.
          </p>

          {/* Detalles del pedido */}
          <div className="success-details">
            <p><strong>Número de pedido:</strong> <code>{orderId}</code></p>
            <p><strong>Total:</strong> €{total}</p>
            <p><strong>Siguiente paso:</strong> Te contactaremos por WhatsApp para confirmar el envío y el pago (Zelle o acuerdo).</p>
          </div>

          {/* Acciones */}
          <div className="success-actions">
            <button
              onClick={handleWhatsApp}
              className="btn-whatsapp"
              aria-label="Confirmar pedido por WhatsApp"
            >
              📲 Confirmar por WhatsApp
            </button>
            <button
              onClick={() => navigate('/')}
              className="btn-home"
              aria-label="Volver al inicio"
            >
              🏠 Inicio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;