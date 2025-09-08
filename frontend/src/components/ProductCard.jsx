// src/components/ProductCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaEye, FaShoppingCart } from 'react-icons/fa';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import '../styles/ProductCard.css';

const ProductCard = ({ product, category, formatPrice }) => {
  const { 
    addToWishlist, 
    removeFromWishlist, 
    isProductInWishlist 
  } = useStore();

  const { requireAuthForPurchase } = useAuth();
  const { addToCart } = useCart();
  const [hovered, setHovered] = useState(false);

  const inWishlist = isProductInWishlist(product._id);

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) removeFromWishlist(product._id);
    else addToWishlist(product);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    requireAuthForPurchase(() => addToCart(product));
  };

  return (
    <div
      className="eg-product-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link to={`/products/${product._id}`} className="eg-product-card-link">
        <div className="eg-product-image-wrapper">
          <img
            src={product.images?.[0] || '/placeholders/product.png'}
            alt={product.name}
            loading="lazy"
            onError={(e) => { e.target.src = '/placeholders/fallback.png'; }}
            className="eg-product-image"
          />
          {product.featured && <span className="eg-badge-featured">⭐ Destacado</span>}
          <button
            type="button"
            className={`eg-wishlist-button ${inWishlist ? 'active' : ''}`}
            onClick={toggleWishlist}
            aria-label={inWishlist ? 'Eliminar de destacados' : 'Agregar a destacados'}
          >
            {inWishlist ? <FaHeart /> : <FaRegHeart />}
          </button>
        </div>

        <div className="eg-product-info">
          <h3 className="eg-product-name">{product.name}</h3>
          <p className="eg-product-category">{category?.name || 'Sin categoría'}</p>
          <p className="eg-product-price">{formatPrice(product.price)}</p>
        </div>
      </Link>

      <div className={`eg-product-actions ${hovered ? 'visible' : ''}`}>
        <Link to={`/products/${product._id}`} className="eg-btn-outline">
          <FaEye /> Ver detalles
        </Link>
        <button
          type="button"
          className="eg-btn-primary"
          onClick={handleAddToCart}
        >
          <FaShoppingCart /> Agregar
        </button>
      </div>
    </div>
  );
};

export default React.memo(ProductCard);
