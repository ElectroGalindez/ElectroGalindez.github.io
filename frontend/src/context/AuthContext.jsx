// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

// Creamos el contexto de autenticación
const AuthContext = createContext();

// Hook para usar el contexto
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Cargar el usuario al inicio si hay en el localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser)); // Cargamos el usuario desde el localStorage
    }
  }, []);

  // Función de login
  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData)); // Guardamos el usuario
    localStorage.setItem("token", token); // Guardamos el token
  };

  // Función de logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
