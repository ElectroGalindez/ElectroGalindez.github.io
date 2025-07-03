// src/context/StoreContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Cargar categorías una vez al inicio
  useEffect(() => {
    fetch("http://localhost:3001/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error cargando categorías:", err));
  }, []);

  return (
    <StoreContext.Provider value={{ categories, user, setUser }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
