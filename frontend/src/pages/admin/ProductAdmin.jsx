// src/components/admin/ProductAdmin.jsx
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { FaEdit, FaTrash, FaLink, FaPlus, FaBoxOpen } from 'react-icons/fa';
import '../../styles/ProductAdmin.css';

const ProductAdmin = () => {
  const {
    products, categories,
    createProduct, updateProduct, deleteProduct,
    loadingProducts, loadingCategories,
    loadProducts, loadCategories
  } = useAdmin();

  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    id: null, name: '', price: '', description: '', image_url: '', category_id: '', onSale: false
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const safeProducts = Array.isArray(products) ? products : [];
  const safeCategories = Array.isArray(categories) ? categories : [];

  // ---------------- Paginación ----------------
  const PRODUCTS_PER_PAGE = 6;
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return safeProducts;
    const term = search.toLowerCase().trim();
    return safeProducts.filter(p =>
      p.name?.toLowerCase().includes(term) ||
      p.description?.toLowerCase().includes(term)
    );
  }, [safeProducts, search]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const handlePrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

  // ---------------- Carga inicial ----------------
  useEffect(() => {
    loadCategories();
    loadProducts();
    return () => { if (imagePreview.startsWith('blob:')) URL.revokeObjectURL(imagePreview); };
  }, [loadCategories, loadProducts, imagePreview]);

  // ---------------- Inputs controlados ----------------
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: null }));
  }, [formErrors]);

  // ---------------- Imagen ----------------
  const handleImageFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return setFormErrors(prev => ({ ...prev, image: 'Solo imágenes' }));
    if (file.size > 5 * 1024 * 1024) return setFormErrors(prev => ({ ...prev, image: 'Máx 5MB' }));
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

  // ---------------- Validación ----------------
  const validateForm = useCallback(() => {
    const errors = {};
    const name = formData.name?.trim();
    const price = parseFloat(formData.price);
    const description = formData.description?.trim();

    if (!name) errors.name = 'Nombre requerido';
    if (!price || isNaN(price) || price <= 0) errors.price = 'Precio inválido';
    if (!formData.category_id) errors.category_id = 'Selecciona categoría';
    if (!description) errors.description = 'Descripción requerida';
    if (!imageFile && !formData.image_url?.trim()) errors.image = 'Imagen requerida';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData, imageFile]);

  // ---------------- Reset Form ----------------
  const resetForm = useCallback(() => {
    setFormData({ id: null, name: '', price: '', description: '', image_url: '', category_id: '', onSale: false });
    setImageFile(null);
    if (imagePreview.startsWith('blob:')) URL.revokeObjectURL(imagePreview);
    setImagePreview('');
    setIsEditing(false);
    setFormErrors({});
    setError(null);
  }, [imagePreview]);

  // ---------------- Submit ----------------
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError(null);
    if (!validateForm()) return;

    try {
      let payload;
      if (imageFile) {
        payload = new FormData();
        payload.append('name', formData.name.trim());
        payload.append('price', parseFloat(formData.price).toFixed(2));
        payload.append('description', formData.description.trim());
        payload.append('category', formData.category_id);
        payload.append('onSale', formData.onSale ? 'true' : 'false');
        payload.append('image', imageFile);
      } else {
        payload = {
          name: formData.name.trim(),
          price: parseFloat(formData.price).toFixed(2),
          description: formData.description.trim(),
          category: formData.category_id,
          onSale: formData.onSale,
        };
        if (formData.image_url?.trim()) payload.image_url = formData.image_url.trim();
      }

      if (isEditing) await updateProduct(formData.id, payload);
      else await createProduct(payload);
      resetForm();
    } catch (err) {
      setError(err?.message || 'Error al guardar producto');
    }
  }, [formData, imageFile, isEditing, validateForm, createProduct, updateProduct, resetForm]);

  // ---------------- Editar ----------------
  const handleEdit = useCallback((product) => {
    if (imagePreview.startsWith('blob:')) URL.revokeObjectURL(imagePreview);
    setFormData({
      id: product._id || product.id,
      name: product.name || '',
      price: product.price ? product.price.toString() : '',
      description: product.description || '',
      image_url: product.images?.[0] || product.image_url || '',
      category_id: product.category?._id || product.category?.id || product.category || '',
      onSale: product.onSale || false
    });
    setImagePreview(product.images?.[0] || product.image_url || '');
    setImageFile(null);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [imagePreview]);

  // ---------------- Eliminar ----------------
  const handleDelete = useCallback(async (id) => {
    if (!window.confirm('¿Eliminar este producto?')) return;
    try { await deleteProduct(id); resetForm(); } catch { setError('Error al eliminar'); }
  }, [deleteProduct, resetForm]);

  // ---------------- Formato precio ----------------
  const formatPrice = useCallback((price) => new Intl.NumberFormat('es-CU', { style: 'currency', currency: 'CUP' }).format(price || 0), []);

  // ---------------- Render ----------------
  if (loadingProducts || loadingCategories) return (
    <div className="product-admin loading">
      <FaBoxOpen size={40} className="spinner-icon"/>
      <p>Cargando productos...</p>
    </div>
  );

  return (
    <div className="product-admin">
      <header className="product-header">
        <h1>Gestión de Productos</h1>
        <p>Agrega, edita o elimina productos</p>
      </header>

      <section className="form-section">
        <h2>{isEditing ? 'Editar Producto' : 'Nuevo Producto'}</h2>
        {error && <div className="alert error">{error}</div>}
        <form onSubmit={handleSubmit} className="product-form" noValidate>
          <div className="form-grid">
            <div className="form-group">
              <label>Nombre *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} aria-invalid={!!formErrors.name}/>
              {formErrors.name && <span className="error-text">{formErrors.name}</span>}
            </div>
            <div className="form-group">
              <label>Precio *</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} step="0.01" min="0" aria-invalid={!!formErrors.price}/>
              {formErrors.price && <span className="error-text">{formErrors.price}</span>}
            </div>
            <div className="form-group">
              <label><input type="checkbox" name="onSale" checked={formData.onSale} onChange={handleChange}/> En oferta</label>
            </div>
            <div className="form-group">
              <label>Categoría *</label>
              <select name="category_id" value={formData.category_id} onChange={handleChange} aria-invalid={!!formErrors.category_id}>
                <option value="">Seleccionar categoría</option>
                {safeCategories.map(cat => <option key={cat._id || cat.id} value={cat._id || cat.id}>{cat.name}</option>)}
              </select>
              {formErrors.category_id && <span className="error-text">{formErrors.category_id}</span>}
            </div>
            <div className="form-group">
              <label>Imagen</label>
              <div className={`image-upload-area ${imageFile ? 'has-preview' : ''}`} onClick={()=>document.getElementById('imageFile').click()}>
                {imagePreview ? <img src={imagePreview} alt="Preview" className="preview" onError={e=>e.target.src='/placeholders/fallback.png'}/> :
                  <div className="upload-placeholder"><FaPlus size={24}/><p>Selecciona imagen</p></div>}
              </div>
              <input type="file" id="imageFile" accept="image/*" onChange={handleImageFileChange} style={{display:'none'}}/>
            </div>
            <div className="form-group">
              <label>O usar URL de imagen</label>
              <div className="input-with-icon"><FaLink size={16}/>
                <input type="url" name="image_url" value={formData.image_url} onChange={handleImageUrlChange} placeholder="https://ejemplo.com/imagen.jpg"/>
              </div>
              {formErrors.image && <span className="error-text">{formErrors.image}</span>}
            </div>
          </div>
          <div className="form-group full">
            <label>Descripción *</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="3"/>
            {formErrors.description && <span className="error-text">{formErrors.description}</span>}
          </div>
          <div className="form-actions">
            <button type="submit" className="btn primary">{isEditing ? 'Actualizar' : 'Agregar'}</button>
            {isEditing && <button type="button" className="btn secondary" onClick={resetForm}>Cancelar</button>}
          </div>
        </form>
      </section>

      <section className="table-section">
        <div className="table-header">
          <input type="text" placeholder="Buscar productos..." value={search} onChange={e=>{setSearch(e.target.value); setCurrentPage(1);}} className="table-search"/>
        </div>
        <div className="product-list">
          {paginatedProducts.length === 0 ? (
            <div className="empty-state">
              <FaBoxOpen size={40} color="#ccc"/>
              <p>{safeProducts.length === 0 ? 'No hay productos' : 'No se encontraron resultados'}</p>
            </div>
          ) : paginatedProducts.map((product, index) => {
            const productId = product._id || product.id || index;
            const productImage = product.images?.[0] || product.image_url || '/placeholders/fallback.png';
            let category;
            if (product.category) {
              category = safeCategories.find(c => c._id === product.category._id) ||
                         safeCategories.find(c => c._id === product.category) ||
                         { name: 'Sin categoría' };
            } else category = { name: 'Sin categoría' };

            return (
              <div key={productId} className={`product-card ${product.onSale ? 'sale' : ''}`}>
                {product.onSale && <div className="badge-sale">En Oferta</div>}
                <div className="product-image">
                  <img src={productImage} alt={product.name || 'Producto'} onError={e => e.target.src='/placeholders/fallback.png'}/>
                </div>
                <div className="product-info">
                  <h3>{product.name || 'Sin nombre'}</h3>
                  <p className="product-category">{category.name}</p>
                  <p className="product-desc">{product.description || 'Sin descripción'}</p>
                  <p className={`product-price ${product.onSale ? 'sale' : ''}`}>{product.price != null ? formatPrice(Number(product.price)) : 'Sin precio'}</p>
                </div>
                <div className="product-actions-admin">
                  <button onClick={() => handleEdit(product)} className="action-btn edit"><FaEdit size={16}/></button>
                  <button onClick={() => handleDelete(productId)} className="action-btn delete"><FaTrash size={16}/></button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="pagination">
            <button onClick={handlePrevPage} disabled={currentPage === 1}>Anterior</button>
            <span>Página {currentPage} de {totalPages}</span>
            <button onClick={handleNextPage} disabled={currentPage === totalPages}>Siguiente</button>
          </div>
        )}
      </section>
    </div>
  );
};

export default React.memo(ProductAdmin);
