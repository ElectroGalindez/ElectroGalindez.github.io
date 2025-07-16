import React, { useState } from "react";
import { useAdmin } from "../../context/AdminContext";

export default function ProductAdmin() {
  const {
    products,
    categories,
    deleteProduct,
    createProduct,
  } = useAdmin();

  const [form, setForm] = useState({ name: "", price: "", category_id: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!Array.isArray(products) || !Array.isArray(categories)) {
    return <div>Cargando productos o categorías...</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.category_id) return;
    setLoading(true);
    setError(null);
    try {
      await createProduct(form);
      setForm({ name: "", price: "", category_id: "" });
    } catch (err) {
      setError("Error al crear producto");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Productos</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Nombre"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Precio"
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
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
          {loading ? "Creando..." : "Crear"}
        </button>
      </form>

      <ul>
        {products.map((p) => (
          <li key={p.id}>
            {p.name} - ${p.price} (
            {categories.find((c) => c.id === p.category_id)?.name || "Sin categoría"})
            <button onClick={() => deleteProduct(p.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
