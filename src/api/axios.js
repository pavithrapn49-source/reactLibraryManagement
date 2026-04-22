import axios from "axios";

const instance = axios.create({
  baseURL: "https://library-management-backend-0un8.onrender.com/api",
  timeout: 60000,
});

// ================= REQUEST INTERCEPTOR =================
// Automatically attach token
instance.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ================= RESPONSE INTERCEPTOR =================
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong";

    return Promise.reject(new Error(message));
  }
);

export default instance;