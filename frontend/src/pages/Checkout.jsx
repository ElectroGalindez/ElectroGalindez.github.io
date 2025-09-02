// src/pages/Checkout.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import '../styles/Checkout.css';

function Checkout() {
  const { cart, clearCart, getTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: '',
    address: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Nombre requerido';
    if (!formData.phone.trim()) newErrors.phone = 'Teléfono requerido';
    if (!formData.address.trim()) newErrors.address = 'Dirección requerida';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Generar mensaje de WhatsApp
    const total = getTotal();
    const items = cart.map(item => 
      `• ${item.name} × ${item.quantity} → ${new Intl.NumberFormat('es-CU', {
        style: 'currency',
        currency: 'CUP'
      }).format(item.price * item.quantity)}`
    ).join('\n');

    const message = encodeURIComponent(
      `Hola, quiero hacer una compra en ElectroGalíndez:\n\n${items}\n\n` +
      `Total: ${new Intl.NumberFormat('es-CU', {
        style: 'currency',
        currency: 'CUP'
      }).format(total)}\n\n` +
      `Datos de contacto:\n` +
      `Nombre: ${formData.name}\n` +
      `Teléfono: ${formData.phone}\n` +
      `Dirección: ${formData.address}\n` +
      `${formData.notes ? `Notas: ${formData.notes}` : ''}\n\n` +
      `Por favor, confírmenme disponibilidad y coordinemos entrega.`
    );

    const whatsappUrl = `https://wa.me/5358956749?text=${message}`;
    window.open(whatsappUrl, '_blank');

    // Vaciar carrito y redirigir
    clearCart();
    setIsSubmitting(false);
    navigate('/thank-you');
  };

  const total = getTotal();

  if (cart.length === 0) {
    return (
      <div className="checkout empty">
        <p>Tu carrito está vacío</p>
        <button onClick={() => navigate('/products')} className="btn-primary">
          ← Volver a productos
        </button>
      </div>
    );
  }

  return (
    <div className="checkout">
      <h1>Finalizar Compra</h1>
      <p className="checkout-subtitle">Completa tus datos para coordinar la entrega</p>

      <div className="checkout-grid">
        {/* Resumen del pedido */}
        <div className="order-summary">
          <h2>Resumen del Pedido</h2>
          <div className="summary-items">
            {cart.map(item => (
              <div key={item.id} className="summary-item">
                <img src={item.image || '/placeholders/product.png'} alt={item.name} />
                <div className="item-info">
                  <strong>{item.name}</strong>
                  <span>{item.quantity} × {new Intl.NumberFormat('es-CU', {
                    style: 'currency',
                    currency: 'CUP'
                  }).format(item.price)}</span>
                </div>
                <div className="item-total">
                  {new Intl.NumberFormat('es-CU', {
                    style: 'currency',
                    currency: 'CUP'
                  }).format(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>
          <div className="summary-total">
            <strong>Total:</strong>
            <span>{new Intl.NumberFormat('es-CU', {
              style: 'currency',
              currency: 'CUP'
            }).format(total)}</span>
          </div>
        </div>

        {/* Formulario */}
        <div className="checkout-form">
          <h2>Tus Datos</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nombre *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Tu nombre completo"
              />
              {errors.name && <span className="error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label>Teléfono *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Ej: 55512345"
              />
              {errors.phone && <span className="error">{errors.phone}</span>}
            </div>

            <div className="form-group">
              <label>Dirección de entrega *</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Ej: Calle 123, entre 5 y 7, Vedado"
                rows="3"
              ></textarea>
              {errors.address && <span className="error">{errors.address}</span>}
            </div>

            <div className="form-group">
              <label>Notas (opcional)</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Ej: Entregar después de las 5 PM"
                rows="2"
              ></textarea>
            </div>

            <div className="form-actions">
              <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
                ← Volver
              </button>
              <button type="submit" className="btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Enviando...' : '✅ Enviar pedido por WhatsApp'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Checkout;