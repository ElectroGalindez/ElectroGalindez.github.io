// context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Evita renderizado prematuro

  useEffect(() => {
    const loadUser = () => {
      try {
        const userItem = localStorage.getItem("user");
        if (userItem) {
          const parsedUser = JSON.parse(userItem);
          setUser(parsedUser);
          console.log("Usuario cargado desde localStorage:", parsedUser);
        } else {
          console.log("No hay usuario en localStorage");
        }
      } catch (err) {
        console.error("Error al cargar usuario de localStorage:", err);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    console.log("Usuario logueado:", userData);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    console.log("Usuario deslogueado");
  };

  const getToken = () => {
    return localStorage.getItem("token");
  };

  const value = {
    user,
    login,
    logout,
    getToken,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <div className="auth-loading">Cargando sesión...</div> : children}
    </AuthContext.Provider>
  );
}