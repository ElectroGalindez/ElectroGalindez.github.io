// src/components/OrderAdmin.jsx
import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import '../../styles/OrderAdmin.css';

export default function OrderAdmin() {
  const { orders, updateOrderStatus, deleteOrder, loading, loadOrders } = useAdmin();

  React.useEffect(() => {
    if (!orders.length && !loading) {
      loadOrders();
    }
  }, [orders.length, loading, loadOrders]);

  if (loading) {
    return (
      <div className="order-admin loading">
        <div className="spinner"></div>
        <p>Cargando órdenes...</p>
      </div>
    );
  }

  if (!Array.isArray(orders) || orders.length === 0) {
    return (
      <div className="order-admin empty">
        <p>No hay órdenes disponibles.</p>
      </div>
    );
  }

  return (
    <div className="order-admin">
      <header className="order-header">
        <h1>Gestión de Órdenes</h1>
        <p>Revisa, actualiza y gestiona las órdenes de tus clientes.</p>
      </header>

      <section className="order-list">
        {orders.map((order) => {
          const createdAt = order.created_at
            ? new Date(order.created_at).toLocaleString('es-ES')
            : 'No disponible';

          const items = Array.isArray(order.items) ? order.items : [];
          const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
          const userName = order.user_name || 'Usuario no registrado';
          const userEmail = order.user_email || 'Sin email';

          return (
            <div key={order.id} className="order-card">
              {/* Encabezado */}
              <div className="order-card-header">
                <div className="order-card-info">
                  <h3>Orden #{order.id}</h3>
                  <p className="order-user">
                    <strong>{userEmail}</strong>
                  </p>
                </div>
                <div className="order-card-meta">
                  <span className={`status-badge status-${order.status}`}>
                    {getStatusLabel(order.status)}
                  </span>
                  <span className="order-date">{createdAt}</span>
                </div>
              </div>

              {/* Productos */}
              <div className="order-items">
                <h4>Productos ({totalItems})</h4>
                {items.length === 0 ? (
                  <p className="text-muted">No hay detalles de productos.</p>
                ) : (
                  <ul className="items-list">
                    {items.map((item, idx) => (
                      <li key={idx} className="item-row">
                        <div className="item-info">
                          <span className="item-name">{item.name || 'Producto sin nombre'}</span>
                          <span className="item-details">
                            {item.quantity} × €{parseFloat(item.price).toFixed(2)}
                          </span>
                        </div>
                        <span className="item-total">
                          €{(item.quantity * parseFloat(item.price)).toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Footer: Total y Acciones */}
              <div className="order-card-footer">
                <div className="order-total">
                  <strong>Total:</strong> €{parseFloat(order.total || 0).toFixed(2)}
                </div>

                <div className="order-actions">
                  <select
                    value={order.status || 'pending'}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    disabled={loading}
                    aria-label={`Estado de la orden ${order.id}`}
                  >
                    <option value="pending">Pendiente</option>
                    <option value="paid">Pagado</option>
                    <option value="shipped">Enviado</option>
                    <option value="cancelled">Cancelado</option>
                  </select>

                  <button
                    onClick={() => {
                      if (window.confirm(`¿Eliminar la orden #${order.id}? Esta acción no se puede deshacer.`)) {
                        deleteOrder(order.id);
                      }
                    }}
                    className="btn-delete"
                    disabled={loading}
                    aria-label={`Eliminar orden ${order.id}`}
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}

// Traducir estados
function getStatusLabel(status) {
  const labels = {
    pending: 'Pendiente',
    paid: 'Pagado',
    shipped: 'Enviado',
    cancelled: 'Cancelado',
  };
  return labels[status] || status;
}