import React, { useState } from "react";
import "../styles/ Sidebar.css";

export default function Sidebar({ currentSection, setSection }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => setIsOpen(!isOpen);

  const buttons = [
    { id: "products", label: "Productos" },
    { id: "categories", label: "Categorías" },
    { id: "users", label: "Usuarios" },
    { id: "orders", label: "Órdenes" },
  ];

  return (
    <>
      <button className="sidebar-toggle" onClick={handleToggle}>
        &#9776;
      </button>

      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <h2 className="sidebar-title">Admin Panel</h2>
        {buttons.map((btn) => (
          <button
            key={btn.id}
            className={`sidebar-btn ${
              currentSection === btn.id ? "active" : ""
            }`}
            onClick={() => {
              setSection(btn.id);
              setIsOpen(false); // cierra sidebar en móvil al seleccionar
            }}
          >
            {btn.label}
          </button>
        ))}
      </aside>
    </>
  );
}
