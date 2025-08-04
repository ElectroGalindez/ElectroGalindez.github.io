// src/components/ProductAdmin.jsx
import React, { useState, useMemo } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useStore } from '../../context/StoreContext';
import { FaEdit, FaTrash } from 'react-icons/fa';
import '../../styles/ProductAdmin.css';

const ProductAdmin = () => {
  const { products, deleteProduct, createProduct, updateProduct, loading } = useAdmin();
  const { categories } = useStore();
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image_url: '',
    category_id: '',
    id: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [formError, setFormError] = useState('');

  const safeProducts = Array.isArray(products) ? products : [];

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return safeProducts;
    return safeProducts.filter(p => {
      if (!p) return false;
      const nameMatch = p.name?.toLowerCase().includes(search.toLowerCase()) || false;
      const categoryMatch = p.category_id?.toString().includes(search) || false;
      const descMatch = p.description?.toLowerCase().includes(search.toLowerCase()) || false;
      return nameMatch || categoryMatch || descMatch;
    });
  }, [safeProducts, search]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const required = ['name', 'price', 'category_id'];
    const newErrors = {};
    required.forEach(field => {
      if (!formData[field]) newErrors[field] = 'Requerido';
    });
    if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Precio inválido';
    }
    setFormError('');
    if (Object.keys(newErrors).length > 0) {
      setFormError('Corrige los errores en el formulario.');
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      category_id: parseInt(formData.category_id),
    };

    if (isEditing) {
      updateProduct(productData.id, productData);
    } else {
      createProduct(productData);
    }

    setFormData({
      name: '',
      price: '',
      description: '',
      image_url: '',
      category_id: '',
      id: null,
    });
    setIsEditing(false);
  };

  const handleEdit = (product) => {
    setFormData({
      id: product.id,
      name: product.name || '',
      price: product.price ? product.price.toString() : '',
      description: product.description || '',
      image_url: product.image_url || '',
      category_id: product.category_id ? product.category_id.toString() : '',
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este producto? Esta acción no se puede deshacer.')) return;
    try {
      await deleteProduct(id);
      setError(null);
    } catch (err) {
      setError('Error al eliminar el producto.');
      console.error('Delete error:', err);
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(price || 0);

  if (loading) {
    return (
      <div className="product-admin loading">
        <div className="spinner"></div>
        <p>Cargando productos...</p>
      </div>
    );
  }

  return (
    <div className="product-admin">
      <header className="product-header">
        <h1>Gestión de Productos</h1>
        <p>Administra los productos de tu tienda: agrega, edita o elimina.</p>
      </header>

      {/* Formulario */}
      <section className="form-section">
        <h2>{isEditing ? 'Editar Producto' : 'Nuevo Producto'}</h2>
        {formError && <div className="alert error">{formError}</div>}

        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">Nombre</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nombre del producto"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">Precio (€)</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category_id">Categoría</label>
              <select
                id="category_id"
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar categoría</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="image_url">Imagen (URL)</label>
              <input
                type="url"
                id="image_url"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>
          </div>

          <div className="form-group full">
            <label htmlFor="description">Descripción</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Escribe una descripción detallada..."
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn primary">
              {isEditing ? 'Actualizar Producto' : 'Agregar Producto'}
            </button>
            {isEditing && (
              <button
                type="button"
                className="btn secondary"
                onClick={() => {
                  setFormData({
                    name: '',
                    price: '',
                    description: '',
                    image_url: '',
                    category_id: '',
                    id: null,
                  });
                  setIsEditing(false);
                }}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </section>

      {/* Lista de productos */}
      <section className="table-section">
        <div className="table-header">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="table-search"
          />
        </div>

        {error && <div className="alert error">{error}</div>}

        <div className="product-list">
          {filteredProducts.length === 0 ? (
            <div className="empty-state">
              <p>
                {safeProducts.length === 0
                  ? 'No hay productos disponibles. Agrega uno nuevo.'
                  : 'No se encontraron productos con ese criterio.'}
              </p>
            </div>
          ) : (
            filteredProducts.map((product) => {
              const category = categories?.find((c) => c.id === product.category_id);
              return (
                <div key={product.id} className="product-card">
                  <div className="product-image">
                    <img
                      src={product.image_url || '/placeholder.png'}
                      alt={product.name || 'Producto'}
                      onError={(e) => { e.target.src = '/placeholder.png'; }}
                    />
                  </div>
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p className="product-category">{category?.name || 'Sin categoría'}</p>
                    <p className="product-price">{formatPrice(product.price)}</p>
                    <p className="product-desc" title={product.description}>
                      {product.description || 'Sin descripción'}
                    </p>
                  </div>
                  <div className="product-actions">
                    <button
                      onClick={() => handleEdit(product)}
                      className="action-btn edit"
                      aria-label="Editar producto"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="action-btn delete"
                      aria-label="Eliminar producto"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
};

export default ProductAdmin;