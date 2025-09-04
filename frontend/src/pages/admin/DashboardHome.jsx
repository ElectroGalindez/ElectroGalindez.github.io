import React, { useEffect, useState } from 'react';
import { FaUsers, FaBoxOpen, FaReceipt, FaMoneyBillWave } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useAdmin } from '../../context/AdminContext';
import { toast } from 'react-toastify';
import "../../styles/DashboardHome.css";

function DashboardHome() {
  const { getAdminSummary, refreshAll, users, products, orders } = useAdmin();

  const [summary, setSummary] = useState({
    users: 0,
    products: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalIncome: 0,
    weeklySales: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      // Primero refrescamos datos en AdminContext
      await refreshAll();

      // Luego obtenemos resumen del backend
      const data = await getAdminSummary();

      setSummary({
        users: Number(data.users) || users.length || 0,
        products: Number(data.products) || products.length || 0,
        pendingOrders: Number(data.pendingOrders) || orders.filter(o => o.status === 'pending').length || 0,
        completedOrders: Number(data.completedOrders) || orders.filter(o => o.status === 'completed').length || 0,
        totalIncome: parseFloat(data.totalIncome) || 0,
        weeklySales: Array.isArray(data.weeklySales) ? data.weeklySales : []
      });
    } catch (err) {
      const msg = err.message || 'Error desconocido';
      setError(msg);
      toast.error(`❌ Dashboard: ${msg}`);
      console.error('[DashboardHome] fetchSummary', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSummary(); }, []);

  // Map dinámico de ventas por día
  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const salesByDay = days.map(day => {
    const sale = summary.weeklySales.find(s => s.day === day);
    return { day, ventas: Number(sale?.sales) || 0 };
  });

  if (loading) return (
    <div className="dashboard-home loading" aria-live="polite">
      <FaBoxOpen size={40} className="loading-icon" />
      <p>Cargando estadísticas...</p>
    </div>
  );

  if (error) return (
    <div className="dashboard-home error" role="alert">
      <p><strong>⚠️ Error de conexión</strong><br />{error}</p>
      <button className="btn-retry" onClick={fetchSummary} aria-label="Reintentar">
        Reintentar
      </button>
    </div>
  );

  return (
    <div className="dashboard-home" aria-labelledby="dashboard-title">
      <header className="dashboard-header">
        <h1 id="dashboard-title">Panel de Administración</h1>
        <p>Resumen de actividad y rendimiento de la tienda</p>
      </header>

      {/* Tarjetas resumen */}
      <section className="dashboard-cards" aria-label="Estadísticas generales">
        {[
          { icon: FaUsers, value: summary.users.toLocaleString(), label: 'Usuarios Registrados', className: 'card-users' },
          { icon: FaBoxOpen, value: summary.products.toLocaleString(), label: 'Productos Activos', className: 'card-products' },
          { icon: FaReceipt, value: summary.pendingOrders.toLocaleString(), label: 'Órdenes Pendientes', className: 'card-orders' },
          { icon: FaMoneyBillWave, value: `CUP ${summary.totalIncome.toLocaleString('es-CU', { minimumFractionDigits: 2 })}`, label: 'Ingresos Totales', className: 'card-income' }
        ].map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className={`dashboard-card ${card.className}`}>
              <div className="card-icon"><Icon size={24} /></div>
              <div className="card-content">
                <h3>{card.value}</h3>
                <p>{card.label}</p>
              </div>
            </div>
          );
        })}
      </section>

      {/* Gráfico de ventas */}
      <section className="dashboard-charts">
        <div className="chart-container">
          <h3>Ventas de la Última Semana</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesByDay} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="5 5" opacity={0.1} />
              <XAxis dataKey="day" tick={{ fill: 'var(--text)', fontSize: 13 }} />
              <YAxis tick={{ fill: 'var(--text)', fontSize: 13 }} />
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-alt)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  color: 'var(--text)',
                  fontSize: '14px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                }}
                formatter={value => [`${value} ventas`, 'Ventas']}
                labelFormatter={label => `Día: ${label}`}
              />
              <Bar
                dataKey="ventas"
                fill="var(--primary)"
                name="Ventas"
                radius={[6, 6, 0, 0]}
                stroke="var(--primary)"
                strokeWidth={1}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}

export default DashboardHome;
