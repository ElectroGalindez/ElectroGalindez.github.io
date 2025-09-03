// src/components/CategoryCarousel.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import '../styles/CategoryCarousel.css';

function CategoryCarousel() {
  const { categories, filterByCategory } = useStore();

  return (
    <div className="category-carousel">
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
          <span className="category-name">{category.name}</span>
        </Link>
      ))}
    </div>
  );
}

export default React.memo(CategoryCarousel);