// src/pages/CheckoutPage.jsx
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import '../styles/CheckoutPage.css';

function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();

  const [address, setAddress] = useState({
    street: '',
    city: 'La Habana',
    phone: user?.phone || '',
  });

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleWhatsAppSubmit = () => {
    if (!address.street || !address.phone) {
      alert('Por favor, completa tu dirección y teléfono.');
      return;
    }

    let message = `Hola, quiero hacer un pedido:\n\n`;
    cart.forEach((item) => {
      message += `- ${item.name} (x${item.quantity})\n`;
    });
    message += `\nTotal: $${total.toFixed(2)}\n`;
    message += `Enviar a: ${address.street}, ${address.city}\n`;
    message += `Teléfono: ${address.phone}\n`;
    message += `Método de pago: Zelle o acuerdo directo.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/5358956749?text=${encodedMessage}`;

    // Simular que el pedido fue enviado
    clearCart();
    window.open(whatsappURL, '_blank');
  };

  if (cart.length === 0) {
    return (
      <div className="checkout-empty">
        <h2>Carrito vacío</h2>
        <p>Ve a <Link to="/products">nuestros productos</Link> para agregar artículos.</p>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h2>Finalizar Compra</h2>

      <div className="checkout-grid">
        {/* Formulario de dirección */}
        <div className="checkout-form">
          <h3>Dirección de Envío</h3>
          <div className="form-group">
            <label htmlFor="street">Dirección</label>
            <input
              type="text"
              id="street"
              name="street"
              value={address.street}
              onChange={handleChange}
              placeholder="Calle, número, apartamento"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="city">Ciudad</label>
            <input type="text" id="city" name="city" value={address.city} readOnly />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Teléfono de contacto</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={address.phone}
              onChange={handleChange}
              placeholder="+53 58956749"
              required
            />
          </div>
        </div>

        {/* Resumen del pedido */}
        <div className="checkout-summary">
          <h3>Resumen del Pedido</h3>
          <div className="summary-items">
            {cart.map((item) => (
              <div key={item._id} className="summary-item">
                <span>{item.name}</span>
                <span>x{item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="summary-total">
            <strong>Total: ${total.toFixed(2)}</strong>
          </div>

          <button className="whatsapp-btn" onClick={handleWhatsAppSubmit}>
            📲 Enviar Pedido por WhatsApp
          </button>
          <p className="checkout-note">
            Te contactaremos para confirmar el envío y el pago (Zelle o acuerdo).
          </p>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;