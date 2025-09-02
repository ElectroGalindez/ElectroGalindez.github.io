// src/pages/Profile.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaMapMarkerAlt, FaPhone, FaShieldAlt, FaUser, FaSignOutAlt } from "react-icons/fa";
import "../styles/Profile.css";

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Cargar datos guardados
  useEffect(() => {
    if (user) {
      setAddress(localStorage.getItem('userAddress') || '');
      setPhone(localStorage.getItem('userPhone') || user.phone || '');
    }
  }, [user]);

  if (!user) {
    return (
      <div className="profile-container">
        <div className="profile-card access-denied">
          <div className="profile-icon">
            <FaShieldAlt size={40} />
          </div>
          <h2>🔒 Acceso no autorizado</h2>
          <p>Por favor, inicia sesión para ver tu perfil.</p>
          <button onClick={() => navigate("/login")} className="btn-primary">
            Iniciar sesión
          </button>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    if (!address.trim()) {
      setMessage('⚠️ Por favor, ingresa una dirección de envío');
      return;
    }
    if (!phone.trim()) {
      setMessage('⚠️ Por favor, ingresa un número de contacto');
      return;
    }

    setMessage('');
    setSaving(true);

    try {
      // Simulación de guardado real (descomenta para conectar con backend)
      /*
      const response = await fetch('http://localhost:3001/api/profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ address, phone })
      });
      if (!response.ok) throw new Error('Error al guardar');
      */

      // Guardado local temporal
      localStorage.setItem('userAddress', address);
      localStorage.setItem('userPhone', phone);

      setTimeout(() => {
        setSaving(false);
        setMessage('✅ Datos guardados correctamente');
      }, 800);
    } catch (err) {
      setSaving(false);
      setMessage('❌ Error al guardar. Inténtalo más tarde.');
    }
  };

  const handleLogout = () => {
    if (window.confirm("¿Estás seguro de que deseas cerrar sesión?")) {
      logout();
      navigate("/");
    }
  };

  return (
    <div className="profile-container" aria-labelledby="profile-title">
      <div className="profile-card">
        {/* Header */}
        <div className="profile-header">
          <div className="profile-avatar">
            {user.role === "admin" ? (
              <FaShieldAlt size={32} color="#007bff" />
            ) : (
              <FaUser size={32} color="#6c757d" />
            )}
          </div>
          <h2 id="profile-title">Mi Perfil</h2>
          <span className={`badge role-${user.role}`}>
            {user.role === 'admin' ? 'Administrador' : 'Usuario'}
          </span>
        </div>

        {/* Información */}
        <div className="profile-info">
          {/* Email */}
          <div className="info-item">
            <label className="info-label">
              <FaEnvelope /> Correo electrónico
            </label>
            <p className="info-value">{user.email}</p>
          </div>

          {/* Dirección */}
          <div className="info-item">
            <label className="info-label">
              <FaMapMarkerAlt /> Dirección de envío
            </label>
            <input
              type="text"
              placeholder="Calle, número, apartamento, ciudad"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="input-full"
              aria-label="Dirección de envío"
            />
          </div>

          {/* Teléfono */}
          <div className="info-item">
            <label className="info-label">
              <FaPhone /> Teléfono de contacto
            </label>
            <input
              type="tel"
              placeholder="+53 58956749"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="input-full"
              aria-label="Teléfono de contacto"
            />
          </div>
        </div>

        {/* Mensaje de estado */}
        {message && (
          <div className={`profile-message ${message.includes('✅') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        {/* Acciones */}
        <div className="profile-actions">
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary"
            aria-busy={saving}
          >
            {saving ? (
              <>
                <span className="spinner"></span>
                Guardando...
              </>
            ) : (
              'Guardar cambios'
            )}
          </button>
          {user.role === 'admin' && (
          <button
            onClick={() => navigate('/admin')}
            className="btn-admin"
            aria-label="Ir al panel de administración"
          >
            🛠️ Panel de Administración
          </button>
          )}    
          <button
            onClick={handleLogout}
            className="btn-secondary"
            aria-label="Cerrar sesión"
          >
            <FaSignOutAlt /> Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;