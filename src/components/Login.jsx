import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/authService";
import "../styles/components/Login.css";
import bedImage from "@assets/login.png"; // 🛏️ Gambar kasur
import logoZinus from "@assets/logo_hijau.jpeg"; // 🌿 Logo Zinus

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
    // ✅ WRAP SELURUH KONTEN DALAM SCOPE
    <div className="login-root">
      <div className="login-page">
        {/* Kiri: Gambar kasur */}
        <div className="login-left">
          <div className="image-wrapper">
            <img src={bedImage} alt="Zinus Bed" />
          </div>
        </div>

        {/* Kanan: Form Login */}
        <div className="login-right">
          <div className="login-card">
            <div className="logo-top">
              <img src={logoZinus} alt="Zinus Logo" />
            </div>

            <h1>Welcome to Zinus Production</h1>
            <h2>Login</h2>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <input
                  type="email"
                  placeholder="Email address"
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
                  <input type="checkbox" /> Remember Me
                </label>
                <a href="#" className="forgot-password">
                  Forgot Password?
                </a>
              </div>

              <button type="submit" className="btn-login" disabled={loading}>
                {loading ? "Loading..." : "Login"}
              </button>
            </form>

            <footer>© 2025 Nurmalik Wijaya. All Rights Reserved.</footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
