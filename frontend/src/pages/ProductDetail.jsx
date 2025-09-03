// src/pages/ProductDetail.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import WhatsAppButton from "../components/WhatsAppButton";
import "../styles/ProductDetail.css";

function ProductDetail() {
  const { id } = useParams();
  const { getProductById } = useStore();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatPrice = useCallback((price) =>
    new Intl.NumberFormat('es-CU', {
      style: 'currency',
      currency: 'CUP',
    }).format(price || 0),
    []
  );

  useEffect(() => {
    let isMounted = true;

    const loadProduct = async () => {
      if (!id) {
        if (isMounted) {
          setError('ID del producto no válido');
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // 1. Intentar desde el contexto (caché)
        const cachedProduct = getProductById(id);
        if (isMounted && cachedProduct) {
          setProduct(cachedProduct);
          setLoading(false);
          return;
        }

        // 2. Si no está en caché, intentar desde API
        const fetchedProduct = await getProductById(id);
        if (isMounted) {
          setProduct(fetchedProduct);
        }
      } catch (err) {
        if (isMounted) {
          const errorMessage = err.message.includes('404')
            ? 'Producto no encontrado'
            : 'No se pudo cargar el producto. Revisa tu conexión.';
          setError(errorMessage);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [id, getProductById]);

  const handleWhatsApp = useCallback(() => {
    if (!product) return;
    const message = encodeURIComponent(
      `Hola, estoy interesado en el producto:\n\n${product.name}\nPrecio: ${formatPrice(product.price)}\n\n¿Tiene disponible?`
    );
    const whatsappUrl = `https://wa.me/5358956749?text=${message}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  }, [product, formatPrice]);

  if (loading) {
    return (
      <div className="product-detail loading" aria-busy="true">
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
        <WhatsAppButton />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail error">
        <div className="error-container" role="alert" aria-live="polite">
          <h2>Producto no disponible</h2>
          <p>
            {error === "Producto no encontrado"
              ? "El producto que buscas no existe o ha sido eliminado."
              : "No se pudo cargar el producto. Verifica tu conexión e inténtalo más tarde."}
          </p>
          <div className="error-actions">
            <button onClick={() => navigate(-1)} className="btn-back">← Volver atrás</button>
            <button onClick={() => navigate('/products')} className="btn-home">🏠 Ver todos los productos</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="product-detail"
      itemScope
      itemType="https://schema.org/Product"
      aria-labelledby="product-title"
    >
      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          "name": product.name,
          "image": product.images?.[0] || null,
          "description": product.description || "Producto disponible en ElectroGalíndez.",
          "offers": {
            "@type": "Offer",
            "price": product.price,
            "priceCurrency": "CUP",
            "availability": "https://schema.org/InStock",
            "seller": {
              "@type": "Organization",
              "name": "ElectroGalíndez",
              "url": "https://electrogalindez.com"
            }
          }
        })}
      </script>

      {/* Galería */}
      <div className="product-gallery">
        <img
          src={product.images?.[0] || '/placeholders/product-large.png'}
          alt={product.name}
          className="product-main-image"
          loading="lazy"
          itemProp="image"
          onError={(e) => {
            e.target.src = '/placeholders/fallback-large.png';
            e.target.alt = 'Imagen no disponible';
          }}
        />
        {product.featured && (
          <span className="badge featured" aria-label="Producto destacado">⭐ Destacado</span>
        )}
      </div>

      {/* Información */}
      <div className="product-info">
        <h1 id="product-title" itemProp="name">{product.name}</h1>

        <p
          className="product-price"
          itemProp="offers"
          itemScope
          itemType="https://schema.org/Offer"
        >
          <meta itemProp="priceCurrency" content="CUP" />
          <meta itemProp="availability" content="https://schema.org/InStock" />
          <span itemProp="price">
            {formatPrice(product.price)}
          </span>
        </p>

        {product.description && (
          <div className="product-description">
            <h3>Descripción</h3>
            <p itemProp="description">{product.description}</p>
          </div>
        )}

        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <div className="product-specs">
            <h3>Especificaciones</h3>
            <dl>
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="spec-item">
                  <dt>{key}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        <div className="product-actions">
          <button
            onClick={handleWhatsApp}
            className="btn-whatsapp"
            aria-label={`Solicitar ${product.name} por WhatsApp`}
          >
            💬 Solicitar por WhatsApp
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

      <WhatsAppButton />
    </div>
  );
}

export default React.memo(ProductDetail);