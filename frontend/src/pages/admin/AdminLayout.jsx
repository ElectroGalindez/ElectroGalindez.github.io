// src/pages/admin/AdminLayout.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import '../../styles/AdminLayout.css';

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Overlay para móviles */}
      {sidebarOpen && <div className="admin-sidebar-overlay" onClick={toggleSidebar}></div>}

      {/* Contenido principal */}
      <div className="admin-main">
        <header className="admin-header">
          <button className="admin-sidebar-toggle" onClick={toggleSidebar}>
            ☰
          </button>
          <h2>Panel de Administración</h2>
          <div className="admin-user-actions">
            <span className="admin-user">Admin</span>
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
