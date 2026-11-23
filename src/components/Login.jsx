import { useState } from "react";
import { MapPin, Lock, Mail, User } from "lucide-react";
import "./Login.css";

function Login({ onLogin }) {
  const [role, setRole] = useState("Administrator");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    const accounts = {
      Administrator: {
        email: "admin@civictrack.com",
        password: "Admin@123",
      },
      Citizen: {
        email: "citizen@civictrack.com",
        password: "Citizen@123",
      },
    };

    const account = accounts[role];

    if (
      email.trim().toLowerCase() === account.email &&
      password === account.password
    ) {
      onLogin({
        email: account.email,
        role: role === "Administrator" ? "Admin" : "Citizen",
        name: role,
      });
    } else {
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <div className="login-logo">
          <MapPin size={30} />
        </div>

        <h1>CivicTrack</h1>

        <p className="login-subtitle">
          Smart City Public Issue Management Portal
        </p>

        <h2>Welcome Back!</h2>

        <p className="login-description">
          Sign in to continue to your account.
        </p>

        <form onSubmit={handleLogin}>

          <label>Login As</label>

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="Administrator">
              Administrator
            </option>

            <option value="Citizen">
              Citizen
            </option>
          </select>

          <label>Email Address</label>

          <div className="login-input">
            <Mail size={18} />

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <label>Password</label>

          <div className="login-input">
            <Lock size={18} />

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="login-error">{error}</p>
          )}

          <button
            type="submit"
            className="login-button"
          >
            Sign In
          </button>

        </form>

        <div className="login-footer">
          <User size={15} />
          Secure access to CivicTrack
        </div>

      </div>
    </div>
  );
}

export default Login;