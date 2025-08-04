// src/pages/PublicLayout.jsx
import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/PublicLayout.css';

export default function PublicLayout() {
  const [theme, setTheme] = useState('light');

  // Cargar tema desde localStorage o preferencia del sistema
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
  }, []);

  // Escuchar cambios de tema (puedes usar un Context si lo prefieres)
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <div className="app-container" data-theme={theme}>
      <Navbar />
      <main className="app-main" id="main-content" role="main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}