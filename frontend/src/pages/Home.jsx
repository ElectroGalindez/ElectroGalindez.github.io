// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import CategoryFilter from '../components/CategoryFilter';
import FeaturedProducts from '../components/FeaturedProducts';

function Home() {
  const [products, setProducts] = useState([]);

  const loadProducts = async (categoryId = null) => {
    let url = 'http://localhost:3001/api/products';
    if (categoryId) url += `?category_id=${categoryId}`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error('Error al cargar productos filtrados:', err);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div>
      <Hero />
      <CategoryFilter onSelectCategory={loadProducts} />
      <FeaturedProducts products={products} />
    </div>
  );
}

export default Home;
