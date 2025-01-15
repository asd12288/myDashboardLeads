import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import RequireAuth from "./components/RequireAuth";
import Admin from "./Pages/Admin";
import RequireAdmin from "./components/RequireAdmin";
import Campaigns from "./Pages/Campaigns";
import Budget from "./Pages/Budget";
import { BaseUrlContext } from "./context/BaseUrlContext";
import Maintenance from "./Pages/Maintenance";
import { useContext } from "react";

function App() {
  const { MAINTENANCE_MODE } = useContext(BaseUrlContext);

  if (MAINTENANCE_MODE) {
    // Render Maintenance mode
    return (
      <Router>
        <Routes>
          <Route element={<RequireAdmin />}>
            <Route path="/admin" element={<Admin />} />
          </Route>

          <Route path="/login" element={<Login />} />

          <Route path="*" element={<Maintenance />} />
        </Routes>
      </Router>
    );
  }

  // Otherwise, render your normal app
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

        {/* admin route */}
        <Route element={<RequireAdmin />}>
          <Route path="/admin" element={<Admin />} />
        </Route>

        {/* redirect to login if not authenticated */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
