import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { FaEdit, FaTrash, FaImage, FaLink, FaPlus } from 'react-icons/fa';
import '../../styles/CategoryAdmin.css';

const CategoryAdmin = () => {
  const { categories, createCategory, updateCategory, deleteCategory, loading, loadCategories } = useAdmin();
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ id: null, name: '', description: '', image_url: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [loaded, setLoaded] = useState(false);

  const safeCategories = Array.isArray(categories) ? categories : [];

  useEffect(() => {
    if (!loaded && !loading) {
      if (!safeCategories.length) loadCategories();
      setLoaded(true);
    }
    return () => { if (imagePreview.startsWith('blob:')) URL.revokeObjectURL(imagePreview); };
  }, [safeCategories, loading, loaded, loadCategories, imagePreview]);

  const filteredCategories = useMemo(() => {
    if (!search.trim()) return safeCategories;
    const term = search.toLowerCase().trim();
    return safeCategories.filter(c => 
      c.name?.toLowerCase().includes(term) || c.description?.toLowerCase().includes(term)
    );
  }, [safeCategories, search]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: null }));
  }, [formErrors]);

  const handleImageFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return setFormErrors(prev => ({ ...prev, image: 'Solo imágenes (jpg, png, gif)' }));
    if (file.size > 5 * 1024 * 1024) return setFormErrors(prev => ({ ...prev, image: 'Máximo 5MB' }));
    if (imagePreview.startsWith('blob:')) URL.revokeObjectURL(imagePreview);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setFormData(prev => ({ ...prev, image_url: '' }));
    setFormErrors(prev => ({ ...prev, image: null }));
  }, [imagePreview]);

  const handleImageUrlChange = useCallback((e) => {
    const url = e.target.value.trim();
    if (imagePreview.startsWith('blob:')) URL.revokeObjectURL(imagePreview);
    setFormData(prev => ({ ...prev, image_url: url }));
    setImageFile(null);
    setImagePreview(url);
    setFormErrors(prev => ({ ...prev, image: null }));
  }, [imagePreview]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!formData.name?.trim()) newErrors.name = 'Nombre requerido';
    if (!imageFile && !formData.image_url?.trim()) newErrors.image = 'Se requiere imagen';
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, imageFile]);

  const resetForm = useCallback(() => {
    setFormData({ id: null, name: '', description: '', image_url: '' });
    setImageFile(null);
    if (imagePreview.startsWith('blob:')) URL.revokeObjectURL(imagePreview);
    setImagePreview('');
    setIsEditing(false);
    setFormErrors({});
    setError(null);
  }, [imagePreview]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError(null);
    if (!validateForm()) return;

    // --- Construir payload según si hay archivo o no ---
    let payload;
    if (imageFile) {
      payload = new FormData();
      payload.append('name', formData.name.trim());
      payload.append('description', formData.description.trim());
      payload.append('image', imageFile);
    } else {
      payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        image_url: formData.image_url?.trim() || ''
      };
    }

    try {
      if (isEditing) await updateCategory(formData.id, payload);
      else await createCategory(payload);
      resetForm();
    } catch (err) {
      setError(`Error: ${err.message}`);
    }
  }, [formData, imageFile, isEditing, validateForm, createCategory, updateCategory, resetForm]);

  const handleEdit = useCallback((cat) => {
    if (imagePreview.startsWith('blob:')) URL.revokeObjectURL(imagePreview);
    setFormData({ id: cat._id, name: cat.name || '', description: cat.description || '', image_url: cat.image || '' });
    setImagePreview(cat.image || '');
    setImageFile(null);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [imagePreview]);

  const handleDelete = useCallback(async (id) => {
    if (!window.confirm('¿Eliminar esta categoría?')) return;
    try { await deleteCategory(id); resetForm(); } 
    catch { setError('Error al eliminar la categoría.'); }
  }, [deleteCategory, resetForm]);

  if (loading) return (
    <div className="category-admin loading">
      <FaImage size={40} className="spinner-icon"/>
      <p>Cargando categorías...</p>
    </div>
  );

  return (
    <div className="category-admin">
      <header className="category-header">
        <h1>Gestión de Categorías</h1>
        <p>Agrega, edita o elimina categorías de productos</p>
      </header>

      <section className="form-section">
        <h2>{isEditing ? 'Editar Categoría' : 'Nueva Categoría'}</h2>
        {error && <div className="alert error">{error}</div>}
        <form onSubmit={handleSubmit} className="category-form" noValidate>
          <div className="form-grid">
            <div className="form-group">
              <label>Nombre *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nombre" aria-invalid={!!formErrors.name}/>
              {formErrors.name && <span className="error-text">{formErrors.name}</span>}
            </div>
            <div className="form-group">
              <label>Descripción</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="3" placeholder="Descripción opcional"/>
            </div>
            <div className="form-group">
              <label>Subir Imagen</label>
              <div className={`image-upload-area ${imageFile ? 'has-preview' : ''}`} onClick={()=>document.getElementById('imageFile').click()}>
                {imagePreview ? <img src={imagePreview} alt="Preview" className="preview" onError={e=>e.target.src='/placeholders/fallback.png'}/> :
                <div className="upload-placeholder"><FaPlus size={24}/><p>Selecciona una imagen</p></div>}
              </div>
              <input type="file" id="imageFile" accept="image/*" onChange={handleImageFileChange} style={{display:'none'}}/>
            </div>
            <div className="form-group">
              <label>O usar URL de imagen</label>
              <div className="input-with-icon"><FaLink size={16}/>
                <input type="url" name="image_url" value={formData.image_url} onChange={handleImageUrlChange} placeholder="https://ejemplo.com/imagen.jpg"/>
              </div>
            </div>
          </div>
          {formErrors.image && <span className="error-text full">{formErrors.image}</span>}
          <div className="form-actions">
            <button type="submit" className="btn primary">{isEditing ? 'Actualizar' : 'Agregar'}</button>
            {isEditing && <button type="button" className="btn secondary" onClick={resetForm}>Cancelar</button>}
          </div>
        </form>
      </section>

      <section className="table-section">
        <div className="table-header">
          <input type="text" placeholder="Buscar..." value={search} onChange={e=>setSearch(e.target.value)} className="table-search"/>
        </div>
        <div className="category-list">
          {filteredCategories.length === 0 ? 
          <div className="empty-state"><FaImage size={40} color="#ccc"/><p>{safeCategories.length===0?'No hay categorías':'No se encontraron resultados'}</p></div> :
          filteredCategories.map(cat=>(
            <div key={cat._id} className="category-card">
              <div className="category-image"><img src={cat.image || '/placeholders/fallback.png'} alt={cat.name} onError={e=>e.target.src='/placeholders/fallback.png'}/></div>
              <div className="category-info">
                <h3>{cat.name}</h3>
                <p className="category-desc">{cat.description||'Sin descripción'}</p>
              </div>
              <div className="category-actions">
                <button onClick={()=>handleEdit(cat)} className="action-btn edit"><FaEdit/></button>
                <button onClick={()=>handleDelete(cat._id)} className="action-btn delete"><FaTrash/></button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default React.memo(CategoryAdmin);
