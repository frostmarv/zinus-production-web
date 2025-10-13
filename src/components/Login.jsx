// src/components/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/authService";
import "../styles/components/Login.css";
import logo from "@assets/login.png"; // ✅ Import gambar

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Login gagal. Cek email dan password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Gambar sebelah kiri */}
      <div className="login-image">
        <img src={logo} alt="Login Illustration" />{" "}
        {/* ✅ Gunakan variabel `logo` */}
      </div>

      {/* Form Login sebelah kanan */}
      <div className="login-form">
        <h2>Sign In</h2>
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="options">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <a href="#" className="forgot-password">
              Forgot password?
            </a>
          </div>

          <button type="submit" disabled={loading} className="login-button">
            {loading ? "Loading..." : "LOGIN"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
