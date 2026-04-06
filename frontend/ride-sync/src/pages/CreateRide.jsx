import React, { useEffect, useState } from "react";
import { ridesService } from "../services/ridesService";
import { useUser } from "../context/UserContext";
import { useToast } from "../components/Toast";

const InputField = ({
  label,
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  hint,
  min,
  max,
  readOnly,
  disabled,
}) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium mb-2"
      style={{ color: "rgba(255,255,255,0.8)", fontFamily: "'Satoshi', sans-serif" }}
    >
      {label}
    </label>
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value ?? ""}
      onChange={onChange}
      onClick={(e) => {
        if (disabled || readOnly) return;
        if (type !== "date" && type !== "time") return;
        // Chromium browsers: ensure the picker opens even if the indicator is hidden.
        if (typeof e.currentTarget.showPicker === "function") {
          e.currentTarget.showPicker();
        }
      }}
      min={min}
      max={max}
      readOnly={readOnly}
      disabled={disabled}
      className={`rs-input${disabled ? " opacity-75 cursor-not-allowed" : ""}`}
      style={error ? { borderColor: "rgba(255,80,80,0.5)" } : {}}
    />
    {error && (
      <p className="mt-1.5 text-xs" style={{ color: "#ff5050", fontFamily: "'Satoshi', sans-serif" }}>
        {error}
      </p>
    )}
    {hint && !error && (
      <p className="mt-1.5 text-xs" style={{ color: "#8891A4", fontFamily: "'Satoshi', sans-serif" }}>
        {hint}
      </p>
    )}
  </div>
);

