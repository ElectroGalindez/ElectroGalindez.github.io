import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useStore } from '../../context/StoreContext';

const ProductModal = ({ isOpen, onClose, product, categories }) => {
  const { createProduct, updateProduct } = useAdmin();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image_url: '',
    category_id: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  // Inicializar formulario y resetear errores cuando se abre/cambia de producto
  useEffect(() => {
    if (isOpen) {
      if (product) {
        setFormData({
          name: product.name || '',
          price: product.price ? product.price.toString() : '',
          description: product.description || '',
          image_url: product.image_url || '',
          category_id: product.category_id ? product.category_id.toString() : ''
        });
        setPreviewImage(product.image_url || null);
      } else {
        setFormData({
          name: '',
          price: '',
          description: '',
          image_url: '',
          category_id: ''
        });
        setPreviewImage(null);
      }
      setErrors({});
    }
  }, [product, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Limpiar errores al cambiar el campo
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
        setFormData((prev) => ({ ...prev, image_url: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.price) {
      newErrors.price = 'El precio es requerido';
    } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Ingrese un precio válido';
    }

    if (!formData.category_id) {
      newErrors.category_id = 'Seleccione una categoría';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        category_id: parseInt(formData.category_id)
      };

      if (product) {
        await updateProduct(product.id, productData);
      } else {
        await createProduct(productData);
      }

      onClose();
    } catch (error) {
      console.error('Error al guardar el producto:', error);
      setErrors({ submit: error.message || 'No se pudo guardar el producto' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            {product ? 'Editar Producto' : 'Nuevo Producto'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
            aria-label="Cerrar modal"
            disabled={isSubmitting}
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {errors.submit && (
            <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded">
              <p>{errors.submit}</p>
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 mb-2 font-medium">
              Nombre *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.name ? 'border-red-500 focus:ring-red-200' : 'focus:ring-blue-200'
              }`}
              placeholder="Nombre del producto"
              disabled={isSubmitting}
            />
            {errors.name && <p className="mt-1 text-red-500 text-sm">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label htmlFor="price" className="block text-gray-700 mb-2 font-medium">
                Precio *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.price ? 'border-red-500 focus:ring-red-200' : 'focus:ring-blue-200'
                }`}
                placeholder="0.00"
                disabled={isSubmitting}
              />
              {errors.price && <p className="mt-1 text-red-500 text-sm">{errors.price}</p>}
            </div>

            <div>
              <label htmlFor="category_id" className="block text-gray-700 mb-2 font-medium">
                Categoría *
              </label>
              <select
                id="category_id"
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.category_id ? 'border-red-500 focus:ring-red-200' : 'focus:ring-blue-200'
                }`}
                disabled={isSubmitting}
              >
                <option value="">Seleccionar categoría</option>
                {categories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category_id && (
                <p className="mt-1 text-red-500 text-sm">{errors.category_id}</p>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="image" className="block text-gray-700 mb-2 font-medium">
              Imagen del Producto
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
              disabled={isSubmitting}
            />
            {previewImage && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-1">Vista previa:</p>
                <img
                  src={previewImage}
                  alt="Vista previa del producto"
                  className="max-h-40 rounded border"
                />
              </div>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="description" className="block text-gray-700 mb-2 font-medium">
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Describe el producto..."
              disabled={isSubmitting}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-gray-600 hover:text-gray-800 font-medium rounded-lg border border-gray-300 hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {product ? 'Actualizando...' : 'Creando...'}
                </span>
              ) : (
                product ? 'Actualizar Producto' : 'Crear Producto'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;