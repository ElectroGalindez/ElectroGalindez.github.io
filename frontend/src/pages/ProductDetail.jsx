import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../styles/ProductDetail.css";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart();
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`http://localhost:3001/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data.product))
      .catch((err) => console.error("Error al cargar producto:", err));
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product);
    setMessage("✅ Producto agregado al carrito");
    setTimeout(() => setMessage(""), 2000); // borra el mensaje después de 2s
  };

  if (!product) return <p>Cargando producto...</p>;

  return (
    <div className="product-detail">
      <img src={product.image_url} alt={product.name} />
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p>€{product.price}</p>
      <button onClick={handleAddToCart}>Agregar al carrito</button>
      {message && <p style={{ color: "green", marginTop: "1rem" }}>{message}</p>}
    </div>
  );
}

export default ProductDetail;
