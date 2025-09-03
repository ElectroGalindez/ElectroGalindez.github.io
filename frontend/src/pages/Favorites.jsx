// src/pages/Favorites.jsx
import React from 'react';
import { useStore } from '../context/StoreContext';
import { useApp } from '../context/AppContext';
import { FaHeart } from 'react-icons/fa'; 
import ProductCard from '../components/ProductCard';
import '../styles/Favorites.css';

function Favorites() {
  const { wishlist, removeFromWishlist } = useStore();
  const { formatPrice } = useApp();

  if (wishlist.length === 0) {
    return (
      <div className="favorites-empty">
        <FaHeart size={64} color="#ccc" />
        <h2>No tienes productos destacados</h2>
        <p>Agrega productos a tus favoritos para guardarlos aquí.</p>
        <button onClick={() => window.location.href = '/products'} className="btn-browse">
          Ver productos
        </button>
      </div>
    );
  }

  return (
    <div className="favorites-page">
      <h1>Mis Favoritos ({wishlist.length})</h1>
      <div className="favorites-grid">
        {wishlist.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            formatPrice={formatPrice}
            onRemove={() => removeFromWishlist(product.id)} 
          />
        ))}
      </div>
    </div>
  );
}

export default Favorites;