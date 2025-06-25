import { Link } from 'react-router-dom';

function ProductCard({ product }) {
  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', margin: '0.5rem' }}>
      <h3>{product.name}</h3>
      <p>€{product.price}</p>
      <Link to={`/products/${product.id}`}>Ver detalles</Link>
    </div>
  );
}

export default ProductCard;
