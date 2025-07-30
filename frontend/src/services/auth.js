// src/utils/auth.js

// Función para obtener el token del localStorage
export const getToken = () => {
  return localStorage.getItem("token");
};

// Función para obtener el usuario actual
export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

// Función para verificar si el usuario está autenticado
export const isAuthenticated = () => {
  const token = getToken();
  const user = getCurrentUser();
  return !!(token && user);
};

// Función para limpiar sesión
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};