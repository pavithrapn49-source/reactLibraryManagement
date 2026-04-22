import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * RoleRoute
 * Restricts access to routes based on allowed roles.
 *
 * @param {ReactNode} children - Component to render if role matches
 * @param {string|string[]} allowedRole - Role(s) allowed to access this route
 */
const RoleRoute = ({ children, allowedRole }) => {
  const { user } = useAuth();

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Normalize allowedRole into an array
  const allowedRoles = Array.isArray(allowedRole) ? allowedRole : [allowedRole];

  // Role mismatch
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default RoleRoute;
