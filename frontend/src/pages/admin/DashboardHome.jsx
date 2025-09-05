import React, { useEffect, useState } from 'react';
import { FaUsers, FaBoxOpen, FaTags, FaMoneyBillWave, FaShoppingCart } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useAdmin } from '../../context/AdminContext';
import "../../styles/DashboardHome.css";

function DashboardHome() {
  const { users, products, orders } = useAdmin();

  const [summary, setSummary] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalIncome: 0,
    inStockProducts: 0,
    weeklySales: []
  });

  useEffect(() => {
    // Validar que existan datos antes de calcular
    if (!users || !products || !orders) return;

    const totalUsers = users.length || 0;
    const totalProducts = products.length || 0;
    const totalOrders = orders.length || 0;
    const totalIncome = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
    const inStockProducts = products.filter(p => p.stock && p.stock > 0).length;

    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const weeklySales = days.map(day => {
      const sales = orders
        .filter(o => {
          const orderDay = new Date(o.createdAt).getDay();
          return orderDay === days.indexOf(day);
        })
        .reduce((sum, o) => sum + (o.totalPrice || 0), 0);
      return { day, sales };
    });

    setSummary({ totalUsers, totalProducts, totalOrders, totalIncome, inStockProducts, weeklySales });
  }, [users, products, orders]);

  const { totalUsers, totalProducts, totalOrders, totalIncome, inStockProducts, weeklySales } = summary;

  const cards = [
    { icon: FaUsers, value: totalUsers, label: 'Usuarios Registrados', className: 'card-users' },
    { icon: FaBoxOpen, value: totalProducts, label: 'Productos Totales', className: 'card-products' },
    { icon: FaTags, value: inStockProducts, label: 'Productos en Stock', className: 'card-stock' },
    { icon: FaShoppingCart, value: totalOrders, label: 'Órdenes Totales', className: 'card-orders' },
    { icon: FaMoneyBillWave, value: `CUP ${totalIncome.toLocaleString('es-CU', { minimumFractionDigits: 2 })}`, label: 'Ingresos Estimados', className: 'card-income' }
  ];

  return (
    <div className="dashboard-home" aria-labelledby="dashboard-title">
      <header className="dashboard-header">
        <h1 id="dashboard-title">Panel de Administración</h1>
        <p>Resumen de actividad y rendimiento de la tienda</p>
      </header>

      {/* Tarjetas resumen */}
      <section className="dashboard-cards" aria-label="Estadísticas generales">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className={`dashboard-card ${card.className}`}>
              <div className="card-icon"><Icon size={24} /></div>
              <div className="card-content">
                <h3>{typeof card.value === 'number' ? card.value.toLocaleString() : card.value}</h3>
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
            <BarChart data={weeklySales} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="5 5" opacity={0.1} />
              <XAxis dataKey="day" tick={{ fill: 'var(--text)', fontSize: 13 }} />
              <YAxis tick={{ fill: 'var(--text)', fontSize: 13 }} />
              <Tooltip
                contentStyle={{
                  background: 'var(--bg)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  color: 'var(--text)',
                  fontSize: '14px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                }}
                formatter={value => [`CUP ${value}`, 'Ventas']}
                labelFormatter={label => `Día: ${label}`}
              />
              <Bar
                dataKey="sales"
                fill="var(--primary)"
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
