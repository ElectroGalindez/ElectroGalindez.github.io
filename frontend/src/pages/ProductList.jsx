import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../services/api";
import "../styles/ProductList.css";


function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts().then((data) => {
      setProducts(data.products)
      });
  }, []);

  return (
    <div>
        <div className="product-list-container">
          <h2 className="product-list-title">Productos</h2>
          <div className="products-grid">
            {products?.map((p) => (
              <div className="product-card" key={p.id}>
                <img src={p.image_url} alt={p.name} />
                <h3>{p.name}</h3>
                <p className="price">€{p.price}</p>
                <Link to={`/products/${p.id}`} className="btn">Ver detalle</Link>
              </div>
            ))}
          </div>
        </div>
    </div>
  );
}
export default ProductList;
