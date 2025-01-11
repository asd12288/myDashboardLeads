import { useNavigate, NavLink } from "react-router-dom";
import "../styles/styles.css"; // or "./Navbar.css" if you keep it separate

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="header">
      <h1>Welocome back {localStorage.getItem("user") || "user"}</h1>

      <button className="logout" onClick={handleLogout}>
        Logout
      </button>
    </header>
  );
}

export default Navbar;
