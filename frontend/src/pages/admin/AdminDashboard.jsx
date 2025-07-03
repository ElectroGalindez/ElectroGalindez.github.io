import React, { useState } from "react";
import CategoryAdmin from "./CategoryAdmin";
import ProductAdmin from "./ProductAdmin";
import OrderAdmin from "./OrderAdmin";
import "../../styles/AdminDashboard.css"; // opcional

const AdminDashboard = () => {
  const [section, setSection] = useState("categories");

  const renderSection = () => {
    switch (section) {
      case "products":
        return <ProductAdmin />;
      case "orders":
        return <OrderAdmin />;
      case "categories":
      default:
        return <CategoryAdmin />;
    }
  };

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <h2>Panel de Admin</h2>
        <ul>
          <li onClick={() => setSection("categories")}>Categorías</li>
          <li onClick={() => setSection("products")}>Productos</li>
          <li onClick={() => setSection("orders")}>Órdenes</li>
        </ul>
      </aside>

      <main className="admin-content">{renderSection()}</main>
    </div>
  );
};

export default AdminDashboard;
