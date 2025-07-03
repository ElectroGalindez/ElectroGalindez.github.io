import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../styles/Navbar.css";

function Navbar() {
  const { cart } = useCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="navbar">
      <div className="navbar__logo">
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
        <Link to="/login">Login</Link>
        <Link to="/admin">Admin</Link>
      </nav>
    </header>
  );
}

export default Navbar;
