// src/components/UserAdmin.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useAdmin } from "../../context/AdminContext";
import { FaUser, FaEnvelope, FaShieldAlt, FaUsers } from 'react-icons/fa';
import "../../styles/UserAdmin.css";

function UserAdmin() {
  const { users, loading, loadUsers, changeUserRole } = useAdmin(); 
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    if ((!users || users.length === 0) && !loading) {
      loadUsers();
    }
  }, [users, loading, loadUsers]);

  const filteredUsers = useMemo(() => {
    return (users || []).filter(user =>
      user.email?.toLowerCase().includes(search.toLowerCase()) ||
      user._id?.includes(search) ||
      user.role?.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginatedUsers = useMemo(() => {
    const startIndex = (page - 1) * usersPerPage;
    return filteredUsers.slice(startIndex, startIndex + usersPerPage);
  }, [filteredUsers, page, usersPerPage]);

  const handleRoleChange = async (id, newRole) => {
    if (!changeUserRole) return console.error("changeUserRole no está definido");
    try {
      await changeUserRole(id, newRole);
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  if (loading) {
    return (
      <div className="user-admin loading" aria-live="polite">
        <FaUsers size={40} className="loading-icon" />
        <p>Cargando usuarios...</p>
      </div>
    );
  }

  return (
    <div className="user-admin" aria-labelledby="user-admin-title">
      <header className="user-header">
        <h1 id="user-admin-title">Gestión de Usuarios</h1>
        <p>Administra los roles y permisos de los usuarios de la tienda.</p>
      </header>

      <div className="user-toolbar">
        <div className="search-wrapper">
          <FaUser className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por email, ID o rol..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            disabled={loading}
            aria-label="Buscar usuario"
          />
        </div>
      </div>

      <div className="user-table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th><FaUser size={14} /> ID</th>
              <th><FaEnvelope size={14} /> Correo Electrónico</th>
              <th><FaShieldAlt size={14} /> Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.length === 0 ? (
              <tr>
                <td colSpan="4" className="no-results">
                  {search ? 'No se encontraron usuarios con ese criterio.' : 'No hay usuarios disponibles.'}
                </td>
              </tr>
            ) : (
              paginatedUsers.map((u) => (
                <tr key={u._id} className="user-row">
                  <td>{u._id?.slice(-6)}</td>
                  <td className="user-email">{u.email}</td>
                  <td>
                    <span className={`role-badge role-${u.role}`}>
                      {u.role === "admin" ? "Administrador" : "Cliente"}
                    </span>
                  </td>
                  <td>
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      disabled={loading}
                      aria-label={`Cambiar rol de ${u.email}`}
                    >
                      <option value="user">Cliente</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={page === 1 || loading}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            aria-label="Página anterior"
            className="pagination-btn"
          >
            &laquo;
          </button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNum = page <= 3
              ? i + 1
              : page >= totalPages - 2
                ? totalPages - 4 + i
                : page - 2 + i;

            if (pageNum < 1 || pageNum > totalPages) return null;

            return (
              <button
                key={i}
                className={`pagination-btn ${page === pageNum ? "active" : ""}`}
                onClick={() => setPage(pageNum)}
                disabled={loading}
                aria-label={`Ir a página ${pageNum}`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            disabled={page === totalPages || loading}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            aria-label="Página siguiente"
            className="pagination-btn"
          >
            &raquo;
          </button>
        </div>
      )}
    </div>
  );
}

export default UserAdmin;
