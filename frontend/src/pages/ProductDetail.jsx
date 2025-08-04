// src/components/ProductDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../styles/ProductDetail.css";

function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:3001/api/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Producto no encontrado");
        return res.json();
      })
      .then((data) => {
        setProduct(data.product);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar producto:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="product-detail">
        <div className="loading-skeleton">
          <div className="skeleton-image"></div>
          <div className="skeleton-info">
            <div className="skeleton-title"></div>
            <div className="skeleton-price"></div>
            <div className="skeleton-text"></div>
            <div className="skeleton-text"></div>
            <div className="skeleton-button"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail">
        <div className="error-container">
          <h2>Producto no encontrado</h2>
          <p>El producto que buscas no existe o está temporalmente disponible.</p>
          <button onClick={() => navigate(-1)} className="btn-back">
            Volver atrás
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail">
      <div className="product-image-container">
        <img
          src={product.image_url}
          alt={product.name}
          className="product-image"
          loading="lazy"
        />
      </div>

      <div className="product-info">
        <h1>{product.name}</h1>
        <p className="product-price">€{product.price.toFixed(2)}</p>

        {product.description && (
          <div className="product-description">
            <h3>Descripción</h3>
            <p>{product.description}</p>
          </div>
        )}

        <button
          onClick={() => addToCart(product)}
          className="btn-add-to-cart"
          aria-label={`Agregar ${product.name} al carrito`}
        >
          + Agregar al carrito
        </button>

        <button
          onClick={() => navigate(-1)}
          className="btn-continue"
          aria-label="Seguir comprando"
        >
          Seguir comprando
        </button>
      </div>
    </div>
  );
}

export default ProductDetail;