// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext"; // Usamos el AuthContext
import { FaUserCircle, FaUserShield } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import "../styles/Navbar.css";

function Navbar() {
  const { cart } = useCart();
  const { user, logout } = useAuth(); // Obtenemos el usuario y logout del contexto
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    logout(); 
    navigate("/"); 
  };

  return (
    <header className="navbar">
      <div className="navbar__logo">
          <img src="./ElectoGalíndez.png" alt="Logo ElectroGalíndez"/>
      </div>
      <div className="navbar__title">
        <Link to="/">ElectroGalíndez</Link>
      </div>

      <nav className="navbar__links">
        <Link to="/">Inicio</Link>
        <Link to="/products">Productos</Link>
        <Link to="/cart" className="cart-link">
          <div className="cart-wrapper">
            Carrito
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </div>
        </Link>

        {!user ? (
          <>
            <Link to="/login">Entrar</Link>
            <Link to="/register">Registrarse</Link>
          </>
        ) : (
          <div className="navbar__user" ref={menuRef}>
            <button className="user-btn" onClick={() => setShowMenu(!showMenu)}>
              {user.role === "admin" ? (
                <FaUserShield size={22} />
              ) : (
                <FaUserCircle size={22} />
              )}
            </button>

            {showMenu && (
              <div className="user-menu">
                <p className="user-email">{user.email}</p>
                <p className="user-role">{user.role === "admin" ? "Administrador" : "Cliente"}</p>
                <hr />
                <Link to="/profile" onClick={() => setShowMenu(false)}>Perfil</Link>

                {/* Mostrar 'Mis Pedidos' solo si no es un admin */}
                {user.role !== "admin" && (
                  <Link to="/cart" onClick={() => setShowMenu(false)}>Mis Pedidos</Link>
                )}

                {/* Mostrar 'Panel Admin' solo si es un admin */}
                {user.role === "admin" && (
                  <Link to="/admin" onClick={() => setShowMenu(false)}>Panel Admin</Link>
                )}

                <button onClick={handleLogout}>Cerrar sesión</button>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
