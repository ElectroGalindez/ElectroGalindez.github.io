import React, { useEffect, useState } from "react";
import "../../styles/AdminSection.css";

function UserAdmin() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Error al cargar usuarios:", err));
  }, []);

  const handleRoleChange = async (id, newRole) => {
    try {
      const res = await fetch(`http://localhost:3001/api/users/${id}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await res.json();

      if (res.ok) {
        setUsers((prev) =>
          prev.map((user) =>
            user.id === id ? { ...user, role: newRole } : user
          )
        );
      } else {
        alert(data.message || "Error al actualizar el rol");
      }
    } catch (err) {
      console.error("Error al actualizar el rol:", err);
    }
  };

  return (
    <div className="admin-panel">
      <h2>Gestión de Usuarios</h2>
      <div className="admin-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u.id, e.target.value)}
                  >
                    <option value="user">Usuario</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserAdmin;
