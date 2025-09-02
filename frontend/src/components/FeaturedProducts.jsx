// src/components/FeaturedProducts.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import '../styles/FeaturedProducts.css';

const FeaturedProducts = ({ formatPrice }) => {
  const { products, categories, loading } = useStore();
  const featured = products.filter(p => p.featured).slice(0, 6);

  if (loading.products || featured.length === 0) return null;

  return (
    <div className="featured-grid">
      {featured.map(product => {
        const category = categories.find(c => c._id === product.category?._id);
        return (
          <div key={product._id} className="featured-card">
            <Link to={`/products/${product._id}`} className="featured-link">
              <div className="featured-image-wrapper">
                <img
                  src={product.images?.[0] || '/placeholders/product.png'}
                  alt={product.name}
                  loading="lazy"
                  onError={(e) => { e.target.src = '/placeholders/fallback.png'; }}
                  className="featured-image"
                />
              </div>
              <h3 className="featured-name">{product.name}</h3>
              <p className="featured-price">{formatPrice(product.price)}</p>
              <p className="featured-category">{category?.name}</p>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default FeaturedProducts;