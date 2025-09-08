export async function apiClient(endpoint, options = {}) {
  try {
    const res = await fetch(`http://localhost:3001/api${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });

    const data = await res.json().catch(() => null); 

    if (!res.ok) {
      const errorMsg = data?.message || `Error ${res.status}: ${res.statusText}`;
      throw new Error(errorMsg);
    }

    return data;
  } catch (err) {
    console.error('Error en apiClient:', err);
    throw new Error(err.message || 'Error en la petición');
  }
}
