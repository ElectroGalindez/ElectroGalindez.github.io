import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { useStore } from './StoreContext';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const { imagesCache } = useStore();
  const [cart, setCart] = useState([]);

  // --- Cargar carrito desde localStorage ---
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem(user ? `cart_${user.id}` : 'cart_guest');
      if (storedCart) setCart(JSON.parse(storedCart));
    } catch (error) {
      console.error('Error al cargar el carrito:', error);
      setCart([]);
    }
  }, [user]);

  // --- Guardar carrito en localStorage ---
  useEffect(() => {
    try {
      localStorage.setItem(user ? `cart_${user.id}` : 'cart_guest', JSON.stringify(cart));
    } catch (error) {
      console.error('Error al guardar el carrito:', error);
    }
  }, [cart, user]);

  // --- Agregar producto al carrito ---
  const addToCart = useCallback((product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item._id === product._id);
      if (existing) {
        return prev.map(item =>
          item._id === product._id
            ? { ...item, quantity: Math.max(1, item.quantity + quantity) }
            : item
        );
      }
      return [...prev, { ...product, quantity: Math.max(1, quantity) }];
    });
  }, []);

  // --- Quitar producto del carrito ---
  const removeItem = useCallback((productId) => {
    setCart(prev => prev.filter(item => item._id !== productId));
  }, []);

  // --- Vaciar carrito ---
  const clearCart = useCallback(() => setCart([]), []);

  // --- Total del carrito ---
  const getTotal = useCallback(() => {
    return cart.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 1), 0);
  }, [cart]);

  // --- Obtener imagen del producto ---
  const getProductImage = useCallback((product) => {
    if (!product) return '/placeholders/product.png';

    // 1️⃣ Desde imagesCache
    if (product._id && imagesCache?.[product._id]?.src) {
      return imagesCache[product._id].src;
    }

    // 2️⃣ Desde array images
    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images[0];
    }

    // 3️⃣ Desde campo image individual
    if (product.image) return product.image;

    // 4️⃣ Fallback general
    return '/placeholders/product.png';
  }, [imagesCache]);

  const value = useMemo(() => ({
    cart,
    addToCart,
    removeItem,
    clearCart,
    getTotal,
    getProductImage 
  }), [cart, addToCart, removeItem, clearCart, getTotal, getProductImage]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
