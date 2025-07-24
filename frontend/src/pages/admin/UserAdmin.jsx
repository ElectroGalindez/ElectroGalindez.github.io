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

  if (loading) return <div>Loading users...</div>;

  return (
    <div className="admin-panel">
      <h2>User Management</h2>
      
      <div className="admin-toolbar">
        <input
          type="text"
          placeholder="Search user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="admin-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u.id, e.target.value)}
                    disabled={loading}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredUsers.length === 0 && !loading && (
        <p className="no-results">No users found</p>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button 
            disabled={page === 1 || loading} 
            onClick={() => setPage(p => Math.max(1, p-1))}
          >
            &laquo;
          </button>
          
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNum = page <= 3 
              ? i + 1 
              : page >= totalPages - 2 
                ? totalPages - 4 + i 
                : page - 2 + i;
                
            return pageNum > 0 && pageNum <= totalPages ? (
              <button
                key={i}
                className={page === pageNum ? "active" : ""}
                onClick={() => setPage(pageNum)}
                disabled={loading}
              >
                {pageNum}
              </button>
            ) : null;
          })}
          
          <button 
            disabled={page === totalPages || loading} 
            onClick={() => setPage(p => Math.min(totalPages, p+1))}
          >
            &raquo;
          </button>
        </div>
      )}
    </div>
  );
}

export default UserAdmin;