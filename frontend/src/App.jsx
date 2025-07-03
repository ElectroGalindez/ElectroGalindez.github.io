// App.jsx    
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
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/AuthContext"; 
import "./styles/App.css"; 

function App() {
  return (
    <div className="app-layout">
      <AuthProvider>
        <div className="app-layout">
          <Navbar />
          <main className="app-main">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/success" element={<OrderSuccess />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute roleRequired="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
          <Footer />
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </AuthProvider>
    </div>) ;
  }
export default App;
