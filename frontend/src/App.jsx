// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import OrderSuccess from "./pages/OrderSuccess";
import Footer from "./components/Footer";
import Login from './pages/Login';
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import AdminLayout from "./pages/admin/AdminLayout";
import ProductAdmin from "./pages/admin/ProductAdmin";
import CategoryAdmin from "./pages/admin/CategoryAdmin";
import OrderAdmin from "./pages/admin/OrderAdmin";
import UserAdmin from "./pages/admin/UserAdmin";
import ProtectedRoute from "./components/ProtectedRoute";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/AuthContext";

import "./styles/App.css";

function App() {
  return (
    <div className="app-layout">
      <AuthProvider>
        <Navbar />
        <main className="app-main">
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/success" element={<OrderSuccess />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />

            {/* 🛡️ Rutas protegidas para admin */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute roleRequired="admin">
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="products" element={<ProductAdmin />} />
              <Route path="categories" element={<CategoryAdmin />} />
              <Route path="orders" element={<OrderAdmin />} />
              <Route path="users" element={<UserAdmin />} />
            </Route>
          </Routes>
        </main>
        <Footer />
        <ToastContainer position="top-right" autoClose={3000} />
      </AuthProvider>
    </div>
  );
}

export default App;
