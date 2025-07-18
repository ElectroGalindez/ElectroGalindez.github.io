// src/pages/admin/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import { useAdmin } from "../../context/AdminContext";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { format, subDays } from "date-fns";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";
import "../../styles/AdminDashboard.css";

export default function AdminDashboard() {
  const { users, products, orders, fetchAllData } = useAdmin();

  const [range, setRange] = useState("7");
  const [salesData, setSalesData] = useState([]);
  const [categoryPie, setCategoryPie] = useState([]);

  // Fetch all data
  useEffect(() => {
    fetchAllData();
  }, []);

  // Update sales and pie data when orders or range change
  useEffect(() => {
    const end = new Date();
    const start = subDays(end, parseInt(range) - 1);

    // Filtrar órdenes completadas dentro del rango
    const filtered = orders.filter(o => {
      const date = new Date(o.created_at);
      return o.status === "completed" && date >= start && date <= end;
    });

    // Ventas por día
    const dayMap = {};
    for (let d = 0; d < parseInt(range); d++) {
      const day = format(subDays(end, d), "dd/MM");
      dayMap[day] = 0;
    }
    filtered.forEach(o => {
      const day = format(new Date(o.created_at), "dd/MM");
      dayMap[day] = (dayMap[day] || 0) + o.total; // total: campo en tu orden
    });
    setSalesData(Object.entries(dayMap).map(([day, total]) => ({ day, total })));

    // Pie: ventas por categoría
    const catMap = {};
    filtered.forEach(o => {
      o.items.forEach(i => {
        const name = i.product_category_name || "Sin categoría";
        catMap[name] = (catMap[name] || 0) + i.quantity;
      });
    });
    setCategoryPie(Object.entries(catMap).map(([name, value]) => ({ name, value })));
  }, [orders, range]);

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#00c49f"];

  // Export PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Reporte de Ventas", 10, 10);
    salesData.forEach((d, i) => doc.text(`${d.day}: ${d.total}`, 10, 20 + i * 8));
    doc.save("ventas.pdf");
    toast.success("PDF creado exitosamente");
  };

  // Export Excel
  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(salesData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Ventas");
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buf], { type: "application/octet-stream" }), "ventas.xlsx");
    toast.success("Excel creado exitosamente");
  };

  return (
    <div className="dashboard-container">
      <h1>Resumen General</h1>
      <div className="cards-row">
        <div className="card">
          <h3>👥 Usuarios</h3>
          <p>{users.length}</p>
        </div>
        <div className="card">
          <h3>📦 Productos</h3>
          <p>{products.length}</p>
        </div>
        <div className="card">
          <h3>🧾 Órdenes (pendientes/completadas)</h3>
          <p>
            {orders.filter(o => o.status === "pending").length} /{" "}
            {orders.filter(o => o.status === "completed").length}
          </p>
        </div>
        <div className="card">
          <h3>💰 Ingresos Totales</h3>
          <p>
            ${orders.reduce((sum, o) => sum + (o.status === "completed" ? o.total : 0), 0)}
          </p>
        </div>
      </div>

      <div className="charts-row">
        <div className="chart-container">
          <div className="chart-header">
            <h3>📈 Ventas por día</h3>
            <select value={range} onChange={(e) => setRange(e.target.value)}>
              <option value="7">Últimos 7 días</option>
              <option value="30">Últimos 30 días</option>
              <option value="90">Últimos 90 días</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={salesData}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#007bff" />
            </LineChart>
          </ResponsiveContainer>
          <div className="export-buttons">
            <button onClick={exportPDF}>Exportar PDF</button>
            <button onClick={exportExcel}>Exportar Excel</button>
          </div>
        </div>

        <div className="chart-container">
          <h3>🥧 Ventas por categoría</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={categoryPie} dataKey="value" nameKey="name" outerRadius={80}>
                {categoryPie.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Legend layout="vertical" />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
