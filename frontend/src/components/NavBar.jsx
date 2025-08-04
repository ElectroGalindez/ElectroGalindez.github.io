// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { 
  FaUserCircle, 
  FaUserShield, 
  FaSearch, 
  FaShoppingCart, 
  FaLanguage, 
  FaDollarSign, 
  FaPhoneAlt 
} from 'react-icons/fa';
import SearchBar from './SearchBar';
import '../styles/Navbar.css';

function Navbar() {
  const { cart } = useCart();
  const { user } = useAuth();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const [scrolled, setScrolled] = useState(false);

  // Detectar scroll para efecto de opacidad
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      {/* Barra superior */}
      <div className="navbar-top">
        <div className="navbar-container">
          {/* Logo */}
          <div className="navbar-brand">
            <Link to="/" aria-label="Inicio">
              <img 
                src="../assets/logo.jpeg" 
                alt="ElectroGalíndez" 
                className="logo-image" 
              />
            </Link>
          </div>

          {/* Búsqueda */}
          <div className="search-wrapper">
            <div className="search-wrapper">
              <SearchBar onSearch={(query) => setSearch(query)} />
            </div>
          </div>

          {/* Acciones */}
          <div className="navbar-actions">
            <Link to={user ? '/profile' : '/login'} className="navbar-link auth" aria-label={user ? 'Perfil' : 'Iniciar sesión'}>
              {user ? <FaUserShield size={20} /> : <FaUserCircle size={20} />}
              <span>{user ? 'Perfil' : 'Iniciar sesión'}</span>
            </Link>
            <Link to="/cart" className="navbar-link cart" aria-label="Carrito de compras">
              <FaShoppingCart size={20} />
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </Link>
          </div>
        </div>
      </div>

      {/* Menú principal */}
      <nav className="navbar-main">
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
                <Link to={item.to} className="menu-link" role="menuitem">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="navbar-tools">
            <select className="language-selector" aria-label="Seleccionar idioma">
              <option value="es">ES</option>
              <option value="en">EN</option>
            </select>
            <select className="currency-selector" aria-label="Seleccionar moneda">
              <option value="EUR">€ EUR</option>
              <option value="USD">$ USD</option>
            </select>
            <div className="contact-info" aria-label="Teléfono de contacto">
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