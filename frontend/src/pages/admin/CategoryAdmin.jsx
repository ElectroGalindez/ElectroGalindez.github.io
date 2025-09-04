// src/components/admin/CategoryAdmin.jsx
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { FaEdit, FaTrash, FaImage, FaLink, FaPlus } from 'react-icons/fa';
import '../../styles/CategoryAdmin.css';

const CategoryAdmin = () => {
  const {
    categories,
    createCategory,
    updateCategory,
    deleteCategory,
    loading
  } = useAdmin();

  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    description: '',
    image_url: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // ✅ Validación de datos
  const safeCategories = Array.isArray(categories) ? categories : [];

  // ✅ Filtrado optimizado
  const filteredCategories = useMemo(() => {
    if (!search.trim()) return safeCategories;
    const term = search.toLowerCase().trim();
    return safeCategories.filter(c => {
      if (!c) return false;
      return (
        c.name?.toLowerCase().includes(term) ||
        c.description?.toLowerCase().includes(term)
      );
    });
  }, [safeCategories, search]);

  // ✅ Limpieza de URL de objeto al desmontar
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, []); // ✅ Solo al desmontar

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
      return setFormErrors(prev => ({ 
        ...prev, 
        image: 'Solo se permiten imágenes (jpg, png, jpeg, gif)' 
      }));
    }

    if (file.size > 5 * 1024 * 1024) {
      return setFormErrors(prev => ({ 
        ...prev, 
        image: 'La imagen no debe superar 5MB' 
      }));
    }

    // ✅ Validación del tipo de archivo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      return setFormErrors(prev => ({ 
        ...prev, 
        image: 'Formato de imagen no soportado' 
      }));
    }

    // Liberar URL anterior SOLO si es blob
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

    // Liberar URL anterior si es blob
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

    if (!name) newErrors.name = 'Nombre requerido';

    if (!imageFile && !formData.image_url?.trim()) {
      newErrors.image = 'Requiere una imagen';
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, imageFile]);

  // ✅ Reset del formulario
  const resetForm = useCallback(() => {
    setFormData({
      id: null,
      name: '',
      description: '',
      image_url: ''
    });
    setImageFile(null);
    
    // Liberar URL anterior
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

    const categoryData = new FormData();
    categoryData.append('name', formData.name.trim());
    categoryData.append('description', formData.description.trim());

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
      resetForm();
    } catch (err) {
      console.error('❌ Error al guardar categoría:', err);
      setError(`Error: ${err.message}`);
    }
  }, [
    formData,
    imageFile,
    isEditing,
    validateForm,
    createCategory,
    updateCategory,
    resetForm
  ]);

  // ✅ Editar categoría
  const handleEdit = useCallback((category) => {
    // Liberar URL anterior
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }

    setFormData({
      id: category._id,
      name: category.name || '',
      description: category.description || '',
      image_url: category.image || ''
    });
    setImagePreview(category.image || '');
    setImageFile(null);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [imagePreview]);

  // ✅ Eliminar categoría
  const handleDelete = useCallback(async (id) => {
    if (!window.confirm('¿Eliminar esta categoría? Esta acción no se puede deshacer.')) return;
    try {
      await deleteCategory(id);
      setError(null);
    } catch (err) {
      setError('Error al eliminar la categoría.');
    }
  }, [deleteCategory]);

  // ✅ Renderizado de carga
  if (loading) {
    return (
      <div className="category-admin loading" aria-busy="true">
        <FaImage size={40} className="spinner-icon" />
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

        <form onSubmit={handleSubmit} className="category-form" noValidate>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">Nombre *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nombre de la categoría"
                aria-invalid={!!formErrors.name}
              />
              {formErrors.name && <span className="error-text">{formErrors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="description">Descripción</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                placeholder="Escribe una descripción opcional..."
              />
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
                    onError={(e) => { 
                      e.target.src = '/placeholders/fallback.png'; 
                      console.error('❌ Error al cargar imagen:', e.target.src);
                    }}
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

          <div className="form-actions">
            <button type="submit" className="btn primary">
              {isEditing ? 'Actualizar Categoría' : 'Agregar Categoría'}
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

      {/* Lista de categorías */}
      <section className="table-section">
        <div className="table-header">
          <input
            type="text"
            placeholder="Buscar categorías..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="table-search"
            aria-label="Buscar categorías"
          />
        </div>

        <div className="category-list">
          {filteredCategories.length === 0 ? (
            <div className="empty-state">
              <FaImage size={40} color="#ccc" />
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
                    src={category.image || '/placeholders/fallback.png'}
                    alt={category.name || 'Categoría'}
                    loading="lazy"
                    onError={(e) => { 
                      e.target.src = '/placeholders/fallback.png'; 
                      console.error(`❌ Imagen no encontrada: ${category.image}`);
                    }}
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

export default React.memo(CategoryAdmin);