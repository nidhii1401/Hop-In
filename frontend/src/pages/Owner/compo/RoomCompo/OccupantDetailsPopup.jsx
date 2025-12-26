// src/components/owner/OccupantDetailsPopup.jsx
import React, { useState, useEffect } from "react";
import {
  X,
  Mail,
  Phone,
  GraduationCap,
  Trash2,
  BookOpen,
  GitBranch,
  Calendar,
  FileText,
  Copy,
  Check,
} from "lucide-react";
import { getUserAvatar } from "../../../../utils/avatarUtils.js";

const OccupantDetailsPopup = ({
  occupant,
  onClose,
  hostelId,
  roomId,
  stayId,
  onDeallocate,
}) => {
  // Remove complex animations - simple fade/slide
  const [isVisible, setIsVisible] = useState(false);
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
    setIsVisible(true);
    return () => setIsVisible(false);
  }, []);

  return (
    <div
      className={`fixed z-100 inset-0 flex items-center justify-center p-4 transition-all duration-300 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 w-full max-w-md mx-4 max-h-[90vh] transform transition-all duration-300 flex flex-col ${
          isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <img
                src={getUserAvatar(occupant)}
                className="h-16 w-16 rounded-xl shadow-lg ring-4 ring-stone-100 dark:ring-stone-900"
                alt={occupant.fullName}
              />
              <div>
                <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100">
                  {occupant.fullName}
                </h3>
                <p className="text-sm text-stone-500 dark:text-stone-400">
                  Room Occupant
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
            >
              <X size={20} className="text-stone-500" />
            </button>
          </div>
        </div>

        {/* Simple Details - No animation */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center gap-3 p-3 bg-stone-50 dark:bg-stone-800/50 rounded-lg">
              <Mail className="h-5 w-5 text-stone-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-xs text-stone-500 uppercase font-medium tracking-wide">
                  Email
                </div>
                <div
                  className="font-medium text-stone-900 dark:text-stone-100 truncate"
                  title={occupant.email}
                >
                  {occupant.email}
                </div>
              </div>
            </div>

            {occupant.phone && (
              <div className="flex items-center gap-3 p-3 bg-stone-50 dark:bg-stone-800/50 rounded-lg">
                <Phone className="h-5 w-5 text-stone-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-stone-500 uppercase font-medium tracking-wide">
                    Phone
                  </div>
                  <div className="font-medium text-stone-900 dark:text-stone-100 truncate">
                    {occupant.phone}
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(occupant.phone)}
                  className="p-2 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-lg transition-colors group"
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

            {occupant.hostellerProfile?.collegeName && (
              <div className="flex items-center gap-3 p-3 bg-stone-50 dark:bg-stone-800/50 rounded-lg">
                <GraduationCap className="h-5 w-5 text-stone-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-stone-500 uppercase font-medium tracking-wide">
                    College
                  </div>
                  <div
                    className="font-medium text-stone-900 dark:text-stone-100 truncate"
                    title={occupant.hostellerProfile.collegeName}
                  >
                    {occupant.hostellerProfile.collegeName}
                  </div>
                </div>
              </div>
            )}

            {occupant.hostellerProfile?.course && (
              <div className="flex items-center gap-3 p-3 bg-stone-50 dark:bg-stone-800/50 rounded-lg">
                <BookOpen className="h-5 w-5 text-stone-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-stone-500 uppercase font-medium tracking-wide">
                    Course
                  </div>
                  <div
                    className="font-medium text-stone-900 dark:text-stone-100 truncate"
                    title={occupant.hostellerProfile.course}
                  >
                    {occupant.hostellerProfile.course}
                  </div>
                </div>
              </div>
            )}

            {occupant.hostellerProfile?.branch && (
              <div className="flex items-center gap-3 p-3 bg-stone-50 dark:bg-stone-800/50 rounded-lg">
                <GitBranch className="h-5 w-5 text-stone-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-stone-500 uppercase font-medium tracking-wide">
                    Branch
                  </div>
                  <div
                    className="font-medium text-stone-900 dark:text-stone-100 truncate"
                    title={occupant.hostellerProfile.branch}
                  >
                    {occupant.hostellerProfile.branch}
                  </div>
                </div>
              </div>
            )}

            {occupant.hostellerProfile?.yearOfStudy && (
              <div className="flex items-center gap-3 p-3 bg-stone-50 dark:bg-stone-800/50 rounded-lg">
                <Calendar className="h-5 w-5 text-stone-500 shrink-0" />
                <div>
                  <div className="text-xs text-stone-500 uppercase font-medium tracking-wide">
                    Year
                  </div>
                  <div className="font-medium text-stone-900 dark:text-stone-100">
                    {occupant.hostellerProfile.yearOfStudy}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bio - Full width */}
          {occupant.hostellerProfile?.bio && (
            <div className="p-3 bg-stone-50 dark:bg-stone-800/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-5 w-5 text-stone-500 shrink-0" />
                <div className="text-xs text-stone-500 uppercase font-medium tracking-wide">
                  Bio
                </div>
              </div>
              <div className="font-medium text-stone-900 dark:text-stone-100 text-sm leading-relaxed max-h-32 overflow-y-auto">
                {occupant.hostellerProfile.bio}
              </div>
            </div>
          )}
        </div>

        {/* Remove Button */}
        <div className="p-6 pt-0 border-t border-stone-200 dark:border-stone-800">
          <button
            onClick={() => onDeallocate(stayId)}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Trash2 size={18} />
            Remove from Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default OccupantDetailsPopup;
