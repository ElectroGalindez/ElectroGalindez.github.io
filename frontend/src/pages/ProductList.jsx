// src/components/ProductList.jsx
import React, { useEffect, useState } from 'react';
import CategoryFilter from '../components/CategoryFilter';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/ProductList.css';

function ProductList() {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();

  const fetchProducts = async (categoryId = null) => {
    let url = 'http://localhost:3001/api/products';
    if (categoryId) url += `?category_id=${categoryId}`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error('Error al cargar productos:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="product-page">
      {/* Encabezado */}
      <header className="product-header">
        <h2>Todos los Productos</h2>
      </header>

      {/* Filtro de categorías */}
      <div className="category-row">
        <CategoryFilter onSelectCategory={fetchProducts} />
      </div>

      {/* Grid de productos */}
      <div className="products-grid">
        {products.length === 0 ? (
          <p className="no-products">No hay productos disponibles en esta categoría.</p>
        ) : (
          products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image-wrapper">
                <img
                  src={product.image_url}
                  alt={product.name}
                  loading="lazy"
                  className="product-image"
                />
              </div>
              <h3 className="product-name">{product.name}</h3>
              <p className="product-price">€{product.price.toFixed(2)}</p>
              <div className="button-group">
                <Link to={`/products/${product.id}`} className="btn btn-outline">
                  Ver detalle
                </Link>
                <button
                  onClick={() => addToCart(product)}
                  className="btn btn-primary"
                  aria-label={`Agregar ${product.name} al carrito`}
                >
                  + Carrito
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ProductList;