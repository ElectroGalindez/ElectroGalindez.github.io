// src/components/RequireAuth.jsx
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export const RequireAuth = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="auth-loading">Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};