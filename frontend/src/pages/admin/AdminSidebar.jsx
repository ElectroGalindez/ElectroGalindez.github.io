// src/components/admin/AdminSidebar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaBox, FaTags, FaUsers, FaClipboardList, FaArrowLeft } from 'react-icons/fa';

const menuItems = [
  { path: 'dashboard', label: 'Dashboard', icon: FaHome },
  { path: 'products', label: 'Productos', icon: FaBox },
  { path: 'categories', label: 'Categorías', icon: FaTags },
  { path: 'orders', label: 'Órdenes', icon: FaClipboardList },
  { path: 'users', label: 'Usuarios', icon: FaUsers },
  { path: '/', label: 'Volver al Inicio', icon: FaArrowLeft }
];

function AdminSidebar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar si es móvil
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize(); // Ejecutar al cargar
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Cerrar menú móvil al cambiar de ruta
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <>
      {/* Botón hamburguesa: solo en móvil */}
      {isMobile && (
        <button
          className="admin-sidebar-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Menú"
        >
          ☰
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`admin-sidebar ${isMobile && !isMobileMenuOpen ? 'closed' : 'open'}`}
        role="navigation"
        aria-label="Menú de administración"
      >
        {/* Logo */}
        <div className="admin-logo">
          <Link to="/" aria-label="Inicio de ElectroGalíndez">
            <img
              src="/logo.svg"
              alt="ElectroGalíndez"
              className="logo-image"
              loading="eager"
              width="250"
              height="80"
              onError={(e) => {
                e.target.src = '/placeholders/logo-fallback.png';
                e.target.alt = 'ElectroGalíndez';
              }}
            />
          </Link>
        </div>

        {/* Menú */}
        <nav className="admin-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.path === '/' 
              ? false 
              : location.pathname === `/admin/${item.path}`;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`admin-nav-item ${isActive ? 'active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon /> {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Overlay para móvil */}
      {isMobile && isMobileMenuOpen && (
        <div
          className="admin-sidebar-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}
    </>
  );
}

export default AdminSidebar;