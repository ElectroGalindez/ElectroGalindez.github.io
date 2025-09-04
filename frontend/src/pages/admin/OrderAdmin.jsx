import React, { useEffect, useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { FaShoppingCart, FaUser, FaCalendarAlt, FaWhatsapp, FaTrash } from 'react-icons/fa';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import '../../styles/OrderAdmin.css';

// Formatear precio
const formatPrice = (amount) =>
  new Intl.NumberFormat('es-CU', { style: 'currency', currency: 'CUP' }).format(amount || 0);

// Formatear fecha
const formatDate = (dateString) => {
  try {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: es });
  } catch {
    return 'Fecha inválida';
  }
};

// Enviar mensaje por WhatsApp
const sendWhatsApp = (order) => {
  const { _id, user, items, totalAmount } = order;
  const userName = user?.name || user?.email || 'Cliente';
  const itemCount = items?.length || 0;
  const message = encodeURIComponent(
    `Hola ${userName},\n\nHas realizado una orden en ElectroGalíndez:\n\n` +
    `Orden #${_id}\n` +
    `${itemCount} producto(s) por un total de ${formatPrice(totalAmount)}.\n\n` +
    `Por favor, contáctanos para coordinar entrega y pago.\n\nGracias por tu confianza.`
  );
  const whatsappUrl = `https://wa.me/5358956749?text=${message}`;
  window.open(whatsappUrl, '_blank');
};

export default function OrderAdmin() {
  const { orders, deleteOrder, loadOrders, loadingOrders } = useAdmin();
  const [localLoading, setLocalLoading] = useState(true);

  // Cargar órdenes al montar
  useEffect(() => {
    const fetchOrders = async () => {
      setLocalLoading(true);
      try {
        await loadOrders();
      } catch (err) {
        console.error('[OrderAdmin] Error cargando órdenes:', err);
      } finally {
        setLocalLoading(false);
      }
    };

    fetchOrders();
  }, [loadOrders]);

  // Función para eliminar orden y refrescar lista
  const handleDelete = async (orderId) => {
    if (!window.confirm(`¿Eliminar la orden #${orderId}?`)) return;
    try {
      await deleteOrder(orderId);
      await loadOrders(); // refrescar lista
    } catch (err) {
      console.error('[OrderAdmin] Error eliminando orden:', err);
    }
  };

  if (localLoading || loadingOrders) {
    return (
      <div className="order-admin loading" aria-live="polite">
        <div className="spinner"></div>
        <p>Cargando órdenes...</p>
      </div>
    );
  }

  if (!Array.isArray(orders) || orders.length === 0) {
    return (
      <div className="order-admin empty">
        <FaShoppingCart size={40} color="#ccc" />
        <p>No hay órdenes disponibles.</p>
      </div>
    );
  }

  return (
    <div className="order-admin" aria-labelledby="order-admin-title">
      <header className="order-header">
        <h1 id="order-admin-title">Órdenes de Clientes</h1>
        <p>Lista de órdenes recibidas. Contacta al cliente por WhatsApp para coordinar.</p>
      </header>

      <section className="order-list">
        {orders.map((order) => {
          const orderId = order._id;
          if (!orderId) return null;

          const items = Array.isArray(order.items) ? order.items : [];
          const totalItems = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
          const userEmail = order.user?.email || 'Sin email';
          const userName = order.user?.name || 'Cliente';
          const createdAt = formatDate(order.createdAt || order.created_at);

          return (
            <div key={orderId} className="order-card">
              {/* Encabezado */}
              <div className="order-card-header">
                <div className="order-card-info">
                  <h3>Orden #{orderId.slice(-6).toUpperCase()}</h3>
                  <p className="order-user">
                    <FaUser size={14} /> <strong>{userName}</strong> ({userEmail})
                  </p>
                </div>
                <div className="order-card-meta">
                  <span className="order-date">
                    <FaCalendarAlt size={14} /> {createdAt}
                  </span>
                </div>
              </div>

              {/* Productos */}
              <div className="order-items">
                <h4>Productos ({totalItems})</h4>
                {items.length === 0 ? (
                  <p className="text-muted">No hay productos en esta orden.</p>
                ) : (
                  <ul className="items-list">
                    {items.map((item, idx) => {
                      const product = item.product || item;
                      const price = parseFloat(product.price || 0);
                      const quantity = parseInt(item.quantity) || 1;
                      const total = quantity * price;
                      const name = product.name || 'Producto sin nombre';

                      return (
                        <li key={idx} className="item-row">
                          <div className="item-info">
                            <span className="item-name">{name}</span>
                            <span className="item-details">
                              {quantity} × {formatPrice(price)}
                            </span>
                          </div>
                          <span className="item-total">{formatPrice(total)}</span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              {/* Total */}
              <div className="order-total">
                <strong>Total:</strong> {formatPrice(order.totalAmount || 0)}
              </div>

              {/* Acciones */}
              <div className="order-actions">
                <div className="action-buttons">
                  <button
                    onClick={() => sendWhatsApp(order)}
                    className="btn btn-whatsapp"
                    aria-label={`Contactar por WhatsApp`}
                  >
                    <FaWhatsapp /> WhatsApp
                  </button>

                  <button
                    onClick={() => handleDelete(orderId)}
                    className="btn btn-delete"
                    aria-label={`Eliminar orden ${orderId}`}
                  >
                    <FaTrash />
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
