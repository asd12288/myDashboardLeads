import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import RequireAuth from "./components/RequireAuth";
import Admin from "./Pages/Admin";
import RequireAdmin from "./components/RequireAdmin";
import Campaigns from "./Pages/Campaigns";
import Budget from "./Pages/Budget";

function App() {
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
