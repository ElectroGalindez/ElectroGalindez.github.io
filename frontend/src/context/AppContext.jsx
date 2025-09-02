// src/context/AppContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

export const AppProvider = ({ children }) => {
  const [language, setLanguage] = useState('es');
  const [currency, setCurrency] = useState('CUP');

  useEffect(() => {
    const savedLang = localStorage.getItem('appLanguage');
    const savedCurrency = localStorage.getItem('appCurrency');
    if (savedLang) setLanguage(savedLang);
    if (savedCurrency) setCurrency(savedCurrency);
  }, []);

  useEffect(() => {
    localStorage.setItem('appLanguage', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('appCurrency', currency);
  }, [currency]);

  const formatPrice = (price) => {
    const usdPrice = currency === 'USD' ? price : price * 24; // Conversión CUP → USD
    return new Intl.NumberFormat('es-CU', {
      style: 'currency',
      currency: currency
    }).format(usdPrice);
  };

  const t = (key) => {
    const translations = {
      es: {
        cart: 'Carrito',
        total: 'Total',
        addToCart: '+ Carrito',
        soldOut: 'Agotado',
        price: 'Precio',
        description: 'Descripción',
        contact: 'Contacto',
        offers: 'Ofertas',
        newArrivals: 'Novedades',
        allProducts: 'Todos los productos',
        help: 'Ayuda',
        aboutUs: 'Sobre nosotros'
      },
      en: {
        cart: 'Cart',
        total: 'Total',
        addToCart: '+ Cart',
        soldOut: 'Sold out',
        price: 'Price',
        description: 'Description',
        contact: 'Contact',
        offers: 'Offers',
        newArrivals: 'New Arrivals',
        allProducts: 'All Products',
        help: 'Help',
        aboutUs: 'About Us'
      }
    };
    return translations[language]?.[key] || key;
  };

  return (
    <AppContext.Provider value={{ language, setLanguage, currency, setCurrency, formatPrice, t }}>
      {children}
    </AppContext.Provider>
  );
};