/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ridesService } from "../services/ridesService";
import RideCard from "../components/RideCard";
import { SkeletonCard } from "../components/Loader";
import BookingModal from "../components/BookingModal";
import { useToast } from "../components/Toast";
import { useUser } from "../context/UserContext";

export default function SearchRide() {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const { user } = useUser();
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);
  const [sourceError, setSourceError] = useState("");
  const [destError, setDestError] = useState("");

  const validate = () => {
    let valid = true;
    if (!source.trim()) { setSourceError("Please enter a pickup location"); valid = false; }
    else setSourceError("");
    if (!destination.trim()) { setDestError("Please enter a drop location"); valid = false; }
    else setDestError("");
    if (source.trim().toLowerCase() === destination.trim().toLowerCase() && source.trim()) {
      setDestError("Source and destination cannot be same"); valid = false;
    }
    return valid;
  };

  const handleSearch = useCallback(async () => {
    if (!validate()) return;
    setLoading(true);
    setSearched(true);
    try {
      const data = await ridesService.searchRides(source.trim(), destination.trim());
      setRides(Array.isArray(data) ? data : []);
    } catch (err) {
      setRides([]);
      addToast(err.userMessage || "Could not fetch rides. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }, [source, destination]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleBookSuccess = () => {
    addToast("Ride booked successfully! Check your bookings.", "success");
    setSelectedRide(null);
  };

  const handleBook = (ride) => {
    if (!user) {
      addToast("Please login to book a ride", "info");
      navigate("/login");
      return;
    }

    const riderId = (user?.userId || "").toString().trim();
    const driverId = (ride?.driverId || "").toString().trim();
    if (riderId && driverId && riderId === driverId) {
      addToast("You can't book your own ride", "error");
      return;
    }
    setSelectedRide(ride);
  };

  const swapLocations = () => {
    setSource(destination);
    setDestination(source);
    setSourceError("");
    setDestError("");
  };

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-4xl mx-auto px-5 py-12">
        {/* Header */}
        <div
          className="mb-8"
          style={{ animation: "fadeUp 0.5s ease forwards", opacity: 0 }}
        >
          <span className="badge badge-volt mb-3">Find Your Ride</span>
          <h1
            className="text-4xl font-bold text-white mt-2"
            style={{ fontFamily: "'Clash Display', sans-serif", letterSpacing: "-0.02em" }}
          >
            Search Available Rides
          </h1>
          <p className="mt-2" style={{ color: "#8891A4", fontFamily: "'Satoshi', sans-serif" }}>
            Find drivers going your way and book a seat instantly.
          </p>
        </div>

        {/* Search card */}
        <div
          className="glass-card gradient-border p-6 mb-8"
          style={{ animation: "fadeUp 0.6s ease 0.1s forwards", opacity: 0 }}
        >
          <div className="flex flex-col md:flex-row gap-3 items-end">
            {/* Source */}
            <div className="flex-1">
              <label
                className="block text-xs font-medium mb-2"
                style={{ color: "rgba(255,255,255,0.6)", fontFamily: "'Satoshi', sans-serif", letterSpacing: "0.05em" }}
              >
                FROM
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8891A4" strokeWidth="2">
                    <circle cx="12" cy="12" r="3" />
                    <circle cx="12" cy="12" r="8" opacity="0.4" />
                  </svg>
                </span>
                <input
                  className="rs-input pl-9"
                  placeholder="Pickup location"
                  value={source}
                  onChange={(e) => { setSource(e.target.value); setSourceError(""); }}
                  onKeyDown={handleKeyDown}
                  style={sourceError ? { borderColor: "rgba(255,80,80,0.5)" } : {}}
                />
              </div>
              {sourceError && (
                <p className="mt-1 text-xs" style={{ color: "#ff5050", fontFamily: "'Satoshi', sans-serif" }}>
                  {sourceError}
                </p>
              )}
            </div>

            {/* Swap button */}
            <button
              onClick={swapLocations}
              className="hidden md:flex w-10 h-10 items-center justify-center rounded-xl transition-all mb-0.5 flex-shrink-0"
              style={{
                background: "rgba(200,241,53,0.08)",
                border: "1px solid rgba(200,241,53,0.2)",
                color: "#C8F135",
              }}
              title="Swap locations"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* Destination */}
            <div className="flex-1">
              <label
                className="block text-xs font-medium mb-2"
                style={{ color: "rgba(255,255,255,0.6)", fontFamily: "'Satoshi', sans-serif", letterSpacing: "0.05em" }}
              >
                TO
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8891A4" strokeWidth="2">
                    <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </span>
                <input
                  className="rs-input pl-9"
                  placeholder="Drop location"
                  value={destination}
                  onChange={(e) => { setDestination(e.target.value); setDestError(""); }}
                  onKeyDown={handleKeyDown}
                  style={destError ? { borderColor: "rgba(255,80,80,0.5)" } : {}}
                />
              </div>
              {destError && (
                <p className="mt-1 text-xs" style={{ color: "#ff5050", fontFamily: "'Satoshi', sans-serif" }}>
                  {destError}
                </p>
              )}
            </div>

            {/* Search button */}
            <button
              onClick={handleSearch}
              disabled={loading}
              className="btn-volt flex items-center gap-2 flex-shrink-0 mb-0.5"
              style={{ height: "46px", paddingLeft: "20px", paddingRight: "20px" }}
            >
              {loading ? (
                <div
                  className="w-4 h-4 rounded-full animate-spin"
                  style={{ border: "2px solid transparent", borderTopColor: "#0A0A0F" }}
                />
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" strokeLinecap="round" />
                </svg>
              )}
              Search
            </button>
          </div>
        </div>

        {/* Results */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {!loading && searched && (
          <>
            <div
              className="flex items-center justify-between mb-5"
              style={{ animation: "fadeIn 0.4s ease forwards" }}
            >
              <div>
                <p
                  className="text-lg font-semibold text-white"
                  style={{ fontFamily: "'Clash Display', sans-serif" }}
                >
                  {rides.length > 0
                    ? `${rides.length} ride${rides.length !== 1 ? "s" : ""} found`
                    : "No rides found"}
                </p>
                <p className="text-sm mt-0.5" style={{ color: "#8891A4", fontFamily: "'Satoshi', sans-serif" }}>
                  {source} → {destination}
                </p>
              </div>
              {rides.length > 0 && (
                <span className="badge badge-slate">
                  {rides.filter((r) => (r.availableSeats ?? 0) > 0).length} with seats
                </span>
              )}
            </div>

            {rides.length === 0 ? (
              <div
                className="text-center py-20 glass-card"
                style={{ animation: "fadeUp 0.5s ease forwards", opacity: 0 }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: "rgba(136,145,164,0.1)" }}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8891A4" strokeWidth="1.5">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" strokeLinecap="round" />
                    <line x1="8" y1="11" x2="14" y2="11" strokeLinecap="round" />
                  </svg>
                </div>
                <h3
                  className="text-xl font-semibold text-white mb-2"
                  style={{ fontFamily: "'Clash Display', sans-serif" }}
                >
                  No rides available
                </h3>
                <p className="text-sm" style={{ color: "#8891A4", fontFamily: "'Satoshi', sans-serif" }}>
                  No rides found for this route right now. Try different locations or check back later.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rides.map((ride, i) => (
                  <div
                    key={ride.id || i}
                    style={{ animationDelay: `${i * 0.08}s` }}
                  >
                    <RideCard
                      ride={ride}
                      onBook={handleBook}
                      showBookButton
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Empty state before search */}
        {!loading && !searched && (
          <div
            className="text-center py-16"
            style={{ animation: "fadeIn 0.4s ease 0.3s forwards", opacity: 0 }}
          >
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center animate-float"
                style={{ background: "rgba(200,241,53,0.08)", border: "1px solid rgba(200,241,53,0.15)" }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C8F135" strokeWidth="1.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
            </div>
            <p
              className="text-xl font-semibold text-white mb-2"
              style={{ fontFamily: "'Clash Display', sans-serif" }}
            >
              Where are you headed?
            </p>
            <p className="text-sm" style={{ color: "#8891A4", fontFamily: "'Satoshi', sans-serif" }}>
              Enter your pickup and drop locations to find available rides.
            </p>
          </div>
        )}
      </div>

      {selectedRide && (
        <BookingModal
          ride={selectedRide}
          onClose={() => setSelectedRide(null)}
          onSuccess={handleBookSuccess}
        />
      )}
    </div>
  );
}