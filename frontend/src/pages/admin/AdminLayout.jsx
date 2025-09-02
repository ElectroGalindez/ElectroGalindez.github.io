// src/pages/admin/AdminLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import '../../styles/AdminLayout.css';
import DashboardHome from './DashboardHome';

function AdminLayout() {
  return (
    <div className="admin-layout">
      {/* Sidebar fija */}
      <AdminSidebar />

      {/* Contenido principal */}
      <div className="admin-main">
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;