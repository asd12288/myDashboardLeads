import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./Pages/Login";
import RequireAuth from "./components/RequireAuth";
import Admin from "./Pages/Admin";
import RequireAdmin from "./components/RequireAdmin";
import Campaigns from "./Pages/Campaigns";
import Budget from "./Pages/Budget";

function App() {
  const [role, setRole] = useState(null);

  function onLogin(username, password) {
    if (username === "admin" && password === "admin") {
      setRole("admin");
    }
    if (username === "user" && password === "user") {
      setRole("user");
    }
    if (
      username !== "admin" &&
      username !== "user" &&
      password !== "admin" &&
      password !== "user"
    ) {
      alert("Invalid credentials");
    }
  }

  function handleLogout() {
    setRole(null);
  }

  return (
    <Router>
      <Routes>
        {/* public route */}
        <Route path="/login" element={<Login />} />

        {/* private route */}
        <Route element={<RequireAuth />}>
          <Route path="/" element={<Budget />} />
          <Route path="/campaign" element={<Campaigns />} />
        </Route>

        {/* admin Route */}
        <Route element={<RequireAdmin />}>
          <Route path="/admin" element={<Admin />} />
        </Route>
        {/* redirect to login page if not authenticated */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
