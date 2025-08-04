// src/context/StoreContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";

const StoreContext = createContext();

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore debe usarse dentro de un StoreProvider");
  }
  return context;
};

// Hook personalizado para fetch reutilizable
const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(url, options);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const json = await response.json();
        
        if (isMounted) {
          setData(json);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
        console.error(`Error fetching ${url}:`, err);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [url, options]);

  return { data, loading, error };
};

export const StoreProvider = ({ children }) => {
  const { user } = useAuth();

  // Cargar categorías
  const {
    data: categories = [],
    loading: categoriesLoading,
    error: categoriesError
  } = useFetch('http://localhost:3001/api/categories');

  // Cargar ofertas destacadas (ejemplo futuro)
  const {
    data: featuredOffers = [],
    loading: offersLoading
  } = useFetch('http://localhost:3001/api/offers/featured');

  // Estado global de la tienda
  const storeValue = {
    // Datos
    categories,
    featuredOffers,

    // Estados de carga
    loading: categoriesLoading || offersLoading,
    error: categoriesError,

    // Usuario
    user,

    // Funciones útiles (futuro)
    refreshCategories: () => window.location.reload(), // O implementar re-fetch
  };

  return (
    <StoreContext.Provider value={storeValue}>
      {children}
    </StoreContext.Provider>
  );
};