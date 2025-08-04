// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AdminProvider } from "./context/AdminContext";

import PublicLayout from "./pages/PublicLayout";
import AdminLayout from "./pages/admin/AdminLayout";

import Home from "./pages/Home";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import OrderSuccess from "./pages/OrderSuccess";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

// ✅ Importa las nuevas páginas
import About from "./pages/About";
import Help from "./pages/Help";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";

// Páginas de Admin
import DashboardHome from "./pages/admin/DashboardHome";
import ProductAdmin from "./pages/admin/ProductAdmin";
import CategoryAdmin from "./pages/admin/CategoryAdmin";
import OrderAdmin from "./pages/admin/OrderAdmin";
import UserAdmin from "./pages/admin/UserAdmin";
import ProtectedRoute from "./components/ProtectedRoute";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/App.css";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* 🧭 RUTAS PÚBLICAS */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<ProductList />} />
          <Route path="products/:id" element={<ProductDetail />} />
          <Route path="cart" element={<Cart />} />
          <Route path="success" element={<OrderSuccess />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="profile" element={<Profile />} />
          
          {/* ✅ Rutas corregidas (sin / al inicio) */}
          <Route path="about" element={<About />} />
          <Route path="help" element={<Help />} />
          <Route path="contact" element={<Contact />} />
          <Route path="terms" element={<Terms />} />
          <Route path="privacy" element={<Privacy />} />
        </Route>

        {/* 🔒 RUTAS ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roleRequired="admin">
              <AdminProvider>
                <AdminLayout />
              </AdminProvider>
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardHome />} />
          <Route path="products" element={<ProductAdmin />} />
          <Route path="categories" element={<CategoryAdmin />} />
          <Route path="orders" element={<OrderAdmin />} />
          <Route path="users" element={<UserAdmin />} />
        </Route>
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </AuthProvider>
  );
}

export default App;