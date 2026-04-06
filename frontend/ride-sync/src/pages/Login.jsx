import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useToast } from "../components/Toast";
import { authService } from "../services/authService";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useUser();
  const { addToast } = useToast();

  const redirectTo = location.state?.from || "/profile";

  const [form, setForm] = useState({ identifier: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const next = {};
    if (!form.identifier.trim()) next.identifier = "Email or mobile number is required";
    if (!form.password) next.password = "Password is required";
    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setLoading(true);
    try {
      const user = await authService.login({ identifier: form.identifier.trim(), password: form.password });
      login(user);
      addToast("Logged in successfully", "success");
      navigate(redirectTo);
    } catch (err) {
      addToast(err.userMessage || "Login failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-md mx-auto px-5 py-12">
        <div className="mb-8" style={{ animation: "fadeUp 0.5s ease forwards", opacity: 0 }}>
          <span className="badge badge-volt mb-3">Account</span>
          <h1
            className="text-4xl font-bold text-white"
            style={{ fontFamily: "'Clash Display', sans-serif", letterSpacing: "-0.02em" }}
          >
            Login
          </h1>
          <p className="mt-2" style={{ color: "#8891A4", fontFamily: "'Satoshi', sans-serif" }}>
            Enter your email or mobile number to continue.
          </p>
        </div>

        <div className="glass-card gradient-border p-7" style={{ animation: "fadeUp 0.6s ease 0.1s forwards", opacity: 0 }}>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="identifier"
                className="block text-sm font-medium mb-2"
                style={{ color: "rgba(255,255,255,0.8)", fontFamily: "'Satoshi', sans-serif" }}
              >
                Email / Mobile
              </label>
              <input
                id="identifier"
                className="rs-input"
                placeholder="e.g., alex@email.com or +15551234567"
                value={form.identifier}
                onChange={handleChange("identifier")}
                style={errors.identifier ? { borderColor: "rgba(255,80,80,0.5)" } : {}}
              />
              {errors.identifier && (
                <p className="mt-1.5 text-xs" style={{ color: "#ff5050", fontFamily: "'Satoshi', sans-serif" }}>
                  {errors.identifier}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2"
                style={{ color: "rgba(255,255,255,0.8)", fontFamily: "'Satoshi', sans-serif" }}
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                className="rs-input"
                placeholder="Your password"
                value={form.password}
                onChange={handleChange("password")}
                style={errors.password ? { borderColor: "rgba(255,80,80,0.5)" } : {}}
              />
              {errors.password && (
                <p className="mt-1.5 text-xs" style={{ color: "#ff5050", fontFamily: "'Satoshi', sans-serif" }}>
                  {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-volt w-full inline-flex items-center justify-center gap-2"
              style={{ padding: "14px" }}
            >
              {loading ? (
                <div
                  className="w-4 h-4 rounded-full animate-spin"
                  style={{ border: "2px solid transparent", borderTopColor: "#0A0A0F" }}
                />
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M10 17l5-5-5-5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M15 12H3" strokeLinecap="round" />
                  <path d="M21 4v16" strokeLinecap="round" opacity="0.4" />
                </svg>
              )}
              {loading ? "Logging in..." : "Continue"}
            </button>

            <p className="text-sm text-center" style={{ color: "#8891A4", fontFamily: "'Satoshi', sans-serif" }}>
              New here?{" "}
              <Link to="/signup" state={{ from: location.state?.from }} style={{ color: "#C8F135", textDecoration: "none" }}>
                Create an account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
