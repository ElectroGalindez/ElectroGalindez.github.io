// src/pages/Offers.jsx
import React from 'react';
import { useStore } from '../context/StoreContext';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import '../styles/Offers.css';

function Offers() {
  const { featured, loading, error } = useStore();
  const { formatPrice } = useApp();
  const isLoading = loading.products;

  return (
    <div className="offers-page" aria-labelledby="offers-title">
      {/* Encabezado */}
      <header className="offers-header">
        <h1 id="offers-title">🔥 Ofertas Especiales</h1>
        <p>Descuentos exclusivos en productos seleccionados. ¡Aprovecha antes de que se acaben!</p>
      </header>

      {/* Estado de carga */}
      {isLoading ? (
        <div className="skeleton-grid">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={`skeleton-${index}`} className="skeleton-card">
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
      ) : featured.length === 0 ? (
        <div className="no-products">
          <p>No hay productos en oferta en este momento.</p>
        </div>
      ) : (
        /* Grid de productos */
        <div className="products-grid">
          {featured.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              formatPrice={formatPrice}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default React.memo(Offers);