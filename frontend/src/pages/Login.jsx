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

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Por favor, ingresa un correo electrónico válido.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.error || data.message || 'Credenciales inválidas';
        setError(errorMsg);
        if (response.status === 401) {
          console.log('Error 401: Credenciales incorrectas');
        }
        return;
      }

      const { user, token } = data;

      if (!user || !user._id) {
        setError('Error: usuario no válido en la respuesta.');
        return;
      }

      login(user, token);
      navigate('/');
    } catch (err) {
      if (err.name === 'TypeError' || err.message.includes('failed to fetch')) {
        setError('No se pudo conectar al servidor. Verifica tu conexión o que el backend esté corriendo en http://localhost:3001');
      } else {
        setError('Error inesperado. Intenta más tarde.');
      }
      console.error('Error de autenticación:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" aria-labelledby="login-title">
      <div className="auth-card">
        <h2 id="login-title" className="auth-title">
          Iniciar sesión
        </h2>
        <p className="auth-subtitle">Accede a tu cuenta en ElectroGalíndez</p>

        <form onSubmit={handleLogin} noValidate>
          {/* Campo de correo */}
          <div className="input-group">
            <input
              type="email"
              id="email"
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
              aria-invalid={error && email ? 'true' : 'false'}
              aria-describedby="email-error"
            />
            <label htmlFor="email">Correo electrónico</label>
          </div>

          {/* Campo de contraseña */}
          <div className="input-group">
            <input
              type="password"
              id="password"
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
              minLength="6"
              aria-invalid={error && password ? 'true' : 'false'}
              aria-describedby="password-error"
            />
            <label htmlFor="password">Contraseña</label>
          </div>

          {/* Mensaje de error */}
          {error && (
            <p className="error-message" role="alert" id="auth-error">
              {error}
            </p>
          )}

          {/* Botón de envío */}
          <button
            type="submit"
            className="auth-button"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Iniciando sesión...
              </>
            ) : (
              'Entrar'
            )}
          </button>
        </form>

        {/* Enlace a registro */}
        <p className="auth-switch">
          ¿No tienes cuenta?{' '}
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="link-button"
            disabled={loading}
            aria-label="Ir a la página de registro"
          >
            Regístrate aquí
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;