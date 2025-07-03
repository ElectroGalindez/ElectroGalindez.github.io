import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Auth.css"; 

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validación básica antes de enviar la solicitud
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Correo electrónico no válido");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Registro exitoso 🎉");
        setTimeout(() => navigate("/login"), 1000);
      } else {
        toast.error(data.message || "Error en el registro.");
      }
    } catch (err) {
      toast.error("Error al conectarse al servidor.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Crear cuenta</h2>
      <form onSubmit={handleRegister}>
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
        <input
          type="password"
          placeholder="Confirmar contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Registrarse</button>
      </form>
      <p className="auth-switch">
        ¿Ya tienes una cuenta? <a href="/login">Inicia sesión aquí</a>
      </p>
    </div>
  );
}

export default Register;
