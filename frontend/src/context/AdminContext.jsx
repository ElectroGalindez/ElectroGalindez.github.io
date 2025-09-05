// src/context/AdminContext.jsx
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const AdminContext = createContext(null);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin debe usarse dentro de AdminProvider');
  return context;
};

export const AdminProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const { getToken } = useAuth();
  const API_BASE = 'http://localhost:3001/api';

  // ---------------- Fetch con Auth ----------------
  const fetchWithAuth = useCallback(async (endpoint, options = {}) => {
    const { method = 'GET', body = null, isFormData = false } = options;
    const token = getToken();
    if (!token) throw new Error('No autorizado. Inicia sesión nuevamente.');

    const headers = new Headers();
    headers.append('Authorization', `Bearer ${token}`);
    if (!isFormData) headers.append('Content-Type', 'application/json');

    const url = `${API_BASE}${endpoint}`;
    const config = {
      method,
      headers,
      body: body && method !== 'GET' ? (isFormData ? body : JSON.stringify(body)) : undefined,
    };

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        const errorText = await response.text();
        let error;
        try {
          const errorJson = JSON.parse(errorText);
          error = errorJson.error || errorJson.message || `HTTP ${response.status}`;
        } catch {
          error = errorText;
        }
        throw new Error(error);
      }
      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json') || response.status === 204) return { success: true };
      return await response.json();
    } catch (err) {
      const message = err.message.includes('Failed to fetch')
        ? '❌ No se pudo conectar al servidor. ¿Está corriendo en http://localhost:3001?'
        : `❌ ${err.message}`;
      toast.error(message);
      throw new Error(message);
    }
  }, [getToken]);

  // ---------------- Carga inicial ----------------
  // ---------------- Carga inicial ----------------
  const refreshAll = useCallback(async () => {
    setLoading(true);
    try {
      const [catsRes, prodsRes, ordsRes, usersRes] = await Promise.allSettled([
        fetchWithAuth('/categories'),
        fetchWithAuth('/products'),
        fetchWithAuth('/orders'),
        fetchWithAuth('/users'),
      ]);

      // Categorías
      setCategories(Array.isArray(catsRes?.value?.categories) ? catsRes.value.categories :
                    Array.isArray(catsRes?.value) ? catsRes.value : []);

      // Productos
      const productsArray = Array.isArray(prodsRes?.value?.products) ? prodsRes.value.products :
                            Array.isArray(prodsRes?.value) ? prodsRes.value : [];
      setProducts(productsArray);

      // Órdenes
      setOrders(Array.isArray(ordsRes?.value?.orders) ? ordsRes.value.orders :
                Array.isArray(ordsRes?.value) ? ordsRes.value : []);

      // Usuarios
      setUsers(Array.isArray(usersRes?.value?.users) ? usersRes.value.users :
              Array.isArray(usersRes?.value) ? usersRes.value : []);

    } catch (err) {
      toast.error('Error al cargar datos del admin');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [fetchWithAuth]);


  // ---------------- Productos ----------------
  const createProduct = useCallback(async (productData) => {
    const isFormData = productData instanceof FormData;
    const name = isFormData ? productData.get('name') : productData?.name;
    if (!name?.trim()) throw new Error('El nombre es requerido');

    try {
      const data = await fetchWithAuth('/products', { method: 'POST', body: productData, isFormData });
      const product = data.product || data;
      setProducts(prev => Array.isArray(prev) ? [...prev, product] : [product]);
      toast.success('Producto creado correctamente');
      return product;
    } catch (err) {
      toast.error(err.message || 'Error al crear producto');
      throw err;
    }
  }, [fetchWithAuth]);

  const updateProduct = useCallback(async (id, productData) => {
    if (!id) throw new Error('ID requerido');
    const isFormData = productData instanceof FormData;

    try {
      const data = await fetchWithAuth(`/products/${id}`, { method: 'PUT', body: productData, isFormData });
      const product = data.product || data;
      setProducts(prev => Array.isArray(prev) ? prev.map(p => (p._id === id ? product : p)) : [product]);
      toast.success('Producto actualizado correctamente');
      return product;
    } catch (err) {
      toast.error(err.message || 'Error al actualizar producto');
      throw err;
    }
  }, [fetchWithAuth]);

  const deleteProduct = useCallback(async (id) => {
    if (!id) throw new Error('ID requerido');
    try {
      await fetchWithAuth(`/products/${id}`, { method: 'DELETE' });
      setProducts(prev => Array.isArray(prev) ? prev.filter(p => p._id !== id) : []);
      toast.success('Producto eliminado correctamente');
    } catch (err) {
      toast.error(err.message || 'Error al eliminar producto');
      throw err;
    }
  }, [fetchWithAuth]);

  // ---------------- Categorías ----------------
  const createCategory = useCallback(async (categoryData) => {
    const isFormData = categoryData instanceof FormData;
    const name = isFormData ? categoryData.get('name') : categoryData?.name;
    if (!name?.trim()) throw new Error('El nombre es requerido');

    try {
      const data = await fetchWithAuth('/categories', { method: 'POST', body: categoryData, isFormData });
      const category = data.category || data;
      setCategories(prev => Array.isArray(prev) ? [...prev, category] : [category]);
      toast.success('Categoría creada correctamente');
      return category;
    } catch (err) {
      toast.error(err.message || 'Error al crear categoría');
      throw err;
    }
  }, [fetchWithAuth]);

  const updateCategory = useCallback(async (id, categoryData) => {
    if (!id) throw new Error('ID requerido');
    const isFormData = categoryData instanceof FormData;
    try {
      const data = await fetchWithAuth(`/categories/${id}`, { method: 'PUT', body: categoryData, isFormData });
      const category = data.category || data;
      setCategories(prev => Array.isArray(prev) ? prev.map(c => (c._id === id ? category : c)) : [category]);
      toast.success('Categoría actualizada correctamente');
      return category;
    } catch (err) {
      toast.error(err.message || 'Error al actualizar categoría');
      throw err;
    }
  }, [fetchWithAuth]);

  const deleteCategory = useCallback(async (id) => {
    if (!id) throw new Error('ID requerido');
    try {
      await fetchWithAuth(`/categories/${id}`, { method: 'DELETE' });
      setCategories(prev => Array.isArray(prev) ? prev.filter(c => c._id !== id) : []);
      toast.success('Categoría eliminada correctamente');
    } catch (err) {
      toast.error(err.message || 'Error al eliminar categoría');
      throw err;
    }
  }, [fetchWithAuth]);

  // ---------------- Órdenes ----------------
  const updateOrderStatus = useCallback(async (id, status) => {
    if (!id || !status) throw new Error('ID y estado requeridos');
    try {
      const data = await fetchWithAuth(`/orders/${id}/status`, { method: 'PUT', body: { status } });
      const order = data.order || data;
      setOrders(prev => Array.isArray(prev) ? prev.map(o => (o._id === id ? order : o)) : [order]);
      toast.success('Estado de orden actualizado');
      return order;
    } catch (err) {
      toast.error(err.message || 'Error al actualizar orden');
      throw err;
    }
  }, [fetchWithAuth]);

  const deleteOrder = useCallback(async (id) => {
    if (!id) throw new Error('ID requerido');
    try {
      await fetchWithAuth(`/orders/${id}`, { method: 'DELETE' });
      setOrders(prev => Array.isArray(prev) ? prev.filter(o => o._id !== id) : []);
      toast.success('Orden eliminada correctamente');
    } catch (err) {
      toast.error(err.message || 'Error al eliminar orden');
      throw err;
    }
  }, [fetchWithAuth]);

  // ---------------- Usuarios ----------------
  const updateUserRole = useCallback(async (id, role) => {
    if (!id || !['user', 'admin'].includes(role)) throw new Error('ID o rol inválido');
    try {
      const data = await fetchWithAuth(`/users/${id}/role`, { method: 'PUT', body: { role } });
      const user = data.user || data;
      setUsers(prev => Array.isArray(prev) ? prev.map(u => (u._id === id ? user : u)) : [user]);
      toast.success('Rol de usuario actualizado');
      return user;
    } catch (err) {
      toast.error(err.message || 'Error al actualizar rol de usuario');
      throw err;
    }
  }, [fetchWithAuth]);

  // ---------------- Dashboard ----------------
  const getAdminSummary = useCallback(async () => {
    try {
      return await fetchWithAuth('/admin/summary');
    } catch (err) {
      toast.error('Error al obtener resumen del admin');
      throw err;
    }
  }, [fetchWithAuth]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  return (
    <AdminContext.Provider value={{
      products,
      categories,
      orders,
      users,
      loading,
      refreshAll,
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
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export default AdminContext;
