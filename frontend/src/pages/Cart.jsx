// src/pages/Cart.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import '../styles/Cart.css';

function Cart() {
  const { cart, clearCart, getTotal } = useCart();
  const { formatPrice } = useApp();
  const { requireAuthForPurchase } = useAuth(); // ✅ Usa la validación
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const total = getTotal();

  // ✅ Solo muestra el carrito si hay productos
  if (cart.length === 0) {
    return (
      <div className="cart-container empty">
        <div className="cart-empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <h3>Carrito vacío</h3>
          <p>Agrega algunos productos para comenzar.</p>
          <button onClick={() => navigate('/products')} className="btn-browse">
            🛒 Ver productos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2 className="cart-title">Tu Pedido</h2>
      <ul className="cart-list">
        {cart.map(item => (
          <li key={item.id} className="cart-item">
            <img src={item.image || '/placeholders/product.png'} alt={item.name} loading="lazy" />
            <div className="cart-item-info">
              <h4>{item.name}</h4>
              <p>{formatPrice(item.price)} × {item.quantity}</p>
            </div>
            <div className="cart-item-total">
              {formatPrice(item.price * item.quantity)}
            </div>
          </li>
        ))}
      </ul>
      <div className="cart-summary">
        <div className="cart-total">
          <strong>Total:</strong>
          <span>{formatPrice(total)}</span>
        </div>
        <div className="cart-actions">
          <button onClick={() => navigate('/products')} className="btn-continue">
            ← Seguir comprando
          </button>
          <button
            onClick={() => {
              requireAuthForPurchase(() => {
                navigate('/checkout');
              });
            }}
            className="btn-whatsapp"
          >
            🛒 Ir a finalizar compra
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;