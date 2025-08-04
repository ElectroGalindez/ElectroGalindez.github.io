// src/components/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Auth.css";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validaciones
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Por favor, ingresa un correo electrónico válido.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("¡Registro exitoso! Bienvenido a ElectroGalíndez 🎉");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        const errorMsg = data.message || data.error || "Error en el registro.";
        toast.error(errorMsg);
      }
    } catch (err) {
      if (err.name === 'TypeError' || err.message.includes('failed to fetch')) {
        toast.error("No se pudo conectar al servidor. Verifica que el backend esté corriendo en http://localhost:3001");
      } else {
        toast.error("Error inesperado. Intenta más tarde.");
      }
      console.error("Error de red en registro:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" aria-labelledby="register-title">
      <div className="auth-card">
        <h2 id="register-title" className="auth-title">Crear cuenta</h2>
        <p className="auth-subtitle">Regístrate para acceder a tu carrito y pedidos</p>

        <form onSubmit={handleRegister} noValidate>
          {/* Correo electrónico */}
          <div className="input-group">
            <input
              type="email"
              id="email"
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
              aria-invalid={email && !/\S+@\S+\.\S+/.test(email) ? 'true' : 'false'}
            />
            <label htmlFor="email">Correo electrónico</label>
          </div>

          {/* Contraseña */}
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
              aria-describedby="password-hint"
            />
            <label htmlFor="password">Contraseña</label>
          </div>

          {/* Confirmar contraseña */}
          <div className="input-group">
            <input
              type="password"
              id="confirmPassword"
              placeholder=" "
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              required
            />
            <label htmlFor="confirmPassword">Confirmar contraseña</label>
          </div>

          {/* Botón de registro */}
          <button
            type="submit"
            className="auth-button"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Registrando...
              </>
            ) : (
              "Registrarse"
            )}
          </button>
        </form>

        {/* Enlace a login */}
        <p className="auth-switch">
          ¿Ya tienes una cuenta?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="link-button"
            disabled={loading}
            aria-label="Ir a la página de inicio de sesión"
          >
            Inicia sesión aquí
          </button>
        </p>
      </div>
    </div>
  );
}

export default Register;