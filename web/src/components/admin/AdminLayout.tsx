import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../services/admin/auth.service";

const AdminLayout = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) => {
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const user = authService.getUser();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate("/admin/login");
    }

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [navigate]);

  if (!authService.isAuthenticated()) {
    return null;
  }

  return (
    <div
      className="flex min-h-screen"
      style={{ fontFamily: "'Inter', sans-serif", background: "#FAFAFA" }}
    >
      <Sidebar />
      <div className="flex-1 ml-[260px] flex flex-col min-h-screen">
        <AnimatePresence>
          {!isOnline && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-[#FEF3F2] border-b border-[#FECDCA] overflow-hidden"
            >
              <div className="px-6 py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#F04438] rounded-full animate-pulse" />
                  <p className="text-[13px] font-medium text-[#B42318]">
                    You are offline. Some features may be unavailable.
                  </p>
                </div>
                <button
                  onClick={() => window.location.reload()}
                  className="text-[12px] font-semibold text-[#B42318] hover:underline"
                >
                  Reconnect
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top bar */}
        <header className="h-16 bg-white border-b border-[#F0F0F0] flex items-center justify-between px-6 sticky top-0 z-30">
          <h1 className="text-[15px] font-semibold text-[#101828]">{title}</h1>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-[6px] bg-[#F9FAFB] border border-[#EAECF0] rounded-lg w-56">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#98A2B3"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none outline-none text-[13px] w-full text-[#667085] placeholder:text-[#98A2B3]"
                style={{ fontFamily: "inherit" }}
              />
              <span className="text-[10px] text-[#98A2B3] border border-[#EAECF0] rounded px-1 py-0.5 bg-white font-medium">
                ⌘K
              </span>
            </div>

            <Link
              to="/admin/notifications"
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#EAECF0] text-[#667085] hover:bg-[#F9FAFB] transition-colors relative"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
              </svg>
              <span className="absolute top-2 right-2 w-[6px] h-[6px] bg-[#F04438] rounded-full"></span>
            </Link>

            <div className="h-6 w-px bg-[#EAECF0]"></div>

            <div className="flex items-center gap-2.5">
              <div className="text-right">
                <p className="text-[13px] font-medium text-[#344054]">
                  {user?.fullName || "Admin"}
                </p>
                <p className="text-[11px] text-[#98A2B3] capitalize">
                  {user?.role?.toLowerCase() || "Administrator"}
                </p>
              </div>
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || "A")}&background=1C6206&color=fff&size=80&bold=true&font-size=0.4`}
                alt="Avatar"
                className="w-8 h-8 rounded-full"
              />
            </div>
          </div>
        </header>

        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="p-6"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
};

export default AdminLayout;