export default function CreateRide() {
  const { user, addCreatedRide } = useUser();
  const { addToast } = useToast();

  const toLocalISODate = (date) => {
    const tzOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - tzOffset).toISOString().slice(0, 10);
  };

  const pad2 = (n) => (n < 10 ? `0${n}` : String(n));
  const toLocalHHMM = (date) => `${pad2(date.getHours())}:${pad2(date.getMinutes())}`;

  const todayISO = toLocalISODate(new Date());
  const nowRoundedUpHHMM = (() => {
    const now = new Date();
    const needsRoundUp = now.getSeconds() > 0 || now.getMilliseconds() > 0;
    const rounded = needsRoundUp ? new Date(now.getTime() + 60 * 1000) : new Date(now.getTime());
    rounded.setSeconds(0, 0);
    return toLocalHHMM(rounded);
  })();

  const [form, setForm] = useState({
    driverId: user.userId || "",
    source: "",
    destination: "",
    totalSeats: "",
    distance: "",
    price: "",
    departureDate: "",
    departureTime: "",
    vehicleNo: "",
    vehicleModel: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const nextDriverId = (user?.userId || "").toString().trim();
    setForm((prev) => (prev.driverId === nextDriverId ? prev : { ...prev, driverId: nextDriverId }));
  }, [user?.userId]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.driverId.trim()) errs.driverId = "Driver ID is required";
    if (!form.source.trim()) errs.source = "Source is required";
    if (!form.destination.trim()) errs.destination = "Destination is required";
    if (form.source.trim().toLowerCase() === form.destination.trim().toLowerCase())
      errs.destination = "Source and destination cannot be the same";
    if (!form.totalSeats) errs.totalSeats = "Total seats is required";
    else if (Number(form.totalSeats) < 1 || Number(form.totalSeats) > 8)
      errs.totalSeats = "Seats must be between 1 and 8";
    if (!form.departureDate) errs.departureDate = "Departure date is required";
    if (!form.departureTime) errs.departureTime = "Departure time is required";

    if (form.departureDate && form.departureTime) {
      const [y, m, d] = form.departureDate.split("-").map((v) => Number(v));
      const [hh, mm] = form.departureTime.split(":").map((v) => Number(v));

      const hasValidParts =
        Number.isFinite(y) &&
        Number.isFinite(m) &&
        Number.isFinite(d) &&
        Number.isFinite(hh) &&
        Number.isFinite(mm);

      if (hasValidParts) {
        const departure = new Date(y, m - 1, d, hh, mm, 0, 0);
        if (!Number.isNaN(departure.getTime()) && departure.getTime() < Date.now()) {
          errs.departureTime = "You can't create rides in the past";
        }

        // Extra guard: if the selected date is today, ensure time is not earlier
        // than the current minute (rounded up) to avoid edge-cases.
        if (!errs.departureTime && form.departureDate === todayISO) {
          const [minH, minM] = nowRoundedUpHHMM.split(":").map((v) => Number(v));
          const minToday = new Date(y, m - 1, d, minH, minM, 0, 0);
          if (!Number.isNaN(minToday.getTime()) && departure.getTime() < minToday.getTime()) {
            errs.departureTime = "You can't create rides in the past";
          }
        }
      }
    }

    if (form.distance && Number(form.distance) < 0) errs.distance = "Distance cannot be negative";
    if (!form.price) errs.price = "Price is required";
    else if (Number(form.price) <= 0) errs.price = "Price must be greater than 0";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);

      if ((errs.departureDate || errs.departureTime || "").toString().toLowerCase().includes("past")) {
        addToast("You can't create rides in the past", "error");
      }
      return;
    }

    setLoading(true);
    try {
      const departureTime = (form.departureTime || "").toString().trim();
      const departureDate = (form.departureDate || "").toString().trim();
      const hour = departureTime ? Number(departureTime.split(":")[0]) : null;
      const timeSlot =
        hour === null
          ? "NORMAL"
          : (hour >= 7 && hour <= 10) || (hour >= 17 && hour <= 20)
            ? "PEAK"
            : hour >= 22 || hour <= 5
              ? "NIGHT"
              : "NORMAL";

      const payload = {
        driverId: form.driverId.toString().trim(),
        source: form.source.toString().trim(),
        destination: form.destination.toString().trim(),
        totalSeats: Number(form.totalSeats),
        distance: form.distance === "" ? 0 : Number(form.distance),
        timeSlot,
        price: Number(form.price),
        departureDate,
        departureTime,
        vehicleNo: (form.vehicleNo || "").toString().trim() || undefined,
        vehicleModel: (form.vehicleModel || "").toString().trim() || undefined,
      };

      const result = await ridesService.createRide(payload);
      addCreatedRide({
        ...(result || payload),
      });
      setSuccess(true);
      addToast("Ride created successfully! Riders can now book your seats.", "success");
      setForm({ driverId: user.userId, source: "", destination: "", totalSeats: "", distance: "", price: "", departureDate: "", departureTime: "", vehicleNo: "", vehicleModel: "" });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      addToast(err.userMessage || "Failed to create ride. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-2xl mx-auto px-5 py-12">
        {/* Header */}
        <div
          className="mb-10"
          style={{ animation: "fadeUp 0.5s ease forwards", opacity: 0 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(200,241,53,0.1)", border: "1px solid rgba(200,241,53,0.2)" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C8F135" strokeWidth="2">
                <path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z" />
                <path d="M20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
                <path d="M9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5z" />
                <path d="M3.5 14H5v1.5c0 .83-.67 1.5-1.5 1.5S2 16.33 2 15.5 2.67 14 3.5 14z" />
                <path d="M14 14.5c0-.83.67-1.5 1.5-1.5h5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-5c-.83 0-1.5-.67-1.5-1.5z" />
                <path d="M15.5 19H14v1.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z" />
                <path d="M10 9.5C10 8.67 9.33 8 8.5 8h-5C2.67 8 2 8.67 2 9.5S2.67 11 3.5 11h5c.83 0 1.5-.67 1.5-1.5z" />
                <path d="M8.5 5H10V3.5C10 2.67 9.33 2 8.5 2S7 2.67 7 3.5 7.67 5 8.5 5z" />
              </svg>
            </div>
            <span className="badge badge-volt">Driver Mode</span>
          </div>
          <h1
            className="text-4xl font-bold text-white"
            style={{ fontFamily: "'Clash Display', sans-serif", letterSpacing: "-0.02em" }}
          >
            Offer a Ride
          </h1>
          <p className="mt-2 text-base" style={{ color: "#8891A4", fontFamily: "'Satoshi', sans-serif" }}>
            Share your journey and split the cost with fellow commuters.
          </p>
        </div>

        {/* Success banner */}
        {success && (
          <div
            className="mb-6 p-4 rounded-xl flex items-center gap-3"
            style={{
              background: "rgba(200,241,53,0.08)",
              border: "1px solid rgba(200,241,53,0.25)",
              animation: "fadeUp 0.4s ease forwards",
            }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(200,241,53,0.15)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C8F135" strokeWidth="2.5">
                <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-sm" style={{ color: "#C8F135", fontFamily: "'Satoshi', sans-serif" }}>
              Ride posted successfully! Riders can now discover and book your seats.
            </p>
          </div>
        )}

        {/* Form */}
        <div
          className="glass-card gradient-border p-7"
          style={{ animation: "fadeUp 0.6s ease 0.1s forwards", opacity: 0 }}
        >
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Driver */}
            <InputField
              label="Driver"
              id="driverName"
              placeholder="Your name"
              value={user?.name || ""}
              disabled
              error={errors.driverId}
              hint="Auto-filled from your account"
            />

            {/* Route */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Pickup Location"
                id="source"
                placeholder="e.g., Koramangala, Bengaluru"
                value={form.source}
                onChange={handleChange("source")}
                error={errors.source}
              />
              <InputField
                label="Drop Location"
                id="destination"
                placeholder="e.g., Whitefield, Bengaluru"
                value={form.destination}
                onChange={handleChange("destination")}
                error={errors.destination}
              />
            </div>

            {/* Distance and Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Distance (km)"
                id="distance"
                type="number"
                placeholder="e.g., 12.5"
                value={form.distance}
                onChange={handleChange("distance")}
                error={errors.distance}
                min={0}
                hint="Optional (helps price calculation)"
              />
              <InputField
                label="Price per Seat (₹)"
                id="price"
                type="number"
                placeholder="150"
                value={form.price}
                onChange={handleChange("price")}
                error={errors.price}
                min={0}
              />
            </div>

            {/* Departure Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Departure Date"
                id="departureDate"
                type="date"
                value={form.departureDate}
                onChange={handleChange("departureDate")}
                error={errors.departureDate}
              />
              <InputField
                label="Departure Time"
                id="departureTime"
                type="time"
                value={form.departureTime}
                onChange={handleChange("departureTime")}
                error={errors.departureTime}
              />
            </div>

            {/* Seats */}
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Total Seats"
                id="totalSeats"
                type="number"
                placeholder="4"
                value={form.totalSeats}
                onChange={handleChange("totalSeats")}
                error={errors.totalSeats}
                min={1}
                max={8}
                hint="Max 8 seats"
              />
              <InputField
                label="Available Seats"
                id="availableSeats"
                type="number"
                placeholder="Auto"
                value={form.totalSeats}
                disabled
                readOnly
                hint="Auto-set to total seats"
              />
            </div>

            {/* Vehicle */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Vehicle No."
                id="vehicleNo"
                placeholder="e.g., KA01AB1234"
                value={form.vehicleNo}
                onChange={handleChange("vehicleNo")}
                hint="Optional"
              />
              <InputField
                label="Vehicle Model"
                id="vehicleModel"
                placeholder="e.g., Honda City"
                value={form.vehicleModel}
                onChange={handleChange("vehicleModel")}
                hint="Optional"
              />
            </div>

            {/* Route preview */}
            {form.source && form.destination && (
              <div
                className="p-4 rounded-xl"
                style={{
                  background: "rgba(200,241,53,0.04)",
                  border: "1px solid rgba(200,241,53,0.12)",
                  animation: "fadeIn 0.3s ease forwards",
                }}
              >
                <p className="text-xs mb-2" style={{ color: "#8891A4", fontFamily: "'Satoshi', sans-serif" }}>
                  ROUTE PREVIEW
                </p>
                <div className="flex items-center gap-3 text-sm">
                  <span className="font-medium text-white" style={{ fontFamily: "'Clash Display', sans-serif" }}>
                    {form.source}
                  </span>
                  <svg width="32" height="14" viewBox="0 0 32 14" fill="none">
                    <path d="M0 7 Q8 2 16 7 Q24 12 32 7" stroke="#C8F135" strokeWidth="1.5" strokeDasharray="3 2" fill="none" opacity="0.7" />
                  </svg>
                  <span className="font-medium text-white" style={{ fontFamily: "'Clash Display', sans-serif" }}>
                    {form.destination}
                  </span>
                </div>
                {form.totalSeats && (
                  <p className="text-xs mt-2" style={{ color: "#C8F135", fontFamily: "'Satoshi', sans-serif" }}>
                    {form.totalSeats} seat{Number(form.totalSeats) > 1 ? "s" : ""} available
                    {form.price ? ` · ₹${form.price} per seat` : ""}
                  </p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-volt w-full flex items-center justify-center gap-2 mt-2"
              style={{ padding: "14px" }}
            >
              {loading ? (
                <>
                  <div
                    className="w-4 h-4 rounded-full animate-spin"
                    style={{ border: "2px solid transparent", borderTopColor: "#0A0A0F" }}
                  />
                  Creating Ride...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="16" strokeLinecap="round" />
                    <line x1="8" y1="12" x2="16" y2="12" strokeLinecap="round" />
                  </svg>
                  Post Ride
                </>
              )}
            </button>
          </form>
        </div>

        {/* Tips */}
        <div
          className="mt-6 p-5 rounded-xl"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.05)",
            animation: "fadeUp 0.6s ease 0.2s forwards",
            opacity: 0,
          }}
        >
          <p className="text-xs font-semibold mb-3" style={{ color: "#8891A4", fontFamily: "'Clash Display', sans-serif", letterSpacing: "0.08em" }}>
            TIPS FOR DRIVERS
          </p>
          <ul className="space-y-2">
            {[
              "Set a fair price to attract more riders",
              "Be specific about pickup and drop points",
              "Update available seats if plans change",
            ].map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "#8891A4", fontFamily: "'Satoshi', sans-serif" }}>
                <span style={{ color: "#C8F135", marginTop: "2px" }}>→</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}