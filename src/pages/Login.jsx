import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { supabase } from "../lib/supabase.js";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from?.pathname || "/";

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await login(email, password);
      if (result.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", result.user.id)
          .maybeSingle();

        if (profile?.role === "admin") {
          navigate("/admin", { replace: true });
        } else {
          navigate(from, { replace: true });
        }
      }
    } catch (err) {
      if (err.message?.toLowerCase().includes("invalid login")) {
        setError("Incorrect email or password.");
      } else if (err.message?.toLowerCase().includes("email not confirmed")) {
        setError("Please confirm your email before logging in.");
      } else {
        setError(err.message || "Login failed. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="section auth-page">
      <div className="auth-container">
        <h2>Welcome Back</h2>
        <p className="auth-subtitle">Login to your TM INDUSTRY account</p>

        {error && (
          <p style={{ color: "#c0392b", fontSize: 14, marginBottom: 16, textAlign: "center" }}>
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="auth-options">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <span style={{ color: "#8e8e93", fontSize: 13 }}>Forgot Password?</span>
          </div>

          <button
            type="submit"
            className="btn-primary btn-full"
            disabled={submitting}
          >
            {submitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </section>
  );
}
