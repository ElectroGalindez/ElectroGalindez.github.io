import React, { useEffect, useState } from "react";
import "../../styles/AdminSection.css";

const CategoryAdmin = () => {
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/categories");
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (err) {
      console.error("Error cargando categorías:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div>
      <h3>Gestión de Categorías</h3>
      {/* Aquí puedes renderizar un form y la lista de categorías */}
    </div>
  );
};

export default CategoryAdmin;
