// src/components/AdminLayout.jsx
import { Outlet } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import "../../styles/AdminLayout.css";

function AdminLayout() {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-content" role="main">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;