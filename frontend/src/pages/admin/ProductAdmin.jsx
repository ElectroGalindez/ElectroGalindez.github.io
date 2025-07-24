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

  // Formulario
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

  // Asegurar productos
  const safeProducts = Array.isArray(products) ? products : [];

  // Filtrar productos
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

  // Cambiar input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Validar formulario
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
      setFormError('Corrige los errores');
      return false;
    }

    return true;
  };

  // Enviar formulario
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

  // Editar producto
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

  // Eliminar producto
  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este producto?')) return;
    try {
      await deleteProduct(id);
      setError(null);
    } catch (err) {
      setError('Error al eliminar el producto');
      console.error('Delete error:', err);
    }
  };

  // Formatear precio
  const formatPrice = (price) =>
    new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
    }).format(price || 0);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Cargando productos...</p>
      </div>
    );
  }

  return (
    <div className="product-admin">
      <h1 className="dashboard-title">Gestión de Productos</h1>
      <p className="dashboard-description">
        Administra los productos de tu tienda, agrega nuevos, edita o elimina los existentes.
      </p>

      {/* Formulario */}
      <div className="form-section">
        <h2 className="form-title">{isEditing ? 'Editar Producto' : 'Nuevo Producto'}</h2>

        {formError && <p className="form-error">{formError}</p>}

        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-row">
            <div className="form-group">
              <label>Nombre</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nombre del producto"
              />
            </div>
            <div className="form-group">
              <label>Precio</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Categoría</label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
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
              <label>Imagen (URL)</label>
              <input
                type="url"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                placeholder="https://ejemplo.com/imagen.jpg "
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full">
              <label>Descripción</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                placeholder="Escribe una descripción..."
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {isEditing ? 'Actualizar Producto' : 'Agregar Producto'}
            </button>
            {isEditing && (
              <button
                type="button"
                className="btn btn-secondary"
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
      </div>

      {/* Tabla de productos */}
      <div className="table-section">
        <div className="table-header">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="table-search"
          />
        </div>

        {error && <div className="dashboard-error">⚠️ {error}</div>}

        <div className="table-wrapper">
          <table className="product-table">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Descripción</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">
                    {safeProducts.length === 0
                      ? 'No hay productos disponibles'
                      : 'No se encontraron productos con ese criterio'}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const category = categories?.find((c) => c.id === product.category_id);

                  return (
                    <tr key={product.id} className="product-row">
                      <td className="product-image-cell">
                        <img
                          src={product.image_url || '/placeholder.png'}
                          alt={product.name || 'Producto'}
                          onError={(e) => {
                            e.target.src = '/placeholder.png';
                          }}
                          className="product-thumbnail"
                        />
                      </td>
                      <td>{product.name}</td>
                      <td>{category ? category.name : 'Sin categoría'}</td>
                      <td>{formatPrice(product.price)}</td>
                      <td className="product-description">{product.description || 'Sin descripción'}</td>
                      <td className="product-actions">
                        <button
                          onClick={() => handleEdit(product)}
                          className="action-button edit"
                          aria-label="Editar producto"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="action-button delete"
                          aria-label="Eliminar producto"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductAdmin;