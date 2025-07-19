// src/pages/admin/ProductAdmin.jsx
import React, { useState, useEffect } from "react";
import { useAdmin } from "../../context/AdminContext";
import { toast } from "react-toastify";
import "../../styles/ProductAdmin.css";

export default function ProductAdmin() {
  const {
    products,
    categories,
    createProduct,
    deleteProduct,
    updateProduct,
    fetchAllData,
  } = useAdmin();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    image_url: "",
    category_id: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const productsPerPage = 5;

  useEffect(() => {
    fetchAllData();
  }, []);

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      price: "",
      image_url: "",
      category_id: "",
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, price, category_id } = form;
    if (!name || !price || !category_id) {
      setError("Nombre, precio y categoría son obligatorios");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (editingId) {
        await updateProduct(editingId, form);
        toast.info("✏️ Producto actualizado");
      } else {
        await createProduct(form);
        toast.success("✅ Producto creado");
      }
      resetForm();
    } catch (err) {
      setError("Error al guardar producto");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * productsPerPage,
    page * productsPerPage
  );

  return (
    <div className="product-admin">
      <h2>Gestión de Productos</h2>

      {error && <p className="error-msg">{error}</p>}

      <form className="product-form" onSubmit={handleSubmit}>
        <input
          placeholder="Nombre"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <textarea
          placeholder="Descripción"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          type="number"
          placeholder="Precio"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />
        <input
          placeholder="URL de imagen"
          value={form.image_url}
          onChange={(e) => setForm({ ...form, image_url: e.target.value })}
        />
        <select
          value={form.category_id}
          onChange={(e) => setForm({ ...form, category_id: e.target.value })}
        >
          <option value="">-- Categoría --</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "Guardando..." : editingId ? "Actualizar" : "Crear producto"}
        </button>
        {editingId && (
          <button
            type="button"
            className="cancel-edit"
            onClick={resetForm}
          >
            Cancelar
          </button>
        )}
      </form>

      <div className="search-pagination">
        <input
          type="text"
          placeholder="🔍 Buscar producto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={page === i + 1 ? "active" : ""}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="table-responsive">
        <table className="product-table">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Categoría</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.map((p) => (
              <tr key={p.id}>
                <td>
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} className="thumbnail" />
                  ) : (
                    "—"
                  )}
                </td>
                <td>{p.name}</td>
                <td>{p.description}</td>
                <td>${parseFloat(p.price).toFixed(2)}</td>
                <td>{categories.find((c) => c.id === p.category_id)?.name}</td>
                <td>
                  <button onClick={() => { setForm(p); setEditingId(p.id); }}>
                    ✏️
                  </button>
                  <button onClick={() => deleteProduct(p.id)}>
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredProducts.length === 0 && (
          <p className="no-results">No se encontraron productos.</p>
        )}
      </div>
    </div>
  );
}
