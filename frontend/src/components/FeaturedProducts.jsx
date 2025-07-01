// src/components/FeaturedProducts.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/FeaturedProducts.css';

const FeaturedProducts = ({ products = [] }) => {
  return (
    <section className="featured-products">
      <h2>Productos Destacados</h2>
      <div className="products-grid">
        {products.slice(0, 6).map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.image_url} alt={product.name} />
            <h3>{product.name}</h3>
            <p>${product.price}</p>
            <Link to={`/products/${product.id}`} className="btn">
              Ver más
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;
