import React from "react";
import { Link } from "react-router-dom";
import "../styles/OrderSuccess.css";

function OrderSuccess() {
  return (
    <div className="success-container">
      <h2>🎉 ¡Pedido realizado con éxito!</h2>
      <p>Gracias por tu compra. Pronto recibirás la confirmación por correo electrónico.</p>
      <Link to="/" className="btn">Volver al inicio</Link>
    </div>
  );
}

export default OrderSuccess;
