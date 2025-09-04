import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart debe usarse dentro de un CartProvider");
  return context;
};

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Cargar carrito
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) setCart(parsed);
      }
    } catch (error) {
      console.error("Error al cargar el carrito:", error);
      setCart([]);
    }
  }, []);

  // Guardar carrito
  const saveCart = useCallback((newCart) => {
    setCart(newCart);
    try {
      localStorage.setItem("cart", JSON.stringify(newCart));
    } catch (error) {
      console.error("No se pudo guardar el carrito:", error);
    }
  }, []);

  const addToCart = useCallback((product) => {
    if (!product?._id || typeof product.price !== "number") {
      console.error("Producto inválido para el carrito:", product);
      return;
    }

    saveCart(prevCart => {
      const index = prevCart.findIndex(item => item.id === product._id);
      if (index > -1) {
        const updated = [...prevCart];
        updated[index].quantity += 1;
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
  }, [saveCart]);

  const removeFromCart = useCallback((productId) => {
    saveCart(prevCart => prevCart.filter(item => item.id !== productId));
  }, [saveCart]);

  const updateQuantity = useCallback((productId, quantity) => {
    saveCart(prevCart => {
      return prevCart
        .map(item => item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item)
        .filter(item => item.quantity > 0);
    });
  }, [saveCart]);

  const clearCart = useCallback(() => saveCart([]), [saveCart]);

  const getTotal = useCallback(() => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [cart]);

  const getTotalItems = useCallback(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const isEmpty = cart.length === 0;

  const contextValue = useMemo(() => ({
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotal,
    getTotalItems,
    isEmpty
  }), [cart, addToCart, removeFromCart, updateQuantity, clearCart, getTotal, getTotalItems, isEmpty]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}
