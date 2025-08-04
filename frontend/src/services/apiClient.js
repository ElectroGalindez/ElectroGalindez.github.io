// src/lib/apiClient.js
const API_BASE = 'http://localhost:3001/api';

const apiClient = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };

  const config = {
    ...options,
    headers: {
      ...headers,
      ...options.headers
    }
  };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `Error ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    if (err.name === 'TypeError') {
      throw new Error('No se pudo conectar al servidor. ¿Está corriendo en http://localhost:3001?');
    }
    throw err;
  }
};

export default apiClient;