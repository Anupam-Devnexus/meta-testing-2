// ProtectedRoute.jsx
import { useAuth } from "./AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user } = useAuth();

  // Not logged in → redirect to login
  if (!user) return <Navigate to="/login" replace />;

  // Normalize role check
  const normalizedRole = user?.role?.trim().toLowerCase() || "user";
  const allowed = allowedRoles.map((r) => r.trim().toLowerCase());

  // if (!allowed.includes(normalizedRole)) {
  //   return <Navigate to="/unauthorized" replace />;
  // }

  return children;
};

export default ProtectedRoute;
