// src/pages/Offers.jsx
import React from 'react';
import { useStore } from '../context/StoreContext';
import { useApp } from '../context/AppContext';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Offers.css';

function OfferCard({ product, formatPrice, addToCart }) {
  const navigate = useNavigate();

  if (!product || product.price == null) return null;

  const fakeOldPrice = product.price * 1.2; // precio tachado

  return (
    <div className="offer-card">
      <div
        className="offer-image"
        onClick={() => navigate(`/products/${product._id}`)}
      >
        <img
          src={product.images?.[0] || '/placeholders/product-thumb.png'}
          alt={product.name}
          loading="lazy"
          onError={(e) => { e.target.src = '/placeholders/fallback-thumb.png'; }}
        />
      </div>
      <div className="offer-info">
        <h3 onClick={() => navigate(`/products/${product._id}`)}>{product.name}</h3>
        <div className="offer-prices">
          <span className="old-price">{formatPrice(fakeOldPrice)}</span>
          <span className="current-price">{formatPrice(product.price)}</span>
        </div>
        <button onClick={() => addToCart(product, 1)}>Agregar al carrito</button>
      </div>
    </div>
  );
}

function Offers() {
  const { products, loading, error } = useStore();
  const { formatPrice } = useApp();
  const { addToCart } = useCart();
  const isLoading = loading?.products;

  return (
    <div className="offers-page" aria-labelledby="offers-title">
      <header className="offers-header">
        <h1 id="offers-title">🔥 Ofertas Especiales</h1>
        <p>Descuentos exclusivos en productos seleccionados. ¡Aprovecha antes de que se acaben!</p>
      </header>

      {isLoading ? (
        <div className="skeleton-grid">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="skeleton-card">
              <div className="skeleton-image"></div>
              <div className="skeleton-text name"></div>
              <div className="skeleton-text category"></div>
              <div className="skeleton-text price"></div>
              <div className="skeleton-actions">
                <div className="skeleton-btn outline"></div>
                <div className="skeleton-btn primary"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="error-banner" role="alert">
          <strong>⚠️ {error}</strong>
        </div>
      ) : products?.length === 0 ? (
        <div className="no-products">
          <p>No hay productos en oferta en este momento.</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <OfferCard
              key={product._id}
              product={product}
              formatPrice={formatPrice}
              addToCart={addToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default React.memo(Offers);
