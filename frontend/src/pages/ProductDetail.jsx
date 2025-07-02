import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../styles/ProductDetail.css";

function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3001/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data.product))
      .catch((err) => console.error("Error al cargar producto:", err));
  }, [id]);

  if (!product) return <p>Cargando...</p>;

  return (
    <div className="product-detail">
      <div className="product-image">
        <img src={product.image_url} alt={product.name} />
      </div>

      <div className="product-info">
        <h1>{product.name}</h1>
        <p className="product-price">€{product.price}</p>
        <p className="product-description">{product.description}</p>
        <button onClick={() => addToCart(product)}>Agregar al carrito</button>
      </div>
    </div>
  );
}

export default ProductDetail;
