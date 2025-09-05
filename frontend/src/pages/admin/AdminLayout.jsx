// src/pages/admin/AdminLayout.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import '../../styles/AdminLayout.css';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Overlay para móviles */}
      <div 
        className={`admin-sidebar-overlay ${sidebarOpen ? 'open' : 'closed'}`} 
        onClick={toggleSidebar} 
      />

      {/* Main content */}
      <main className="admin-main">
        <header className="admin-header">
          <button 
            className="admin-sidebar-toggle" 
            onClick={toggleSidebar} 
            aria-label="Toggle sidebar"
          >
            ☰
          </button>
          <div className="admin-user-actions">
            <span className="admin-user">Admin</span>
          </div>
        </header>

        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
