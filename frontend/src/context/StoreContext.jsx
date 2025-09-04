import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

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
  const [loading, setLoading] = useState({ products: false, categories: false, featured: false });
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [wishlist, setWishlist] = useState([]);

  const API_BASE = 'http://localhost:3001/api';

  // Persistencia de wishlist
  useEffect(() => {
    try {
      const saved = localStorage.getItem('wishlist');
      if (saved) setWishlist(JSON.parse(saved));
    } catch (e) {
      console.warn('No se pudo cargar la wishlist de localStorage');
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.warn('No se pudo guardar la wishlist en localStorage');
    }
  }, [wishlist]);

  const fetchWithAuth = useCallback(async (endpoint) => {
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      return await res.json();
    } catch (err) {
      const msg = err.message.includes('Failed to fetch')
        ? 'No se pudo conectar al servidor'
        : err.message;
      console.error(`[StoreContext] Error en ${endpoint}:`, msg);
      throw new Error(msg);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    if (loading.products) return;
    setLoading(prev => ({ ...prev, products: true }));
    try {
      const data = await fetchWithAuth('/products');
      setProducts(Array.isArray(data) ? data : data.products || []);
      setError(null);
    } catch (err) {
      if (products.length === 0) setError(err.message);
    } finally {
      setLoading(prev => ({ ...prev, products: false }));
    }
  }, [fetchWithAuth, loading.products, products.length]);

  const fetchCategories = useCallback(async () => {
    if (loading.categories) return;
    setLoading(prev => ({ ...prev, categories: true }));
    try {
      const data = await fetchWithAuth('/categories');
      setCategories(Array.isArray(data) ? data : data.categories || []);
    } catch (err) {
      console.warn('[StoreContext] No se pudieron cargar categorías:', err.message);
    } finally {
      setLoading(prev => ({ ...prev, categories: false }));
    }
  }, [fetchWithAuth, loading.categories]);

  const fetchFeatured = useCallback(async () => {
    if (loading.featured) return;
    setLoading(prev => ({ ...prev, featured: true }));
    try {
      const data = await fetchWithAuth('/products/featured');
      setFeatured(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn('[StoreContext] No se pudieron cargar productos destacados:', err.message);
      setFeatured([]);
    } finally {
      setLoading(prev => ({ ...prev, featured: false }));
    }
  }, [fetchWithAuth, loading.featured]);

  const filterByCategory = useCallback((categoryId) => {
    setSelectedCategory(categoryId || null);
  }, []);

  const clearFilter = useCallback(() => setSelectedCategory(null), []);

  const addToWishlist = useCallback((product) => {
    setWishlist(prev => prev.some(p => p._id === product._id) ? prev : [...prev, product]);
  }, []);

  const removeFromWishlist = useCallback((productId) => {
    setWishlist(prev => prev.filter(p => p._id !== productId));
  }, []);

  const isProductInWishlist = useCallback((productId) => {
    return wishlist.some(p => p._id === productId);
  }, [wishlist]);

  const filteredProducts = useMemo(() => {
    if (!selectedCategory) return products;
    return products.filter(p => p.category?._id === selectedCategory);
  }, [products, selectedCategory]);

  const getProductById = useCallback((id) => {
    return [...products, ...featured].find(p => p._id === id);
  }, [products, featured]);

  const contextValue = useMemo(() => ({
    products,
    categories,
    featured,
    filteredProducts,
    wishlist,
    loading,
    error,
    selectedCategory,
    refreshProducts: fetchProducts,
    refreshCategories: fetchCategories,
    refreshFeatured: fetchFeatured,
    filterByCategory,
    clearFilter,
    getProductById,
    addToWishlist,
    removeFromWishlist,
    isProductInWishlist,
  }), [
    products,
    categories,
    featured,
    filteredProducts,
    wishlist,
    loading,
    error,
    selectedCategory,
    fetchProducts,
    fetchCategories,
    fetchFeatured,
    filterByCategory,
    clearFilter,
    getProductById,
    addToWishlist,
    removeFromWishlist,
    isProductInWishlist,
  ]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchFeatured();
  }, [fetchProducts, fetchCategories, fetchFeatured]);

  return <StoreContext.Provider value={contextValue}>{children}</StoreContext.Provider>;
};
