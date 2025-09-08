import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import "../styles/CategoryFilter.css";

function CategoryFilter() {
  const { categories, loading, filterByCategory, clearFilter, selectedCategory } = useStore();
  const navigate = useNavigate();

  const handleClearFilter = (e) => {
    e.preventDefault();
    clearFilter();
    navigate("/products", { replace: true });
  };

  if (loading.categories) {
    return (
      <div className="category-filter-carousel">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={`skeleton-${index}`} className="category-item skeleton">
            <div className="skeleton-img"></div>
            <div className="skeleton-text"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!categories?.length) {
    return (
      <div className="category-filter-carousel no-categories">
        <p>No hay categorías disponibles.</p>
      </div>
    );
  }

  return (
    <div className="category-filter-carousel" role="list">
      {/* Todos los productos */}
      <Link
        to="/products"
        onClick={handleClearFilter}
        className={`category-item ${!selectedCategory ? "active" : ""}`}
        aria-label="Ver todos los productos"
        role="listitem"
      >
        <div className="category-img-wrapper">
          <img
            src="/all-products.png"
            alt="Todos los productos"
            loading="lazy"
            onError={(e) => (e.target.src = "/placeholders/category.png")}
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
          className={`category-item ${selectedCategory === category._id ? "active" : ""}`}
          aria-label={`Ver productos de ${category.name}`}
          role="listitem"
        >
          <div className="category-img-wrapper">
            <img
              src={category.image || "/placeholders/category.png"}
              alt={category.name}
              loading="lazy"
              onError={(e) => (e.target.src = "/placeholders/fallback.png")}
            />
          </div>
          <span>{category.name}</span>
        </Link>
      ))}
    </div>
  );
}

export default React.memo(CategoryFilter);
