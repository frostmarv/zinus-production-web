import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/authService";
import "../styles/components/Login.css";
import bedImage1 from "@assets/login.webp"; // 🛏️ Gambar kasur 1
import bedImage2 from "@assets/login2.webp"; // 🛏️ Gambar kasur 2
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
    <div className="login-root">
      <div className="login-page">
        {/* Kiri: Slider Gambar */}
        <div className="login-left">
          <div className="image-slider">
            <img src={bedImage1} alt="Zinus Bed 1" className="slide" />
            <img src={bedImage2} alt="Zinus Bed 2" className="slide" />
          </div>
        </div>

        {/* Kanan: Form Login */}
        <div className="login-right">
          <div className="login-card">
            {/* ✅ Logo dibungkus dalam div untuk shadow */}
            <div className="logo-container">
              <img src={logoZinus} alt="Zinus Logo" />
            </div>
            {/* Akhir perubahan logo */}

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

            <footer>© Nurmalik Wijaya 2025. All Rights Reserved.</footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
