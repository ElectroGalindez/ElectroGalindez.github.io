import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import '../styles/FeaturedProducts.css';

const FeaturedProducts = () => {
  const { products, categories, loading, formatProductPrice } = useStore();

  if (loading.products || products.length === 0) {
    return (
      <div className="featured-grid loading-state">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="featured-card skeleton">
            <div className="skeleton-image"></div>
            <div className="skeleton-text title"></div>
            <div className="skeleton-text price"></div>
            <div className="skeleton-btn"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="featured-section-wrapper">
      <h2 className="featured-title">Productos Destacados</h2>
      <div className="featured-scroll-container">
        {products.map(product => {
          const category = categories.find(c => c._id === product.category?._id);
          return (
            <div key={product._id} className="featured-card">
              <Link to={`/products/${product._id}`} className="featured-link">
                <div className="featured-image-wrapper">
                  {product.isNew && <span className="badge new">Nuevo</span>}
                  {product.isOnSale && <span className="badge sale">Oferta</span>}
                  <img
                    src={product.images?.[0] || '/placeholders/product.png'}
                    alt={product.name}
                    loading="lazy"
                    onError={(e) => { e.target.src = '/placeholders/fallback.png'; }}
                    className="featured-image"
                  />
                </div>
                <div className="featured-info">
                  <h3 className="featured-name">{product.name}</h3>
                  <p className="featured-price">{formatProductPrice(product.price)}</p>
                  {category && <p className="featured-category">{category.name}</p>}
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FeaturedProducts;
