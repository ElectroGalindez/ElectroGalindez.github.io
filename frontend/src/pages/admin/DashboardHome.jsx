// src/pages/admin/DashboardHome.jsx
import React, { useEffect, useState } from 'react';
import { FaUsers, FaBoxOpen, FaReceipt, FaMoneyBillWave } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
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

  useEffect(() => {
    fetch("http://localhost:3001/api/products")
      .then(res => res.json())
      .then(data => setSummary(data))
      .catch(err => console.error("Error al cargar resumen:", err));
  }, []);

  return (
    <div className="dashboard-home">
      <h2>Resumen General</h2>

      <div className="dashboard-cards">
        <div className="card">
          <FaUsers className="icon" />
          <div>
            <h3>{summary.users}</h3>
            <p>Usuarios registrados</p>
          </div>
        </div>
        <div className="card">
          <FaBoxOpen className="icon" />
          <div>
            <h3>{summary.products}</h3>
            <p>Productos en tienda</p>
          </div>
        </div>
        <div className="card">
          <FaReceipt className="icon" />
          <div>
            <h3>{summary.pendingOrders} / {summary.completedOrders}</h3>
            <p>Órdenes Pendientes / Completadas</p>
          </div>
        </div>
        <div className="card">
          <FaMoneyBillWave className="icon" />
          <div>
            <h3>${summary.totalIncome.toFixed(2)}</h3>
            <p>Ingresos totales</p>
          </div>
        </div>
      </div>

      <div className="chart-section">
        <h3>Ventas de la semana</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={summary.weeklySales}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="sales" fill="#007bff" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default DashboardHome;
