// src/utils/auth.js
export const getToken = () => {
  return localStorage.getItem("token");
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

export const isAuthenticated = () => {
  const token = getToken();
  const user = getCurrentUser();
  return !!(token && user);
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};