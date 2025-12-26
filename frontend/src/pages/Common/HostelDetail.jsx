// src/pages/Hosteller/HostelDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Wifi,
  Wind,
  Zap,
  Utensils,
  BookOpen,
  Lock,
  MapPin,
  Users,
  BedDouble,
  CheckCircle,
  User,
  Phone,
  Mail,
  Copy,
  Check,
  ChevronLeft,
} from "lucide-react";
import { AlertTriangle } from "lucide-react";
import { getHostelById } from "../../apis/hostellerApis.js";
import { useSelector } from "react-redux";
import Loader from "./UI/Loader.jsx";
import { getUserAvatar } from "../../utils/avatarUtils.js";

const amenityIconMap = {
  "Wi-Fi": Wifi,
  "High-Speed Wi-Fi": Wifi,
  "Air Conditioning": Wind,
  "Power Backup": Zap,
  "Shared Kitchen": Utensils,
  "Study Areas": BookOpen,
  "Secure Lockers": Lock,
};

const HostelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hostel, setHostel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add these states at the top of your HostelDetail component
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const { user } = useSelector((state) => state.auth);

  // Add navigation handler
  const handleNavigate = (hostel_id) => {
    if (user) {
      if (user.role === "ADMIN" || user.role === "OWNER") {
        navigate(`/owner/hostel/${hostel_id}/residents`);
      } else {
        navigate(`/hosteller/hostel/${hostel_id}/residents`);
      }
    } else {
      // Optional: redirect to login
      navigate("/login");
    }
  };

  const handleBackNavigation = () => {
    navigate(-1);
  };

  const copyToClipboard = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text);
      if (field === "phone") {
        setCopiedPhone(true);
        setTimeout(() => setCopiedPhone(false), 2000);
      } else if (field === "email") {
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2000);
      }
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  useEffect(() => {
    const fetchHostel = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getHostelById(id);
        const h = data.hostel;
        setHostel(h);
      } catch (err) {
        setError(err.message || "Failed to load hostel details");
      } finally {
        setLoading(false);
      }
    };
    fetchHostel();
  }, [id]);

  if (loading) {
    return <Loader size="lg" text="Loading hostel..." className="py-20" />;
  }

  if (error || !hostel) {
    return (
      <div className="w-full max-w-3xl mx-auto py-16">
        <div className="bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-xl p-6 flex items-start gap-3">
          <AlertTriangle className="h-6 w-6 text-orange-500 mt-0.5" />
          <div>
            <h2 className="text-lg font-bold text-orange-900 dark:text-orange-100 mb-1">
              Unable to load hostel
            </h2>
            <p className="text-sm text-orange-800 dark:text-orange-200">
              {error || "Hostel not found or an unexpected error occurred."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const imageUrls =
    hostel.media && hostel.media.length
      ? hostel.media.map((m) => m.url)
      : [
          "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=2069&auto=format&fit=crop",
        ];

  const mainImage = imageUrls[0];
  const otherImages = imageUrls.slice(1, 5);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm font-medium text-stone-500">
        <span
          className="cursor-pointer hover:text-stone-900"
          onClick={() => handleBackNavigation()}
        >
          {" "}
          <ChevronLeft size={20} />
        </span>
        <span
          className="cursor-pointer hover:text-stone-900"
          onClick={() => handleBackNavigation()}
        >
          Hostels
        </span>
        <span className="cursor-pointer hover:text-stone-900">
          {hostel.city || "City"}
        </span>
        <span>/</span>
        <span className="text-stone-900 dark:text-stone-100">
          {hostel.name}
        </span>
      </nav>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
            {hostel.name}
          </h1>
          <div className="flex items-center gap-2 mt-2 text-stone-500 dark:text-stone-400">
            <MapPin size={18} />
            <span className="text-lg">
              {hostel.area}, {hostel.city}
            </span>
          </div>
        </div>
        {hostel.messType && hostel.messType !== "NONE" && (
          <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 rounded-lg font-medium self-start">
            <Utensils size={18} />
            Mess Available
          </div>
        )}
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[400px] md:h-[500px]">
        <div className="md:col-span-2 md:row-span-2 relative rounded-2xl overflow-hidden group">
          <img
            src={mainImage}
            alt="Main View"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        {otherImages.map((img, idx) => (
          <div
            key={idx}
            className="relative rounded-2xl overflow-hidden group hidden md:block"
          >
            <img
              src={img}
              alt={`View ${idx + 1}`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        ))}
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left */}
        <div className="lg:col-span-2 space-y-12">
          {/* Overview */}
          <section>
            <h3 className="text-2xl font-bold text-stone-900 dark:text-stone-100 border-b border-stone-200 dark:border-stone-800 pb-3 mb-4">
              Overview
            </h3>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed text-lg">
              {hostel.description || "No description provided."}
            </p>
          </section>

          {/* Amenities */}
          {!!hostel.amenities?.length && (
            <section>
              <h3 className="text-2xl font-bold text-stone-900 dark:text-stone-100 border-b border-stone-200 dark:border-stone-800 pb-3 mb-6">
                Amenities
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-6 gap-x-4">
                {hostel.amenities.map((name, idx) => {
                  const Icon = amenityIconMap[name] || CheckCircle;
                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-3 text-stone-700 dark:text-stone-300"
                    >
                      <Icon size={20} className="text-orange-600" />
                      <span className="font-medium">{name}</span>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Room Categories */}
          {!!hostel.roomCategories?.length && (
            <section>
              <h3 className="text-2xl font-bold text-stone-900 dark:text-stone-100 border-b border-stone-200 dark:border-stone-800 pb-3 mb-6">
                Room Categories
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {hostel.roomCategories.map((category) => {
                  const hasAvailability =
                    category.emptyRooms > 0 || category.totalAvailableBeds > 0;

                  return (
                    <div
                      key={category.capacity}
                      className="p-6 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex flex-col gap-4 hover:shadow-md transition-all duration-200"
                    >
                      {/* Header with status badge */}
                      <div className="flex items-center justify-between">
                        <h4 className="text-xl font-bold text-stone-900 dark:text-stone-100">
                          {category.capacity} Seater
                        </h4>
                        <span
                          className={`text-sm font-semibold px-3 py-1 rounded-full ${
                            hasAvailability
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 animate-pulse"
                              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 animate-pulse"
                          }`}
                        >
                          {hasAvailability ? "Available" : "Full"}
                        </span>
                      </div>

                      {/* Occupancy Progress Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-stone-500 dark:text-stone-400">
                            Occupancy
                          </span>
                          <span className="font-semibold text-stone-900 dark:text-stone-100">
                            {category.occupancyRate}%
                          </span>
                        </div>
                        <div className="w-full bg-stone-200 dark:bg-stone-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-700 ${
                              hasAvailability ? "bg-green-500" : "bg-red-500"
                            }`}
                            style={{ width: `${category.occupancyRate}%` }}
                          />
                        </div>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="text-center p-2 bg-stone-50 dark:bg-stone-800/50 rounded-lg">
                          <div className="font-bold text-lg text-stone-900 dark:text-stone-100">
                            {category.emptyRooms} of {category.totalRooms}
                          </div>
                          <div className="text-stone-500 dark:text-stone-400 text-xs">
                            Empty Rooms
                          </div>
                        </div>
                        <div className="text-center p-2 bg-stone-50 dark:bg-stone-800/50 rounded-lg">
                          <div
                            className={`font-bold text-lg ${
                              hasAvailability
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            {category.totalAvailableBeds}
                          </div>
                          <div className="text-stone-500 dark:text-stone-400 text-xs">
                            Available Beds
                          </div>
                        </div>
                      </div>

                      {/* Price */}
                      {category.minPrice && (
                        <div className="pt-2 border-t border-stone-200 dark:border-stone-700">
                          <p className="text-sm text-stone-600 dark:text-stone-400">
                            Price range:{" "}
                            <span className="font-bold text-orange-600 dark:text-orange-400">
                              ₹{category.minPrice.toLocaleString()}
                              {category.minPrice !== category.maxPrice &&
                                ` - ₹${category.maxPrice.toLocaleString()}`}
                              /mo
                            </span>
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        {/* Right Sidebar */}
        <aside className="lg:col-span-1 lg:sticky lg:top-24 h-fit space-y-8">
          {/* FIXED Hostel Snapshot - Clean Hover */}
          <div
            className="bg-white dark:bg-stone-900 p-4 sm:p-6 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-3 cursor-pointer hover:shadow-xl hover:shadow-orange-100/50 dark:hover:shadow-orange-900/20 hover:border-orange-200 dark:hover:border-orange-700/50 transition-all duration-300 group relative overflow-hidden"
            onClick={() => handleNavigate(hostel.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleNavigate(hostel.id);
              }
            }}
          >
            <h3 className="font-bold text-stone-900 dark:text-stone-100 mb-2 flex items-center gap-2 text-sm sm:text-base group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-200">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-all duration-200" />
              Hostel Snapshot
            </h3>

            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-stone-500 dark:text-stone-400 group-hover:text-stone-600 dark:group-hover:text-stone-300 transition-colors">
                Total Rooms
              </span>
              <span className="font-semibold text-stone-900 dark:text-stone-100 group-hover:text-orange-700 dark:group-hover:text-orange-300 transition-colors">
                {hostel.totalRooms ?? 0}
              </span>
            </div>

            {/* Active Residents */}
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-stone-500 dark:text-stone-400 group-hover:text-stone-600 dark:group-hover:text-stone-300 transition-colors">
                Active Residents
              </span>
              <div className="flex items-center">
                {hostel.totalActiveResidents === 0 ? (
                  <span className="font-semibold text-stone-900 dark:text-stone-100 group-hover:text-orange-700 dark:group-hover:text-orange-300 transition-colors">
                    0
                  </span>
                ) : (
                  <div className="flex items-center gap-1 -space-x-1.5 sm:gap-1.5 sm:-space-x-2">
                    {hostel.activeResidentsPreview
                      ?.slice(0, 4)
                      .map((resident, index) => (
                        <div
                          key={resident.id}
                          className="h-5 w-5 sm:h-7 sm:w-7 rounded-full ring-2 ring-white/80 dark:ring-stone-900 shadow-md hover:scale-110 group-hover:ring-orange-200 dark:group-hover:ring-orange-500/50 transition-all duration-200 z-20"
                          style={{ zIndex: 4 - index }}
                        >
                          <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${resident.id}`}
                            alt={resident.fullName}
                            className="h-full w-full object-cover rounded-full"
                          />
                        </div>
                      ))}
                    {hostel.totalActiveResidents > 4 && (
                      <div className="h-5 w-5 sm:h-7 sm:w-7 bg-stone-200 dark:bg-stone-700 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-semibold text-stone-500 dark:text-stone-400 ring-2 ring-white/80 dark:ring-stone-900 group-hover:bg-orange-100 dark:group-hover:bg-orange-900/30 group-hover:text-orange-700 dark:group-hover:text-orange-300 group-hover:ring-orange-200 dark:group-hover:ring-orange-500/50 shadow-md z-10 -ml-0.5 sm:-ml-1 transition-all duration-200">
                        +{hostel.totalActiveResidents - 4}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {hostel.minPrice && (
              <div className="flex items-center justify-between text-xs sm:text-sm pt-1">
                <span className="text-stone-500 dark:text-stone-400 group-hover:text-stone-600 dark:group-hover:text-stone-300 transition-colors">
                  Starting from
                </span>
                <span className="font-semibold text-orange-600 dark:text-orange-400">
                  ₹{hostel.minPrice.toLocaleString()}/mo
                </span>
              </div>
            )}
          </div>

          {/*  OWNER DETAIL CARD */}
          {hostel.owner && (
            <div className="bg-white dark:bg-stone-900 p-5 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-stone-200 dark:border-stone-700">
                <h3 className="font-bold text-stone-900 dark:text-stone-100 mb-2 flex items-center gap-2">
                  <User size={18} /> Owner Details
                </h3>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="relative w-10 h-10 rounded-full ring-2 ring-white dark:ring-stone-900 shadow-sm hover:scale-105 transition-transform duration-200">
                  {hostel.owner.avatarUrl ? (
                    <img
                      src={hostel.owner.avatarUrl || getUserAvatar(hostel.owner)}
                      alt={`${hostel.owner.fullName}'s profile`}
                      className="h-full w-full object-cover rounded-full"
                      onError={(e) => {
                        e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${hostel.owner.id}`;
                      }}
                    />
                  ) : (
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${hostel.owner.id}`}
                      alt={`${hostel.owner.fullName}'s avatar`}
                      className="h-full w-full object-cover rounded-full"
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base text-stone-900 dark:text-stone-100 truncate">
                    {hostel.owner.fullName}
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Hostel Owner
                  </p>
                </div>
              </div>

              <div className="space-y-2 -mx-1 pt-1">
                {hostel.owner.phone && (
                  <div className="flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-orange-50 dark:hover:bg-stone-800/50 transition-all duration-200 group -mx-1">
                    <div className="w-9 h-9 bg-orange-50 dark:bg-orange-900/20 group-hover:bg-orange-100 dark:group-hover:bg-orange-800/30 rounded-lg flex items-center justify-center shrink-0 border border-orange-200/50 dark:border-orange-700/50 group-hover:border-orange-300 dark:group-hover:border-orange-600/50">
                      <Phone className="w-4 h-4 text-orange-600 dark:text-orange-400 group-hover:scale-105 transition-transform" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-stone-700 dark:text-stone-300 group-hover:text-stone-900 dark:group-hover:text-stone-100">
                        Phone
                      </p>
                      <p className="text-xs font-medium text-stone-600 dark:text-stone-400 truncate pr-8">
                        {hostel.owner.phone}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        copyToClipboard(hostel.owner.phone, "phone")
                      }
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

                {hostel.owner.email && (
                  <div className="flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-orange-50 dark:hover:bg-stone-800/50 transition-all duration-200 group -mx-1">
                    <div className="w-9 h-9 bg-orange-50 dark:bg-orange-900/20 group-hover:bg-orange-100 dark:group-hover:bg-orange-800/30 rounded-lg flex items-center justify-center shrink-0 border border-orange-200/50 dark:border-orange-700/50 group-hover:border-orange-300 dark:group-hover:border-orange-600/50">
                      <Mail className="w-4 h-4 text-orange-600 dark:text-orange-400 group-hover:scale-105 transition-transform" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-stone-700 dark:text-stone-300 group-hover:text-stone-900 dark:group-hover:text-stone-100">
                        Email
                      </p>
                      <p className="text-xs font-medium text-stone-600 dark:text-stone-400 truncate pr-8">
                        {hostel.owner.email}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        copyToClipboard(hostel.owner.email, "email")
                      }
                      className="p-1.5 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-lg transition-colors ml-1 group"
                      title="Copy email address"
                    >
                      {copiedEmail ? (
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
          {hostel.messType && hostel.messType !== "NONE" && (
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
                    {hostel.messType}
                  </span>
                </div>
                {hostel.messPricePerMonth && (
                  <div className="flex justify-between">
                    <span className="text-stone-600 dark:text-stone-400">
                      Price
                    </span>
                    <span className="font-semibold text-stone-900 dark:text-stone-100">
                      ₹{Number(hostel.messPricePerMonth).toLocaleString()} /
                      month
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

export default HostelDetail;
