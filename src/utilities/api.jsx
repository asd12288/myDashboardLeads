import axios from "axios";

// const BASE_URL = "http://localhost:30010";
const BASE_URL = "https://mydashleads-70713a400aca.herokuapp.com"; // For production

const api = axios.create({
  baseURL: BASE_URL,
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
