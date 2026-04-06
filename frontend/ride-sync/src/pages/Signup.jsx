import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useToast } from "../components/Toast";
import { authService } from "../services/authService";

export default function Signup() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signup } = useUser();
  const { addToast } = useToast();

  const redirectTo = location.state?.from || "/profile";

  const [form, setForm] = useState({ name: "", email: "", mobile: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Name is required";
    if (!form.email.trim()) next.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) next.email = "Enter a valid email";

    const cleanedMobile = form.mobile.trim().replace(/\s+/g, "");
    if (!cleanedMobile) next.mobile = "Mobile number is required";
    else if (!/^\+?\d{7,15}$/.test(cleanedMobile)) next.mobile = "Enter a valid mobile number";

    if (!form.password) next.password = "Password is required";
    else if (form.password.length < 6) next.password = "Password must be at least 6 characters";
    if (!form.confirmPassword) next.confirmPassword = "Please confirm your password";
    else if (form.password !== form.confirmPassword) next.confirmPassword = "Passwords do not match";
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
      const user = await authService.signup({
        name: form.name.trim(),
        email: form.email.trim(),
        mobile: form.mobile.trim().replace(/\s+/g, ""),
        password: form.password,
        confirmPassword: form.confirmPassword,
      });
      signup(user);
      addToast("Account created", "success");
      navigate(redirectTo);
    } catch (err) {
      addToast(err.userMessage || "Signup failed. Please try again.", "error");
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
            Sign up
          </h1>
          <p className="mt-2" style={{ color: "#8891A4", fontFamily: "'Satoshi', sans-serif" }}>
            Create a profile to book and offer rides.
          </p>
        </div>

        <div className="glass-card gradient-border p-7" style={{ animation: "fadeUp 0.6s ease 0.1s forwards", opacity: 0 }}>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium mb-2"
                style={{ color: "rgba(255,255,255,0.8)", fontFamily: "'Satoshi', sans-serif" }}
              >
                Name
              </label>
              <input
                id="name"
                className="rs-input"
                placeholder="e.g., Alex Rivera"
                value={form.name}
                onChange={handleChange("name")}
                style={errors.name ? { borderColor: "rgba(255,80,80,0.5)" } : {}}
              />
              {errors.name && (
                <p className="mt-1.5 text-xs" style={{ color: "#ff5050", fontFamily: "'Satoshi', sans-serif" }}>
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-2"
                style={{ color: "rgba(255,255,255,0.8)", fontFamily: "'Satoshi', sans-serif" }}
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                className="rs-input"
                placeholder="e.g., alex@email.com"
                value={form.email}
                onChange={handleChange("email")}
                style={errors.email ? { borderColor: "rgba(255,80,80,0.5)" } : {}}
              />
              {errors.email && (
                <p className="mt-1.5 text-xs" style={{ color: "#ff5050", fontFamily: "'Satoshi', sans-serif" }}>
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="mobile"
                className="block text-sm font-medium mb-2"
                style={{ color: "rgba(255,255,255,0.8)", fontFamily: "'Satoshi', sans-serif" }}
              >
                Mobile number
              </label>
              <input
                id="mobile"
                type="tel"
                inputMode="tel"
                className="rs-input"
                placeholder="e.g., +15551234567"
                value={form.mobile}
                onChange={handleChange("mobile")}
                style={errors.mobile ? { borderColor: "rgba(255,80,80,0.5)" } : {}}
              />
              {errors.mobile && (
                <p className="mt-1.5 text-xs" style={{ color: "#ff5050", fontFamily: "'Satoshi', sans-serif" }}>
                  {errors.mobile}
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
                placeholder="Create a password"
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

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium mb-2"
                style={{ color: "rgba(255,255,255,0.8)", fontFamily: "'Satoshi', sans-serif" }}
              >
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                className="rs-input"
                placeholder="Re-enter your password"
                value={form.confirmPassword}
                onChange={handleChange("confirmPassword")}
                style={errors.confirmPassword ? { borderColor: "rgba(255,80,80,0.5)" } : {}}
              />
              {errors.confirmPassword && (
                <p className="mt-1.5 text-xs" style={{ color: "#ff5050", fontFamily: "'Satoshi', sans-serif" }}>
                  {errors.confirmPassword}
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
                  <circle cx="12" cy="7" r="3" />
                  <path d="M5 21a7 7 0 0 1 14 0" strokeLinecap="round" />
                  <path d="M19 8v4" strokeLinecap="round" />
                  <path d="M17 10h4" strokeLinecap="round" />
                </svg>
              )}
              {loading ? "Creating..." : "Create account"}
            </button>

            <p className="text-sm text-center" style={{ color: "#8891A4", fontFamily: "'Satoshi', sans-serif" }}>
              Already have an account?{" "}
              <Link to="/login" state={{ from: location.state?.from }} style={{ color: "#C8F135", textDecoration: "none" }}>
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
