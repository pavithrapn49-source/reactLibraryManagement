import { createContext, useContext, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

const API = "https://library-management-backend-0un8.onrender.com";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    const res = await axios.post(
      `${API}/api/auth/login`,
      { email, password }
    );

    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);

    return res.data.user;
  };

  const register = async (name, email, password, role) => {
    const res = await axios.post(
      `${API}/api/auth/register`,
      { name, email, password, role }
    );

    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);