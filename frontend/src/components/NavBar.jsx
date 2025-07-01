import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">ElectroGalíndez</Link>
      </div>
      <div className="navbar-center">
        <input type="text" placeholder="Buscar productos..." className="navbar-search" />
      </div>
      <div className="navbar-right">
        <Link to="/products">Productos</Link>
        <Link to="/cart">🛒</Link>
        <Link to="/login">👤</Link>
      </div>
    </nav>
  );
}

export default Navbar;
