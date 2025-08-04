// src/components/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Auth.css';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Correo electrónico no válido');
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || data.message || 'Email o contraseña incorrectos');
        return;
      }

      const { user, token } = data;

      if (!user.id) {
        setError('Error: usuario sin ID');
        return;
      }

      login(user, token);
      setError('');
      navigate('/');
    } catch (err) {
      setError('Error de red. Intenta nuevamente.');
      console.error('Error de conexión:', err);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Iniciar sesión</h2>
        <form onSubmit={handleLogin} noValidate>
          <div className="input-group">
            <input
              type="email"
              id="email"
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-label="Correo electrónico"
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
              required
              aria-label="Contraseña"
            />
            <label htmlFor="password">Contraseña</label>
          </div>

          {error && <p className="error-message" role="alert">{error}</p>}

          <button type="submit" className="auth-button">
            Entrar
          </button>
        </form>

        <p className="auth-switch">
          ¿No tienes una cuenta?{' '}
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="link-button"
          >
            Regístrate aquí
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;