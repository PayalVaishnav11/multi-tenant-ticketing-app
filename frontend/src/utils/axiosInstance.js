import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api", // adjust to your backend port
  timeout: 10000,
  headers: {
        "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
