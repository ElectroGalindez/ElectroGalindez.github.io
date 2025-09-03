// src/components/Navbar.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { useStore } from '../context/StoreContext'; // ✅ Importa useStore
import { FaUserCircle, FaUserShield, FaSearch, FaShoppingCart, FaHeart, FaPhoneAlt } from 'react-icons/fa';
import SearchBar from './SearchBar';
import '../styles/Navbar.css';

function Navbar() {
  const { cart } = useCart();
  const { user } = useAuth();
  const { wishlist } = useStore(); // ✅ Obtiene la lista de deseos
  const { language, setLanguage, currency, setCurrency, t } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Detectar tamaño de pantalla
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalItems = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const totalWishlist = useMemo(
    () => wishlist.length,
    [wishlist]
  );

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSearch = () => setIsSearchOpen((prev) => !prev);

  const navLinks = useMemo(() => [
    { to: '/products', label: t('allProducts') },
    { to: '/products/featured', label: t('offers') },
    { to: '/help', label: t('help') },
    { to: '/about', label: t('aboutUs') },
    { to: '/contact', label: t('contact') },
  ], [t]);

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
  };

  const isCompact = windowWidth <= 480;

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`} role="banner">
      {/* Fila 1: Logo, Búsqueda, Acciones */}
      <div className="navbar-top">
        <div className="navbar-container">
          {/* Logo */}
          <div className="navbar-brand">
            <Link to="/" aria-label="Inicio de ElectroGalíndez">
              <img
                src="/logo.svg"
                alt="ElectroGalíndez - Tienda de electrodomésticos en Cuba"
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

          {/* Búsqueda (Desktop) */}
          <div className="search-desktop">
            <SearchBar />
          </div>

          {/* Acciones */}
          <div className="navbar-actions">
            {/* Selector de moneda */}
            <select
              className="currency-selector"
              aria-label="Seleccionar moneda"
              value={currency}
              onChange={handleCurrencyChange}
            >
              <option value="CUP">CUP</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>

            {/* Contacto */}
            <a
              href="https://wa.me/5358956749"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-link"
              aria-label="Contactar por WhatsApp"
            >
              <FaPhoneAlt size={isCompact ? 16 : 18} />
              {!isCompact && <span>+53 58956749</span>}
            </a>

            {/* Perfil */}
            <Link
              to={user ? '/profile' : '/login'}
              className="navbar-link auth"
              aria-label={user ? 'Ir a perfil' : 'Iniciar sesión'}
            >
              {user ? (
                <FaUserShield size={isCompact ? 16 : 18} />
              ) : (
                <FaUserCircle size={isCompact ? 16 : 18} />
              )}
              {!isCompact && <span>{user ? 'Perfil' : 'Iniciar sesión'}</span>}
            </Link>

            {/* Favoritos */}
            <Link
              to="/favorites"
              className="navbar-link favorites"
              aria-label={`Favoritos (${totalWishlist})`}
            >
              <FaHeart size={isCompact ? 16 : 18} color={totalWishlist > 0 ? "#e74c3c" : "#636366"} />
              {totalWishlist > 0 && (
                <span className="cart-badge">{totalWishlist}</span>
              )}
            </Link>

            {/* Carrito */}
            <Link
              to="/cart"
              className="navbar-link cart"
              aria-label={`Carrito (${totalItems} ítems)`}
            >
              <FaShoppingCart size={isCompact ? 16 : 20} />
              {totalItems > 0 && (
                <span className="cart-badge">{totalItems}</span>
              )}
            </Link>
          </div>

          {/* Botón de búsqueda móvil */}
          <button
            className="search-toggle"
            onClick={toggleSearch}
            aria-label="Buscar productos"
          >
            <FaSearch size={20} />
          </button>
        </div>

        {/* Búsqueda móvil desplegable */}
        {isSearchOpen && (
          <div className="search-mobile-expanded">
            <SearchBar onClose={() => setIsSearchOpen(false)} autoFocus />
          </div>
        )}
      </div>

      {/* Fila 2: Menú principal */}
      <nav className="navbar-main" role="navigation" aria-label="Menú principal">
        <div className="navbar-container">
          <div className="menu-wrapper">
            <ul className="navbar-menu" role="menubar">
              {navLinks.map((item) => (
                <li key={item.to} role="none">
                  <Link
                    to={item.to}
                    className={`menu-link ${location.pathname === item.to ? 'active' : ''}`}
                    role="menuitem"
                    aria-current={location.pathname === item.to ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default React.memo(Navbar);