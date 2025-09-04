import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaBox, FaTags, FaUsers, FaClipboardList, FaArrowLeft } from 'react-icons/fa';
import '../../styles/AdminSidebar.css';

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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Cerrar menú móvil al navegar
  useEffect(() => setIsMobileMenuOpen(false), [location]);

  return (
    <>
      {/* Botón hamburguesa */}
      {isMobile && (
        <button
          className="admin-sidebar-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Menú de administración"
        >
          ☰
        </button>
      )}

      <aside
        className={`admin-sidebar ${isMobile && !isMobileMenuOpen ? 'closed' : 'open'}`}
        role="navigation"
        aria-label="Menú de administración"
      >
        {/* Logo */}
        <div className="admin-logo">
          <Link to="/" aria-label="Inicio">
            <img
              src="/logo.svg"
              alt="ElectroGalíndez"
              className="logo-image"
              width={200}
              height={60}
              loading="eager"
              onError={(e) => {
                e.target.src = '/placeholders/logo-fallback.png';
                e.target.alt = 'ElectroGalíndez';
              }}
            />
          </Link>
        </div>

        {/* Menú */}
        <nav className="admin-nav">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = item.path !== '/' && location.pathname.includes(`/admin/${item.path}`);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`admin-nav-item ${isActive ? 'active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon /> <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Overlay móvil */}
      {isMobile && isMobileMenuOpen && (
        <div
          className="admin-sidebar-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}

export default AdminSidebar;
