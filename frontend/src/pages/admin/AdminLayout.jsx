import { Link, Outlet } from "react-router-dom";
import { FaBoxes, FaUsers, FaThLarge, FaClipboardList, FaHome } from "react-icons/fa";
import "../../styles/AdminLayout.css";

function AdminLayout() {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>Admin Panel</h2>
        <nav>
          <Link to="/admin/dashboard"><FaThLarge /> Dashboard</Link>
          <Link to="/admin/products"><FaBoxes /> Productos</Link>
          <Link to="/admin/categories"><FaThLarge /> Categorías</Link>
          <Link to="/admin/users"><FaUsers /> Usuarios</Link>
          <Link to="/admin/orders"><FaClipboardList /> Órdenes</Link>
          <Link to="/"><FaHome /> Ir al sitio</Link>
        </nav>
      </aside>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
