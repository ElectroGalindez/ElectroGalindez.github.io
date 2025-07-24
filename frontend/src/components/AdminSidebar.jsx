import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FaBars, FaTimes, FaBox, FaUsers, FaThLarge, FaClipboardList, FaHome, FaTachometerAlt, FaList } from "react-icons/fa";
import "../styles/AdminSidebar.css";

export default function AdminSidebar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  
  const toggleSidebar = () => setOpen(!open);
  const closeSidebar = () => setOpen(false);
  
  // Verificar si estamos en la ruta base del admin
  const isBaseRoute = location.pathname === '/admin' || location.pathname === '/admin/';

  return (
    <>
      {/* Botón hamburguesa */}
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        {open ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <aside className={`admin-sidebar ${open ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2>Panel Admin</h2>
        </div>
        
        <nav className="sidebar-nav">
          <NavLink 
            to="/admin/dashboard" 
            className={isBaseRoute ? "active" : ""}
            onClick={closeSidebar}
          >
            <FaTachometerAlt className="icon" />
            <span>Dashboard</span>
          </NavLink>
          
          <NavLink 
            to="/admin/products" 
            onClick={closeSidebar}
          >
            <FaBox className="icon" />
            <span>Productos</span>
          </NavLink>
          
          <NavLink 
            to="/admin/categories" 
            onClick={closeSidebar}
          >
            <FaList className="icon" />
            <span>Categorías</span>
          </NavLink>
          
          <NavLink 
            to="/admin/orders" 
            onClick={closeSidebar}
          >
            <FaClipboardList className="icon" />
            <span>Órdenes</span>
          </NavLink>
          
          <NavLink 
            to="/admin/users" 
            onClick={closeSidebar}
          >
            <FaUsers className="icon" />
            <span>Usuarios</span>
          </NavLink>
          
          <NavLink 
            to="/" 
            onClick={closeSidebar}
            className="go-to-site"
          >
            <FaHome className="icon" />
            <span>Ir al sitio</span>
          </NavLink>
        </nav>
        
        <div className="sidebar-footer">
          <p>ElectroShop Admin</p>
        </div>
      </aside>
      
      {/* Overlay para móviles */}
      {open && <div className="sidebar-overlay" onClick={closeSidebar} />}
    </>
  );
}