// src/components/CategoryFilter.jsx
import React, { useState, useEffect } from "react";
import "../styles/CategoryFilter.css";

function CategoryFilter({ onSelectCategory }) {
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState(null); // null = "Todos"

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/categories");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Error al cargar categorías:", err);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (id) => {
    setSelected(id);
    onSelectCategory(id); // Se conecta con ProductList
  };

  return (
    <div className="category-filter" role="tablist">
      <button
        role="tab"
        aria-selected={selected === null}
        className={`category-button ${selected === null ? "active" : ""}`}
        onClick={() => handleCategoryClick(null)}
      >
        Todos
      </button>

      {categories.map((cat) => (
        <button
          key={cat.id}
          role="tab"
          aria-selected={selected === cat.id}
          className={`category-button ${selected === cat.id ? "active" : ""}`}
          onClick={() => handleCategoryClick(cat.id)}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;