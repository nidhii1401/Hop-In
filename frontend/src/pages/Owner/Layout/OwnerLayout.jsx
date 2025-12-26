import React, { useEffect, useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userLogout } from "../../../redux/slices/authSlices.js";
import ProtectedRoute from "../../../components/ProtectedRoute.jsx";
import { toastError, toastSuccess } from "../../../utils/toast.js";
import {
  LayoutDashboard,
  BedDouble,
  LogOut,
  Menu,
  ChevronRight,
  Search,
} from "lucide-react";
import { getUserAvatar } from "../../../utils/avatarUtils.js";
import logo from "../../../../src/logo.jpeg";

const OwnerLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, user } = useSelector((state) => state.auth);

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      await dispatch(userLogout()).unwrap();
      toastSuccess("Signed out");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      toastError(error?.message || "Logout failed");
      navigate("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const navItems = [
    // {
    //   name: "Overview",
    //   path: "/owner/dashboard",
    //   icon: <LayoutDashboard size={20} />,
    // },
    {
      name: "My Hostels",
      path: "/owner/hostels",
      icon: <BedDouble size={20} />,
    },
    { name: "Explore", path: "/owner/browse", icon: <Search size={20} /> },
  ];

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  useEffect(() => {
    const isSmallScreen = window.innerWidth < 768; // Tailwind md breakpoint

    if (isSmallScreen && isMobileMenuOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original || "";
      };
    }

    if (isSmallScreen && !isMobileMenuOpen) {
      document.body.style.overflow = "";
    }
  }, [isMobileMenuOpen]);

  return (
    <ProtectedRoute requiredRole="OWNER">
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans flex flex-col md:flex-row">
        {/* Mobile Header */}
        <div className="md:hidden sticky top-0 z-30 bg-white/95 dark:bg-stone-900/95 backdrop-blur-sm border-b border-stone-200 dark:border-stone-800 px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2 text-orange-700 dark:text-orange-500">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-stone-700 dark:text-stone-200 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
            >
              <Menu size={24} />
            </button>
            <span className="font-bold text-lg tracking-tight text-stone-900 dark:text-stone-100">
              Hop-In
            </span>
          </div>
        </div>

        {/* 🔹 BLUR BACKDROP on mobile */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={closeMobileMenu}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-stone-900 border-r border-stone-200 dark:border-stone-800 transform transition-transform duration-300 md:relative md:translate-x-0 ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* 🔹 sidebar top bar (Menu + Hop-In) visible only on mobile */}
          <div className="md:hidden h-16 flex items-center gap-2 px-4 border-b border-stone-100 dark:border-stone-800">
            <button
              onClick={closeMobileMenu}
              className="text-stone-700 dark:text-stone-200 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
            >
              <Menu size={24} />
            </button>
            <span className="font-bold text-lg tracking-tight text-stone-900 dark:text-stone-100">
              Hop-In
            </span>
          </div>

          {/* Desktop logo row - REPLACED WITH IMAGE */}
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

          {/* Profile section */}
          <div className="h-20 flex items-center px-4 border-b border-stone-100 dark:border-stone-800 shrink-0">
            <div
              className="flex items-center gap-3 w-full group cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-800 p-3 -m-3 rounded-xl transition-all duration-200 bg-stone-50/50 dark:bg-transparent border border-stone-200/50 dark:border-0"
              onClick={() => {
                navigate("/owner/settings");
                closeMobileMenu();
              }}
            >
              <div className="h-10 w-10 shrink-0 from-orange-100 to-orange-200 dark:from-orange-900/50 dark:to-orange-800/50 rounded-xl overflow-hidden border-2 border-stone-200 dark:border-stone-700 shadow-sm">
                <img
                  src={getUserAvatar(user)}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-stone-900 dark:text-stone-100 leading-tight truncate max-w-[140px] group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                  {user?.fullName || user?.name || "Loading..."}
                </div>
                <div className="text-xs text-stone-500 dark:text-stone-400 truncate max-w-[140px]">
                  {user?.email || "user@example.com"}
                </div>
                <div className="text-xs text-emerald-600 font-medium mt-1">
                  {user?.role || "OWNER"}
                </div>
              </div>
            </div>
          </div>

          <nav className="p-2 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeMobileMenu}
                className={`flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? "bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-500"
                    : "text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`${
                      isActive(item.path)
                        ? "text-orange-600 dark:text-orange-500"
                        : "text-stone-400 dark:text-stone-500"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="truncate">{item.name}</span>
                </div>
                {isActive(item.path) && (
                  <ChevronRight
                    size={16}
                    className="text-orange-400 opacity-50"
                  />
                )}
              </Link>
            ))}
          </nav>

          <div className="absolute bottom-0 w-full p-4 border-t border-stone-100 dark:border-stone-800 ">
            <button
              onClick={() => {
                closeMobileMenu();
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
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col h-[calc(100vh-57px)] md:h-screen overflow-hidden">
          <header className="hidden md:flex h-16 shrink-0 items-center justify-between px-8 border-b border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md sticky top-0 z-10">
            <div className="text-sm text-stone-500 dark:text-stone-400">
              Owner Portal /{" "}
              <span className="font-medium text-stone-900 dark:text-stone-100 capitalize">
                {location.pathname.split("/").pop().replace("-", " ")}
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

export default OwnerLayout;
