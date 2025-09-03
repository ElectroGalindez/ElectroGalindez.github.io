// src/components/admin/ProductAdmin.jsx
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { FaEdit, FaTrash, FaImage, FaLink, FaPlus, FaBoxOpen } from 'react-icons/fa';
import '../../styles/ProductAdmin.css';

const ProductAdmin = () => {
  const {
    products,
    categories,
    createProduct,
    updateProduct,
    deleteProduct,
    loading
  } = useAdmin();

  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    price: '',
    description: '',
    image_url: '',
    category_id: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // ✅ Validación de datos
  const safeProducts = Array.isArray(products) ? products : [];
  const safeCategories = Array.isArray(categories) ? categories : [];

  // ✅ Filtrado optimizado
  const filteredProducts = useMemo(() => {
    if (!search.trim()) return safeProducts;
    const term = search.toLowerCase().trim();
    return safeProducts.filter(p => {
      if (!p) return false;
      return (
        p.name?.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term)
      );
    });
  }, [safeProducts, search]);

  // ✅ Limpieza de URL de objeto
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // ✅ Manejo de cambios en inputs
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  }, [formErrors]);

  // ✅ Subida de archivo
  const handleImageFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      return setFormErrors(prev => ({ ...prev, image: 'Solo se permiten imágenes' }));
    }

    if (file.size > 5 * 1024 * 1024) {
      return setFormErrors(prev => ({ ...prev, image: 'La imagen no debe superar 5MB' }));
    }

    // Liberar URL anterior
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(file);
    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);
    setFormData(prev => ({ ...prev, image_url: '' }));
    setFormErrors(prev => ({ ...prev, image: null }));
  }, [imagePreview]);

  // ✅ Uso de URL externa
  const handleImageUrlChange = useCallback((e) => {
    const url = e.target.value.trim();

    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }

    setFormData(prev => ({ ...prev, image_url: url }));
    setImageFile(null);
    setImagePreview(url);
    setFormErrors(prev => ({ ...prev, image: null }));
  }, [imagePreview]);

  // ✅ Validación del formulario
  const validateForm = useCallback(() => {
    const newErrors = {};
    const name = formData.name?.trim();
    const price = parseFloat(formData.price);

    if (!name) newErrors.name = 'Nombre requerido';
    if (!price || isNaN(price) || price <= 0) newErrors.price = 'Precio inválido';
    if (!formData.category_id) newErrors.category_id = 'Selecciona una categoría';
    if (!imageFile && !formData.image_url?.trim()) newErrors.image = 'Requiere una imagen';

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, imageFile]);

  // ✅ Reset del formulario
  const resetForm = useCallback(() => {
    setFormData({
      id: null,
      name: '',
      price: '',
      description: '',
      image_url: '',
      category_id: ''
    });
    setImageFile(null);
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview('');
    setIsEditing(false);
    setFormErrors({});
  }, [imagePreview]);

  // ✅ Envío del formulario
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    const productData = new FormData();
    productData.append('name', formData.name.trim());
    productData.append('price', formData.price);
    productData.append('description', formData.description.trim());
    productData.append('category', formData.category_id);

    if (imageFile) {
      productData.append('image', imageFile);
    } else if (formData.image_url) {
      productData.append('image_url', formData.image_url);
    }

    try {
      if (isEditing) {
        await updateProduct(formData.id, productData);
      } else {
        await createProduct(productData);
      }
      resetForm();
    } catch (err) {
      console.error('❌ Error al guardar producto:', err);
      setError(`Error: ${err.message}`);
    }
  }, [
    formData,
    imageFile,
    isEditing,
    validateForm,
    createProduct,
    updateProduct,
    resetForm
  ]);

  // ✅ Editar producto
  const handleEdit = useCallback((product) => {
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }

    setFormData({
      id: product._id,
      name: product.name || '',
      price: product.price ? product.price.toString() : '',
      description: product.description || '',
      image_url: product.images?.[0] || '',
      category_id: product.category?._id || ''
    });
    setImagePreview(product.images?.[0] || '');
    setImageFile(null);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [imagePreview]);

  // ✅ Eliminar producto
  const handleDelete = useCallback(async (id) => {
    if (!window.confirm('¿Eliminar este producto? Esta acción no se puede deshacer.')) return;
    try {
      await deleteProduct(id);
      setError(null);
    } catch (err) {
      setError('Error al eliminar el producto.');
    }
  }, [deleteProduct]);

  // ✅ Formateo de precio
  const formatPrice = useCallback((price) =>
    new Intl.NumberFormat('es-CU', {
      style: 'currency',
      currency: 'CUP',
    }).format(price || 0),
    []
  );

  // ✅ Renderizado de carga
  if (loading) {
    return (
      <div className="product-admin loading" aria-busy="true">
        <FaBoxOpen size={40} className="spinner-icon" />
        <p>Cargando productos y categorías...</p>
      </div>
    );
  }

  return (
    <div className="product-admin" aria-labelledby="product-admin-title">
      <header className="product-header">
        <h1 id="product-admin-title">Gestión de Productos</h1>
        <p>Administra los productos de tu tienda: agrega, edita o elimina.</p>
      </header>

      {/* Formulario */}
      <section className="form-section">
        <h2>{isEditing ? 'Editar Producto' : 'Nuevo Producto'}</h2>
        {error && <div className="alert error">{error}</div>}

        <form onSubmit={handleSubmit} className="product-form" noValidate>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">Nombre *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nombre del producto"
                aria-invalid={!!formErrors.name}
              />
              {formErrors.name && <span className="error-text">{formErrors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="price">Precio (CUP) *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                aria-invalid={!!formErrors.price}
              />
              {formErrors.price && <span className="error-text">{formErrors.price}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="category_id">Categoría *</label>
              <select
                id="category_id"
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                aria-invalid={!!formErrors.category_id}
                disabled={safeCategories.length === 0}
              >
                <option value="">Seleccionar categoría</option>
                {safeCategories.map(cat => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {formErrors.category_id && <span className="error-text">{formErrors.category_id}</span>}
            </div>

            {/* Subir imagen */}
            <div className="form-group">
              <label htmlFor="imageFile">Subir Imagen</label>
              <div
                className={`image-upload-area ${imageFile ? 'has-preview' : ''}`}
                onClick={() => document.getElementById('imageFile').click()}
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Vista previa"
                    className="preview"
                    onLoad={() => console.log('✅ Imagen cargada')}
                    onError={(e) => { e.target.src = '/placeholder.png'; }}
                  />
                ) : (
                  <div className="upload-placeholder">
                    <FaPlus size={24} />
                    <p>Selecciona una imagen</p>
                  </div>
                )}
              </div>
              <input
                type="file"
                id="imageFile"
                name="image"
                accept="image/*"
                onChange={handleImageFileChange}
                style={{ display: 'none' }}
              />
            </div>

            {/* Pegar URL */}
            <div className="form-group">
              <label htmlFor="image_url">O usar URL de imagen</label>
              <div className="input-with-icon">
                <FaLink size={16} />
                <input
                  type="url"
                  id="image_url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleImageUrlChange}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>
            </div>
          </div>

          {formErrors.image && <span className="error-text full">{formErrors.image}</span>}

          <div className="form-group full">
            <label htmlFor="description">Descripción *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Escribe una descripción detallada..."
            />
            {formErrors.description && <span className="error-text">{formErrors.description}</span>}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn primary">
              {isEditing ? 'Actualizar Producto' : 'Agregar Producto'}
            </button>
            {isEditing && (
              <button
                type="button"
                className="btn secondary"
                onClick={resetForm}
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
            aria-label="Buscar productos"
          />
        </div>

        <div className="product-list">
          {filteredProducts.length === 0 ? (
            <div className="empty-state">
              <FaBoxOpen size={40} color="#ccc" />
              <p>
                {safeProducts.length === 0
                  ? 'No hay productos disponibles. Agrega uno nuevo.'
                  : 'No se encontraron productos con ese criterio.'}
              </p>
            </div>
          ) : (
            filteredProducts.map((product) => {
              const category = safeCategories.find(c => c._id === product.category?._id);
              return (
                <div key={product._id} className="product-card">
                  <div className="product-image">
                    <img
                      src={product.images?.[0] || '/placeholder.png'}
                      alt={product.name || 'Producto'}
                      loading="lazy"
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
                      onClick={() => handleDelete(product._id)}
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

export default React.memo(ProductAdmin);