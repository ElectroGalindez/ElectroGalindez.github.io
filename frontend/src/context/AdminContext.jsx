import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";

export const AdminContext = createContext();
export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { getToken } = useAuth();

  const API_BASE = "http://localhost:3001/api";

  // Función genérica para peticiones autenticadas
  const fetchWithAuth = async (endpoint, method = "GET", body = null) => {
    setLoading(true);
    try {
      const token = getToken();
      const headers = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      };

      const options = {
        method,
        headers,
        ...(body && { body: JSON.stringify(body) }),
      };

      const response = await fetch(`${API_BASE}${endpoint}`, options);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Error ${response.status}`);
      }

      return data; // Devuelve los datos tal cual
    } catch (error) {
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Cargar productos: acepta { products: [...] } o [...]
  const loadProducts = async () => {
    try {
      const data = await fetchWithAuth("/products");
      const productsArray = Array.isArray(data) ? data : (data.products || []);
      setProducts(productsArray);
    } catch (error) {
      console.error("Error al cargar productos:", error);
      setProducts([]);
    }
  };

  // Cargar categorías: acepta { categories: [...] } o [...]
  const loadCategories = async () => {
    try {
      const data = await fetchWithAuth("/categories");
      const categoriesArray = Array.isArray(data) ? data : (data.categories || []);
      setCategories(categoriesArray);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
      setCategories([]);
    }
  };

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  // CRUD de productos
  const createProduct = async (productData) => {
    try {
      const data = await fetchWithAuth("/products", "POST", productData);
      const newProduct = data.product || data; 
      setProducts(prev => [...prev, newProduct]);
      toast.success("✅ Producto creado");
      return newProduct;
    } catch (error) {
      throw error;
    }
  };

  const updateProduct = async (id, productData) => {
    try {
      const data = await fetchWithAuth(`/products/${id}`, "PUT", productData);
      const updatedProduct = data.product || data;
      setProducts(prev => prev.map(p => (p.id === id ? updatedProduct : p)));
      toast.info("✏️ Producto actualizado");
      return updatedProduct;
    } catch (error) {
      throw error;
    }
  };

  const deleteProduct = async (id) => {
    try {
      await fetchWithAuth(`/products/${id}`, "DELETE");
      setProducts(prev => prev.filter(p => p.id !== id));
      toast.success("🗑️ Producto eliminado");
    } catch (error) {
      throw error;
    }
  };

  // CRUD de categorías
  const createCategory = async (name) => {
    try {
      const newCategory = await fetchWithAuth("/categories", "POST", { name });
      setCategories(prev => [...prev, newCategory]);
      toast.success("✅ Categoría creada");
      return newCategory;
    } catch (error) {
      throw error;
    }
  };

  const updateCategory = async (id, name) => {
    try {
      const updated = await fetchWithAuth(`/categories/${id}`, "PUT", { name });
      setCategories(prev => prev.map(c => (c.id === id ? updated : c)));
      toast.info("✏️ Categoría actualizada");
      return updated;
    } catch (error) {
      throw error;
    }
  };
  
  const deleteCategory = async (id) => {
    try {
      await fetchWithAuth(`/categories/${id}`, "DELETE");
      setCategories(prev => prev.filter(c => c.id !== id));
      toast.success("🗑️ Categoría eliminada");
    } catch (error) {
      throw error;
    }
  };

  // CRUD de órdenes
const loadOrders = async () => {
  try {
    const data = await fetchWithAuth("/orders");
    const ordersArray = Array.isArray(data) ? data : (data.orders || []);
    
    // Asegurar que cada orden tenga `items`
    const ordersWithItems = await Promise.all(
      ordersArray.map(async (order) => {
        if (!order.items) {
          try {
            const detail = await fetchWithAuth(`/orders/${order.id}`);
            return { ...order, items: detail.items };
          } catch (err) {
            console.warn(`No se pudo cargar items para orden ${order.id}`);
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
const loadUsers = async () => {
    try {
      const data = await fetchWithAuth("/users");
      const usersArray = Array.isArray(data) ? data : (data.users || []);
      setUsers(usersArray);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      setUsers([]);
    }
};
const updateOrderStatus = async (id, status) => {
  try {
    const updated = await fetchWithAuth(`/orders/${id}/status`, "PUT", { status });
    setOrders(prev => prev.map(o => (o.id === id ? updated : o)));
    toast.info(`✅ Orden #${id} actualizada a "${status}"`);
    return updated;
  } catch (err) {
    throw err;
  }
};

const deleteOrder = async (id) => {
  try {
    await fetchWithAuth(`/orders/${id}`, "DELETE");
    setOrders(prev => prev.filter(o => o.id !== id));
    toast.success(`🗑️ Orden #${id} eliminada`);
  } catch (err) {
    toast.error(`Error al eliminar orden #${id}`);
    throw err;
  }
};
  
  return (
    <AdminContext.Provider
      value={{
        // Datos
        products,
        categories,
        orders,
        users,
        loading,

        // Productos
        createProduct,
        updateProduct,
        deleteProduct,

        // Categorías
        createCategory,
        updateCategory,
        deleteCategory,

        // Órdenes y usuarios
        loadOrders,
        loadUsers,
        updateOrderStatus,
        deleteOrder,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};