import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function NotFound() {
  const location = useLocation();

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-4xl mx-auto px-5 py-16">
        <div
          className="text-center relative overflow-hidden"
          style={{ animation: "fadeUp 0.5s ease forwards", opacity: 0 }}
        >
          <div
            className="orb w-80 h-80"
            style={{ background: "#C8F135", top: "-140px", left: "-160px", opacity: 0.06 }}
          />
          <div
            className="orb w-72 h-72"
            style={{ background: "#C8F135", bottom: "-160px", right: "-140px", opacity: 0.05 }}
          />

          <div className="mx-auto mb-6 w-20 h-20 rounded-2xl gradient-border p-px">
            <div
              className="w-full h-full rounded-2xl flex items-center justify-center animate-float"
              style={{ background: "rgba(20,20,32,0.9)" }}
            >
              <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#C8F135" strokeWidth="2.2">
                <path
                  d="M12 21s6-5 6-10a6 6 0 1 0-12 0c0 5 6 10 6 10z"
                  strokeLinejoin="round"
                  opacity="0.9"
                />
                <circle cx="12" cy="11" r="2" opacity="0.9" />
                <path d="M4 4l16 16" strokeLinecap="round" opacity="0.85" />
              </svg>
            </div>
          </div>

          <span className="badge badge-slate mb-4">404</span>
          <h1
            className="text-5xl sm:text-6xl font-bold text-white"
            style={{ fontFamily: "'Clash Display', sans-serif", letterSpacing: "-0.03em" }}
          >
            Page not found
          </h1>
          <p
            className="mt-3 text-base"
            style={{ color: "#8891A4", fontFamily: "'Satoshi', sans-serif" }}
          >
            The page you’re looking for doesn’t exist or was moved.
          </p>
        </div>

        <div
          className="mt-10 glass-card gradient-border p-8 text-center"
          style={{ animation: "fadeUp 0.6s ease 0.1s forwards", opacity: 0 }}
        >
          <p
            className="text-sm inline-flex items-center justify-center gap-2"
            style={{ color: "#8891A4", fontFamily: "'Satoshi', sans-serif" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path
                d="M12 21s6-5 6-10a6 6 0 1 0-12 0c0 5 6 10 6 10z"
                strokeLinejoin="round"
                opacity="0.7"
              />
              <circle cx="12" cy="11" r="2" opacity="0.7" />
              <path d="M5 5l14 14" strokeLinecap="round" />
            </svg>
            Requested path
          </p>
          <p
            className="mt-1 text-lg font-semibold"
            style={{ color: "#C8F135", fontFamily: "'JetBrains Mono', monospace" }}
          >
            {location.pathname}
          </p>

          <div className="mt-7 flex flex-wrap gap-3 justify-center">
            <Link
              to="/"
              className="btn-volt inline-flex items-center gap-2"
              style={{ textDecoration: "none" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M3 10.5L12 3l9 7.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M5 10v10h14V10" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Go Home
            </Link>
            <Link
              to="/search-ride"
              className="btn-outline inline-flex items-center gap-2"
              style={{ textDecoration: "none" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" strokeLinecap="round" />
              </svg>
              Find a Ride
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
