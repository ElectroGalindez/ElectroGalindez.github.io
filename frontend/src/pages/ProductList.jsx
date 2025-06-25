import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../services/api";

function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts().then((data) => {
      setProducts(data.products)
      });
  }, []);

  return (
    <div>
      <h2>Productos</h2>
      <ul>
        {products?.map((p) => (
          <li key={p.id}>
            <Link to={`/products/${p.id}`}>
              {p.name} - €{p.price}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default ProductList;
