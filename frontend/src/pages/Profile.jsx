// src/pages/Profile.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <h2>Acceso no autorizado</h2>
          <p>Por favor inicia sesión para ver tu perfil.</p>
          <button
            onClick={() => navigate("/login")}
            className="btn-primary"
          >
            Iniciar sesión
          </button>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    if (window.confirm("¿Estás seguro de que deseas cerrar sesión?")) {
      logout();
      navigate("/");
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-icon">
            {user.role === "admin" ? (
              <span title="Administrador">🛡️</span>
            ) : (
              <span title="Cliente">👤</span>
            )}
          </div>
          <h2>Mi Perfil</h2>
        </div>

        <div className="profile-info">
          <div className="info-item">
            <strong>Correo electrónico</strong>
            <p>{user.email}</p>
          </div>
          <div className="info-item">
            <strong>Rol</strong>
            <p className={`role-badge role-${user.role}`}>
              {user.role === "admin" ? "Administrador" : "Cliente"}
            </p>
          </div>
        </div>

        <div className="profile-actions">
          <button onClick={handleLogout} className="btn-secondary">
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;