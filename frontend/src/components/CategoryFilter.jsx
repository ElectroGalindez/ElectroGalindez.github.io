// src/components/CategoryFilter.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // ✅ Añadido useNavigate
import { useStore } from '../context/StoreContext';
import '../styles/CategoryFilter.css';

function CategoryFilter() {
  const { categories, loading, filterByCategory, clearFilter } = useStore();
  const navigate = useNavigate();

  const handleClearFilter = (e) => {
    e.preventDefault();
    clearFilter(); // ✅ Limpia el filtro
    navigate('/products', { replace: true }); // ✅ Navega a /products
  };

  if (loading.categories) {
    return (
      <div className="category-filter-carousel">
        <div className="category-item skeleton">
          <div className="skeleton-img"></div>
          <div className="skeleton-text"></div>
        </div>
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={`skeleton-${index}`} className="category-item skeleton">
            <div className="skeleton-img"></div>
            <div className="skeleton-text"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="category-filter-carousel no-categories">
        <p>No hay categorías disponibles.</p>
      </div>
    );
  }

  return (
    <div className="category-filter-carousel">
      {/* Botón "Todos los productos" */}
      <Link
        to="/products"
        onClick={handleClearFilter}
        className="category-item"
        aria-label="Ver todos los productos"
      >
        <div className="category-img-wrapper">
          <img
            src="/all-products.png"
            alt="Todos los productos"
            loading="lazy"
            onError={(e) => {
              e.target.src = '/placeholders/category.png';
            }}
          />
        </div>
        <span>Todos</span>
      </Link>

      {/* Categorías dinámicas */}
      {categories.map((category) => (
        <Link
          key={category._id}
          to="/products"
          onClick={() => filterByCategory(category._id)}
          className="category-item"
          aria-label={`Ver productos de ${category.name}`}
        >
          <div className="category-img-wrapper">
            <img
              src={category.image || '/placeholders/category.png'}
              alt={category.name}
              loading="lazy"
              onError={(e) => {
                e.target.src = '/placeholders/fallback.png';
              }}
            />
          </div>
          <span>{category.name}</span>
        </Link>
      ))}
    </div>
  );
}

export default React.memo(CategoryFilter);