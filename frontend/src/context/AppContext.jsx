import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

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

// Tasas de conversión (flexible para futuras monedas)
const conversionRates = {
  CUP: 1,
  USD: 0.041, // 1 CUP ≈ 0.041 USD
  EUR: 0.037
};

export const AppProvider = ({ children }) => {
  const [language, setLanguage] = useState('es');
  const [currency, setCurrency] = useState('CUP');

  // Cargar preferencias al montar
  useEffect(() => {
    const savedLang = localStorage.getItem('appLanguage');
    const savedCurrency = localStorage.getItem('appCurrency');
    if (savedLang) setLanguage(savedLang);
    if (savedCurrency) setCurrency(savedCurrency);
  }, []);

  // Guardar preferencias cuando cambien
  useEffect(() => {
    localStorage.setItem('appLanguage', language);
    localStorage.setItem('appCurrency', currency);
  }, [language, currency]);

  // Formateo de precios
  const formatPrice = useCallback(
    (price) => {
      const rate = conversionRates[currency] || 1;
      const converted = price * rate;
      return new Intl.NumberFormat(language === 'es' ? 'es-CU' : 'en-US', {
        style: 'currency',
        currency
      }).format(converted);
    },
    [currency, language]
  );

  // Traducciones
  const t = useCallback(
    (key) => {
      return translations[language]?.[key] || translations['en'][key] || key;
    },
    [language]
  );

  const contextValue = useMemo(() => ({
    language,
    setLanguage,
    currency,
    setCurrency,
    formatPrice,
    t
  }), [language, currency, formatPrice, t]);

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};
