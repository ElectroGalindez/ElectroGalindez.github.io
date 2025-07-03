import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/Auth.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }) // ✅ solo email y password
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('Error de autenticación:', data);
        setError(data.message || 'Login fallido');
        return;
      }

      // ✅ Guardar datos en localStorage
      const { user, token } = data;
      const { role } = user;

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);

      setError('');

      // ✅ Redirección por rol
      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }

    } catch (err) {
      console.error('Error de red:', err);
      setError('Error al conectar con el servidor');
    }
  };

  return (
    <div className="auth-container">
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Entrar</button>
        {error && <p className="error-message">{error}</p>}
      </form>

      <p className="auth-switch">
        ¿No tienes una cuenta? <a href="/register">Regístrate aquí</a>
      </p>
    </div>
  );
}

export default Login;
