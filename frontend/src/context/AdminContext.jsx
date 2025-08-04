// src/context/AdminContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin debe usarse dentro de un AdminProvider");
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const { getToken } = useAuth();
  const API_BASE = "http://localhost:3001/api";

  // === Función genérica para peticiones autenticadas ===
  const fetchWithAuth = async (endpoint, method = "GET", body = null) => {
    setLoading(true);
    try {
      const token = getToken();
      if (!token) throw new Error("No autorizado. Inicia sesión nuevamente.");

      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      };

      const options = {
        method,
        headers,
        ...(body && { body: JSON.stringify(body) }),
      };

      const response = await fetch(`${API_BASE}${endpoint}`, options);
      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.error || data.message || `Error ${response.status}`;
        throw new Error(errorMsg);
      }

      return data;
    } catch (error) {
      const message = error.message.includes("Failed to fetch")
        ? "No se pudo conectar al servidor. Verifica tu conexión o que el backend esté corriendo en http://localhost:3001"
        : error.message;

      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // === Cargar productos ===
  const loadProducts = async () => {
    try {
      const data = await fetchWithAuth("/products");
      const productsArray = Array.isArray(data) ? data : data.products || [];
      setProducts(productsArray);
    } catch (error) {
      console.error("Error al cargar productos:", error);
      setProducts([]);
    }
  };

  // === Cargar categorías ===
  const loadCategories = async () => {
    try {
      const data = await fetchWithAuth("/categories");
      const categoriesArray = Array.isArray(data) ? data : data.categories || [];
      setCategories(categoriesArray);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
      setCategories([]);
    }
  };

  // === Cargar órdenes (con items completos) ===
  const loadOrders = async () => {
    try {
      const data = await fetchWithAuth("/orders");
      const ordersArray = Array.isArray(data) ? data : data.orders || [];

      const ordersWithItems = await Promise.all(
        ordersArray.map(async (order) => {
          if (!order.items) {
            try {
              const detail = await fetchWithAuth(`/orders/${order._id || order.id}`);
              return { ...order, items: detail.items || [] };
            } catch (err) {
              console.warn(`No se pudieron cargar los items de la orden ${order._id || order.id}`);
              return { ...order, items: [] };
            }
          }
          return order;
        })
      );

      setOrders(ordersWithItems);
    } catch (err) {
      console.error("Error al cargar órdenes:", err);
      setOrders([]);
    }
  };

  // === Cargar usuarios ===
  const loadUsers = async () => {
    try {
      const data = await fetchWithAuth("/users");
      const usersArray = Array.isArray(data) ? data : data.users || [];
      setUsers(usersArray);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      setUsers([]);
    }
  };

  // === CRUD: Productos ===
  const createProduct = async (productData) => {
    try {
      const newProduct = await fetchWithAuth("/products", "POST", productData);
      const product = newProduct.product || newProduct;
      setProducts(prev => [...prev, product]);
      toast.success("✅ Producto creado");
      return product;
    } catch (error) {
      throw error;
    }
  };

  const updateProduct = async (id, productData) => {
    try {
      const updated = await fetchWithAuth(`/products/${id}`, "PUT", productData);
      const product = updated.product || updated;
      setProducts(prev => prev.map(p => (p._id === id || p.id === id ? product : p)));
      toast.info("✏️ Producto actualizado");
      return product;
    } catch (error) {
      throw error;
    }
  };

  const deleteProduct = async (id) => {
    try {
      await fetchWithAuth(`/products/${id}`, "DELETE");
      setProducts(prev => prev.filter(p => p._id === id || p.id !== id));
      toast.success("🗑️ Producto eliminado");
    } catch (error) {
      throw error;
    }
  };

  // === CRUD: Categorías ===
  const createCategory = async (name) => {
    try {
      const newCategory = await fetchWithAuth("/categories", "POST", { name });
      const category = newCategory.category || newCategory;
      setCategories(prev => [...prev, category]);
      toast.success("✅ Categoría creada");
      return category;
    } catch (error) {
      throw error;
    }
  };

  const updateCategory = async (id, name) => {
    try {
      const updated = await fetchWithAuth(`/categories/${id}`, "PUT", { name });
      const category = updated.category || updated;
      setCategories(prev => prev.map(c => (c._id === id || c.id === id ? category : c)));
      toast.info("✏️ Categoría actualizada");
      return category;
    } catch (error) {
      throw error;
    }
  };

  const deleteCategory = async (id) => {
    try {
      await fetchWithAuth(`/categories/${id}`, "DELETE");
      setCategories(prev => prev.filter(c => c._id === id || c.id !== id));
      toast.success("🗑️ Categoría eliminada");
    } catch (error) {
      throw error;
    }
  };

  // === CRUD: Órdenes ===
  const updateOrderStatus = async (id, status) => {
    try {
      const updated = await fetchWithAuth(`/orders/${id}/status`, "PUT", { status });
      const order = updated.order || updated;
      setOrders(prev => prev.map(o => (o._id === id || o.id === id ? order : o)));
      toast.info(`✅ Orden #${id} actualizada a "${status}"`);
      return order;
    } catch (err) {
      throw err;
    }
  };

  const deleteOrder = async (id) => {
    try {
      await fetchWithAuth(`/orders/${id}`, "DELETE");
      setOrders(prev => prev.filter(o => o._id === id || o.id !== id));
      toast.success(`🗑️ Orden #${id} eliminada`);
    } catch (err) {
      toast.error(`Error al eliminar orden #${id}`);
      throw err;
    }
  };

  // === Carga inicial ===
  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  // === Valor del contexto ===
  const value = {
    // Datos
    products,
    categories,
    orders,
    users,
    loading,

    // Cargadores
    loadOrders,
    loadUsers,

    // Productos
    createProduct,
    updateProduct,
    deleteProduct,

    // Categorías
    createCategory,
    updateCategory,
    deleteCategory,

    // Órdenes
    updateOrderStatus,
    deleteOrder,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};