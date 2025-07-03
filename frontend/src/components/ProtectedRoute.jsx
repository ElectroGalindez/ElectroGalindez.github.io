import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, isAdmin }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" />;
  if (isAdmin && role !== "admin") return <Navigate to="/" />;

  return children;
};

export default ProtectedRoute;
