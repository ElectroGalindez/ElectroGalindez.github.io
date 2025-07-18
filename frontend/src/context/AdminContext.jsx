import React, { createContext, useState, useEffect, useContext } from 'react';

export const AdminContext = createContext();
export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);

  const API_BASE = 'http://localhost:3001';

  const fetchAllData = async () => {
    try {
      const [prodRes, catRes, orderRes] = await Promise.all([
        fetch(`${API_BASE}/api/products`),
        fetch(`${API_BASE}/api/categories`),
        fetch(`${API_BASE}/api/orders`)
      ]);

      if (!prodRes.ok || !catRes.ok || !orderRes.ok) {
        throw new Error('Error fetching data');
      }

      const prodData = await prodRes.json();
      const catData = await catRes.json();
      const orderData = await orderRes.json();

      // Aquí ajusta según la estructura de tu API
      // Si la API devuelve { data: [...] }, extrae data
      setProducts(prodData.products || []);
      setCategories(catData.categories || []);
      setOrders(orderData.orders || []);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // CRUD de productos
  const createProduct = async (product) => {
    try {
      const res = await fetch(`${API_BASE}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      if (!res.ok) throw new Error('Error creating product');
      const newProduct = await res.json();
      setProducts((prev) => [...prev, newProduct]);
    } catch (error) {
      console.error(error);
    }
  };

  const updateProduct = async (id, product) => {
    try {
      const res = await fetch(`${API_BASE}/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      if (!res.ok) throw new Error('Error updating product');
      const updated = await res.json();
      setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
    } catch (error) {
      console.error(error);
    }
  };

  const deleteProduct = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/products/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Error deleting product');
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  // CRUD de categorías
  const createCategory = async (category) => {
    try {
      const res = await fetch(`${API_BASE}/api/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(category),
      });
      if (!res.ok) throw new Error('Error creating category');
      const newCategory = await res.json();
      setCategories((prev) => [...prev, newCategory]);
    } catch (error) {
      console.error(error);
    }
  };

  const updateCategory = async (id, category) => {
    try {
      const res = await fetch(`${API_BASE}/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(category),
      });
      if (!res.ok) throw new Error('Error updating category');
      const updated = await res.json();
      setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)));
    } catch (error) {
      console.error(error);
    }
  };

  const deleteCategory = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/categories/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Error deleting category');
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  // Órdenes
  const updateOrderStatus = async (id, status) => {
    try {
      const res = await fetch(`${API_BASE}/api/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Error updating order status');
      const updated = await res.json();
      setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AdminContext.Provider
      value={{
        products,
        categories,
        orders,
        fetchAllData,
        createProduct,
        updateProduct,
        deleteProduct,
        createCategory,
        updateCategory,
        deleteCategory,
        updateOrderStatus,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
