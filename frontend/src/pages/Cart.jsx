// src/pages/Cart.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/apiClient';
import '../styles/Cart.css';

function Cart() {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleOrder = async () => {
    if (!user) {
      if (window.confirm('Debes iniciar sesión para realizar el pedido. ¿Ir a iniciar sesión?')) {
        navigate('/login');
      }
      return;
    }

    const address = localStorage.getItem('userAddress');
    const phone = localStorage.getItem('userPhone');

    if (!address || !phone) {
      alert('Por favor, completa tu dirección y teléfono en tu perfil.');
      navigate('/profile');
      return;
    }

    const orderData = {
      items: cart.map(item => ({
        product: item._id,
        quantity: item.quantity,
        price: item.price
      })),
      totalAmount: total,
      shippingAddress: {
        street: address,
        city: 'La Habana',
        country: 'Cuba',
        phone: phone
      },
      paymentMethod: 'zelle-whatsapp',
      source: 'web'
    };

    if (window.confirm(`¿Confirmas tu pedido por €${total.toFixed(2)}?`)) {
      setLoading(true);
      try {
        const data = await apiClient('/orders', {
          method: 'POST',
          body: JSON.stringify(orderData)
        });

        clearCart();
        navigate('/success');
      } catch (err) {
        alert('Error: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    
  };

  if (cart.length === 0) {
    return (
      <div className="cart-container empty">
        <div className="cart-empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <h3>Tu carrito está vacío</h3>
          <p>Agrega algunos electrodomésticos para comenzar.</p>
          <button onClick={() => navigate('/products')} className="btn-browse">
            🛒 Ver productos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2 className="cart-title">Carrito de compras</h2>

      <ul className="cart-list">
        {cart.map((item) => (
          <li key={item._id} className="cart-item">
            <div className="cart-item-image">
              <img
                src={item.images?.[0] || '/placeholders/product.png'}
                alt={item.name}
                loading="lazy"
              />
            </div>
            <div className="cart-item-info">
              <h4>{item.name}</h4>
              <p>€{item.price.toFixed(2)} × {item.quantity}</p>
            </div>
            <div className="cart-item-total">
              €{(item.price * item.quantity).toFixed(2)}
            </div>
          </li>
        ))}
      </ul>

      <div className="cart-summary">
        <div className="cart-total">
          <strong>Total:</strong>
          <span>€{total.toFixed(2)}</span>
        </div>
        <div className="cart-actions">
          <button
            onClick={() => navigate('/products')}
            className="btn-continue"
            disabled={loading}
          >
            ← Seguir comprando
          </button>
          <button
            onClick={handleOrder}
            className="btn-whatsapp"
            disabled={loading}
          >
            {loading ? 'Procesando...' : '📲 Enviar pedido por WhatsApp'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;