import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  const navigate = useNavigate();

  const login = (email, password) => {
    if (email === "admin@gmail.com" && password === "admin123") {
      const u = { role: "admin" };
      setUser(u);
      localStorage.setItem("user", JSON.stringify(u));
      navigate("/admin");
    } else if (email === "user@gmail.com" && password === "user123") {
      const u = { role: "user" };
      setUser(u);
      localStorage.setItem("user", JSON.stringify(u));
      navigate("/books");
    } else {
      alert("Invalid credentials");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
