// src/context/CartContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from "react";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de un CartProvider");
  }
  return context;
};

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Cargar carrito desde localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) {
          setCart(parsed);
        } else {
          setCart([]);
        }
      }
    } catch (error) {
      console.error("Error al cargar el carrito:", error);
      setCart([]);
    }
  }, []);

  // Guardar en localStorage
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (error) {
      console.error("No se pudo guardar el carrito:", error);
    }
  }, [cart]);

  // Añadir producto al carrito
  const addToCart = useCallback((product) => {
    if (!product?._id || product.price == null) {
      console.error("Producto inválido para el carrito:", product);
      return;
    }

    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(item => item.id === product._id);

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1
        };
        return updated;
      } else {
        return [
          ...prevCart,
          {
            id: product._id,
            name: product.name,
            price: product.price,
            image: product.images?.[0] || '/placeholders/product.png',
            quantity: 1
          }
        ];
      }
    });
  }, []);

  // Eliminar producto
  const removeFromCart = useCallback((productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  }, []);

  // Actualizar cantidad
  const updateQuantity = useCallback((productId, quantity) => {
    setCart(prevCart => {
      const updated = prevCart.map(item =>
        item.id === productId
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      );
      return updated.filter(item => item.quantity > 0);
    });
  }, []);

  // Vaciar carrito
  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // Calcular total
  const getTotal = useCallback(() => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [cart]);

  // Contar items
  const getTotalItems = useCallback(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // Verificar si está vacío
  const isEmpty = cart.length === 0;

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotal,
      getTotalItems,
      isEmpty
    }}>
      {children}
    </CartContext.Provider>
  );
}