// src/pages/Checkout.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../services/apiClient';
import '../styles/Checkout.css';

function Checkout() {
  const { cart, getTotal, clearCart, removeItem, getProductImage } = useCart();
  const { formatPrice } = useApp();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Estado del formulario, inicializado con datos del usuario
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: '',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Actualiza el estado del formulario al cambiar campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Envía la orden
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert('Debes iniciar sesión para realizar la compra.');
      navigate('/login');
      return;
    }

    const { name, phone, address, notes } = formData;
    if (!name || !phone || !address) {
      alert('Por favor, completa todos los campos obligatorios.');
      return;
    }

    const orderPayload = {
      user: user._id,
      items: cart.map(item => ({
        productId: item._id,
        quantity: item.quantity,
        price: item.price
      })),
      shippingAddress: address,
      paymentMethod: 'WhatsApp',
      notes
    };

    try {
      setIsSubmitting(true);

      const data = await apiClient('/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}` // token del usuario
        },
        body: JSON.stringify(orderPayload)
      });

      const orderId = data.order._id;

      // Generar mensaje WhatsApp
      const productLines = cart.map(item =>
        `${item.name || 'Producto'} × ${item.quantity || 1} (${formatPrice(item.price || 0)} c/u) = ${formatPrice((item.price || 0) * (item.quantity || 1))}`
      ).join('\n• ');

      const message = encodeURIComponent(`
  *Pedido desde ElectroGalíndez*

  *ID de la orden:* ${orderId}
  *Cliente:* ${name}
  *Teléfono:* ${phone}
  *Dirección:* ${address}
  ${notes ? '*Notas:* ' + notes : ''}

  *Detalles del pedido:*
  • ${productLines}

  *Total:* ${formatPrice(getTotal() || 0)}

  ¡Hola! Quiero confirmar este pedido.
      `.trim());

      window.open(`https://wa.me/5358956749?text=${message}`, '_blank');

      clearCart();
      alert('Orden creada exitosamente y mensaje enviado por WhatsApp.');
      navigate('/products');

    } catch (err) {
      console.error('Error al crear la orden:', err);

      if (err.message.toLowerCase().includes('unauthorized')) {
        alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        logout();
        navigate('/login');
        return;
      }

      alert(err.message || 'No se pudo crear la orden. Intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };


  // 7️⃣ Si el carrito está vacío
  if (!cart || cart.length === 0) {
    return (
      <div className="checkout-container">
        <h2>Tu carrito está vacío</h2>
        <button onClick={() => navigate('/products')} className="btn-back">
          ← Volver a productos
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h2>Finalizar Compra</h2>

      {/* Resumen del carrito */}
      <div className="checkout-cart">
        <h3>Tu Pedido</h3>
        <ul className="cart-list">
          {cart.map(item => (
            <li key={item._id || Math.random()} className="cart-item">
              <img
                src={getProductImage(item)}
                alt={item.name || 'Producto'}
                loading="lazy"
                onError={e => e.target.src = '/placeholders/product.png'}
              />
              <div className="cart-item-info">
                <span>{item.name || 'Sin nombre'}</span>
                <span>x{item.quantity || 1}</span>
                <span>{formatPrice((item.price || 0) * (item.quantity || 1))}</span>
              </div>
              <button
                className="btn-remove"
                title="Quitar producto"
                onClick={() => removeItem(item._id)}
              >
                ❌
              </button>
            </li>
          ))}
        </ul>
        <div className="cart-total">
          <strong>Total:</strong>
          <span>{formatPrice(getTotal() || 0)}</span>
        </div>
      </div>

      {/* Formulario de contacto */}
      <form onSubmit={handleSubmit} className="checkout-form">
        <h3>Datos de Contacto</h3>

        <div className="form-group">
          <label htmlFor="name">Nombre completo *</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Teléfono (WhatsApp) *</label>
          <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="address">Dirección de entrega *</label>
          <textarea id="address" name="address" value={formData.address} onChange={handleChange} rows="3" required></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notas (opcional)</label>
          <textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows="2"></textarea>
        </div>

        {/* Acciones */}
        <div className="checkout-actions">
          <button type="button" onClick={() => navigate(-1)} className="btn-back">
            ← Volver al carrito
          </button>
          <button type="submit" className="btn-confirm" disabled={isSubmitting}>
            {isSubmitting ? 'Procesando...' : '💬 Enviar pedido por WhatsApp'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Checkout;
