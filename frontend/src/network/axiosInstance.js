import axios from "axios";
import url from "./UrlProvider";

const api = axios.create({
  baseURL: url,
  withCredentials: true, // COOKIE ALWAYS SENT
});

// GLOBAL RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // optional: clear localStorage/sessionStorage here
      // localStorage.clear();

      window.location.href = "/login"; // instant logout
    }
    return Promise.reject(error);
  }
);

export default api;
