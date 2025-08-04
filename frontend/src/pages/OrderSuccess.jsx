// src/components/OrderSuccess.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../styles/OrderSuccess.css";

function OrderSuccess() {
  return (
    <div className="success-container">
      <div className="success-content">
        <div className="success-icon">🎉</div>
        <h1>¡Pedido realizado con éxito!</h1>
        <p>
          Gracias por tu compra. Pronto recibirás la confirmación por correo electrónico.
        </p>
        <Link to="/" className="btn-primary">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}

export default OrderSuccess;