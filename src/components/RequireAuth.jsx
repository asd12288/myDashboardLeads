import { Navigate, Outlet } from "react-router-dom";

const requireAuth = () => {
  const isAuthenticated = localStorage.getItem("user");

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default requireAuth;
