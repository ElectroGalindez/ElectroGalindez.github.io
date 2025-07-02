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
        <Link to="/cart">
          Carrito
          {totalItems > 0 && <span className="navbar__badge">{totalItems}</span>}
        </Link>
        <Link to="/login">Login</Link>

      </nav>
    </header>
  );
}

export default Navbar;
