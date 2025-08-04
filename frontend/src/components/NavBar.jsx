// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import {
  FaUserCircle,
  FaUserShield,
  FaSearch,
  FaShoppingCart,
  FaPhoneAlt,
} from 'react-icons/fa';
import SearchBar from './SearchBar';
import '../styles/Navbar.css';

function Navbar() {
  const { cart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Detectar scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Alternar barra de búsqueda (móvil)
  const toggleSearch = () => setIsSearchOpen((prev) => !prev);

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      {/* Barra superior: Logo, Búsqueda, Acciones */}
      <div className="navbar-top">
        <div className="navbar-container">
          {/* Logo */}
          <div className="navbar-brand">
            <Link to="/" aria-label="Inicio de ElectroGalíndez">
              <img
                src="./logo.jpeg?v=1"
                alt="ElectroGalíndez"
                className="logo-image"
                loading="eager"
              />
            </Link>
          </div>

          {/* Búsqueda (Desktop) */}
          <div className="search-desktop">
            <SearchBar />
          </div>

          {/* Búsqueda (Móvil - Icono) */}
          <div className="search-mobile">
            <button
              onClick={toggleSearch}
              aria-label="Buscar productos"
              className="search-toggle-btn"
            >
              <FaSearch size={18} />
            </button>
          </div>

          {/* Acciones: Perfil y Carrito */}
          <div className="navbar-actions">
            <Link
              to={user ? '/profile' : '/login'}
              className="navbar-link auth"
              aria-label={user ? 'Ir a perfil' : 'Iniciar sesión'}
            >
              {user ? <FaUserShield size={20} /> : <FaUserCircle size={20} />}
              <span>{user ? 'Perfil' : 'Iniciar sesión'}</span>
            </Link>

            <Link
              to="/cart"
              className="navbar-link cart"
              aria-label={`Carrito (${totalItems} ítems)`}
            >
              <FaShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="cart-badge" aria-label="Cantidad en carrito">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Búsqueda móvil desplegable */}
        {isSearchOpen && (
          <div className="search-mobile-expanded">
            <SearchBar onClose={() => setIsSearchOpen(false)} autoFocus />
          </div>
        )}
      </div>

      {/* Menú principal */}
      <nav className="navbar-main" role="navigation" aria-label="Menú principal">
        <div className="navbar-container">
          <ul className="navbar-menu" role="menubar">
            {[
              { to: '/', label: 'Todos los productos' },
              { to: '/products', label: 'Novedades' },
              { to: '/offers', label: 'Ofertas' },
              { to: '/help', label: 'Ayuda' },
              { to: '/about', label: 'Sobre nosotros' },
              { to: '/contact', label: 'Contacto' },
            ].map((item) => (
              <li key={item.to} role="none">
                <Link
                  to={item.to}
                  className="menu-link"
                  role="menuitem"
                  aria-current={window.location.pathname === item.to ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="navbar-tools">
            <select className="language-selector" aria-label="Idioma">
              <option value="es">ES</option>
              <option value="en">EN</option>
            </select>
            <select className="currency-selector" aria-label="Moneda">
              <option value="CUP">CUP</option>
              <option value="USD">USD</option>
            </select>
            <div className="contact-info" aria-label="Contacto por teléfono">
              <FaPhoneAlt aria-hidden="true" />
              <span>+53 58956749</span>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;