import axios from "./axios.js";

// ================= REGISTER =================
export const register = async (name, email, password, role) => {
  const res = await axios.post("/users/register", {
    name,
    email,
    password,
    role,
  });

  return res.data;
};

// ================= LOGIN =================
export const login = async (email, password) => {
  const res = await axios.post("/users/login", {
    email,
    password,
  });

  return res.data;
};

// ================= LOGOUT =================
export const logout = async () => {
  const res = await axios.post("/users/logout");
  return res.data;
};

// ================= PROFILE =================
export const getProfile = async () => {
  const res = await axios.get("/users/me");
  return res.data;
};