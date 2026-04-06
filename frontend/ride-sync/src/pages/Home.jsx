import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const FeatureCard = ({ icon, title, desc, delay }) => (
  <div
    className="glass-card p-6"
    style={{
      animation: `fadeUp 0.6s ease ${delay}s forwards`,
      opacity: 0,
    }}
  >
    <div
      className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
      style={{ background: "rgba(200,241,53,0.1)", border: "1px solid rgba(200,241,53,0.2)" }}
    >
      {icon}
    </div>
    <h3
      className="text-base font-semibold text-white mb-2"
      style={{ fontFamily: "'Clash Display', sans-serif" }}
    >
      {title}
    </h3>
    <p className="text-sm leading-relaxed" style={{ color: "#8891A4", fontFamily: "'Satoshi', sans-serif" }}>
      {desc}
    </p>
  </div>
);

const StatItem = ({ value, label, delay }) => (
  <div
    className="text-center"
    style={{ animation: `fadeUp 0.6s ease ${delay}s forwards`, opacity: 0 }}
  >
    <div
      className="text-4xl font-bold mb-1"
      style={{ fontFamily: "'Clash Display', sans-serif", color: "#C8F135" }}
    >
      {value}
    </div>
    <div className="text-sm" style={{ color: "#8891A4", fontFamily: "'Satoshi', sans-serif" }}>
      {label}
    </div>
  </div>
);

export default function Home() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.4 + 0.1,
    }));

    let animId;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 241, 53, ${p.opacity})`;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="relative overflow-hidden min-h-screen flex items-center">
        {/* Background effects */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ opacity: 0.6 }}
        />
        <div
          className="orb w-96 h-96"
          style={{ background: "#C8F135", top: "-80px", right: "-80px", opacity: 0.08 }}
        />
        <div
          className="orb w-80 h-80"
          style={{ background: "#6496ff", bottom: "0", left: "-60px", opacity: 0.06 }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-5 py-24">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-8"
            style={{
              background: "rgba(200,241,53,0.08)",
              border: "1px solid rgba(200,241,53,0.2)",
              fontFamily: "'Satoshi', sans-serif",
              color: "#C8F135",
              animation: "fadeUp 0.5s ease forwards",
              opacity: 0,
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            Now available across 50+ cities
          </div>

          {/* Headline */}
          <h1
            style={{
              fontFamily: "'Clash Display', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(42px, 7vw, 88px)",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              animation: "fadeUp 0.6s ease 0.1s forwards",
              opacity: 0,
            }}
          >
            <span className="text-white">Share the</span>
            <br />
            <span style={{ color: "#C8F135" }}>ride,</span>
            <span className="text-white"> split</span>
            <br />
            <span className="text-white">the cost.</span>
          </h1>

          <p
            className="mt-6 text-lg max-w-xl leading-relaxed"
            style={{
              color: "#8891A4",
              fontFamily: "'Satoshi', sans-serif",
              animation: "fadeUp 0.6s ease 0.2s forwards",
              opacity: 0,
            }}
          >
            RideSync connects drivers and riders heading the same way. Smarter commutes,
            lower costs, fewer cars on the road.
          </p>

          <div
            className="flex flex-wrap gap-3 mt-10"
            style={{ animation: "fadeUp 0.6s ease 0.3s forwards", opacity: 0 }}
          >
            <Link to="/search-ride" className="btn-volt inline-flex items-center gap-2" style={{ textDecoration: "none" }}>
              Find a Ride
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link to="/create-ride" className="btn-outline inline-flex items-center gap-2" style={{ textDecoration: "none" }}>
              Offer a Ride
            </Link>
          </div>

          {/* Trust indicators */}
          <div
            className="flex flex-wrap gap-6 mt-12"
            style={{ animation: "fadeUp 0.6s ease 0.4s forwards", opacity: 0 }}
          >
            {["No surge pricing", "Verified drivers", "Instant booking"].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C8F135" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-sm" style={{ color: "#8891A4", fontFamily: "'Satoshi', sans-serif" }}>
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatItem value="120K+" label="Rides completed" delay={0.1} />
            <StatItem value="50K+" label="Active drivers" delay={0.2} />
            <StatItem value="₹2Cr+" label="Saved by riders" delay={0.3} />
            <StatItem value="4.9★" label="Average rating" delay={0.4} />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-5">
          <div
            className="mb-12"
            style={{ animation: "fadeUp 0.6s ease forwards", opacity: 0 }}
          >
            <span className="badge badge-volt mb-4">Why RideSync</span>
            <h2
              className="text-4xl font-bold text-white mt-3"
              style={{ fontFamily: "'Clash Display', sans-serif", letterSpacing: "-0.02em" }}
            >
              Built for the modern commuter
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FeatureCard
              delay={0.1}
              icon={
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C8F135" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4l3 3" strokeLinecap="round" />
                </svg>
              }
              title="Real-time Matching"
              desc="Instantly match with drivers on your route. Zero waiting, maximum efficiency."
            />
            <FeatureCard
              delay={0.2}
              icon={
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C8F135" strokeWidth="2">
                  <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              }
              title="Live Route Tracking"
              desc="Follow every journey in real time. Know exactly where your ride is, always."
            />
            <FeatureCard
              delay={0.3}
              icon={
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C8F135" strokeWidth="2">
                  <rect x="1" y="4" width="22" height="16" rx="2" />
                  <line x1="1" y1="10" x2="23" y2="10" />
                </svg>
              }
              title="Transparent Pricing"
              desc="Fixed prices agreed upfront. No hidden charges, no surprises at the end."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-5">
          <div
            className="gradient-border rounded-2xl p-px"
            style={{ background: "linear-gradient(135deg, rgba(200,241,53,0.15), rgba(200,241,53,0.02))" }}
          >
            <div
              className="rounded-2xl p-12 text-center relative overflow-hidden"
              style={{ background: "#0f0f18" }}
            >
              <div
                className="orb w-64 h-64"
                style={{ background: "#C8F135", top: "-80px", right: "-40px", opacity: 0.06 }}
              />
              <h2
                className="text-4xl font-bold text-white mb-4 relative"
                style={{ fontFamily: "'Clash Display', sans-serif", letterSpacing: "-0.02em" }}
              >
                Ready to ride smarter?
              </h2>
              <p
                className="text-lg mb-8 relative"
                style={{ color: "#8891A4", fontFamily: "'Satoshi', sans-serif" }}
              >
                Join thousands who've already switched to a better way to commute.
              </p>
              <div className="flex flex-wrap gap-4 justify-center relative">
                <Link
                  to="/search-ride"
                  className="btn-volt inline-flex items-center gap-2"
                  style={{ textDecoration: "none" }}
                >
                  Search Rides →
                </Link>
                <Link
                  to="/create-ride"
                  className="btn-outline inline-flex items-center gap-2"
                  style={{ textDecoration: "none" }}
                >
                  Create a Ride
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="py-8 text-center"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)", color: "#8891A4" }}
      >
        <p className="text-sm" style={{ fontFamily: "'Satoshi', sans-serif" }}>
          © 2025 RideSync. Built for smarter commutes.
        </p>
      </footer>
    </div>
  );
}