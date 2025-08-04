// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Evita renderizado prematuro

  // Cargar usuario desde localStorage al montar
  useEffect(() => {
    const loadSession = () => {
      try {
        const userItem = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (token && userItem) {
          // Validar que el token no esté expirado (opcional)
          if (isTokenExpired(token)) {
            logout();
            setLoading(false);
            return;
          }

          const parsedUser = JSON.parse(userItem);
          // Validar estructura mínima del usuario
          if (parsedUser && (parsedUser.id || parsedUser._id)) {
            setUser(parsedUser);
            console.log("✅ Sesión recuperada:", parsedUser.email || parsedUser.name);
          } else {
            throw new Error("Usuario inválido en localStorage");
          }
        } else {
          console.log("ℹ️ No hay sesión activa");
        }
      } catch (error) {
        console.error("❌ Error al cargar la sesión:", error);
        // Limpiar datos corruptos
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, []);

  // Verificar si el token JWT está expirado
  const isTokenExpired = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp ? payload.exp * 1000 < Date.now() : false;
    } catch (e) {
      return true; // Si no se puede decodificar, asumimos que está inválido
    }
  };

  // Inicio de sesión
  const login = useCallback((userData, token) => {
    if (!token) {
      console.error("❌ No se puede iniciar sesión sin token");
      return;
    }

    // Validar estructura mínima del usuario
    if (!userData || (!userData.id && !userData._id)) {
      console.error("❌ Usuario inválido:", userData);
      return;
    }

    const userToStore = {
      id: userData._id || userData.id,
      name: userData.name,
      email: userData.email,
      phone: userData.phone || '',
      role: userData.role || 'customer'
    };

    setUser(userToStore);
    localStorage.setItem("user", JSON.stringify(userToStore));
    localStorage.setItem("token", token);

    console.log("✅ Usuario autenticado:", userToStore.email);
  }, []);

  // Cierre de sesión
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    console.log("👋 Sesión cerrada");
  }, []);

  // Obtener token
  const getToken = useCallback(() => {
    return localStorage.getItem("token");
  }, []);

  // Estado de autenticación
  const isAuthenticated = !!user;

  // Exponer funciones para llamadas API seguras
  const apiCall = useCallback(async (url, options = {}) => {
    const token = getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };

    try {
      const response = await fetch(url, { ...options, headers });
      if (response.status === 401) {
        logout();
        throw new Error('Sesión expirada');
      }
      return response;
    } catch (error) {
      console.error("Error en llamada API:", error);
      throw error;
    }
  }, [getToken, logout]);

  const value = {
    user,
    login,
    logout,
    getToken,
    isAuthenticated,
    loading,
    apiCall // Útil para llamadas seguras en otros componentes
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="auth-loading" aria-live="polite">Cargando sesión...</div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}