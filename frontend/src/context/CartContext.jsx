import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { useApp } from "./AppContext";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart debe usarse dentro de un CartProvider");
  return context;
};

export function CartProvider({ children }) {
  const { user } = useAuth();
  const { formatPrice } = useApp();

  const [cart, setCart] = useState([]);

  // Generar key único por usuario para persistencia
  const storageKey = user ? `cart_${user.id}` : "cart_guest";

  // Cargar carrito desde localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(storageKey);
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) setCart(parsed);
      }
    } catch (error) {
      console.error("Error al cargar el carrito:", error);
      setCart([]);
    }
  }, [storageKey]);

  // Guardar carrito
  const saveCart = useCallback((newCart) => {
    setCart(newCart);
    try {
      localStorage.setItem(storageKey, JSON.stringify(newCart));
    } catch (error) {
      console.error("No se pudo guardar el carrito:", error);
    }
  }, [storageKey]);

  // Agregar producto (soporte variantes)
  const addToCart = useCallback((product, variant = {}) => {
    if (!product?._id || typeof product.price !== "number") {
      console.error("Producto inválido para el carrito:", product);
      return;
    }

    saveCart(prevCart => {
      const identifier = `${product._id}_${JSON.stringify(variant)}`;
      const index = prevCart.findIndex(item => item.identifier === identifier);

      if (index > -1) {
        const updated = [...prevCart];
        updated[index].quantity += 1;
        return updated;
      } else {
        return [
          ...prevCart,
          {
            identifier,
            id: product._id,
            name: product.name,
            price: product.price,
            variant,
            image: product.images?.[0] || "/placeholders/product.png",
            quantity: 1
          }
        ];
      }
    });
  }, [saveCart]);

  const removeFromCart = useCallback((identifier) => {
    saveCart(prevCart => prevCart.filter(item => item.identifier !== identifier));
  }, [saveCart]);

  const updateQuantity = useCallback((identifier, quantity) => {
    saveCart(prevCart => prevCart
      .map(item => item.identifier === identifier ? { ...item, quantity: Math.max(1, quantity) } : item)
      .filter(item => item.quantity > 0)
    );
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
    isEmpty,
    formatPrice: (price) => formatPrice(price)
  }), [cart, addToCart, removeFromCart, updateQuantity, clearCart, getTotal, getTotalItems, formatPrice]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}
