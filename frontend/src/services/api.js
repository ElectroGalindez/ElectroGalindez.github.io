// src/services/api.js

const API_URL = 'http://localhost:3001/api';

export const getProducts = async () => {
  const res = await fetch(`${API_URL}/products`);
  return res.json();
};

export const getProductById = async (id) => {
  const res = await fetch(`${API_URL}/products/${id}`);
  return res.json();
};

export const createOrder = async (items) => {
  const token = localStorage.getItem("token");
  
  // ✅ Log para confirmar que entra aquí
  console.log("✅ createOrder ejecutado");
  console.log("🔑 Token usado:", token);
  console.log("📦 Items:", items);

  if (!token) {
    throw new Error("No hay token de autenticación");
  }

  const res = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ items })
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error("❌ Error en la respuesta:", errorData);
    throw new Error(errorData.error || 'Error al crear la orden');
  }

  const data = await res.json();
  console.log("🎉 Orden creada:", data);
  return data;
};