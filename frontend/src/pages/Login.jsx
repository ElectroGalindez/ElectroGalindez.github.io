// src/components/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Auth.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Credenciales inválidas');
      }

      if (!data.token || !data.user) {
        throw new Error('Respuesta del servidor incompleta');
      }

      login(data.user, data.token);

      if (data.user.role === 'admin') {
        navigate('/');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" aria-labelledby="login-title">
      <div className="auth-card">
        <h2 id="login-title">Iniciar sesión</h2>
        <p>Accede a tu cuenta en ElectroGalíndez</p>

        <form onSubmit={handleLogin} autoComplete="on">
          <div className="input-group">
            <input
              type="email"
              id="email"
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
              autoComplete="username"
            />
            <label htmlFor="email">Correo electrónico</label>
          </div>

          <div className="input-group">
            <input
              type="password"
              id="password"
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
              autoComplete="current-password"
            />
            <label htmlFor="password">Contraseña</label>
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" disabled={loading} className="auth-button">
            {loading ? '...' : 'Entrar'}
          </button>
        </form>

        <p className="auth-switch">
          ¿No tienes cuenta?{' '}
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="link-button"
            disabled={loading}
          >
            Regístrate aquí
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;