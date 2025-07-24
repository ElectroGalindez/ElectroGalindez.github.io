import React, { useEffect, useState } from 'react';
import { FaUsers, FaBoxOpen, FaReceipt, FaMoneyBillWave } from 'react-icons/fa';
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
        setSummary({
          users: data.users || 0,
          products: data.products || 0,
          pendingOrders: data.pendingOrders || 0,
          completedOrders: data.completedOrders || 0,
          totalIncome: parseFloat(data.totalIncome) || 0,
          weeklySales: Array.isArray(data.weeklySales) ? data.weeklySales : [],
        });
      } catch (err) {
        setError(err.message);
        console.error("Error al cargar resumen:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  // Rellenar datos por día
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
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Cargando datos del dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <p>⚠️ Error al cargar el resumen: {error}</p>
      </div>
    );
  }

  return (
    <div className="dashboard-home">
      <h1 className="dashboard-title">Panel de Administración</h1>
      <p className="dashboard-description">Resumen de actividad y rendimiento de la tienda</p>

      <div className="dashboard-cards">
        <div className="dashboard-card card-users">
          <div className="card-icon">
            <FaUsers />
          </div>
          <div className="card-content">
            <h3>{summary.users}</h3>
            <p>Usuarios Registrados</p>
          </div>
        </div>

        <div className="dashboard-card card-products">
          <div className="card-icon">
            <FaBoxOpen />
          </div>
          <div className="card-content">
            <h3>{summary.products}</h3>
            <p>Productos en Tienda</p>
          </div>
        </div>

        <div className="dashboard-card card-orders">
          <div className="card-icon">
            <FaReceipt />
          </div>
          <div className="card-content">
            <h3>{summary.pendingOrders} / {summary.completedOrders}</h3>
            <p>Pendientes / Completadas</p>
          </div>
        </div>

        <div className="dashboard-card card-income">
          <div className="card-icon">
            <FaMoneyBillWave />
          </div>
          <div className="card-content">
            <h3>${summary.totalIncome.toFixed(2)}</h3>
            <p>Ingresos Totales</p>
          </div>
        </div>
      </div>

      <div className="dashboard-charts">
        <div className="chart-container">
          <h3 className="chart-title">Ventas de la Última Semana</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesByDay} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip
                formatter={(value) => [`${value} ventas`, 'Ventas']}
                labelFormatter={(label) => `Día: ${label}`}
              />
              <Bar
                dataKey="ventas"
                fill="#4361ee"
                name="Ventas"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default DashboardHome;