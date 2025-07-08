// import "dotenv/config"
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,  // To send cookies (important for sessions/auth)
});

export default axiosInstance;
