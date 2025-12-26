// src/pages/Hosteller/UI/HostelResidentPopUp.jsx
import React from "react";
import {
  User,
  GraduationCap,
  BookOpen,
  BedDouble,
  Calendar,
} from "lucide-react";

const HostelResidentPopUp = ({ resident, onClose }) => {
  const hostellerProfile = resident.hostellerProfile || {};

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in scale-in duration-200">
      <div className="bg-white/90 dark:bg-stone-900/90 backdrop-blur-xl rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-stone-200/50 dark:border-stone-800/50">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-3">
          <div className="flex items-center gap-3 flex-1">
            <div className="relative p-1 bg-linear-to-br from-orange-100 to-orange-200 dark:from-orange-900/50 dark:to-orange-800/50 rounded-2xl">
              <img
                src={resident.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${resident.id}`}
                alt={resident.fullName}
                className="w-12 h-12 rounded-xl shadow-sm"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-white dark:border-stone-900 rounded-full shadow-sm" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 truncate leading-tight">
                {resident.fullName}
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1">
                <User className="h-3 w-3" />
                Resident
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-all"
          >
            <svg
              className="w-4 h-4 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* ✅ HOSTELLERPROFILE DATA */}
        <div className="space-y-2.5">
          {/* College */}
          <div className="flex items-center gap-2.5 p-2.5 border border-stone-200/60 dark:border-stone-700/60 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800/30 transition-all">
            <div className="w-8 h-8 bg-stone-100 dark:bg-stone-800 rounded-lg flex items-center justify-center shrink-0">
              <GraduationCap className="w-3.5 h-3.5 text-stone-600 dark:text-stone-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wider font-medium">
                College
              </p>
              <p className="text-sm font-semibold text-stone-900 dark:text-stone-100 truncate">
                {hostellerProfile.collegeName || "Currently Unavailable"}
              </p>
            </div>
          </div>

          {/* Course & Branch */}
          <div className="flex items-center gap-2.5 p-2.5 border border-stone-200/60 dark:border-stone-700/60 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800/30 transition-all">
            <div className="w-8 h-8 bg-stone-100 dark:bg-stone-800 rounded-lg flex items-center justify-center shrink-0">
              <BookOpen className="w-3.5 h-3.5 text-stone-600 dark:text-stone-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wider font-medium">
                Course
              </p>
              <div className="space-y-px">
                <p className="text-sm font-semibold text-stone-900 dark:text-stone-100 truncate">
                  {hostellerProfile.course || "Currently Unavailable"}
                </p>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  {hostellerProfile.branch || "Not specified"}
                </p>
              </div>
            </div>
          </div>

          {/* Year of Study */}
          <div className="flex items-center gap-2.5 p-2.5 border border-stone-200/60 dark:border-stone-700/60 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800/30 transition-all">
            <div className="w-8 h-8 bg-stone-100 dark:bg-stone-800 rounded-lg flex items-center justify-center shrink-0">
              <Calendar className="w-3.5 h-3.5 text-stone-600 dark:text-stone-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wider font-medium">
                Year
              </p>
              <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                {hostellerProfile.yearOfStudy || "Currently Unavailable"}
              </p>
            </div>
          </div>

          {/* Bio (Optional) */}
          {hostellerProfile.bio && (
            <div className="flex items-center gap-2.5 p-2.5 border border-stone-200/60 dark:border-stone-700/60 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800/30 transition-all">
              <div className="w-8 h-8 bg-stone-100 dark:bg-stone-800 rounded-lg flex items-center justify-center shrink-0">
                <BookOpen className="w-3.5 h-3.5 text-stone-600 dark:text-stone-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wider font-medium">
                  Bio
                </p>
                <p className="text-sm font-semibold text-stone-900 dark:text-stone-100 truncate max-w-[200px]">
                  {hostellerProfile.bio}
                </p>
              </div>
            </div>
          )}

          {/* Room */}
          <div className="flex items-center gap-2.5 p-2.5 border border-stone-200/60 dark:border-stone-700/60 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800/30 transition-all">
            <div className="w-8 h-8 bg-stone-100 dark:bg-stone-800 rounded-lg flex items-center justify-center shrink-0">
              <BedDouble className="w-3.5 h-3.5 text-stone-600 dark:text-stone-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wider font-medium">
                Room
              </p>
              <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                {resident.roomNumber }
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-3 text-center border-t border-stone-200/50 dark:border-stone-700/50">
          <p className="text-xs text-stone-500/80 dark:text-stone-400/80">
            Academic & hostel information
          </p>
        </div>
      </div>
    </div>
  );
};

export default HostelResidentPopUp;
