import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/Auth.css';
import { useAuth } from "../context/AuthContext"; // Usamos el contexto para login

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validación de campos antes de hacer la petición
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Correo electrónico no válido');
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }) // Enviamos solo email y password
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Email o contraseña incorrectos');
        return;
      }

      // Guardamos los datos en localStorage
      const { user, token } = data;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);

      // Llamamos al contexto para guardar el usuario y token
      login(user, token);

      setError('');
      navigate('/'); // Redirige al home

    } catch (err) {
      setError('Error de red, intenta nuevamente');
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
        {error && <p className="error-message">{error}</p>} {/* Mostrar el error aquí */}
      </form>

      <p className="auth-switch">
        ¿No tienes una cuenta? <a href="/register">Regístrate aquí</a>
      </p>
    </div>
  );
}

export default Login;
