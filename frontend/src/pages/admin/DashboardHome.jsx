// src/components/DashboardHome.jsx
import React, { useEffect, useState } from 'react';
import { FaUsers, FaBoxOpen, FaReceipt, FaMoneyBillWave, FaChartLine } from 'react-icons/fa';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import "../../styles/DashboardHome.css";

function DashboardHome() {
  const [summary, setSummary] = useState({
    users: 0,
    products: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalIncome: 0,
    weeklySales: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/admin/summary');

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error ${response.status}: ${errorText}`);
        }

        const data = await response.json();

        // Validación robusta de datos
        setSummary({
          users: data.users || 0,
          products: data.products || 0,
          pendingOrders: data.pendingOrders || 0,
          completedOrders: data.completedOrders || 0,
          totalIncome: parseFloat(data.totalIncome) || 0,
          weeklySales: Array.isArray(data.weeklySales) ? data.weeklySales : [],
        });
      } catch (err) {
        console.error("Error al cargar resumen del dashboard:", err);
        setError(err.message.includes('Failed to fetch')
          ? 'No se pudo conectar al servidor. ¿Está corriendo en http://localhost:3001?'
          : `Error: ${err.message}`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  // Preparar datos para el gráfico
  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const salesByDay = days.map(day => {
    const saleData = summary.weeklySales.find(s => s.day === day);
    return {
      day,
      ventas: saleData ? saleData.sales : 0,
    };
  });

  if (loading) {
    return (
      <div className="dashboard-home loading" aria-live="polite">
        <FaChartLine size={40} className="loading-icon" />
        <p>Cargando estadísticas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-home error" role="alert">
        <p>
          <strong>⚠️ Error de conexión</strong><br />
          {error}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="btn-retry"
          aria-label="Reintentar carga de datos"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-home" aria-labelledby="dashboard-title">
      {/* Header */}
      <header className="dashboard-header">
        <h1 id="dashboard-title">Panel de Administración</h1>
        <p>Resumen de actividad y rendimiento de la tienda</p>
      </header>

      {/* Tarjetas de resumen */}
      <section className="dashboard-cards" aria-label="Estadísticas generales">
        <div className="dashboard-card card-users">
          <div className="card-icon">
            <FaUsers size={24} />
          </div>
          <div className="card-content">
            <h3>{summary.users.toLocaleString()}</h3>
            <p>Usuarios Registrados</p>
          </div>
        </div>

        <div className="dashboard-card card-products">
          <div className="card-icon">
            <FaBoxOpen size={24} />
          </div>
          <div className="card-content">
            <h3>{summary.products}</h3>
            <p>Productos Activos</p>
          </div>
        </div>

        <div className="dashboard-card card-orders">
          <div className="card-icon">
            <FaReceipt size={24} />
          </div>
          <div className="card-content">
            <h3>{summary.pendingOrders}</h3>
            <p>Órdenes Pendientes</p>
          </div>
        </div>

        <div className="dashboard-card card-income">
          <div className="card-icon">
            <FaMoneyBillWave size={24} />
          </div>
          <div className="card-content">
            <h3>CUP {summary.totalIncome.toLocaleString('es-CU', { minimumFractionDigits: 2 })}</h3>
            <p>Ingresos Totales</p>
          </div>
        </div>
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
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value) => [`${value} ventas`, 'Ventas']}
                labelFormatter={(label) => `Día: ${label}`}
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