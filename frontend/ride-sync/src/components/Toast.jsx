/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect, createContext, useContext, useCallback } from "react";

const ToastContext = createContext(null);

let toastIdCounter = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", duration = 4000) => {
    const id = ++toastIdCounter;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const ToastItem = ({ toast, onRemove }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 10);
  }, []);

  const icons = {
    success: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    error: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" strokeLinecap="round" />
        <line x1="9" y1="9" x2="15" y2="15" strokeLinecap="round" />
      </svg>
    ),
    info: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" strokeLinecap="round" />
        <line x1="12" y1="16" x2="12.01" y2="16" strokeLinecap="round" />
      </svg>
    ),
  };

  const styles = {
    success: { border: "rgba(200,241,53,0.3)", icon: "#C8F135", bg: "rgba(200,241,53,0.08)" },
    error: { border: "rgba(255,80,80,0.3)", icon: "#ff5050", bg: "rgba(255,80,80,0.08)" },
    info: { border: "rgba(100,150,255,0.3)", icon: "#6496ff", bg: "rgba(100,150,255,0.08)" },
  };

  const s = styles[toast.type] || styles.info;

  return (
    <div
      className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl backdrop-blur-xl"
      style={{
        background: `rgba(20,20,32,0.95)`,
        border: `1px solid ${s.border}`,
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        transform: visible ? "translateX(0)" : "translateX(100px)",
        opacity: visible ? 1 : 0,
        transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
        minWidth: "280px",
        maxWidth: "380px",
      }}
    >
      <div
        style={{
          color: s.icon,
          background: s.bg,
          padding: "6px",
          borderRadius: "8px",
          flexShrink: 0,
        }}
      >
        {icons[toast.type]}
      </div>
      <p className="text-sm text-white flex-1" style={{ fontFamily: "'Satoshi', sans-serif" }}>
        {toast.message}
      </p>
      <button
        onClick={() => onRemove(toast.id)}
        className="text-slate-500 hover:text-white transition-colors ml-1 flex-shrink-0"
        style={{ lineHeight: 1 }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" />
          <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
};