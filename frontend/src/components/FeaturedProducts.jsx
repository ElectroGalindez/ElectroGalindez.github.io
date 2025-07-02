import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext'; 
import '../styles/FeaturedProducts.css';

const FeaturedProducts = ({ products = [] }) => {
  const { addToCart } = useCart(); 

  return (
    <section className="featured-products">
      <h2>Productos Destacados</h2>
      <div className="products-grid">
        {products.slice(0, 6).map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.image_url} alt={product.name} />
            <h3>{product.name}</h3>
            <p>€{product.price}</p>
            <div className="button-group">
              <Link to={`/products/${product.id}`} className="btn">
                Ver más
              </Link>
              <button
                className="btn add-cart"
                onClick={() => addToCart(product)}
              >
                Agregar al carrito
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;
