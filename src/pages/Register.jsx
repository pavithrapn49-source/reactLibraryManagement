import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    // Mock register (replace with backend later)
    const newUser = { email, role: "user" };
    localStorage.setItem("user", JSON.stringify(newUser));

    alert("Registration successful!");
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form className="bg-white p-6 shadow rounded w-80">
        <h2 className="text-xl font-bold mb-4 text-center">Register</h2>

        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="bg-green-600 text-white w-full py-2 rounded">
          Register
        </button>

        <p className="text-sm mt-3 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
