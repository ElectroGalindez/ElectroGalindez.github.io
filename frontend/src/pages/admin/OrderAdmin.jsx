// src/pages/admin/OrderAdmin.jsx
import React from "react";
import { useAdmin } from "../../context/AdminContext";

export default function OrderAdmin() {
  const { orders, updateOrderStatus } = useAdmin();

  return (
    <div>
      <h2>Órdenes</h2>
      <ul>
        {orders.map((o) => (
          <li key={o.id}>
            #{o.id} - Total: ${o.total} - Estado:
            <select
              value={o.status}
              onChange={(e) => updateOrderStatus(o.id, e.target.value)}
            >
              <option value="pending">Pendiente</option>
              <option value="processing">Procesando</option>
              <option value="shipped">Enviado</option>
              <option value="delivered">Entregado</option>
            </select>
          </li>
        ))}
      </ul>
    </div>
  );
}
