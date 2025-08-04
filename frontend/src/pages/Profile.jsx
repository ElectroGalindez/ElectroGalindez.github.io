// src/pages/Profile.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState(localStorage.getItem('userAddress') || '');
  const [phone, setPhone] = useState(localStorage.getItem('userPhone') || user?.phone || '');
  const [saving, setSaving] = useState(false);

  if (!user) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <h2>🔒 Acceso no autorizado</h2>
          <p>Por favor, inicia sesión para ver tu perfil.</p>
          <button onClick={() => navigate("/login")} className="btn-primary">
            Iniciar sesión
          </button>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    if (!address.trim()) {
      alert('Por favor, ingresa una dirección');
      return;
    }
    if (!phone.trim()) {
      alert('Por favor, ingresa un teléfono');
      return;
    }

    setSaving(true);
    localStorage.setItem('userAddress', address);
    localStorage.setItem('userPhone', phone);
    setTimeout(() => {
      setSaving(false);
      alert('✅ Dirección y teléfono guardados');
    }, 500);
  };

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
          <div className="profile-icon">{user.role === "admin" ? "🛡️" : "👤"}</div>
          <h2>Mi Perfil</h2>
        </div>

        <div className="profile-info">
          <div className="info-item">
            <strong>Correo electrónico</strong>
            <p>{user.email}</p>
          </div>

          <div className="info-item">
            <strong>Dirección de envío</strong>
            <input
              type="text"
              placeholder="Calle, número, apartamento"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="input-full"
            />
          </div>

          <div className="info-item">
            <strong>Teléfono de contacto</strong>
            <input
              type="tel"
              placeholder="Ej: +53 58956749"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="input-full"
            />
          </div>
        </div>

        <div className="profile-actions">
          <button onClick={handleSave} disabled={saving} className="btn-primary">
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
          <button onClick={handleLogout} className="btn-secondary">
            🚪 Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;