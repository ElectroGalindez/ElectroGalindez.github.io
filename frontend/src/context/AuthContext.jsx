import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return context;
};

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar sesión desde localStorage
  const loadSession = useCallback(() => {
    try {
      const token = localStorage.getItem("token");
      const userItem = localStorage.getItem("user");
      if (token && userItem) {
        const parsedUser = JSON.parse(userItem);
        if (parsedUser && (parsedUser.id || parsedUser._id)) {
          setUser(parsedUser);
        } else throw new Error("Usuario inválido");
      }
    } catch (error) {
      console.warn("Error al cargar sesión:", error);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => loadSession(), [loadSession]);

  // Login
  const login = useCallback((userData, token) => {
    if (!token) return console.error("❌ No se puede iniciar sesión sin token");
    if (!userData || (!userData.id && !userData._id)) return console.error("❌ Usuario inválido", userData);

    const userToStore = {
      id: userData._id || userData.id,
      email: userData.email,
      role: userData.role || 'user',
      name: userData.name || '',
      permissions: userData.permissions || [] // opcional para roles avanzados
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
    navigate("/login");
  }, [navigate]);

  // Obtener token
  const getToken = useCallback(() => localStorage.getItem("token"), []);

  // Verificar autenticación antes de acción (ej. compra)
  const requireAuthForPurchase = useCallback(
    (onAuthorized) => {
      if (user) return onAuthorized();
      const confirmed = window.confirm(
        "Debes iniciar sesión para agregar productos al carrito.\n\n¿Quieres ir a iniciar sesión?"
      );
      if (confirmed) navigate("/login");
    },
    [user, navigate]
  );

  // Verificar permisos específicos
  const hasPermission = useCallback(
    (perm) => user?.permissions?.includes(perm),
    [user]
  );

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      getToken,
      isAuthenticated: !!user,
      loading,
      requireAuthForPurchase,
      hasPermission
    }),
    [user, login, logout, getToken, loading, requireAuthForPurchase, hasPermission]
  );

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="auth-loading" aria-live="polite">Cargando sesión...</div>
      ) : children}
    </AuthContext.Provider>
  );
}
