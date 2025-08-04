// src/pages/ProductList.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CategoryFilter from '../components/CategoryFilter';
import '../styles/ProductList.css';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart } = useCart();

  const fetchProducts = async (categoryId = null) => {
    setLoading(true);
    setError('');
    let url = 'http://localhost:3001/api/products';
    if (categoryId) {
      url += `?category_id=${categoryId}`;
    }

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      const data = await res.json();
      const productsArray = Array.isArray(data) ? data : (data.products || []);
      setProducts(productsArray);
    } catch (err) {
      console.error('Error al cargar productos:', err);
      setError(err.message.includes('failed to fetch')
        ? 'No se pudo conectar al servidor. Verifica tu conexión o que el backend esté corriendo en http://localhost:3001'
        : 'No se pudieron cargar los productos. Intenta más tarde.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="product-page" aria-labelledby="product-page-title">
      {/* Encabezado */}
      <header className="product-header">
        <h2 id="product-page-title">Todos los Productos</h2>
        <p className="product-subtitle">Descubre los electrodomésticos más innovadores del mercado</p>
      </header>

      {/* Filtro de categorías */}
      <div className="category-row">
        <CategoryFilter onSelectCategory={fetchProducts} />
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="error-banner" role="alert">
          <strong>⚠️ {error}</strong>
        </div>
      )}

      {/* Grid de productos */}
      <div className="products-grid">
        {loading ? (
          // Skeleton Loading
          Array.from({ length: 8 }).map((_, index) => (
            <div key={`skeleton-${index}`} className="product-card skeleton">
              <div className="product-image-wrapper">
                <div className="skeleton-image"></div>
              </div>
              <div className="skeleton-text name"></div>
              <div className="skeleton-text price"></div>
              <div className="skeleton-actions">
                <div className="skeleton-btn outline"></div>
                <div className="skeleton-btn primary"></div>
              </div>
            </div>
          ))
        ) : products.length === 0 ? (
          <div className="no-products">
            <p>No hay productos disponibles en esta categoría.</p>
            <button onClick={() => fetchProducts()} className="btn-refresh">
              🔄 Recargar productos
            </button>
          </div>
        ) : (
          products.map((product) => (
            <div key={product._id || product.id} className="product-card" data-testid="product-card">
              <div className="product-image-wrapper">
                <img
                  src={product.image_url || '/placeholders/product.png'}
                  alt={product.name || 'Producto sin nombre'}
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = '/placeholders/fallback.png';
                  }}
                  className="product-image"
                />
              </div>
              <h3 className="product-name">{product.name}</h3>
              <p className="product-price">€{product.price?.toFixed(2) || '0.00'}</p>
              <div className="button-group">
                <Link
                  to={`/products/${product._id || product.id}`}
                  className="btn btn-outline"
                  aria-label={`Ver detalles de ${product.name}`}
                >
                  Ver detalle
                </Link>
                <button
                  onClick={() => addToCart(product)}
                  className="btn btn-primary"
                  disabled={!product.stock || product.stock <= 0}
                  aria-label={`Agregar ${product.name} al carrito`}
                >
                  {product.stock > 0 ? '+ Carrito' : 'Agotado'}
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