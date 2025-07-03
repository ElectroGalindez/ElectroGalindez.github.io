// src/pages/Profile.jsx
import React from "react";
import "../styles/Profile.css"; // (opcional: crea si quieres estilo aparte)

function Profile() {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  if (!user) {
    return <p>Por favor inicia sesión para ver tu perfil.</p>;
  }

  return (
    <div className="profile-container">
      <h2>Mi Perfil</h2>
      <p><strong>Correo:</strong> {user.email}</p>
      <p><strong>Rol:</strong> {user.role}</p>
      {/* Agrega más info aquí si quieres */}
    </div>
  );
}

export default Profile;
