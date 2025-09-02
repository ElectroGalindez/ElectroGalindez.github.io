// src/context/StoreContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const StoreContext = createContext();

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore debe usarse dentro de StoreProvider');
  return context;
};

export const StoreProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState({
    products: false,
    categories: false,
    featured: false
  });
  const [error, setError] = useState(null);

  const API_BASE = 'http://localhost:3001/api';

  const fetchWithAuth = async (endpoint) => {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (err) {
      const message = err.message.includes('Failed to fetch')
        ? 'No se pudo conectar al servidor'
        : err.message;

      console.error(`[StoreContext] Error en ${endpoint}:`, message);
      throw new Error(message);
    }
  };

  const fetchProducts = async () => {
    if (loading.products) return; // ✅ Evita llamadas duplicadas
    setLoading(prev => ({ ...prev, products: true }));
    try {
      const data = await fetchWithAuth('/products');
      const productsArray = Array.isArray(data) ? data : data.products || [];
      setProducts(productsArray);
      setFilteredProducts([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(prev => ({ ...prev, products: false }));
    }
  };

  const fetchCategories = async () => {
    if (loading.categories) return;
    setLoading(prev => ({ ...prev, categories: true }));
    try {
      const data = await fetchWithAuth('/categories');
      const categoriesArray = Array.isArray(data) ? data : data.categories || [];
      setCategories(categoriesArray);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(prev => ({ ...prev, categories: false }));
    }
  };

  const fetchFeatured = async () => {
    if (loading.featured) return;
    setLoading(prev => ({ ...prev, featured: true }));
    try {
      const data = await fetchWithAuth('/products/featured');
      const featuredArray = Array.isArray(data) ? data : [];
      setFeatured(featuredArray);
    } catch (err) {
      console.warn('[StoreContext] No se pudieron cargar productos destacados:', err.message);
      setFeatured([]);
    } finally {
      setLoading(prev => ({ ...prev, featured: false }));
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchFeatured();
  }, []);

  const value = {
    products,
    categories,
    featured,
    filteredProducts,
    loading,
    error,
    refreshProducts: fetchProducts,
    refreshCategories: fetchCategories,
    refreshFeatured: fetchFeatured,
    filterByCategory: (categoryId) => {
      if (!categoryId) {
        setFilteredProducts([]);
        return;
      }
      const filtered = products.filter(p => p.category?._id === categoryId);
      setFilteredProducts(filtered);
    },
    getProductById: (id) => [...products, ...featured].find(p => p._id === id)
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
};