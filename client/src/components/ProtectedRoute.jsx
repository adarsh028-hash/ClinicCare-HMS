import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {

  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");

  // Not logged in
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Role not allowed
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <h1 className="text-center mt-10 text-red-500">Access Denied</h1>;
  }

  // Allowed
  return children;
}

export default ProtectedRoute;