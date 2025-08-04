// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import CategoryFilter from '../components/CategoryFilter';
import FeaturedProducts from '../components/FeaturedProducts';
import '../styles/Home.css'; // Opcional: estilos de layout


function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = async (categoryId = null) => {
    setLoading(true);
    let url = 'http://localhost:3001/api/products';
    if (categoryId) url += `?category_id=${categoryId}`;

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Error al cargar productos');
      const data = await res.json();
      setProducts(data.products || data || []);
    } catch (err) {
      console.error('Error al cargar productos:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <main className="home-page">
      {/* Hero - Slider de ofertas */}
      <section className="hero-section">
        <Hero />
      </section>

      {/* Filtro de categorías */}
      <section className="filter-section">
        <CategoryFilter onSelectCategory={loadProducts} />
      </section>

      {/* Productos destacados */}
      <section className="featured-section">
        <FeaturedProducts products={products} loading={loading} />
      </section>
    </main>
  );
}

export default Home;