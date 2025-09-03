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
  } = useStore(); // ✅ Importa las 3 funciones

  const { requireAuthForPurchase } = useAuth();
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  const isInWishlist = isProductInWishlist(product._id);

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist) {
      removeFromWishlist(product._id); // ✅ Ahora funciona
    } else {
      addToWishlist(product);
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    requireAuthForPurchase(() => {
      addToCart(product);
    });
  };

  return (
    <div
      className="product-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/products/${product._id}`} className="product-card-link">
        <div className="product-image-container">
          <img
            src={product.images?.[0] || '/placeholders/product.png'}
            alt={product.name}
            loading="lazy"
            onError={(e) => { e.target.src = '/placeholders/fallback.png'; }}
            className="product-image"
          />
          {product.featured && <span className="badge featured">⭐ Destacado</span>}
          <button
            type="button"
            className={`wishlist-button ${isInWishlist ? 'in-wishlist' : ''}`}
            onClick={handleWishlistToggle}
            aria-label={isInWishlist ? 'Eliminar de destacados' : 'Agregar a destacados'}
          >
            {isInWishlist ? <FaHeart /> : <FaRegHeart />}
          </button>
        </div>

        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-category">{category?.name || 'Sin categoría'}</p>
          <p className="product-price">{formatPrice(product.price)}</p>
        </div>
      </Link>

      <div className={`product-actions ${isHovered ? 'visible' : ''}`}>
        <Link to={`/products/${product._id}`} className="btn btn-outline">
          <FaEye /> Ver detalles
        </Link>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleAddToCart}
        >
          <FaShoppingCart /> Agregar
        </button>
      </div>
    </div>
  );
};

export default React.memo(ProductCard);