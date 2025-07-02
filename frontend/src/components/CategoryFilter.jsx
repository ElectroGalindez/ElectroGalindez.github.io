import React, { useState } from "react";
import { useStore } from "../context/StoreContext";
import "../styles/CategoryFilter.css";

function CategoryFilter({ onSelectCategory }) {
  const { categories = [] } = useStore();
  const [activeCategory, setActiveCategory] = useState(null);

  const handleClick = (id) => {
    setActiveCategory(id);
    onSelectCategory(id);
  };

  return (
    <div className="category-filter">
      <button
        className={`category-button ${activeCategory === null ? "active" : ""}`}
        onClick={() => handleClick(null)}
      >
        Todos
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          className={`category-button ${activeCategory === cat.id ? "active" : ""}`}
          onClick={() => handleClick(cat.id)}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;
