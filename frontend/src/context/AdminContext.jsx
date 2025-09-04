// src/context/AdminContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const AdminContext = createContext(null);

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin debe usarse dentro de AdminProvider');
  return ctx;
};

// ---------------- Utilidades ----------------
const preparePayload = (payload) => {
  let isFormData = payload instanceof FormData;
  let bodyToSend = payload;

  if (!isFormData && typeof payload === 'object') {
    const hasFile = Object.values(payload).some(v => v instanceof File || v instanceof Blob);
    if (hasFile) {
      isFormData = true;
      const fd = new FormData();
      Object.entries(payload).forEach(([k, v]) => {
        if (v !== undefined && v !== null) fd.append(k, v);
      });
      bodyToSend = fd;
    }
  }

  return { body: bodyToSend, isFormData };
};

const extractData = (res) => {
  if (!res) return res;
  if (res.product) return res.product;
  if (res.products) return res.products;
  if (res.category) return res.category;
  if (res.categories) return res.categories;
  if (res.order) return res.order;
  if (res.orders) return res.orders;
  if (res.user) return res.user;
  if (res.users) return res.users;
  return res;
};

// ---------------- Provider ----------------
export const AdminProvider = ({ children }) => {
  const { getToken } = useAuth();
  const API_BASE = 'http://localhost:3001/api';

  // ----- Datos -----
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);

  // ----- Loading / Error -----
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const [errorProducts, setErrorProducts] = useState(null);
  const [errorCategories, setErrorCategories] = useState(null);
  const [errorOrders, setErrorOrders] = useState(null);
  const [errorUsers, setErrorUsers] = useState(null);

  const abortControllers = useRef([]);

  // ---------------- Fetch con auth ----------------
  const fetchWithAuth = useCallback(async (endpoint, options = {}) => {
    const token = getToken();
    if (!token) throw new Error('No autorizado. Inicia sesión nuevamente.');

    const controller = new AbortController();
    abortControllers.current.push(controller);

    const { method = 'GET', body = null, isFormData = false } = options;
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${token}`);
    if (!isFormData) headers.append('Content-Type', 'application/json');

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method,
        headers,
        body: body && method !== 'GET' ? (isFormData ? body : JSON.stringify(body)) : undefined,
        signal: controller.signal
      });

      if (!res.ok) {
        const text = await res.text();
        let error;
        try { error = JSON.parse(text)?.error || JSON.parse(text)?.message || text; } catch { error = text; }
        throw new Error(error || `HTTP ${res.status}`);
      }

      const contentType = res.headers.get('content-type');
      if (!contentType?.includes('application/json') || res.status === 204) return { success: true };
      return await res.json();
    } catch (err) {
      if (err.name === 'AbortError') return;
      const message = err.message.includes('Failed to fetch')
        ? '❌ No se pudo conectar al servidor. ¿Está corriendo el backend?'
        : err.message;
      throw new Error(message);
    } finally {
      abortControllers.current = abortControllers.current.filter(c => c !== controller);
    }
  }, [getToken]);

  // ---------------- Productos ----------------
  const loadProducts = useCallback(async () => {
    setLoadingProducts(true); setErrorProducts(null);
    try {
      const res = await fetchWithAuth('/products');
      const data = extractData(res);
      setProducts(Array.isArray(data) ? data : []);
      return data;
    } catch (err) {
      setErrorProducts(err.message || String(err));
      toast.error(`Error cargando productos: ${err.message || err}`);
      throw err;
    } finally { setLoadingProducts(false); }
  }, [fetchWithAuth]);

  const createProduct = useCallback(async (payload) => {
    setLoadingProducts(true);
    try {
      if (!payload.name || !payload.price) throw new Error('Nombre y precio son obligatorios');
      const { body, isFormData } = preparePayload(payload);
      const res = await fetchWithAuth('/products', { method: 'POST', body, isFormData });
      const prod = extractData(res);
      if (prod) setProducts(prev => [prod, ...prev]);
      toast.success('Producto creado');
      return prod;
    } catch (err) {
      toast.error(`Error al crear producto: ${err.message || err}`);
      console.error('createProduct error:', err);
      throw err;
    } finally { setLoadingProducts(false); }
  }, [fetchWithAuth]);

  const updateProduct = useCallback(async (id, payload) => {
    if (!id) throw new Error('ID requerido');
    setLoadingProducts(true);
    try {
      const { body, isFormData } = preparePayload(payload);
      const res = await fetchWithAuth(`/products/${id}`, { method: 'PUT', body, isFormData });
      const updated = extractData(res);
      if (updated) setProducts(prev => prev.map(p => p._id === id ? updated : p));
      toast.success('Producto actualizado');
      return updated;
    } catch (err) {
      toast.error(`Error al actualizar producto: ${err.message || err}`);
      throw err;
    } finally { setLoadingProducts(false); }
  }, [fetchWithAuth]);

  const deleteProduct = useCallback(async (id) => {
    if (!id) throw new Error('ID requerido');
    setLoadingProducts(true);
    try {
      await fetchWithAuth(`/products/${id}`, { method: 'DELETE' });
      setProducts(prev => prev.filter(p => p._id !== id));
      toast.success('Producto eliminado');
      return true;
    } catch (err) {
      toast.error(`Error al eliminar producto: ${err.message || err}`);
      throw err;
    } finally { setLoadingProducts(false); }
  }, [fetchWithAuth]);

  // ---------------- Categorías ----------------
  const loadCategories = useCallback(async () => {
    setLoadingCategories(true); setErrorCategories(null);
    try {
      const res = await fetchWithAuth('/categories');
      const data = extractData(res);
      setCategories(Array.isArray(data) ? data : []);
      return data;
    } catch (err) {
      setErrorCategories(err.message || String(err));
      toast.error(`Error cargando categorías: ${err.message || err}`);
      throw err;
    } finally { setLoadingCategories(false); }
  }, [fetchWithAuth]);

  const createCategory = useCallback(async (payload) => {
    setLoadingCategories(true);
    try {
      if (!payload.name || !payload.name.trim()) throw new Error('El nombre de la categoría es obligatorio');
      const { body, isFormData } = preparePayload(payload);
      const res = await fetchWithAuth('/categories', { method: 'POST', body, isFormData });
      const cat = extractData(res);
      if (cat) setCategories(prev => [...prev, cat]);
      toast.success('Categoría creada');
      return cat;
    } catch (err) {
      toast.error(`Error al crear categoría: ${err.message || err}`);
      console.error('createCategory error:', err);
      throw err;
    } finally { setLoadingCategories(false); }
  }, [fetchWithAuth]);

  const updateCategory = useCallback(async (id, payload) => {
    if (!id) throw new Error('ID requerido');
    setLoadingCategories(true);
    try {
      const { body, isFormData } = preparePayload(payload);
      const res = await fetchWithAuth(`/categories/${id}`, { method: 'PUT', body, isFormData });
      const updated = extractData(res);
      if (updated) setCategories(prev => prev.map(c => c._id === id ? updated : c));
      toast.success('Categoría actualizada');
      return updated;
    } catch (err) {
      toast.error(`Error al actualizar categoría: ${err.message || err}`);
      throw err;
    } finally { setLoadingCategories(false); }
  }, [fetchWithAuth]);

  const deleteCategory = useCallback(async (id) => {
    if (!id) throw new Error('ID requerido');
    setLoadingCategories(true);
    try {
      await fetchWithAuth(`/categories/${id}`, { method: 'DELETE' });
      setCategories(prev => prev.filter(c => c._id !== id));
      toast.success('Categoría eliminada');
      return true;
    } catch (err) {
      toast.error(`Error al eliminar categoría: ${err.message || err}`);
      throw err;
    } finally { setLoadingCategories(false); }
  }, [fetchWithAuth]);

  // ---------------- Órdenes ----------------
  const loadOrders = useCallback(async () => {
    setLoadingOrders(true); setErrorOrders(null);
    try {
      const res = await fetchWithAuth('/orders');
      const data = extractData(res);
      setOrders(Array.isArray(data) ? data : []);
      return data;
    } catch (err) {
      setErrorOrders(err.message || String(err));
      toast.error(`Error cargando órdenes: ${err.message || err}`);
      throw err;
    } finally { setLoadingOrders(false); }
  }, [fetchWithAuth]);

  const updateOrderStatus = useCallback(async (id, status) => {
    if (!id) throw new Error('ID requerido');
    setLoadingOrders(true);
    try {
      const res = await fetchWithAuth(`/orders/${id}/status`, { method: 'PATCH', body: { status } });
      const updated = extractData(res);
      if (updated) setOrders(prev => prev.map(o => o._id === id ? updated : o));
      toast.success('Estado de orden actualizado');
      return updated;
    } catch (err) {
      toast.error(`Error al actualizar orden: ${err.message || err}`);
      throw err;
    } finally { setLoadingOrders(false); }
  }, [fetchWithAuth]);

  const deleteOrder = useCallback(async (id) => {
    if (!id) throw new Error('ID requerido');
    setLoadingOrders(true);
    try {
      await fetchWithAuth(`/orders/${id}`, { method: 'DELETE' });
      setOrders(prev => prev.filter(o => o._id !== id));
      toast.success('Orden eliminada');
      return true;
    } catch (err) {
      toast.error(`Error al eliminar orden: ${err.message || err}`);
      throw err;
    } finally { setLoadingOrders(false); }
  }, [fetchWithAuth]);

  // ---------------- Usuarios ----------------
  const loadUsers = useCallback(async () => {
    setLoadingUsers(true); setErrorUsers(null);
    try {
      const res = await fetchWithAuth('/users');
      const data = extractData(res);
      setUsers(Array.isArray(data) ? data : []);
      return data;
    } catch (err) {
      setErrorUsers(err.message || String(err));
      toast.error(`Error cargando usuarios: ${err.message || err}`);
      throw err;
    } finally { setLoadingUsers(false); }
  }, [fetchWithAuth]);

  const changeUserRole = useCallback(async (id, role) => {
    if (!id) throw new Error('ID requerido');
    setLoadingUsers(true);
    try {
      const res = await fetchWithAuth(`/users/${id}/role`, { method: 'PUT', body: { role } });
      const updated = extractData(res);
      if (updated) setUsers(prev => prev.map(u => u._id === id ? updated : u));
      toast.success('Rol de usuario actualizado');
      return updated;
    } catch (err) {
      toast.error(`Error al cambiar rol: ${err.message || err}`);
      throw err;
    } finally { setLoadingUsers(false); }
  }, [fetchWithAuth]);

  const toggleUserActive = useCallback(async (id) => {
    if (!id) throw new Error('ID requerido');
    setLoadingUsers(true);
    try {
      const res = await fetchWithAuth(`/users/${id}/toggle`, { method: 'PATCH' });
      const updated = extractData(res);
      if (updated) setUsers(prev => prev.map(u => u._id === id ? updated : u));
      toast.success('Estado del usuario actualizado');
      return updated;
    } catch (err) {
      toast.error(`Error al activar/desactivar usuario: ${err.message || err}`);
      throw err;
    } finally { setLoadingUsers(false); }
  }, [fetchWithAuth]);

  // ---------------- Resumen y refresh ----------------
  const getAdminSummary = useCallback(async () => {
    try {
      const res = await fetchWithAuth('/admin/summary');
      return extractData(res);
    } catch (err) {
      toast.error(`Error al obtener resumen: ${err.message || err}`);
      throw err;
    }
  }, [fetchWithAuth]);

  const refreshAll = useCallback(async () => {
    await Promise.allSettled([loadCategories(), loadProducts(), loadOrders(), loadUsers()]);
  }, [loadCategories, loadProducts, loadOrders, loadUsers]);

  useEffect(() => {
    const token = getToken();
    if (token) refreshAll();
    return () => abortControllers.current.forEach(c => c.abort());
  }, [getToken, refreshAll]);

  // ---------------- Context value ----------------
  const value = {
    // Datos
    products, categories, orders, users,
    // Loading / Error
    loadingProducts, loadingCategories, loadingOrders, loadingUsers,
    errorProducts, errorCategories, errorOrders, errorUsers,
    // Productos
    loadProducts, createProduct, updateProduct, deleteProduct,
    // Categorías
    loadCategories, createCategory, updateCategory, deleteCategory,
    // Órdenes
    loadOrders, updateOrderStatus, deleteOrder,
    // Usuarios
    loadUsers, changeUserRole, toggleUserActive,
    // Misc
    getAdminSummary, refreshAll,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export default AdminContext;
