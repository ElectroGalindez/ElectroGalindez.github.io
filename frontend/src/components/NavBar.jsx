import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
      <Link to="/">Inicio</Link> |{' '}
      <Link to="/products">Productos</Link> |{' '}
      <Link to="/cart">Carrito</Link>
    </nav>
  );
}

export default Navbar;
