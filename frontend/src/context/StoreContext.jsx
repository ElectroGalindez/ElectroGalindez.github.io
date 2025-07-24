import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/categories');
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error cargando categorías:", error.message);
      }
    };

    fetchCategories();
  }, []);

  return (
    <StoreContext.Provider value={{ categories, user }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);