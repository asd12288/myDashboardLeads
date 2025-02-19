import Navbar from "../components/Navbar";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEuroSign, faBullhorn, faCogs  } from "@fortawesome/free-solid-svg-icons";


function Dashboard({ children }) {
  const role = localStorage.getItem("role");

  return (
    <div className="dashboard">
      <Navbar />
      <NavLink
        to="/"
        className={({ isActive }) => (isActive ? "btn active" : "btn")}
      >
        <FontAwesomeIcon icon={faEuroSign} />
        Your Budget
      </NavLink>
      <NavLink
        to="/campaign"
        className={({ isActive }) => (isActive ? "active btn " : "btn")}
      >
        <FontAwesomeIcon icon={faBullhorn} />
        All Campaigns
      </NavLink>

      {role === "admin" && (
        <NavLink
          to="/admin"
          className={({ isActive }) => (isActive ? "active btn " : "btn")}
        >
          <FontAwesomeIcon icon={faCogs} />
          Admin
        </NavLink>
      )}

      <main>{children}</main>
    </div>
  );
}

export default Dashboard;
