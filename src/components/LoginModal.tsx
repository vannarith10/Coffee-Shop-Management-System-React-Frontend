// src/components/LoginModal.tsx
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, getUserRole } from "../services/authService";

interface LoginModalProps {
  onClose: () => void;
}

export default function LoginModal({ onClose }: LoginModalProps) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const usernameRef = useRef<HTMLInputElement>(null);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Auto-focus
  useEffect(() => {
    usernameRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || !username || !password) return;

    setIsLoading(true);
    setError(null);

    try {
      await login(username, password);
      const role = getUserRole();
      onClose();
      switch (role) {
        case "ADMIN":    navigate("/admin");   break;
        case "CASHIER":  navigate("/cashier"); break;
        case "BARISTA":  navigate("/barista"); break;
        default:         navigate("/");
      }
    } catch {
      setError("Invalid username or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
    >
      {/* Blurred backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal card */}
      <div className="relative z-10 w-full max-w-md bg-white dark:bg-[#1a2e1e] border border-slate-200 dark:border-[#3c5342] rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">

        {/* ── Header ──────────────────────────────────────────────────────────── */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-[#29382d] flex justify-between items-center bg-linear-to-r from-[#0d1a10] to-[#1a3320]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#14b83d]/20 border border-[#14b83d]/30 flex items-center justify-center">
              <span className="text-xl">☕</span>
            </div>
            <div>
              <h2
                id="login-modal-title"
                className="text-base font-bold text-white leading-tight"
              >
                Staff Login
              </h2>
              <p className="text-xs text-[#9db8a4]">
                Sign in to access your dashboard
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close login"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* ── Body ────────────────────────────────────────────────────────────── */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {/* Error banner */}
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-xl text-sm text-red-600 dark:text-red-400 animate-fade-in-up">
              <span className="material-symbols-outlined text-base">error</span>
              {error}
            </div>
          )}

          {/* Username */}
          <div>
            <label
              htmlFor="login-username"
              className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#9db8a4] mb-1.5"
            >
              Username
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none">
                person
              </span>
              <input
                ref={usernameRef}
                id="login-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                placeholder="Enter your username"
                autoComplete="username"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-[#112115] border border-slate-200 dark:border-[#3c5342] rounded-xl text-sm focus:ring-2 focus:ring-[#14b83d] focus:border-[#14b83d] dark:text-white outline-none transition-all disabled:opacity-60"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="login-password"
              className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#9db8a4] mb-1.5"
            >
              Password
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none">
                lock
              </span>
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                placeholder="Enter your password"
                autoComplete="current-password"
                className="w-full pl-10 pr-12 py-2.5 bg-slate-50 dark:bg-[#112115] border border-slate-200 dark:border-[#3c5342] rounded-xl text-sm focus:ring-2 focus:ring-[#14b83d] focus:border-[#14b83d] dark:text-white outline-none transition-all disabled:opacity-60"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <span className="material-symbols-outlined text-lg">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading || !username || !password}
            className="w-full py-3 bg-[#14b83d] text-white font-bold rounded-xl shadow-md hover:bg-[#11a035] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-base">login</span>
                Sign In
              </>
            )}
          </button>
        </form>

        {/* ── Footer note ─────────────────────────────────────────────────────── */}
        <div className="px-6 pb-5">
          <p className="text-center text-xs text-slate-400 dark:text-[#9db8a4]">
            This portal is for authorized staff only.
          </p>
        </div>
      </div>
    </div>
  );
}
