import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // const BASE_URL = "http://localhost:30010";
  const BASE_URL = "https://mydashleads-70713a400aca.herokuapp.com"; // For production

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store user data
        localStorage.setItem("user", username);
        localStorage.setItem("role", data.user.role);

        // Redirect based on role
        navigate(data.user.role === "admin" ? "/admin" : "/");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Failed to connect to server");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <img src="/logo.png" alt="logo" className="logo" />
        <h1>Login</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleLogin}>
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            disabled={isLoading}
            required
          />
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            disabled={isLoading}
            required
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
