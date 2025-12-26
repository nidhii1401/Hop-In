// src/pages/Hosteller/MyStay.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Loader2,
  AlertTriangle,
  MapPin,
  BedDouble,
  Utensils,
  Users,
  Phone,
  Mail,
  Copy,
  Check,
  Building2,
  User,
  Award,
} from "lucide-react";
import { getMyStay } from "../../apis/hostellerApis.js";
import Loader from "../Common/UI/Loader.jsx";

const MyStay = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  useEffect(() => {
    const fetchMyStay = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getMyStay();
        setData(response.data);
      } catch (err) {
        setError(err.message || "Failed to load your stay");
      } finally {
        setLoading(false);
      }
    };
    fetchMyStay();
  }, []);

  if (loading) {
    return <Loader size="lg" text="Loading your stay..." className="py-20" />;
  }

  if (error || !data?.stay) {
    return (
      <div className="min-h-[calc(100vh-4rem)] w-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl w-full text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Small pill */}
          <div className="inline-flex items-center gap-2 rounded-full bg-white dark:bg-stone-800 px-4 py-1.5 text-xs font-medium text-orange-600 dark:text-orange-300 shadow-sm border border-stone-200 dark:border-stone-700">
            <AlertTriangle className="h-4 w-4" />
            <span>No active stay found</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-stone-900 dark:text-stone-50">
            Your bunk is still empty,&nbsp;
            <span className="text-orange-600 dark:text-orange-400">
              time to fill it.
            </span>
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 max-w-xl mx-auto">
            You don&apos;t have an active hostel stay right now. Browse hostels,
            compare rooms and lock in a spot before someone else grabs your
            dream bed.
          </p>

          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            Little nudge: early birds get quieter rooms, better views and
            shorter mess queues.
          </p>

          {/* Actions */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => navigate("/hosteller/browse")}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-orange-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500/70 focus:ring-offset-2 dark:focus:ring-offset-stone-900 transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <BedDouble className="h-4 w-4 animate-bounce" />
              <span>Browse hostels</span>
            </button>

            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 rounded-full border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-4 py-2 text-xs sm:text-sm font-medium text-stone-700 dark:text-stone-200 hover:border-stone-400 dark:hover:border-stone-500 hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Go back
            </button>
          </div>

          {/* Playful line */}
          <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-stone-500 dark:text-stone-400">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-sm">
              🧳
            </span>
            <span>
              “One click, one booking, and your next hostel story begins.”
            </span>
          </div>
        </div>
      </div>
    );
  }

  const { stay, roommates, totalRoommates, occupancy } = data;
  const messOpted = stay.isMessOpted;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm font-medium text-stone-500">
        <span
          className="cursor-pointer hover:text-stone-900 flex items-center gap-2"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft size={20} />
          My Stay
        </span>
      </nav>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
            {stay.hostel.name}
          </h1>
          <div className="flex items-center gap-2 mt-2 text-stone-500 dark:text-stone-400">
            <MapPin size={18} />
            <span className="text-lg">
              {stay.hostel.area}, {stay.hostel.city}
            </span>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left */}
        <div className="lg:col-span-2 space-y-12">
          <section>
            <h3 className="text-2xl font-bold text-stone-900 dark:text-stone-100 border-b border-stone-200 dark:border-stone-800 pb-3 mb-4">
              Room Details
            </h3>

            <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 space-y-3">
              {/* Top row: room info */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <BedDouble className="w-4 h-4 text-orange-500" />
                  <span className="font-semibold text-stone-900 dark:text-stone-100">
                    Room {stay.room.roomNumber}
                  </span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                  {stay.room.capacity}-sharing
                </span>
              </div>

              {/* Second row: type + floor */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm text-stone-600 dark:text-stone-400">
                <span>Type: {stay.room.roomType || "Standard"}</span>
                <span>Floor: {stay.room.floor || "G"}</span>
              </div>

              {/* Price */}
              <div className="flex items-center justify-between pt-2 border-t border-stone-200 dark:border-stone-700 text-sm">
                <span className="text-stone-500 dark:text-stone-400">
                  Price
                </span>
                <span className="font-semibold text-orange-600 dark:text-orange-400">
                  ₹{Number(stay.room.pricePerMonth).toLocaleString()}/month
                </span>
              </div>
            </div>
          </section>

          {/* Roommates */}
          {totalRoommates > 0 && (
            <section>
              <h3 className="text-2xl font-bold text-stone-900 dark:text-stone-100 border-b border-stone-200 dark:border-stone-800 pb-3 mb-6">
                Roommates ({totalRoommates})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {roommates.map((roommate) => (
                  <div
                    key={roommate.hosteller.id}
                    className="p-6 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:shadow-md transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="relative w-12 h-12 rounded-full ring-2 ring-white dark:ring-stone-900 shadow-sm group-hover:scale-105 transition-transform">
                        <img
                          src={
                            roommate.hosteller.avatarUrl ||
                            `https://api.dicebear.com/7.x/avataaars/svg?seed=${roommate.hosteller.id}`
                          }
                          alt={roommate.hosteller.fullName}
                          className="h-full w-full object-cover rounded-full"
                          onError={(e) => {
                            e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${roommate.hosteller.id}`;
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-stone-900 dark:text-stone-100 truncate">
                          {roommate.hosteller.fullName}
                        </h4>
                        <p className="text-sm text-stone-500 dark:text-stone-400 truncate">
                          {roommate.hosteller.hostellerProfile?.collegeName ||
                            "College"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {roommate.hosteller.phone && (
                        <div className="flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-orange-50 dark:hover:bg-stone-800/50 transition-all duration-200 group/contact -mx-1">
                          <div className="w-9 h-9 bg-orange-50 dark:bg-orange-900/20 group-hover/contact:bg-orange-100 dark:group-hover/contact:bg-orange-800/30 rounded-lg flex items-center justify-center shrink-0 border border-orange-200/50 dark:border-orange-700/50 group-hover/contact:border-orange-300 dark:group-hover/contact:border-orange-600/50">
                            <Phone className="w-4 h-4 text-orange-600 dark:text-orange-400 group-hover/contact:scale-105 transition-transform" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium text-stone-500 dark:text-stone-400">
                              Phone
                            </p>
                            <p className="text-sm font-medium text-stone-600 dark:text-stone-400 truncate pr-8">
                              {roommate.hosteller.phone}
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              copyToClipboard(roommate.hosteller.phone)
                            }
                            className="p-1.5 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-lg transition-colors ml-1 group/contact"
                            title="Copy phone number"
                          >
                            {copiedPhone ? (
                              <Check className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4 text-stone-400 group-hover/contact:text-stone-600 dark:group-hover/contact:text-stone-300" />
                            )}
                          </button>
                        </div>
                      )}
                      {roommate.hosteller.email && (
                        <div className="flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-orange-50 dark:hover:bg-stone-800/50 transition-all duration-200 group/contact -mx-1">
                          <div className="w-9 h-9 bg-orange-50 dark:bg-orange-900/20 group-hover/contact:bg-orange-100 dark:group-hover/contact:bg-orange-800/30 rounded-lg flex items-center justify-center shrink-0 border border-orange-200/50 dark:border-orange-700/50 group-hover/contact:border-orange-300 dark:group-hover/contact:border-orange-600/50">
                            <Mail className="w-4 h-4 text-orange-600 dark:text-orange-400 group-hover/contact:scale-105 transition-transform" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium text-stone-500 dark:text-stone-400">
                              Email
                            </p>
                            <p className="text-sm font-medium text-stone-600 dark:text-stone-400 truncate pr-8">
                              {roommate.hosteller.email}
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              copyToClipboard(roommate.hosteller.email)
                            }
                            className="p-1.5 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-lg transition-colors ml-1 group/contact"
                            title="Copy email address"
                          >
                            {copiedPhone ? (
                              <Check className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4 text-stone-400 group-hover/contact:text-stone-600 dark:group-hover/contact:text-stone-300" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Sidebar */}
        <aside className="lg:col-span-1 lg:sticky lg:top-24 h-fit space-y-8">
          {/* Owner Details */}
          {stay.hostel.owner && (
            <div className="bg-white dark:bg-stone-900 p-5 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-stone-200 dark:border-stone-700">
                <h3 className="font-bold text-stone-900 dark:text-stone-100 mb-2 flex items-center gap-2">
                  <User size={18} /> Owner Details
                </h3>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="relative w-10 h-10 rounded-full ring-2 ring-white dark:ring-stone-900 shadow-sm">
                  <img
                    src={
                      stay.hostel.owner.avatarUrl ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${stay.hostel.owner.id}`
                    }
                    alt={`${stay.hostel.owner.fullName}'s profile`}
                    className="h-full w-full object-cover rounded-full"
                    onError={(e) => {
                      e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${stay.hostel.owner.id}`;
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base text-stone-900 dark:text-stone-100 truncate">
                    {stay.hostel.owner.fullName}
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Hostel Owner
                  </p>
                </div>
              </div>

              <div className="space-y-2 -mx-1 pt-1">
                {stay.hostel.owner.phone && (
                  <div className="flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-orange-50 dark:hover:bg-stone-800/50 transition-all duration-200 group -mx-1">
                    <div className="w-9 h-9 bg-orange-50 dark:bg-orange-900/20 group-hover:bg-orange-100 dark:group-hover:bg-orange-800/30 rounded-lg flex items-center justify-center shrink-0 border border-orange-200/50 dark:border-orange-700/50 group-hover:border-orange-300 dark:group-hover:border-orange-600/50">
                      <Phone className="w-4 h-4 text-orange-600 dark:text-orange-400 group-hover:scale-105 transition-transform" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-stone-700 dark:text-stone-300 group-hover:text-stone-900 dark:group-hover:text-stone-100">
                        Phone
                      </p>
                      <p className="text-xs font-medium text-stone-600 dark:text-stone-400 truncate pr-8">
                        {stay.hostel.owner.phone}
                      </p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(stay.hostel.owner.phone)}
                      className="p-1.5 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-lg transition-colors ml-1 group"
                      title="Copy phone number"
                    >
                      {copiedPhone ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4 text-stone-400 group-hover:text-stone-600 dark:group-hover:text-stone-300" />
                      )}
                    </button>
                  </div>
                )}
                {stay.hostel.owner.email && (
                  <div className="flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-orange-50 dark:hover:bg-stone-800/50 transition-all duration-200 group -mx-1">
                    <div className="w-9 h-9 bg-orange-50 dark:bg-orange-900/20 group-hover:bg-orange-100 dark:group-hover:bg-orange-800/30 rounded-lg flex items-center justify-center shrink-0 border border-orange-200/50 dark:border-orange-700/50 group-hover:border-orange-300 dark:group-hover:border-orange-600/50">
                      <Mail className="w-4 h-4 text-orange-600 dark:text-orange-400 group-hover:scale-105 transition-transform" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-stone-700 dark:text-stone-300 group-hover:text-stone-900 dark:group-hover:text-stone-100">
                        Email
                      </p>
                      <p className="text-xs font-medium text-stone-600 dark:text-stone-400 truncate pr-8">
                        {stay.hostel.owner.email}
                      </p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(stay.hostel.owner.email)}
                      className="p-1.5 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-lg transition-colors ml-1 group"
                      title="Copy email address"
                    >
                      {copiedPhone ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4 text-stone-400 group-hover:text-stone-600 dark:group-hover:text-stone-300" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
          {/* Mess Details */}
          {stay.hostel.messType && stay.hostel.messType !== "NONE" && (
            <div className="bg-orange-50 dark:bg-orange-900/10 p-6 rounded-xl border border-orange-100 dark:border-orange-900/20">
              <div className="flex items-center gap-3 mb-4 text-orange-800 dark:text-orange-300">
                <Utensils size={24} />
                <h3 className="text-lg font-bold">Mess Details</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-stone-600 dark:text-stone-400">
                    Type
                  </span>
                  <span className="font-semibold text-stone-900 dark:text-stone-100">
                    {stay.hostel.messType}
                  </span>
                </div>
                {messOpted && (
                  <div className="flex justify-between">
                    <span className="text-stone-600 dark:text-stone-400">
                      Status
                    </span>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      Opted In
                    </span>
                  </div>
                )}
                {stay.hostel.messPricePerMonth && (
                  <div className="flex justify-between">
                    <span className="text-stone-600 dark:text-stone-400">
                      Price
                    </span>
                    <span className="font-semibold text-stone-900 dark:text-stone-100">
                      ₹{Number(stay.hostel.messPricePerMonth).toLocaleString()}
                      /month
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default MyStay;
