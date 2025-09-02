// src/components/ProductCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, category, formatPrice }) => {
  return (
    <div className="product-card">
      <Link to={`/products/${product._id}`} className="product-link">
        <div className="product-image-wrapper">
          <img
            src={product.images?.[0] || '/placeholders/product.png'}
            alt={product.name}
            loading="lazy"
            onError={(e) => { e.target.src = '/placeholders/fallback.png'; }}
            className="product-image"
          />
          {product.featured && <span className="badge featured">⭐ Destacado</span>}
        </div>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-category">{category?.name || 'Sin categoría'}</p>
        <p className="product-price">{formatPrice(product.price)}</p>
      </Link>
      <div className="button-group">
        <Link to={`/products/${product._id}`} className="btn btn-outline">
          Ver detalle
        </Link>
        <a
          href={`https://wa.me/5358956749?text=Hola,%20estoy%20interesado%20en%20el%20producto%20${encodeURIComponent(product.name)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
        >
          💬 Solicitar
        </a>
      </div>
    </div>
  );
};

export default React.memo(ProductCard);