import axios from "axios";
import { Cookies } from "react-cookie";

const apiUrl = process.env.REACT_APP_API_URL;

const API = axios.create({
  baseURL: apiUrl,
});

const cookies = new Cookies();
API.interceptors.request.use(
  (config) => {
    const token = cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
