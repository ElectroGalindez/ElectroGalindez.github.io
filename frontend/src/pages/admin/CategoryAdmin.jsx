import React, { useState, useEffect } from "react";
import { useAdmin } from "../../context/AdminContext";
import "../../styles/CategoryAdmin.css";

export default function CategoryAdmin() {
  const { categories, createCategory, updateCategory, deleteCategory, loading } = useAdmin();
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  // Limpiar error al cambiar el input
  const handleNameChange = (e) => {
    setName(e.target.value);
    if (error) setError("");
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("El nombre es requerido");
      return;
    }

    try {
      if (editingId) {
        await updateCategory(editingId, name);
      } else {
        await createCategory(name);
      }
      // Resetear estado
      setName("");
      setEditingId(null);
      setError("");
    } catch (err) {
      setError(`Error: ${err.message || "No se pudo guardar la categoría"}`);
      console.error("Error en categoría:", err);
    }
  };

  // Editar categoría
  const startEditing = (category) => {
    setName(category.name);
    setEditingId(category.id);
    setError("");
  };

  // Cancelar edición
  const cancelEditing = () => {
    setName("");
    setEditingId(null);
    setError("");
  };

  // Eliminar con confirmación
  const handleDelete = async (id, categoryName) => {
    if (!window.confirm(`¿Eliminar la categoría "${categoryName}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      await deleteCategory(id);
      setError("");
    } catch (err) {
      setError(`Error al eliminar: ${err.message}`);
    }
  };

  // Mostrar mensaje si no hay categorías
  const showEmpty = !loading && Array.isArray(categories) && categories.length === 0;

  return (
    <div className="category-admin">
      <h1 className="dashboard-title">Gestión de Categorías</h1>
      <p className="dashboard-description">
        Crea, edita o elimina categorías para organizar tus productos.
      </p>

      {/* Formulario */}
      <div className="form-section">
        <h2 className="form-title">{editingId ? 'Editar Categoría' : 'Nueva Categoría'}</h2>

        {error && <p className="form-error">{error}</p>}

        <form onSubmit={handleSubmit} className="category-form">
          <input
            type="text"
            placeholder="Nombre de la categoría"
            value={name}
            onChange={handleNameChange}
            disabled={loading}
            aria-label="Nombre de categoría"
          />

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !name.trim()}
            >
              {loading && editingId === null ? "Creando..." : editingId ? "Actualizar" : "Crear"}
            </button>

            {editingId && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={cancelEditing}
                disabled={loading}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Lista de categorías */}
      <div className="table-section">
        <h3 className="section-title">Categorías Existentes</h3>

        {loading ? (
          <div className="dashboard-loading">
            <div className="spinner"></div>
            <p>Cargando categorías...</p>
          </div>
        ) : showEmpty ? (
          <p className="text-center">No hay categorías disponibles. Crea una nueva.</p>
        ) : !Array.isArray(categories) ? (
          <p className="text-center">Error al cargar las categorías.</p>
        ) : (
          <div className="category-list">
            {categories.map((c) => (
              <div key={c.id} className="category-item">
                {editingId === c.id ? (
                  <form onSubmit={handleSubmit} className="inline-form">
                    <input
                      type="text"
                      value={name}
                      onChange={handleNameChange}
                      disabled={loading}
                      placeholder="Nombre de categoría"
                    />
                  </form>
                ) : (
                  <span className="category-name">{c.name}</span>
                )}

                <div className="category-actions">
                  {editingId === c.id ? (
                    <>
                      <button
                        onClick={handleSubmit}
                        className="action-button save"
                        disabled={loading || !name.trim()}
                      >
                        {loading ? "Guardando..." : "Guardar"}
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="action-button cancel"
                        disabled={loading}
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEditing(c)}
                        className="action-button edit"
                        disabled={loading}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(c.id, c.name)}
                        className="action-button delete"
                        disabled={loading}
                      >
                        Eliminar
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}