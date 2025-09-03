// src/context/StoreContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

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
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [wishlist, setWishlist] = useState([]); // ✅ Wishlist

  const API_BASE = 'http://localhost:3001/api';

  // ✅ Persistencia: cargar wishlist desde localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('wishlist');
      if (saved) {
        setWishlist(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('No se pudo cargar la lista de deseos de localStorage');
    }
  }, []);

  // ✅ Persistencia: guardar en localStorage cuando cambia
  useEffect(() => {
    try {
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.warn('No se pudo guardar la lista de deseos en localStorage');
    }
  }, [wishlist]);

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
    if (loading.products) return;
    setLoading(prev => ({ ...prev, products: true }));
    try {
      const data = await fetchWithAuth('/products');
      const productsArray = Array.isArray(data) ? data : data.products || [];
      setProducts(productsArray);
      setFilteredProducts([]);
      setError(null);
    } catch (err) {
      if (products.length === 0) {
        setError(err.message);
      }
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
      console.warn('[StoreContext] No se pudieron cargar categorías:', err.message);
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

  // ✅ Limpia el filtro y la categoría seleccionada
  const clearFilter = useCallback(() => {
    setFilteredProducts([]);
    setSelectedCategory(null);
  }, []);

  // ✅ Filtra productos por categoría
  const filterByCategory = useCallback((categoryId) => {
    if (!categoryId) {
      clearFilter();
      return;
    }
    const filtered = products.filter(p => p.category?._id === categoryId);
    setFilteredProducts(filtered);
    setSelectedCategory(categoryId);
  }, [products, clearFilter]);

  // ✅ Wishlist: Añadir producto
  const addToWishlist = useCallback((product) => {
    setWishlist(prev => {
      if (prev.some(p => p._id === product._id)) return prev;
      return [...prev, product];
    });
  }, []);

  // ✅ Wishlist: Eliminar producto
  const removeFromWishlist = useCallback((productId) => {
    setWishlist(prev => prev.filter(p => p._id !== productId));
  }, []);

  // ✅ Wishlist: Verificar si un producto está en la lista
  const isProductInWishlist = useCallback((productId) => {
    return wishlist.some(p => p._id === productId);
  }, [wishlist]);

  // ✅ Carga inicial
  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchFeatured();
  }, []);

  const value = {
    // Datos
    products,
    categories,
    featured,
    filteredProducts,
    wishlist, // ✅ Expuesta

    // Estado
    loading,
    error,
    selectedCategory,

    // Funciones
    refreshProducts: fetchProducts,
    refreshCategories: fetchCategories,
    refreshFeatured: fetchFeatured,
    filterByCategory,
    clearFilter,
    getProductById: (id) => [...products, ...featured].find(p => p._id === id),

    // Wishlist
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isProductInWishlist,
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
};