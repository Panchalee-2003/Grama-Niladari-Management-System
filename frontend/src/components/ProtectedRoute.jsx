import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, roles }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!token || !user) return <Navigate to="/login" replace />;

  if (roles && !roles.includes(user.role)) {
    if (user.role === "GN") return <Navigate to="/gn" replace />;
    if (user.role === "ADMIN")
      return <Navigate to="/admin-dashboard" replace />;
    return <Navigate to="/citizen" replace />;
  }

  return children;
}
