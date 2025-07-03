import { Link } from "react-router-dom";
import "../styles/Admin.css";

function AdminSidebar() {
  return (
    <div className="admin-sidebar">
      <h3>Admin Panel</h3>
      <ul>
        <li><Link to="/admin">Dashboard</Link></li>
        <li><Link to="/admin/products">Productos</Link></li>
        <li><Link to="/admin/orders">Órdenes</Link></li>
        <li><Link to="/admin/categories">Categorías</Link></li>
      </ul>
    </div>
  );
}

export default AdminSidebar;
