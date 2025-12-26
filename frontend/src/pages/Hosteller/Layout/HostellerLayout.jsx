// src/layouts/HostellerLayout.jsx
import React, { useEffect, useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userLogout } from "../../../redux/slices/authSlices.js";
import ProtectedRoute from "../../../components/ProtectedRoute.jsx";
import { getUserAvatar } from "../../../utils/avatarUtils.js";
import { toastError, toastSuccess } from "../../../utils/toast.js";
import {
  Home,
  Search,
  Send,
  Bed,
  LogOut,
  Menu,
  ChevronRight,
} from "lucide-react";

import logo from "../../../../src/logo.jpeg";

const HostellerLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, user } = useSelector((state) => state.auth);

  const navItems = [
    // { name: "Dashboard", path: "/hosteller/dashboard", icon: Home },
    { name: "Browse Hostels", path: "/hosteller/browse", icon: Search },
    { name: "My Requests", path: "/hosteller/requests", icon: Send },
    { name: "My Stay", path: "/hosteller/stay", icon: Bed },
  ];

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await dispatch(userLogout()).unwrap();
      toastSuccess("Signed out");
      navigate("/login");
    } catch (err) {
      toastError(err?.message || "Logout failed");
      navigate("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleProfileClick = () => {
    setSidebarOpen(false);
    navigate("/hosteller/profile");
  };

  const closeSidebar = () => setSidebarOpen(false);

  useEffect(() => {
    const isSmallScreen = window.innerWidth < 768; // Tailwind md breakpoint

    if (isSmallScreen && isSidebarOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original || "";
      };
    }

    if (isSmallScreen && !isSidebarOpen) {
      document.body.style.overflow = "";
    }
  }, [isSidebarOpen]);

  return (
    <ProtectedRoute requiredRole="HOSTELLER">
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans flex flex-col md:flex-row">
        {/* Mobile Header (same style as owner) */}
        <div className="md:hidden sticky top-0 z-30 bg-white/95 dark:bg-stone-900/95 backdrop-blur-sm border-b border-stone-200 dark:border-stone-800 px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2 text-orange-700 dark:text-orange-500">
            <button
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="text-stone-700 dark:text-stone-200 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
            >
              <Menu size={24} />
            </button>
            <span className="font-bold text-lg tracking-tight text-stone-900 dark:text-stone-100">
              Hop-In
            </span>
          </div>
        </div>

        {/* Blur Backdrop on mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={closeSidebar}
          />
        )}

        {/* Sidebar – same layout style as Owner */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-stone-900 border-r border-stone-200 dark:border-stone-800 transform transition-transform duration-300 md:relative md:translate-x-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Mobile top bar (Menu + Hop-In) */}
            <div className="md:hidden h-16 flex items-center gap-2 px-4 border-b border-stone-100 dark:border-stone-800">
              <button
                onClick={closeSidebar}
                className="text-stone-700 dark:text-stone-200 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
              >
                <Menu size={24} />
              </button>
              <span className="font-bold text-lg tracking-tight text-stone-900 dark:text-stone-100">
                Hop-In
              </span>
            </div>

            {/* Desktop logo row - MAXIMUM ROUND LOGO */}
            <div className="hidden md:flex h-16 items-center gap-3 px-6 border-b border-stone-100 dark:border-stone-800">
              <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-full overflow-hidden bg-linear-to-br from-orange-100 to-orange-200 dark:from-orange-900/50 dark:to-orange-800/50 border-2 border-orange-200/50 dark:border-orange-500/30 shadow-sm ring-1 ring-stone-100/50 dark:ring-stone-800/50">
                <img
                  src={logo}
                  alt="Hop-In Logo"
                  className="h-10 w-10 object-contain"
                />
              </div>
              <span className="font-bold text-xl tracking-tight text-stone-900 dark:text-stone-100">
                Hop-In
              </span>
            </div>

            {/* Profile section (hosteller content, owner layout) */}
            <div className="h-20 flex items-center px-4 border-b border-stone-100 dark:border-stone-800 shrink-0">
              <div
                className="flex items-center gap-3 w-full group cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-800 p-3 -m-3 rounded-xl transition-all duration-200 bg-stone-50/50 dark:bg-transparent border border-stone-200/50 dark:border-0"
                onClick={handleProfileClick}
              >
                <div className="h-10 w-10 shrink-0 bg-linear-to-br from-orange-100 to-orange-200 dark:from-orange-900/50 dark:to-orange-800/50 rounded-xl overflow-hidden border-2 border-stone-200 dark:border-stone-700 shadow-sm">
                  <img
                    src={getUserAvatar(user)}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-stone-900 dark:text-stone-100 leading-tight truncate max-w-[140px] group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                    {user?.fullName || "Loading..."}
                  </div>
                  <div className="text-xs text-stone-500 dark:text-stone-400 truncate max-w-[140px]">
                    {user?.email || "user@example.com"}
                  </div>
                  <div className="text-xs text-emerald-600 font-medium mt-1">
                    {user?.role || "HOSTELLER"}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const active = isActive(item.path);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={closeSidebar}
                    className={`flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? "bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-500"
                        : "text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        size={20}
                        className={
                          active
                            ? "text-orange-600 dark:text-orange-500"
                            : "text-stone-400 dark:text-stone-500"
                        }
                      />
                      <span className="truncate">{item.name}</span>
                    </div>
                    {active && (
                      <ChevronRight
                        size={16}
                        className="text-orange-400 opacity-50"
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Logout */}
            <div className="absolute bottom-0 w-full p-4 border-t border-stone-100 dark:border-stone-800">
              <button
                onClick={() => {
                  closeSidebar();
                  handleLogout();
                }}
                disabled={isLoggingOut || loading}
                className="flex w-full items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoggingOut || loading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full"></div>
                    Signing out...
                  </>
                ) : (
                  <>
                    <LogOut size={20} /> Sign Out
                  </>
                )}
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content – same pattern as OwnerLayout */}
        <main className="flex-1 flex flex-col h-[calc(100vh-57px)] md:h-screen overflow-hidden">
          {/* Desktop header */}
          <header className="hidden md:flex h-16 shrink-0 items-center justify-between px-8 border-b border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md sticky top-0 z-10">
            <div className="text-sm text-stone-500 dark:text-stone-400">
              Hosteller Portal /{" "}
              <span className="font-medium text-stone-900 dark:text-stone-100 capitalize">
                {navItems.find((i) => location.pathname.startsWith(i.path))
                  ?.name || ""}
              </span>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans p-4 md:p-8">
            <div className="max-w-7xl mx-auto min-h-full">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default HostellerLayout;
