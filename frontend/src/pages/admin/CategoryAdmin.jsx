// src/pages/admin/CategoryAdmin.jsx
import React, { useState } from "react";
import { useAdmin } from "../../context/AdminContext";

export default function CategoryAdmin() {
  const { categories, createCategory, deleteCategory } = useAdmin();
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) return;
    await createCategory({ name });
    setName("");
  };

  return (
    <div>
      <h2>Categorías</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit">Crear</button>
      </form>

      <ul>
        {categories.map((c) => (
          <li key={c.id}>
            {c.name}
            <button onClick={() => deleteCategory(c.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
