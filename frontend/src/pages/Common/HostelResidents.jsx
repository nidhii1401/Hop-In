// src/pages/Hosteller/HostelResidents.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Users,
  ChevronLeft,
  Loader2,
  AlertTriangle,
  BedDouble,
  Building2,
} from "lucide-react";

import Loader from "./UI/Loader.jsx";
import HostelResidentPopUp from "./UI/HostelResidentPopUp.jsx";
import { getHostelResidents } from "../../apis/hostellerApis.js";

const HostelResidents = () => {
  const { hostelId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ SIMPLIFIED: Only resident for popup
  const [selectedResident, setSelectedResident] = useState(null);

  useEffect(() => {
    const fetchResidents = async () => {
      if (!hostelId || isNaN(parseInt(hostelId))) {
        setError(`Invalid hostel ID: ${hostelId}`);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await getHostelResidents(hostelId);
        setData(response);
      } catch (err) {
        setError(err.message || "Failed to load residents");
      } finally {
        setLoading(false);
      }
    };
    fetchResidents();
  }, [hostelId]);

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto py-20">
        <Loader size="lg" text="Loading residents..." />
      </div>
    );
  }

  if (error || !data?.success) {
    return (
      <div className="w-full max-w-6xl mx-auto py-16">
        <div className="bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-xl p-6 flex items-start gap-3">
          <AlertTriangle className="h-6 w-6 text-orange-500 mt-0.5" />
          <div>
            <h2 className="text-lg font-bold text-orange-900 dark:text-orange-100 mb-1">
              No residents data
            </h2>
            <p className="text-sm text-orange-800 dark:text-orange-200">
              {error || "No residents found or an error occurred."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { residents: roomsByType, totalResidents, hostelName } = data;

  return (
    <>
      <div className="w-full max-w-7xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-all"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
                Hostel Residents
              </h1>
              <p className="text-stone-500 flex items-center gap-2 text-lg">
                <Building2 className="h-4 w-4" />
                {hostelName} • {totalResidents} resident
                {totalResidents !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>

        {/* Room Type Grid */}
        <div className="space-y-10">
          {Object.entries(roomsByType)
            .sort(([a], [b]) => parseInt(a) - parseInt(b))
            .map(([capacity, rooms]) => (
              <section key={capacity} className="space-y-6">
                {/* Room Type Header */}
                <div className="flex items-center gap-3">
                  <BedDouble className="h-6 w-6 text-orange-600" />
                  <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
                    {capacity}-Seater Rooms
                  </h2>
                  {/* <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-sm font-semibold rounded-full">
                    {Object.keys(rooms).length} room
                    {Object.keys(rooms).length !== 1 ? "s" : ""}
                  </span> */}
                </div>

                {/* Room Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                  {Object.values(rooms).map((room, idx) => (
                    <RoomCard
                      key={`${capacity}-${room.roomNumber}-${idx}`}
                      room={room}
                      onAvatarClick={setSelectedResident}
                    />
                  ))}
                </div>
              </section>
            ))}
        </div>

        {/* Empty State */}
        {totalResidents === 0 && (
          <div className="text-center py-32">
            <Users className="h-20 w-20 text-stone-400 mx-auto mb-6 opacity-75" />
            <h3 className="text-3xl font-black text-stone-900 dark:text-stone-100 mb-3">
              No residents yet
            </h3>
            <p className="text-xl text-stone-500 dark:text-stone-400 max-w-lg mx-auto leading-relaxed">
              This hostel doesn't have any active residents. They'll appear here
              once rooms are allocated.
            </p>
          </div>
        )}
      </div>

      {/* ✅ SIMPLIFIED POPUP */}
      {selectedResident && (
        <HostelResidentPopUp
          resident={selectedResident}
          onClose={() => setSelectedResident(null)}
        />
      )}
    </>
  );
};

// ✅ FIXED RoomCard Component - Clean stacked avatars
const RoomCard = ({ room, onAvatarClick }) => {
  const maxAvatars = 4;
  const showAvatars = room.residents.slice(0, maxAvatars);
  const remaining = room.residents.length - maxAvatars;
  const occupancyRate =
    room.capacity > 0 ? (room.residents.length / room.capacity) * 100 : 0;

  return (
    <div className="group bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm p-6 rounded-2xl border border-stone-200/50 dark:border-stone-800/50 hover:shadow-2xl hover:border-orange-300/70 hover:bg-white dark:hover:bg-stone-900 transition-all duration-500 h-full flex flex-col">
      {/* Room Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-black text-xl text-stone-900 dark:text-stone-100 tracking-tight">
          {room.roomNumber}
        </h3>
        <span
          className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${
            occupancyRate < 80
              ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
              : occupancyRate < 100
              ? "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300"
              : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
          }`}
        >
          {room.residents.length}/{room.capacity}
        </span>
      </div>

      {/* ✅ FIXED: Clean stacked avatars - No rings by default */}
      <div className="flex-1 flex items-center justify-center mb-6">
        <div className="flex -space-x-2">
          {showAvatars.map((resident, idx) => (
            <div
              key={resident.id}
              className="relative h-14 w-14 cursor-pointer rounded-full shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 z-[calc(10-${idx})]"
              onClick={() => onAvatarClick(resident)}
            >
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${resident.id}`}
                alt={resident.fullName}
                className="h-full w-full object-cover rounded-full hover:brightness-110 hover:drop-shadow-lg transition-all duration-300"
              />
              {/* ✅ HOVER-ONLY RING */}
              <div className="absolute inset-0 rounded-full ring-4 ring-orange-400/30 bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm opacity-0 hover:opacity-100 transition-all duration-300 scale-100 hover:scale-105 pointer-events-none z-10" />
            </div>
          ))}
          {remaining > 0 && (
            <div className="h-14 w-14 bg-linear-to-br from-stone-200 to-stone-300 dark:from-stone-700 dark:to-stone-800 rounded-full flex items-center justify-center text-sm font-black text-stone-500 dark:text-stone-400 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 z-10">
              +{remaining}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-stone-500 dark:text-stone-400 font-medium">
            Occupancy
          </span>
          <span className="font-black text-lg text-stone-900 dark:text-stone-100">
            {Math.round(occupancyRate)}%
          </span>
        </div>
        <div className="w-full bg-stone-200/50 dark:bg-stone-700/50 rounded-full h-3 border border-stone-300/50 dark:border-stone-600/50 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 shadow-sm ${
              occupancyRate < 80
                ? "bg-linear-to-r from-green-500 to-emerald-600"
                : occupancyRate < 100
                ? "bg-linear-to-r from-orange-500 to-amber-600"
                : "bg-linear-to-r from-red-500 to-rose-600"
            }`}
            style={{ width: `${occupancyRate}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default HostelResidents;
