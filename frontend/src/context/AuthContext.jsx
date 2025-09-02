// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

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
  const [loading, setLoading] = useState(true);

  // Cargar sesión al montar
  useEffect(() => {
    const loadSession = () => {
      try {
        const token = localStorage.getItem("token");
        const userItem = localStorage.getItem("user");

        if (token && userItem) {
          const parsedUser = JSON.parse(userItem);
          if (parsedUser && (parsedUser.id || parsedUser._id)) {
            setUser(parsedUser);
          } else {
            throw new Error("Usuario inválido");
          }
        }
      } catch (error) {
        console.error("Error al cargar sesión:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, []);

  // Login
  const login = useCallback((userData, token) => {
    if (!token) {
      console.error("❌ No se puede iniciar sesión sin token");
      return;
    }

    if (!userData || (!userData.id && !userData._id)) {
      console.error("❌ Usuario inválido:", userData);
      return;
    }

    const userToStore = {
      id: userData._id || userData.id,
      email: userData.email,
      role: userData.role || 'user',
      name: userData.name || ''
    };

    setUser(userToStore);
    localStorage.setItem("user", JSON.stringify(userToStore));
    localStorage.setItem("token", token);
  }, []);

  // Logout
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }, []);

  // Obtener token
  const getToken = useCallback(() => {
    return localStorage.getItem("token");
  }, []);

  const value = {
    user,
    login,
    logout,
    getToken,
    isAuthenticated: !!user,
    loading
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