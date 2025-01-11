import axios from "axios";

const api = axios.create({
  baseURL: "https://mydashleads-70713a400aca.herokuapp.com",
});

// Add role header to all requests
api.interceptors.request.use((config) => {
  const role = localStorage.getItem("role");
  if (role) {
    config.headers.role = role;
  }
  return config;
});

export default api;
