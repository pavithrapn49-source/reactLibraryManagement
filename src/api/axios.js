import axios from "axios";

const instance = axios.create({
  baseURL:
    "https://library-management-backend-0un8.onrender.com/api",
  timeout: 60000,
});

/* ================= REQUEST INTERCEPTOR ================= */
instance.interceptors.request.use(
  (config) => {
    const user = JSON.parse(
      localStorage.getItem("user")
    );

    if (user?.token) {
      config.headers.Authorization =
        `Bearer ${user.token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ================= RESPONSE INTERCEPTOR ================= */
instance.interceptors.response.use(
  (response) => response,

  (error) => {
    // keep original axios error
    return Promise.reject(error);
  }
);

export default instance;