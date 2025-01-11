import Navbar from "../components/Navbar";
import { NavLink } from "react-router-dom";

function Dashboard({ children }) {
  const role = localStorage.getItem("role");

  return (
    <div className="dashboard">
      <Navbar />
      <NavLink
        to="/"
        className={({ isActive }) => (isActive ? "btn active" : "btn")}
      >
        Your Budget
      </NavLink>
      <NavLink
        to="/campaign"
        className={({ isActive }) => (isActive ? "active btn " : "btn")}
      >
        Your Campagins
      </NavLink>

      {role === "admin" && (
        <NavLink
          to="/admin"
          className={({ isActive }) => (isActive ? "active btn " : "btn")}
        >
          Admin
        </NavLink>
      )}

      <main>{children}</main>
    </div>
  );
}

export default Dashboard;
