// src/components/CategoryFilter.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import '../styles/CategoryFilter.css';

function CategoryFilter() {
  const { categories, loading } = useStore();

  if (loading.categories) {
    return (
      <div className="categories-grid loading">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={`skeleton-${index}`} className="category-card skeleton">
            <div className="skeleton-image"></div>
            <div className="skeleton-text"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="categories-grid no-categories">
        <p>No hay categorías disponibles en este momento.</p>
      </div>
    );
  }

  return (
    <div className="categories-grid">
      {categories.map((category) => (
        <Link
          to={`/products?category=${category._id}`}
          key={category._id}
          className="category-card"
          aria-label={`Ver productos de ${category.name}`}
        >
          <div
            className="category-image"
            style={{
              backgroundImage: `url(${category.image || '/placeholders/category.jpg'})`,
            }}
          />
          <h3 className="category-name">{category.name}</h3>
        </Link>
      ))}
    </div>
  );
}

export default CategoryFilter;