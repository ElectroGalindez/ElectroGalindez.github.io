// src/pages/ProductList.jsx
import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { useApp } from '../context/AppContext';
import CategoryFilter from '../components/CategoryFilter';
import WhatsAppButton from '../components/WhatsAppButton';
import ProductCard from '../components/ProductCard';
import '../styles/ProductList.css';

function ProductList() {
  const { 
    products, 
    categories, 
    filteredProducts, 
    loading, 
    error,
    selectedCategory,
    filterByCategory,
    clearFilter // ✅ Asegúrate de tener esta función
  } = useStore();

  const { formatPrice, currency } = useApp();
  const location = useLocation();

  // ✅ Detectar si venimos del Home
  const fromHome = location.state?.from === '/';

  // ✅ Resetear filtro si venimos del Home
  useEffect(() => {
    if (fromHome && selectedCategory !== null) {
      clearFilter();
    }
  }, [fromHome, selectedCategory, clearFilter]);

  const displayedProducts = selectedCategory !== null 
    ? filteredProducts 
    : products;

  const isLoading = loading.products;
  const hasError = error && products.length === 0;
  const noProducts = !isLoading && displayedProducts.length === 0;

  return (
    <div className="product-page" aria-labelledby="product-list-title">
      {/* Encabezado */}
      <header className="product-header">
        <h1 id="product-list-title">Todos los Productos</h1>
        <p className="product-subtitle">Disponibles en {currency}</p>
      </header>

      {/* Filtro por categorías */}
      <div className="category-filter-section">
        <CategoryFilter />
      </div>

      {/* Mensaje de error */}
      {hasError && (
        <div className="error-banner" role="alert">
          <strong>⚠️ {error}</strong>
        </div>
      )}

      {/* Grid de productos */}
      <div className="products-grid">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, index) => (
            <div key={`skeleton-${index}`} className="product-card skeleton">
              <div className="product-image-wrapper">
                <div className="skeleton-image"></div>
              </div>
              <div className="skeleton-text name"></div>
              <div className="skeleton-text category"></div>
              <div className="skeleton-text price"></div>
              <div className="skeleton-actions">
                <div className="skeleton-btn outline"></div>
                <div className="skeleton-btn primary"></div>
              </div>
            </div>
          ))
        ) : noProducts ? (
          <div className="no-products">
            <p>
              {selectedCategory 
                ? 'No hay productos disponibles en esta categoría.' 
                : 'No hay productos disponibles en este momento.'
              }
            </p>
          </div>
        ) : (
          displayedProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              category={categories.find(c => c._id === product.category?._id)}
              formatPrice={formatPrice}
            />
          ))
        )}
      </div>

      <WhatsAppButton />
    </div>
  );
}

export default React.memo(ProductList);