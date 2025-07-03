import React, { useState, useEffect } from 'react';
import "../../styles/AdminSection.css";

function ProductAdmin() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: '',
    price: '',
    description: '',
    category_id: '',
    image_url: '', // para enlaces externos
    image_file: null // para archivos locales
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/products')
      .then((res) => res.json())
      .then((data) => setProducts(data.products));

    fetch('http://localhost:3001/api/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'image_file') {
      setForm({ ...form, image_file: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('price', form.price);
    formData.append('description', form.description);
    formData.append('category_id', form.category_id);
    
    if (form.image_url) {
      formData.append('image_url', form.image_url); // preferencia por URL
    }

    if (form.image_file) {
      formData.append('image_file', form.image_file); // soporte para imagen desde dispositivo
    }

    try {
      const res = await fetch('http://localhost:3001/api/products', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        alert('Producto agregado');
        setProducts([...products, data.product]);
        setForm({
          name: '',
          price: '',
          description: '',
          category_id: '',
          image_url: '',
          image_file: null
        });
      } else {
        alert(data.message || 'Error al crear producto');
      }
    } catch (err) {
      console.error('Error al agregar producto:', err);
    }
  };

  return (
    <div className="admin-panel">
      <h2>Administrar Productos</h2>
      <form onSubmit={handleSubmit} className="admin-form" encType="multipart/form-data">
        <input
          type="text"
          name="name"
          value={form.name}
          placeholder="Nombre"
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          value={form.price}
          placeholder="Precio"
          step="0.01"
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          value={form.description}
          placeholder="Descripción"
          onChange={handleChange}
          required
        ></textarea>

        <select
          name="category_id"
          value={form.category_id}
          onChange={handleChange}
          required
        >
          <option value="">Seleccionar categoría</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <label>URL de imagen (opcional):</label>
        <input
          type="text"
          name="image_url"
          value={form.image_url}
          placeholder="https://ejemplo.com/imagen.jpg"
          onChange={handleChange}
        />

        <label>O selecciona imagen desde tu dispositivo:</label>
        <input
          type="file"
          name="image_file"
          accept="image/*"
          onChange={handleChange}
        />

        <button type="submit">Agregar producto</button>
      </form>

      <div className="product-list">
        {products.map((p) => (
          <div key={p.id} className="product-card">
            <img src={p.image_url} alt={p.name} />
            <h4>{p.name}</h4>
            <p>{p.description}</p>
            <span>${p.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductAdmin;
