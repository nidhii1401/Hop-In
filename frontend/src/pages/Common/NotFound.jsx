import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();
  const handleGoHome = () => navigate("/");

  return (
    <div className="min-h-screen w-full bg-stone-950 text-stone-100 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950" />

      {/* Animated dotted circle background */}
      <div className="pointer-events-none absolute w-[110vmin] h-[110vmin] rounded-full border border-orange-500/10 flex items-center justify-center">
        <div className="w-full h-full rounded-full border border-orange-500/20 opacity-70 animate-[spin_40s_linear_infinite]" />
        <div className="absolute w-[80%] h-[80%] rounded-full border border-stone-700/40 animate-[spin_60s_linear_infinite_reverse]" />
      </div>

      {/* Dotted ring using pseudo-dot elements */}
      <div className="pointer-events-none absolute w-[90vmin] h-[90vmin] rounded-full border border-transparent flex items-center justify-center">
        <div className="w-full h-full rounded-full bg-[radial-gradient(circle_at_0_0,#f97316_10%,transparent_60%),radial-gradient(circle_at_100%_0,#f97316_8%,transparent_55%),radial-gradient(circle_at_0_100%,#f97316_6%,transparent_55%),radial-gradient(circle_at_100%_100%,#f97316_4%,transparent_50%)] opacity-30 animate-pulse" />
      </div>

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-4 text-center">
        {/* 404 logo-style block */}
        <div className="relative w-52 h-52 sm:w-64 sm:h-64 flex items-center justify-center rounded-full bg-stone-950 shadow-[0_0_80px_rgba(249,115,22,0.35)] border border-stone-800">
          {/* rotating arcs */}
          <div className="absolute inset-4 rounded-full border-t-2 border-orange-500/80 border-l-2 border-orange-500/10 border-r-2 border-transparent animate-[spin_12s_linear_infinite]" />
          <div className="absolute inset-8 rounded-full border-b-2 border-orange-400/70 border-r-2 border-orange-500/10 border-l-2 border-transparent animate-[spin_16s_linear_infinite_reverse]" />

          {/* 404 digits */}
          <div className="relative flex items-center gap-2 text-5xl sm:text-6xl font-black tracking-[0.15em]">
            <span className="text-stone-100">4</span>
            <span className="relative inline-flex items-center justify-center">
              <span className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-4 border-orange-500/80 border-t-transparent animate-[spin_2.5s_linear_infinite]" />
            </span>
            <span className="text-stone-100">4</span>
          </div>
        </div>

        {/* Catchy lines */}
        <div className="space-y-1">
          <p className="text-sm font-semibold tracking-[0.25em] uppercase text-orange-400">
            404 · Off the grid
          </p>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-50">
            You didn&apos;t break the internet, just this link.
          </h1>
          <p className="text-sm text-stone-400 max-w-md mx-auto">
            The path you followed doesn&apos;t lead anywhere (yet).  
            Take a tiny step back and we&apos;ll pretend this never happened.
          </p>
        </div>

        {/* Button */}
        <button
          onClick={handleGoHome}
          className="mt-3 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-orange-600 hover:bg-orange-500 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-stone-950 transition-all duration-200 group"
        >
          Back To Home
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>

        <p className="text-[11px] text-stone-500 mt-3">
          If you keep ending up here, the universe is probably sending a bug report.
        </p>
      </div>

      {/* Tailwind keyframes via style tag */}
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes spin_reverse {
          to { transform: rotate(-360deg); }
        }
      `}</style>
    </div>
  );
};

export default NotFound;
