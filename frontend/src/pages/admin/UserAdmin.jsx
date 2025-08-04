// src/components/UserAdmin.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useAdmin } from "../../context/AdminContext";
import "../../styles/UserAdmin.css";

function UserAdmin() {
  const { users, loading, updateUserRole, loadSectionData } = useAdmin();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    if (users.length === 0 && !loading) {
      loadSectionData('users').catch(console.error);
    }
  }, [users, loading, loadSectionData]);

  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.id.toString().includes(search) ||
      user.role.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = useMemo(() => {
    const startIndex = (page - 1) * usersPerPage;
    return filteredUsers.slice(startIndex, startIndex + usersPerPage);
  }, [filteredUsers, page, usersPerPage]);

  const handleRoleChange = async (id, newRole) => {
    try {
      await updateUserRole(id, newRole);
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  if (loading) {
    return (
      <div className="user-admin loading">
        <div className="spinner"></div>
        <p>Cargando usuarios...</p>
      </div>
    );
  }

  return (
    <div className="user-admin">
      <header className="user-header">
        <h1>Gestión de Usuarios</h1>
        <p>Administra los roles y permisos de los usuarios de la tienda.</p>
      </header>

      {/* Barra de búsqueda */}
      <div className="user-toolbar">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Buscar por email, ID o rol..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            disabled={loading}
            aria-label="Buscar usuario"
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="user-table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Correo Electrónico</th>
              <th>Rol</th>
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
                <tr key={u.id} className="user-row">
                  <td>{u.id}</td>
                  <td className="user-email">{u.email}</td>
                  <td>
                    <span className={`role-badge role-${u.role}`}>
                      {u.role === "admin" ? "Administrador" : "Cliente"}
                    </span>
                  </td>
                  <td>
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
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

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={page === 1 || loading}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            aria-label="Página anterior"
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
                className={page === pageNum ? "active" : ""}
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
          >
            &raquo;
          </button>
        </div>
      )}
    </div>
  );
}

export default UserAdmin;