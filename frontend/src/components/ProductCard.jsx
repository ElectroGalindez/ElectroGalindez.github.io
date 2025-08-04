// src/components/ProductCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/ProductCard.css';

function ProductCard({ product }) {
  const { addToCart } = useCart();

  if (!product) return null;

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`} className="product-card__link">
        <div className="product-card__image-wrapper">
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            className="product-card__image"
          />
        </div>
        <div className="product-card__info">
          <h3 className="product-card__title">{product.name}</h3>
          <p className="product-card__price">€{product.price.toFixed(2)}</p>
        </div>
      </Link>
      <button
        onClick={() => addToCart(product)}
        className="product-card__add"
        aria-label={`Agregar ${product.name} al carrito`}
      >
        + Carrito
      </button>
    </div>
  );
}

export default ProductCard;