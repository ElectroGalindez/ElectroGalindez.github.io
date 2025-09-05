import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

// Traducciones centralizadas
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

// Conversión de monedas y configuración de Intl
const currencies = {
  CUP: { rate: 1, locale: 'es-CU', symbol: 'CUP' },
  USD: { rate: 408, locale: 'en-US', symbol: 'USD' },
  EUR: { rate: 450, locale: 'en-IE', symbol: 'EUR' }
};

export const AppProvider = ({ children }) => {
  const [language, setLanguage] = useState('es');
  const [currency, setCurrency] = useState('CUP');

  // Cargar preferencias de localStorage de forma segura
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('appLanguage');
      const savedCurrency = localStorage.getItem('appCurrency');
      if (savedLang && translations[savedLang]) setLanguage(savedLang);
      if (savedCurrency && currencies[savedCurrency]) setCurrency(savedCurrency);
    } catch (err) {
      console.warn('No se pudo cargar preferencias de localStorage', err);
    }
  }, []);

  // Guardar preferencias en localStorage de forma segura
  useEffect(() => {
    try {
      localStorage.setItem('appLanguage', language);
      localStorage.setItem('appCurrency', currency);
    } catch (err) {
      console.warn('No se pudo guardar preferencias de localStorage', err);
    }
  }, [language, currency]);

  // Función para formatear precios
  const formatPrice = useCallback(
    (price) => {
      const { rate, locale, symbol } = currencies[currency] || currencies.CUP;
      const converted = price * rate;
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: symbol
      }).format(converted);
    },
    [currency]
  );

  // Función de traducción con fallback
  const t = useCallback(
    (key) => {
      return translations[language]?.[key] || translations['en'][key] || key;
    },
    [language]
  );

  const contextValue = useMemo(
    () => ({ language, setLanguage, currency, setCurrency, formatPrice, t }),
    [language, currency, formatPrice, t]
  );

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};
