// src/components/CategoryAdmin.jsx
import React, { useState, useEffect } from "react";
import { useAdmin } from "../../context/AdminContext";
import "../../styles/CategoryAdmin.css";

export default function CategoryAdmin() {
  const { categories, createCategory, updateCategory, deleteCategory, loading } = useAdmin();
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const handleNameChange = (e) => {
    setName(e.target.value);
    if (error) setError("");
  };

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
      setName("");
      setEditingId(null);
      setError("");
    } catch (err) {
      setError(`Error: ${err.message || "No se pudo guardar la categoría"}`);
      console.error("Error en categoría:", err);
    }
  };

  const startEditing = (category) => {
    setName(category.name);
    setEditingId(category.id);
    setError("");
  };

  const cancelEditing = () => {
    setName("");
    setEditingId(null);
    setError("");
  };

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

  const showEmpty = !loading && Array.isArray(categories) && categories.length === 0;

  return (
    <div className="category-admin">
      <header className="category-header">
        <h1>Gestión de Categorías</h1>
        <p>Crea, edita o elimina categorías para organizar tus productos.</p>
      </header>

      {/* Formulario */}
      <section className="form-section">
        <h2>{editingId ? 'Editar Categoría' : 'Nueva Categoría'}</h2>

        {error && <div className="alert error">{error}</div>}

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
              className="btn primary"
              disabled={loading || !name.trim()}
            >
              {loading && !editingId ? "Creando..." : editingId ? "Actualizar" : "Crear"}
            </button>

            {editingId && (
              <button
                type="button"
                className="btn secondary"
                onClick={cancelEditing}
                disabled={loading}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </section>

      {/* Lista */}
      <section className="table-section">
        <h3>Categorías Existentes</h3>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Cargando categorías...</p>
          </div>
        ) : showEmpty ? (
          <div className="empty-state">
            <p>No hay categorías disponibles. Crea una nueva.</p>
          </div>
        ) : !Array.isArray(categories) ? (
          <div className="error-state">
            <p>Error al cargar las categorías.</p>
          </div>
        ) : (
          <div className="category-list">
            {categories.map((c) => (
              <div key={c.id} className={`category-item ${editingId === c.id ? 'editing' : ''}`}>
                <div className="category-info">
                  {editingId === c.id ? (
                    <input
                      type="text"
                      value={name}
                      onChange={handleNameChange}
                      disabled={loading}
                      placeholder="Nombre de categoría"
                      autoFocus
                    />
                  ) : (
                    <span className="category-name">{c.name}</span>
                  )}
                </div>

                <div className="category-actions">
                  {editingId === c.id ? (
                    <>
                      <button
                        onClick={handleSubmit}
                        className="btn action save"
                        disabled={loading || !name.trim()}
                      >
                        {loading ? "Guardando..." : "Guardar"}
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="btn action cancel"
                        disabled={loading}
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEditing(c)}
                        className="btn edit"
                        disabled={loading}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(c.id, c.name)}
                        className="btn delete"
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
      </section>
    </div>
  );
}