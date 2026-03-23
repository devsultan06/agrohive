import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/admin/authService";
import { useMutation } from "@tanstack/react-query";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("super@agrohive.com");
  const [password, setPassword] = useState("Admin123!");
  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = useMutation({
    mutationFn: () => authService.adminLogin(email, password),
    onSuccess: () => {
      navigate("/admin/dashboard");
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate();
  };

  const isLoading = loginMutation.isPending;
  const error =
    loginMutation.error instanceof Error ? loginMutation.error.message : "";

  return (
    <div
      className="min-h-screen flex bg-[#0A0F1A]"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Left — Immersive Brand Panel */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1740&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {/* Dark overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0F1A]/90 via-[#0A0F1A]/75 to-[#1C6206]/40" />
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0A0F1A] to-transparent" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center">
              <img
                src="/images/agrohive.svg"
                alt="Logo"
                className="w-6 h-6 brightness-0 invert object-contain"
              />
            </div>
            <span className="text-[17px] font-semibold text-white tracking-tight">
              Agrohive
            </span>
          </motion.div>

          {/* Center Hero */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="max-w-lg"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] animate-pulse" />
              <span className="text-[11px] font-medium text-[#4ADE80] tracking-wide uppercase">
                System Online · All services running
              </span>
            </div>

            <h1 className="text-[42px] font-bold text-white leading-[1.1] mb-5 tracking-tight">
              Powering the future
              <br />
              of <span className="text-[#4ADE80]">agriculture</span>
            </h1>

            <p className="text-[15px] text-white/60 leading-relaxed mb-10 max-w-md">
              Manage your marketplace, track Interswitch payments, moderate
              community content, and grow the Agrohive ecosystem — all from one
              powerful admin console.
            </p>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: "1,284", label: "Active users", trend: "+12%" },
                { value: "₦6.5M", label: "Revenue", trend: "+18%" },
                { value: "148", label: "Products", trend: "+3" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.15 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4"
                >
                  <div className="flex items-baseline gap-1.5 mb-1">
                    <span className="text-[20px] font-bold text-white">
                      {stat.value}
                    </span>
                    <span className="text-[10px] font-medium text-[#4ADE80]">
                      {stat.trend}
                    </span>
                  </div>
                  <span className="text-[11px] text-white/40">
                    {stat.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex items-center gap-5 text-[11px] text-white/30"
          >
            <span>Enterprise v2.1.0</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>Lagos, Nigeria</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>© 2026 Agrohive Inc.</span>
          </motion.div>
        </div>
      </div>

      {/* Right — Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white relative">
        {/* Subtle top accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#1C6206] to-transparent opacity-40" />

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-[360px]"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-10 lg:hidden">
            <div className="w-9 h-9 bg-[#1C6206] rounded-xl flex items-center justify-center">
              <img
                src="/images/agrohive.svg"
                alt="Logo"
                className="w-5 h-5 brightness-0 invert object-contain"
              />
            </div>
            <span className="text-[16px] font-semibold text-[#101828]">
              Agrohive
            </span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-[24px] font-semibold text-[#101828] mb-2 tracking-tight">
              Welcome back
            </h1>
            <p className="text-[14px] text-[#667085]">
              Enter your credentials to access the admin console
            </p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-3"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                <span className="text-[12px] font-medium text-red-600">
                  {error}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="text-[12px] font-medium text-[#344054] mb-1.5 block">
                Email address
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#98A2B3]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@agrohive.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F9FAFB] border border-[#EAECF0] rounded-lg text-[13px] text-[#101828] placeholder:text-[#98A2B3] focus:outline-none focus:ring-2 focus:ring-[#1C6206]/15 focus:border-[#1C6206] focus:bg-white transition-all"
                  style={{ fontFamily: "inherit" }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[12px] font-medium text-[#344054]">
                  Password
                </label>
                <button
                  type="button"
                  className="text-[12px] font-medium text-[#1C6206] hover:text-[#165005] transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#98A2B3]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-2.5 bg-[#F9FAFB] border border-[#EAECF0] rounded-lg text-[13px] text-[#101828] placeholder:text-[#98A2B3] focus:outline-none focus:ring-2 focus:ring-[#1C6206]/15 focus:border-[#1C6206] focus:bg-white transition-all"
                  style={{ fontFamily: "inherit" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#98A2B3] hover:text-[#667085] transition-colors"
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" x2="23" y1="1" y2="23" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember + Submit */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                className="w-3.5 h-3.5 rounded border-[#D0D5DD] text-[#1C6206] focus:ring-[#1C6206]/20 cursor-pointer"
              />
              <label
                htmlFor="remember"
                className="text-[12px] text-[#667085] cursor-pointer select-none"
              >
                Keep me signed in for 30 days
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-[#1C6206] text-white rounded-lg text-[13px] font-medium shadow-lg shadow-[#1C6206]/20 hover:bg-[#165005] hover:shadow-xl hover:shadow-[#1C6206]/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:shadow-none"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign in to console
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Security footer */}
          <div className="mt-10 pt-6 border-t border-[#F2F4F7]">
            <div className="flex items-center justify-center gap-6">
              <div className="flex items-center gap-1.5 text-[11px] text-[#98A2B3]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1C6206"
                  strokeWidth="2"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span>256-bit SSL</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-[#98A2B3]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1C6206"
                  strokeWidth="2"
                >
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span>2FA ready</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-[#98A2B3]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1C6206"
                  strokeWidth="2"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <path d="m9 11 3 3L22 4" />
                </svg>
                <span>SOC 2</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLogin;
