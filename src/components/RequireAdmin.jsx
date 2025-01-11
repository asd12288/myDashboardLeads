// components/RequireAdmin.js
import { Navigate, Outlet } from "react-router-dom";

export default function RequireAdmin() {
  const storedUser = localStorage.getItem("user");
  const storedRole = localStorage.getItem("role");

  // If user is not logged in or not admin, redirect to login
  if (!storedUser || storedRole !== "admin") {
    return <Navigate to="/login" replace />;
  }

  // If user is admin, render child routes
  return <Outlet />;
}
