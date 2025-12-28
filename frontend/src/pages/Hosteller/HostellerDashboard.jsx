import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";


import {
  BedDouble,
  Clock,
  Search,
  MapPin,
  ArrowRight,
  Bell,
  Wallet,
} from "lucide-react";
import { useSelector } from "react-redux";

const HostellerDashboard = () => {
  const { user } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  useEffect(() => {
    const handleNavigate = () => {
      if (user) {
        if (user.role === "ADMIN" || user.role === "OWNER") {
          navigate(`/owner/browse`);
        } else {
          navigate(`/hosteller/browse`);
        }
      } else {
        // Optional: redirect to login
        navigate("/login");
      }
    };

    handleNavigate();
  }, []);

  // Mock Data (Replace with real API data)
  const activeStay = {
    isActive: true,
    hostelName: "The Grind House",
    roomNumber: "204-B",
    nextPaymentDate: "15 Nov 2023",
    image:
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=2069&auto=format&fit=crop",
  };

  const recentRequests = [
    { id: 1, hostel: "The Daily Bean", status: "PENDING", date: "2 days ago" },
    {
      id: 2,
      hostel: "Espresso Towers",
      status: "REJECTED",
      date: "1 week ago",
    },
  ];

  // Helper for Status Badge
  const StatusBadge = ({ status }) => {
    const styles = {
      PENDING:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      ACCEPTED:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      REJECTED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
    return (
      <span
        className={`px-2 py-0.5 rounded text-xs font-bold ${
          styles[status] || styles.PENDING
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">
            Welcome back, Alex! 👋
          </h1>
          <p className="text-stone-500 dark:text-stone-400 mt-1">
            Here's what's happening with your accommodation today.
          </p>
        </div>
        <button
          onClick={() => navigate("/hosteller/browse")}
          className="flex items-center gap-2 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 px-5 py-2.5 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
        >
          <Search size={18} />
          Find Hostel
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2/3 width) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Active Stay Card */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
                Current Stay
              </h2>
              {activeStay.isActive && (
                <button
                  onClick={() => navigate("/hosteller/stay")}
                  className="text-sm font-medium text-orange-600 hover:text-orange-700"
                >
                  Manage Stay &rarr;
                </button>
              )}
            </div>

            {activeStay.isActive ? (
              <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm group hover:shadow-md transition-all">
                <div className="grid grid-cols-1 md:grid-cols-3">
                  {/* Image */}
                  <div className="h-48 md:h-auto w-full relative">
                    <img
                      src={activeStay.image}
                      alt="Hostel"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent md:hidden"></div>
                    <div className="absolute bottom-4 left-4 text-white md:hidden">
                      <h3 className="font-bold text-lg">
                        {activeStay.hostelName}
                      </h3>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-6 md:col-span-2 flex flex-col justify-between">
                    <div>
                      <div className="hidden md:block mb-2">
                        <h3 className="font-bold text-xl text-stone-900 dark:text-stone-100">
                          {activeStay.hostelName}
                        </h3>
                        <p className="text-sm text-stone-500 flex items-center gap-1">
                          <MapPin size={14} /> Downtown, Metro City
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="p-3 bg-stone-50 dark:bg-stone-800 rounded-xl">
                          <p className="text-xs text-stone-500 uppercase font-semibold mb-1">
                            Room
                          </p>
                          <p className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                            <BedDouble size={16} className="text-orange-600" />{" "}
                            {activeStay.roomNumber}
                          </p>
                        </div>
                        <div className="p-3 bg-stone-50 dark:bg-stone-800 rounded-xl">
                          <p className="text-xs text-stone-500 uppercase font-semibold mb-1">
                            Next Payment
                          </p>
                          <p className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                            <Wallet size={16} className="text-green-600" />{" "}
                            {activeStay.nextPaymentDate}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Empty State for Stay */
              <div className="p-8 rounded-2xl bg-stone-50 dark:bg-stone-900 border-2 border-dashed border-stone-200 dark:border-stone-800 text-center">
                <div className="w-16 h-16 bg-stone-200 dark:bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-4 text-stone-400">
                  <BedDouble size={32} />
                </div>
                <h3 className="font-bold text-stone-900 dark:text-stone-100">
                  No Active Stay
                </h3>
                <p className="text-stone-500 text-sm mt-1 mb-4">
                  You are not currently checked into any hostel.
                </p>
                <button
                  onClick={() => navigate("/hosteller/browse")}
                  className="text-orange-600 font-bold text-sm hover:underline"
                >
                  Browse Hostels to Join
                </button>
              </div>
            )}
          </section>

          {/* Quick Actions Grid */}
          <section>
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => navigate("/hosteller/requests")}
                className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-orange-200 dark:hover:border-orange-900/50 hover:shadow-sm transition-all text-left group"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 mb-3 group-hover:scale-110 transition-transform">
                  <Clock size={20} />
                </div>
                <h3 className="font-bold text-stone-900 dark:text-stone-100">
                  Check Request Status
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  See updates on your applications
                </p>
              </button>

              <button
                onClick={() => navigate("/hosteller/profile")}
                className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-orange-200 dark:hover:border-orange-900/50 hover:shadow-sm transition-all text-left group"
              >
                <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 mb-3 group-hover:scale-110 transition-transform">
                  <Wallet size={20} />
                </div>
                <h3 className="font-bold text-stone-900 dark:text-stone-100">
                  Update Payment Info
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Manage your billing details
                </p>
              </button>
            </div>
          </section>
        </div>

        {/* Right Column (1/3 width) - Sidebar Widgets */}
        <div className="space-y-8">
          {/* Recent Activity Widget */}
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <Bell size={18} className="text-orange-600" /> Recent Activity
              </h3>
            </div>

            <div className="space-y-4">
              {recentRequests.length > 0 ? (
                recentRequests.map((req) => (
                  <div
                    key={req.id}
                    className="flex items-start gap-3 pb-4 border-b border-stone-100 dark:border-stone-800 last:border-0 last:pb-0"
                  >
                    <div
                      className={`mt-1 w-2 h-2 rounded-full ${
                        req.status === "PENDING"
                          ? "bg-yellow-400"
                          : "bg-red-400"
                      }`}
                    ></div>
                    <div>
                      <p className="text-sm font-medium text-stone-900 dark:text-stone-100">
                        Request to join{" "}
                        <span className="font-bold">{req.hostel}</span> was{" "}
                        <StatusBadge status={req.status} />
                      </p>
                      <p className="text-xs text-stone-400 mt-1">{req.date}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-stone-500 text-center py-4">
                  No recent activity.
                </p>
              )}
            </div>

            <button
              onClick={() => navigate("/hosteller/requests")}
              className="w-full mt-4 py-2 text-xs font-bold text-stone-500 hover:text-stone-900 dark:hover:text-stone-300 border border-stone-200 dark:border-stone-700 rounded-lg transition-colors"
            >
              View All History
            </button>
          </div>

          {/* Explore Promo Widget */}
          <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-orange-600 to-orange-800 p-6 text-white shadow-lg">
            <div className="relative z-10">
              <h3 className="font-bold text-xl mb-2">Find your next home</h3>
              <p className="text-orange-100 text-sm mb-4">
                Browse over 50+ verified hostels in your area with premium
                amenities.
              </p>
              <button
                onClick={() => navigate("/hosteller/browse")}
                className="bg-white text-orange-700 px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-orange-50 transition-colors flex items-center gap-2"
              >
                Start Exploring <ArrowRight size={14} />
              </button>
            </div>
            {/* Decorative Circle */}
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostellerDashboard;
