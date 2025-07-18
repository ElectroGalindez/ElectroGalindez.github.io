import React, { useState } from "react";
import ProductAdmin from "./ProductAdmin";
import CategoryAdmin from "./CategoryAdmin";
import OrderAdmin from "./OrderAdmin";

import "../../styles/AdminDashboard.css";

export default function AdminDashboard() {
  const [section, setSection] = useState("products");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Cerrar sidebar al cambiar sección (en mobile)
  const handleSectionChange = (sec) => {
    setSection(sec);
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Botón hamburguesa para mobile */}
      <button
        className="sidebar-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
      >
        ☰
      </button>

      <div className="admin-dashboard">
        <Sidebar
          currentSection={section}
          setSection={handleSectionChange}
          className={sidebarOpen ? "open" : ""}
        />

        <main className="admin-content">
          {section === "products" && <ProductAdmin />}
          {section === "categories" && <CategoryAdmin />}
          {section === "orders" && <OrderAdmin />}
        </main>
      </div>
    </>
  );
}
