import { createContext, useContext, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    const res = await axios.post(
      "http://localhost:5000/api/auth/login",
      { email, password }
    );

    // ✅ SAVE TOKEN
    localStorage.setItem("token", res.data.token);

    // ✅ SAVE ONLY USER OBJECT
    setUser(res.data.user);

    return res.data.user;
  };

  const register = async (name, email, password, role) => {
    const res = await axios.post(
      "http://localhost:5000/api/auth/register",
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