// src/components/FeaturedProducts.jsx
import React from 'react';
import ProductCard from './ProductCard';
import '../styles/FeaturedProducts.css';

function FeaturedProducts({ products, loading }) {
  if (loading) {
    return (
      <div className="featured-products">
        <h2 className="section-title">Cargando productos...</h2>
        <div className="skeleton-grid">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton-card"></div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="featured-products">
        <h2 className="section-title">No hay productos disponibles</h2>
        <p className="no-products">Intenta con otra categoría o vuelve más tarde.</p>
      </div>
    );
  }

  return (
    <div className="featured-products">
      <h2 className="section-title">Productos Destacados</h2>
      <div className="products-grid">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default FeaturedProducts;