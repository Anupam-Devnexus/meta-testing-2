import { useUser } from "./auth/AuthContext";
import { Navigate } from "react-router-dom";

const RootRedirect = () => {
  const user = useUser();
  const role = user?.role || "user";

  if (!user) return <Navigate to="/login" replace />;
  if (role === "admin") return <Navigate to="/admin-dashboard" replace />;
  if (role === "user") return <Navigate to="/user-dashboard" replace />;

  return <Navigate to="/unauthorized" replace />;
};

export default RootRedirect;
