// src/components/admin/CategoryAdmin.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { FaEdit, FaTrash, FaImage, FaLink, FaPlus, FaFolder } from 'react-icons/fa';
import '../../styles/CategoryAdmin.css';

const CategoryAdmin = () => {
  const { 
    categories, 
    createCategory, 
    updateCategory, 
    deleteCategory, 
    loading,
  } = useAdmin();

  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: '',
    id: null,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // ✅ Asegurar que categories sea un array
  const safeCategories = Array.isArray(categories) ? categories : [];

  // ✅ Filtrar categorías
  const filteredCategories = useMemo(() => {
    if (!search.trim()) return safeCategories;
    return safeCategories.filter(c => {
      if (!c) return false;
      const nameMatch = c.name?.toLowerCase().includes(search.toLowerCase()) || false;
      const descMatch = c.description?.toLowerCase().includes(search.toLowerCase()) || false;
      return nameMatch || descMatch;
    });
  }, [safeCategories, search]);

  // ✅ Función para evitar caché de imágenes
  const getImageUrl = (url) => {
    if (!url) return '/placeholder-category.png';
    const hasQuery = url.includes('?');
    const separator = hasQuery ? '&' : '?';
    return `${url}${separator}v=${Date.now()}`;
  };

  // ✅ Limpiar URL al desmontar o cambiar
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFormErrors(prev => ({ ...prev, image: 'Solo se permiten imágenes' }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFormErrors(prev => ({ ...prev, image: 'La imagen no debe superar 5MB' }));
      return;
    }

    // ✅ Liberar la URL anterior
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(file);
    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);
    setFormData(prev => ({ ...prev, image_url: '' }));
    setFormErrors(prev => ({ ...prev, image: null }));
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value.trim();
    
    // ✅ Si había una URL de archivo, liberarla
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }

    setFormData(prev => ({ ...prev, image_url: url }));
    setImageFile(null);
    setImagePreview(url);
    setFormErrors(prev => ({ ...prev, image: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    const name = formData.name?.trim();
    if (!name) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!imageFile && !formData.image_url?.trim()) {
      newErrors.image = 'Requiere una imagen (archivo o URL)';
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    const categoryData = new FormData();
    const name = formData.name.trim();
    categoryData.append('name', name);

    if (formData.description) {
      categoryData.append('description', formData.description);
    }

    if (imageFile) {
      categoryData.append('image', imageFile);
    } else if (formData.image_url) {
      categoryData.append('image_url', formData.image_url);
    }

    try {
      if (isEditing) {
        await updateCategory(formData.id, categoryData);
      } else {
        await createCategory(categoryData);
      }

      // ✅ Resetear
      setFormData({ name: '', description: '', image_url: '', id: null });
      setImageFile(null);
      
      // ✅ Liberar la URL actual
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
      
      setImagePreview('');
      setIsEditing(false);
      setFormErrors({});
    } catch (err) {
      console.error('Error al guardar categoría:', err);
      setError(`Error: ${err.message}`);
    }
  };

  const handleEdit = (category) => {
    // ✅ Liberar la URL anterior antes de editar
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }

    setFormData({
      id: category._id,
      name: category.name || '',
      description: category.description || '',
      image_url: category.image_url || '',
    });
    setImagePreview(category.image_url || '');
    setImageFile(null);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta categoría? Esta acción no se puede deshacer.')) return;
    try {
      await deleteCategory(id);
    } catch (err) {
      setError('Error al eliminar la categoría.');
    }
  };

  // ✅ Mostrar loading solo si está cargando Y no hay datos
  if (loading && safeCategories.length === 0) {
    return (
      <div className="category-admin loading">
        <FaFolder size={40} className="spinner-icon" />
        <p>Cargando categorías...</p>
      </div>
    );
  }

  return (
    <div className="category-admin" aria-labelledby="category-admin-title">
      <header className="category-header">
        <h1 id="category-admin-title">Gestión de Categorías</h1>
        <p>Administra las categorías de productos: agrega, edita o elimina.</p>
      </header>

      {/* Formulario */}
      <section className="form-section">
        <h2>{isEditing ? 'Editar Categoría' : 'Nueva Categoría'}</h2>
        {error && <div className="alert error">{error}</div>}

        <form onSubmit={handleSubmit} className="category-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">Nombre *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                placeholder="Nombre de la categoría"
                aria-invalid={!!formErrors.name}
              />
              {formErrors.name && <span className="error-text">{formErrors.name}</span>}
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
                    key={imagePreview} // ✅ Fuerza re-render
                    src={getImageUrl(imagePreview)} // ✅ Evita caché
                    alt="Vista previa" 
                    className="preview" 
                    onLoad={() => console.log('✅ Imagen cargada')}
                    onError={(e) => { e.target.src = '/placeholder-category.png'; }}
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
                  value={formData.image_url || ''}
                  onChange={handleImageUrlChange}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>
            </div>
          </div>

          {formErrors.image && <span className="error-text full">{formErrors.image}</span>}

          <div className="form-group full">
            <label htmlFor="description">Descripción</label>
            <textarea
              id="description"
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              rows="3"
              placeholder="Escribe una descripción detallada..."
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn primary">
              {isEditing ? 'Actualizar Categoría' : 'Agregar Categoría'}
            </button>
            {isEditing && (
              <button
                type="button"
                className="btn secondary"
                onClick={() => {
                  // ✅ Liberar URL al cancelar
                  if (imagePreview && imagePreview.startsWith('blob:')) {
                    URL.revokeObjectURL(imagePreview);
                  }
                  setFormData({
                    name: '',
                    description: '',
                    image_url: '',
                    id: null,
                  });
                  setImageFile(null);
                  setImagePreview('');
                  setIsEditing(false);
                }}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </section>

      {/* Lista de categorías */}
      <section className="table-section">
        <div className="table-header">
          <input
            type="text"
            placeholder="Buscar categorías..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="table-search"
          />
        </div>

        <div className="category-list">
          {filteredCategories.length === 0 ? (
            <div className="empty-state">
              <FaFolder size={40} color="#ccc" />
              <p>
                {safeCategories.length === 0
                  ? 'No hay categorías disponibles. Agrega una nueva.'
                  : 'No se encontraron categorías con ese criterio.'}
              </p>
            </div>
          ) : (
            filteredCategories.map((category) => (
              <div key={category._id} className="category-card">
                <div className="category-image">
                  <img
                    src={getImageUrl(category.image_url)} // ✅ Evita caché
                    alt={category.name || 'Categoría'}
                    loading="lazy"
                    onError={(e) => { e.target.src = '/placeholder-category.png'; }}
                  />
                </div>
                <div className="category-info">
                  <h3>{category.name}</h3>
                  <p className="category-desc" title={category.description}>
                    {category.description || 'Sin descripción'}
                  </p>
                </div>
                <div className="category-actions">
                  <button
                    onClick={() => handleEdit(category)}
                    className="action-btn edit"
                    aria-label="Editar categoría"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(category._id)}
                    className="action-btn delete"
                    aria-label="Eliminar categoría"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default CategoryAdmin;