// src/pages/ProductDetail.jsx
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
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');

    fetch(`http://localhost:3001/api/products/${id}`)
      .then((res) => {
        if (!res.ok) {
          if (res.status === 404) throw new Error("Producto no encontrado");
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        const productData = data.product || data;
        if (!productData.name) throw new Error("Datos del producto inválidos");
        setProduct(productData);
      })
      .catch((err) => {
        console.error("Error al cargar producto:", err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  // Skeleton Loading
  if (loading) {
    return (
      <div className="product-detail" aria-live="polite">
        <div className="loading-skeleton">
          <div className="skeleton-image"></div>
          <div className="skeleton-info">
            <div className="skeleton-title"></div>
            <div className="skeleton-price"></div>
            <div className="skeleton-text"></div>
            <div className="skeleton-text"></div>
            <div className="skeleton-actions">
              <div className="skeleton-btn primary"></div>
              <div className="skeleton-btn outline"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error o producto no encontrado
  if (error || !product) {
    return (
      <div className="product-detail">
        <div className="error-container" role="alert">
          <h2>Producto no disponible</h2>
          <p>
            {error === "Producto no encontrado"
              ? "El producto que buscas no existe o ha sido eliminado."
              : "No se pudo cargar el producto. Intenta más tarde."}
          </p>
          <div className="error-actions">
            <button
              onClick={() => navigate(-1)}
              className="btn-back"
              aria-label="Volver a la página anterior"
            >
              ← Volver atrás
            </button>
            <button
              onClick={() => navigate('/products')}
              className="btn-home"
              aria-label="Ir a la página de productos"
            >
              🏠 Ver todos los productos
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail" itemScope itemType="https://schema.org/Product">
      {/* Imagen del producto */}
      <div className="product-image-container" data-testid="product-image-container">
        <img
          src={product.image_url || '/placeholders/product-large.png'}
          alt={product.name}
          className="product-image"
          loading="lazy"
          itemProp="image"
          onError={(e) => {
            e.target.src = '/placeholders/fallback-large.png';
          }}
        />
      </div>

      {/* Información del producto */}
      <div className="product-info">
        <h1 itemProp="name">{product.name}</h1>
        <p className="product-price" itemProp="offers" itemScope itemType="https://schema.org/Offer">
          <span itemProp="price">€{product.price?.toFixed(2) || '0.00'}</span>
        </p>

        {product.description && (
          <div className="product-description" itemProp="description">
            <h3>Descripción</h3>
            <p>{product.description}</p>
          </div>
        )}

        {/* Acciones */}
        <div className="product-actions">
          <button
            onClick={() => addToCart(product)}
            className="btn-add-to-cart"
            disabled={!product.stock || product.stock <= 0}
            aria-label={`Agregar ${product.name} al carrito`}
            itemProp="potentialAction"
          >
            {product.stock > 0 ? '➕ Agregar al carrito' : '🚫 Agotado'}
          </button>

          <button
            onClick={() => navigate(-1)}
            className="btn-continue"
            aria-label="Seguir comprando"
          >
            ← Seguir comprando
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;