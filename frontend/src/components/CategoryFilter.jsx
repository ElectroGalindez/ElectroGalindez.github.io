// src/components/CategoryFilter.jsx
import React from "react";
import { useStore } from "../context/StoreContext";
import "../styles/CategoryFilter.css"; // Asegúrate de que este archivo exista

function CategoryFilter({ onSelectCategory }) {
  const { categories } = useStore();

  return (
    <div className="category-filter">
      <button className="category-button" onClick={() => onSelectCategory(null)}>
        Todos
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          className="category-button"
          onClick={() => onSelectCategory(cat.id)}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;
