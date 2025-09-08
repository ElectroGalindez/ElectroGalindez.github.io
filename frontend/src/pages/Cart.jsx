import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import '../styles/Cart.css';

function Cart() {
  const { cart, addToCart, removeItem, clearCart, getTotal, getProductImage } = useCart();
  const { formatPrice } = useApp();
  const { requireAuthForPurchase } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const total = getTotal();

  if (!cart || cart.length === 0) {
    return (
      <div className="cart-container empty">
        <div className="cart-empty-state">
          <h3>Carrito vacío</h3>
          <p>Agrega productos para comenzar.</p>
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
          <li key={item._id || Math.random()} className="cart-item">
            <img
              src={getProductImage(item)}
              alt={item.name || 'Producto'}
              onError={(e) => e.target.src = '/placeholders/product.png'}
              loading="lazy"
            />
            <div className="cart-item-info">
              <h4>{item.name || 'Sin nombre'}</h4>
              <p>{formatPrice(item.price || 0)} × {item.quantity || 1}</p>
              <div className="cart-item-controls">
                <button onClick={() => addToCart(item, 1)} className="btn-quantity">+</button>
                <button
                  onClick={() => addToCart(item, -1)}
                  className="btn-quantity"
                  disabled={!item.quantity || item.quantity <= 1}
                >−</button>
                <button onClick={() => removeItem(item._id)} className="btn-remove">🗑️</button>
              </div>
            </div>
            <div className="cart-item-total">
              {formatPrice((item.price || 0) * (item.quantity || 1))}
            </div>
          </li>
        ))}
      </ul>

      <div className="cart-summary">
        <div className="cart-total">
          <strong>Total:</strong>
          <span>{formatPrice(total || 0)}</span>
        </div>
        <div className="cart-actions">
          <button onClick={() => navigate('/products')} className="btn-continue">← Seguir comprando</button>
          <button
            onClick={() => requireAuthForPurchase(() => { setIsSubmitting(true); navigate('/checkout'); })}
            className="btn-whatsapp"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Procesando...' : '🛒 Ir a finalizar compra'}
          </button>
        </div>
        <div className="cart-clear">
          <button onClick={clearCart} className="btn-clear">🧹 Vaciar carrito</button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
