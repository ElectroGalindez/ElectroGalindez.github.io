// src/pages/Checkout.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useApp } from '../context/AppContext';
import '../styles/Checkout.css';

function Checkout() {
  const { cart, getTotal } = useCart();
  const { formatPrice } = useApp();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, phone, address } = formData;
    
    if (!name || !phone || !address) {
      alert('Por favor, completa todos los campos obligatorios.');
      return;
    }

    // Generar mensaje para WhatsApp
    const total = getTotal();
    const productLines = cart.map(item => 
      `${item.name} × ${item.quantity} (${formatPrice(item.price)} c/u) = ${formatPrice(item.price * item.quantity)}`
    ).join('\n• ');

    const message = encodeURIComponent(`
*Pedido desde ElectroGalíndez*

*Cliente:* ${name}
*Teléfono:* ${phone}
*Dirección:* ${address}
${formData.notes ? '*Notas:* ' + formData.notes : ''}

*Detalles del pedido:*
• ${productLines}

*Total:* ${formatPrice(total)}

¡Hola! Quiero confirmar este pedido.
    `.trim());

    const whatsappUrl = `https://wa.me/5358956749?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="checkout-container">
      <h2>Finalizar Compra</h2>

      <div className="checkout-cart">
        <h3>Tu Pedido</h3>
        <ul className="cart-list">
          {cart.map(item => (
            <li key={item.id} className="cart-item">
              <span>{item.name}</span>
              <span>x{item.quantity}</span>
              <span>{formatPrice(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="cart-total">
          <strong>Total:</strong>
          <span>{formatPrice(getTotal())}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="checkout-form">
        <h3>Datos de Contacto</h3>

        <div className="form-group">
          <label htmlFor="name">Nombre completo *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Teléfono (WhatsApp) *</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="555444333"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Dirección de entrega *</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows="3"
            placeholder="Calle, número, barrio, ciudad"
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notas (opcional)</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="2"
            placeholder="Ej: horario de entrega, referencia, etc."
          ></textarea>
        </div>

        <div className="checkout-actions">
          <button type="button" onClick={() => navigate(-1)} className="btn-back">
            ← Volver al carrito
          </button>
          <button type="submit" className="btn-confirm">
            💬 Enviar pedido por WhatsApp
          </button>
        </div>
      </form>
    </div>
  );
}

export default Checkout;