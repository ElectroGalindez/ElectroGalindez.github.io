import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { useApp } from "./AppContext";
import { useAuth } from "./AuthContext";

const StoreContext = createContext();

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore debe usarse dentro de StoreProvider");
  return context;
};

export const StoreProvider = ({ children }) => {
  const { formatPrice } = useApp();
  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState({ products: false, categories: false });
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [wishlist, setWishlist] = useState([]);

  const API_BASE = "http://localhost:3001/api";

  // --- Wishlist persistente ---
  const storageKey = user ? `wishlist_${user.id}` : "wishlist_guest";

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) setWishlist(JSON.parse(saved));
    } catch (e) {
      console.warn("No se pudo cargar la wishlist:", e);
    }
  }, [storageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(wishlist));
    } catch (e) {
      console.warn("No se pudo guardar la wishlist:", e);
    }
  }, [wishlist, storageKey]);

  // --- Fetch seguro ---
  const fetchWithAuth = useCallback(async (endpoint) => {
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, { headers: { "Content-Type": "application/json" } });
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      return await res.json();
    } catch (err) {
      const msg = err.message.includes("Failed to fetch") ? "No se pudo conectar al servidor" : err.message;
      console.error(`[StoreContext] Error en ${endpoint}:`, msg);
      throw new Error(msg);
    }
  }, []);

  // --- Fetch de productos y categorías ---
  const fetchProducts = useCallback(async () => {
    if (loading.products) return;
    setLoading(prev => ({ ...prev, products: true }));
    try {
      const data = await fetchWithAuth("/products");
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
      const data = await fetchWithAuth("/categories");
      setCategories(Array.isArray(data) ? data : data.categories || []);
    } catch (err) {
      console.warn("[StoreContext] No se pudieron cargar categorías:", err.message);
    } finally {
      setLoading(prev => ({ ...prev, categories: false }));
    }
  }, [fetchWithAuth, loading.categories]);

  // --- Filtrado por categoría ---
  const filterByCategory = useCallback((categoryId) => setSelectedCategory(categoryId || null), []);
  const clearFilter = useCallback(() => setSelectedCategory(null), []);

  // --- Wishlist ---
  const addToWishlist = useCallback((product) => {
    setWishlist(prev => prev.some(p => p._id === product._id) ? prev : [...prev, product]);
  }, []);

  const removeFromWishlist = useCallback((productId) => {
    setWishlist(prev => prev.filter(p => p._id !== productId));
  }, []);

  const isProductInWishlist = useCallback((productId) => wishlist.some(p => p._id === productId), [wishlist]);

  // --- Productos filtrados por categoría ---
  const filteredProducts = useMemo(() => {
    if (!selectedCategory) return products;
    return products.filter(p => p.category?._id === selectedCategory);
  }, [products, selectedCategory]);

  // --- Obtener producto por ID ---
  const getProductById = useCallback((id) => products.find(p => p._id === id), [products]);

  // --- Ofertas manuales ---
  const OFFER_IDS = [
    "64f9a2c5e5a1f23b8c123abc",
    "64f9a2c5e5a1f23b8c123def",
    "64f9a2c5e5a1f23b8c123789"
  ];

  const offers = useMemo(() => products.filter(p => OFFER_IDS.includes(p._id)), [products]);

  // --- Formateo de precios ---
  const formatProductPrice = useCallback((price) => formatPrice(price), [formatPrice]);

  // --- Contexto final ---
  const contextValue = useMemo(() => ({
    products,
    categories,
    filteredProducts,
    offers,
    wishlist,
    loading,
    error,
    selectedCategory,
    refreshProducts: fetchProducts,
    refreshCategories: fetchCategories,
    filterByCategory,
    clearFilter,
    getProductById,
    addToWishlist,
    removeFromWishlist,
    isProductInWishlist,
    formatProductPrice
  }), [
    products, categories, filteredProducts, offers,
    wishlist, loading, error, selectedCategory,
    fetchProducts, fetchCategories,
    filterByCategory, clearFilter,
    getProductById, addToWishlist, removeFromWishlist,
    isProductInWishlist, formatProductPrice
  ]);

  return <StoreContext.Provider value={contextValue}>{children}</StoreContext.Provider>;
};
