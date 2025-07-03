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
      <h2>Todos los Productos</h2>

      {/* Botones arriba */}
      <div className="category-row">
        <CategoryFilter onSelectCategory={fetchProducts} />
      </div>

      {/* Productos debajo */}
      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.image_url} alt={product.name} />
            <h3>{product.name}</h3>
            <p>€{product.price}</p>
            <div className="button-group">
              <Link to={`/products/${product.id}`} className="btn">
                Ver más
              </Link>
              <button
                onClick={() => addToCart(product)} 
                className="btn add-cart"
              >
                Agregar al carrito
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
