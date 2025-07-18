// src/components/admin/Sidebar.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes, FaBoxes, FaUsers, FaThLarge, FaClipboardList, FaHome } from "react-icons/fa";
import "../styles/Sidebar.css";

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  const toggleSidebar = () => setOpen(!open);

  return (
    <>
      {/* Botón hamburguesa */}
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        {open ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <aside className={`admin-sidebar ${open ? "open" : ""}`}>
        <h2>Admin Panel</h2>
        <nav>
          <Link to="/admin/dashboard" onClick={toggleSidebar}><FaThLarge /> Dashboard</Link>
          <Link to="/admin/products" onClick={toggleSidebar}><FaBoxes /> Productos</Link>
          <Link to="/admin/categories" onClick={toggleSidebar}><FaThLarge /> Categorías</Link>
          <Link to="/admin/users" onClick={toggleSidebar}><FaUsers /> Usuarios</Link>
          <Link to="/admin/orders" onClick={toggleSidebar}><FaClipboardList /> Órdenes</Link>
          <Link to="/" onClick={toggleSidebar}><FaHome /> Ir al sitio</Link>
        </nav>
      </aside>
    </>
  );
}
