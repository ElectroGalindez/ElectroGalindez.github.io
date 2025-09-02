// src/context/AdminContext.jsx
import { createContext, useContext, useState, useCallback, useEffect } from "react";
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

  // === Función segura para peticiones autenticadas ===
  const fetchWithAuth = useCallback(
    async (endpoint, method = "GET", body = null, isFormData = false) => {
      try {
        const token = getToken();
        if (!token) {
          throw new Error("No autorizado. Inicia sesión nuevamente.");
        }

        const headers = new Headers();
        headers.append("Authorization", `Bearer ${token}`);
        if (!isFormData) {
          headers.append("Content-Type", "application/json");
        }

        // ✅ Mostrar lo que se está enviando
        console.log(`[AdminContext] Llamando a: ${API_BASE}${endpoint}`, {
          method,
          isFormData,
          body: isFormData ? '[FormData]' : body
        });

        const options = {
          method,
          headers,
          body: body && method !== "GET" ? (isFormData ? body : JSON.stringify(body)) : undefined,
        };

        const response = await fetch(`${API_BASE}${endpoint}`, options);

        // ✅ Verificar si la solicitud fue bloqueada por CORS
        if (!response) {
          throw new Error("No se recibió respuesta. Posible bloqueo de CORS");
        }

        // Manejo de respuestas sin contenido
        if (response.status === 204 || !response.headers.get("content-length")) {
          return {};
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text();
          console.error("[AdminContext] Respuesta no JSON:", text);
          throw new Error(`Respuesta inesperada: ${text.substring(0, 100)}...`);
        }

        const data = await response.json();

        if (!response.ok) {
          const errorMsg = data.error || data.message || `Error ${response.status}`;
          console.error("[AdminContext] Error en respuesta:", errorMsg, data);
          throw new Error(errorMsg);
        }

        return data;
      } catch (error) {
        const message = error.message.includes("Failed to fetch")
          ? "❌ No se pudo conectar al servidor. ¿Está corriendo en http://localhost:3001? Verifica el backend y CORS."
          : error.message;

        console.error(`[AdminContext] Error en ${endpoint}:`, message);
        throw new Error(message);
      }
    },
    [getToken]
  );

  // === Cargar todos los datos del admin ===
  const loadAllData = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    try {
      const [cats, prods, ords, usrs] = await Promise.allSettled([
        fetchWithAuth("/categories"),
        fetchWithAuth("/products"),
        fetchWithAuth("/orders"),
        fetchWithAuth("/users")
      ]);

      if (cats.status === 'fulfilled') {
        const data = cats.value;
        setCategories(Array.isArray(data) ? data : data.categories || []);
      } else {
        toast.error(`❌ Error al cargar categorías: ${cats.reason.message}`);
        setCategories([]);
      }

      if (prods.status === 'fulfilled') {
        const data = prods.value;
        setProducts(Array.isArray(data) ? data : data.products || []);
      } else {
        toast.error(`❌ Error al cargar productos: ${prods.reason.message}`);
        setProducts([]);
      }

      if (ords.status === 'fulfilled') {
        const data = ords.value;
        const ordersArray = Array.isArray(data) ? data : data.orders || [];
        setOrders(ordersArray);
      } else {
        toast.error(`❌ Error al cargar órdenes: ${ords.reason.message}`);
        setOrders([]);
      }

      if (usrs.status === 'fulfilled') {
        const data = usrs.value;
        setUsers(Array.isArray(data) ? data : data.users || []);
      } else {
        toast.error(`❌ Error al cargar usuarios: ${usrs.reason.message}`);
        setUsers([]);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  }, [fetchWithAuth]);

  // === CRUD: Productos ===
  const createProduct = useCallback(
    async (productData) => {
      // ✅ Validar que los campos esenciales existan
      let name, price, category;

      if (productData instanceof FormData) {
        name = productData.get("name")?.trim();
        price = productData.get("price");
        category = productData.get("category");
      } else {
        name = productData.name?.trim();
        price = productData.price;
        category = productData.category;
      }

      if (!name) {
        toast.error("⚠️ El nombre es requerido");
        return null;
      }
      if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
        toast.error("⚠️ El precio es inválido");
        return null;
      }
      if (!category) {
        toast.error("⚠️ La categoría es requerida");
        return null;
      }

      try {
        const isFormData = productData instanceof FormData;
        const data = await fetchWithAuth("/products", "POST", productData, isFormData);
        const product = data.product || data;

        setProducts(prev => [...prev, product]);
        toast.success("✅ Producto creado");
        return product;
      } catch (error) {
        toast.error(`❌ Error al crear producto: ${error.message}`);
        throw error;
      }
    },
    [fetchWithAuth]
  );

  const updateProduct = useCallback(
    async (id, productData) => {
      if (!id) throw new Error("ID requerido");

      try {
        const isFormData = productData instanceof FormData;
        const data = await fetchWithAuth(`/products/${id}`, "PUT", productData, isFormData);
        const product = data.product || data;

        setProducts(prev => prev.map(p => (p._id === id ? product : p)));
        toast.info("✏️ Producto actualizado");
        return product;
      } catch (error) {
        toast.error(`❌ Error al actualizar producto: ${error.message}`);
        throw error;
      }
    },
    [fetchWithAuth]
  );

  const deleteProduct = useCallback(
    async (id) => {
      if (!id) throw new Error("ID requerido");
      if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;

      try {
        await fetchWithAuth(`/products/${id}`, "DELETE");
        setProducts(prev => prev.filter(p => p._id !== id));
        toast.success("🗑️ Producto eliminado");
        await loadAllData();
      } catch (error) {
        toast.error(`❌ Error al eliminar producto: ${error.message}`);
        throw error;
      }
    },
    [fetchWithAuth, loadAllData]
  );

  // === CRUD: Categorías ===
  const createCategory = useCallback(
    async (categoryData) => {
      const name = categoryData instanceof FormData 
        ? categoryData.get("name")?.trim() 
        : categoryData?.name?.trim();

      if (!name) {
        toast.error("⚠️ El nombre es requerido");
        return null;
      }

      try {
        const isFormData = categoryData instanceof FormData;
        const data = await fetchWithAuth("/categories", "POST", categoryData, isFormData);
        const category = data.category || data;

        setCategories(prev => [...prev, category]);
        toast.success("✅ Categoría creada");
        return category;
      } catch (error) {
        toast.error(`❌ Error al crear categoría: ${error.message}`);
        throw error;
      }
    },
    [fetchWithAuth]
  );

  const updateCategory = useCallback(
    async (id, categoryData) => {
      if (!id) throw new Error("ID requerido");

      try {
        const isFormData = categoryData instanceof FormData;
        const data = await fetchWithAuth(`/categories/${id}`, "PUT", categoryData, isFormData);
        const category = data.category || data;

        setCategories(prev => prev.map(c => (c._id === id ? category : c)));
        toast.info("✏️ Categoría actualizada");
        return category;
      } catch (error) {
        toast.error(`❌ Error al actualizar categoría: ${error.message}`);
        throw error;
      }
    },
    [fetchWithAuth]
  );

  const deleteCategory = useCallback(
    async (id) => {
      if (!id) throw new Error("ID requerido");
      if (!window.confirm("¿Seguro que deseas eliminar esta categoría?")) return;

      try {
        await fetchWithAuth(`/categories/${id}`, "DELETE");
        setCategories(prev => prev.filter(c => c._id !== id));
        toast.success("🗑️ Categoría eliminada");
        await loadAllData();
      } catch (error) {
        toast.error(`❌ Error al eliminar categoría: ${error.message}`);
        throw error;
      }
    },
    [fetchWithAuth, loadAllData]
  );

  // === CRUD: Órdenes y Usuarios ===
  // (sin cambios, ya están bien)

  const updateOrderStatus = useCallback(
    async (id, status) => {
      if (!id || !status) throw new Error("ID y estado requeridos");
      try {
        const updated = await fetchWithAuth(`/orders/${id}/status`, "PUT", { status });
        const order = updated.order || updated;
        setOrders(prev => prev.map(o => (o._id === id ? order : o)));
        toast.info(`✅ Orden #${id} actualizada a "${status}"`);
        return order;
      } catch (err) {
        toast.error(`❌ Error al actualizar orden: ${err.message}`);
        throw err;
      }
    },
    [fetchWithAuth]
  );

  const deleteOrder = useCallback(
    async (id) => {
      if (!id) throw new Error("ID requerido");
      if (!window.confirm("¿Seguro que deseas eliminar esta orden?")) return;
      try {
        await fetchWithAuth(`/orders/${id}`, "DELETE");
        setOrders(prev => prev.filter(o => o._id !== id));
        toast.success(`🗑️ Orden #${id} eliminada`);
        await loadAllData();
      } catch (err) {
        toast.error(`❌ Error al eliminar orden: ${err.message}`);
        throw err;
      }
    },
    [fetchWithAuth, loadAllData]
  );

  const updateUserRole = useCallback(
    async (id, role) => {
      if (!id || !["user", "admin"].includes(role)) {
        toast.error("⚠️ ID o rol inválido");
        return;
      }
      try {
        const updated = await fetchWithAuth(`/users/${id}/role`, "PUT", { role });
        const user = updated.user || updated;
        setUsers(prev => prev.map(u => (u._id === id ? user : u)));
        toast.info(`✅ Rol de usuario actualizado a "${role}"`);
        return user;
      } catch (err) {
        toast.error(`❌ Error al cambiar rol: ${err.message}`);
        throw err;
      }
    },
    [fetchWithAuth]
  );

  const getAdminSummary = useCallback(async () => {
    try {
      const summary = await fetchWithAuth("/admin/summary");
      return summary;
    } catch (error) {
      toast.error(`❌ Error al obtener resumen: ${error.message}`);
      return null;
    }
  }, [fetchWithAuth]);

  // ✅ Cargar datos al montar
  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const value = {
    products,
    categories,
    orders,
    users,
    loading,
    loadAllData,
    createProduct,
    updateProduct,
    deleteProduct,
    createCategory,
    updateCategory,
    deleteCategory,
    updateOrderStatus,
    deleteOrder,
    updateUserRole,
    getAdminSummary,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export default AdminContext;