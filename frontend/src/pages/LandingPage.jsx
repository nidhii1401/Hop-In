import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { userLogout } from '../redux/slices/authSlices.js';
import { Menu, User, Store, Building2, Search, CalendarCheck, CreditCard, BarChart3, Smartphone, Twitter, Facebook, Instagram, Linkedin, Github } from 'lucide-react';
import logo from '../../src/logo.jpeg';

const LandingPage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth);

  const handleLogout = async () => {
    try {
      await dispatch(userLogout()).unwrap();
      navigate('/');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const scrollToId = (id) => {
    const el = document.querySelector(id);
    if (!el) return;
    window.scrollTo({
      top: el.offsetTop - 80,
      behavior: 'smooth',
    });
  };

  return (
    <div className="min-h-screen w-full bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans selection:bg-orange-200">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-stone-200 dark:border-stone-800 bg-white/95 dark:bg-stone-900/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-full overflow-hidden bg-linear-to-br from-orange-100 to-orange-200 dark:from-orange-900/50 dark:to-orange-800/50 border-2 border-orange-200/50 dark:border-orange-500/30 shadow-sm ring-1 ring-stone-100/50 dark:ring-stone-800/50">
              <img src={logo} alt="Hop-In Logo" className="h-10 w-10 object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-stone-900 dark:text-stone-100">Hop-In</span>
              {/* <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400">Hostel Management</span> */}
            </div>
          </div>

          {/* Center Nav (desktop) */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <button onClick={() => scrollToId('#overview')} className="text-stone-600 dark:text-stone-300 hover:text-orange-700 dark:hover:text-orange-500 transition-colors">Overview</button>
            <button onClick={() => scrollToId('#roles')} className="text-stone-600 dark:text-stone-300 hover:text-orange-700 dark:hover:text-orange-500 transition-colors">For Whom?</button>
            <button onClick={() => scrollToId('#features')} className="text-stone-600 dark:text-stone-300 hover:text-orange-700 dark:hover:text-orange-500 transition-colors">Features</button>
          </nav>

          {/* Desktop Auth Actions - Always show Login/Signup buttons */}
          <div className="hidden md:flex gap-3">
            <button onClick={() => navigate('/login')} className="flex items-center justify-center rounded-lg px-5 py-2 text-xs font-bold text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors border border-transparent">
              Login
            </button>
            <button onClick={() => navigate('/signup')} className="flex items-center justify-center rounded-lg px-6 py-2 bg-orange-700 hover:bg-orange-800 text-white text-xs font-bold shadow-md shadow-orange-900/20 transition-colors">
              Sign Up
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-stone-700 dark:text-stone-200" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-[0.18em]">Navigate</div>
              {user && (
                <span className="text-[11px] text-stone-500 dark:text-stone-400">{user.fullName} ({user.role})</span>
              )}
            </div>
            <button onClick={() => scrollToId('#overview')} className="w-full rounded-lg px-4 py-2 text-sm font-medium text-stone-700 dark:text-stone-200 bg-stone-100/70 dark:bg-stone-800/70">Overview</button>
            <button onClick={() => scrollToId('#roles')} className="w-full rounded-lg px-4 py-2 text-sm font-medium text-stone-700 dark:text-stone-200 bg-stone-100/70 dark:bg-stone-800/70">Who is it for?</button>
            <button onClick={() => scrollToId('#features')} className="w-full rounded-lg px-4 py-2 text-sm font-medium text-stone-700 dark:text-stone-200 bg-stone-100/70 dark:bg-stone-800/70">Key Features</button>
            <div className="h-px bg-stone-200 dark:bg-stone-800 my-3" />
            {user ? (
              <button onClick={handleLogout} className="w-full rounded-lg px-4 py-3 text-sm font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                Sign Out
              </button>
            ) : (
              <div className="flex gap-3">
                <button onClick={() => navigate('/login')} className="flex-1 rounded-lg px-4 py-3 text-sm font-bold text-stone-700 dark:text-stone-200 bg-stone-200 dark:bg-stone-800">Login</button>
                <button onClick={() => navigate('/signup')} className="flex-1 rounded-lg px-4 py-3 bg-orange-700 text-white text-sm font-bold">Sign Up</button>
              </div>
            )}
          </div>
        )}
      </header>

      <main className="flex-1 flex flex-col items-center">
        {/* Hero Section */}
        <section id="overview" className="w-full px-4 py-12 md:py-20 flex justify-center bg-stone-50 dark:bg-stone-950">
          <div className="max-w-7xl w-full">
            <div className="flex flex-col-reverse lg:flex-row gap-10 lg:gap-16 items-center">
              {/* Text Content */}
              <div className="flex flex-col gap-6 flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 mx-auto lg:mx-0 rounded-full border border-orange-200/60 dark:border-orange-900/60 bg-orange-50/70 dark:bg-orange-900/20 px-3 py-1">
                  <Store className="h-4 w-4 text-orange-700 dark:text-orange-400" />
                  <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-orange-700 dark:text-orange-300">Unified Hostel Management</span>
                </div>
                <div className="flex flex-col gap-3">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight text-stone-900 dark:text-stone-50">
                    One platform for <br /> modern hostel life.
                  </h1>
                  <p className="text-base md:text-lg font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0 text-stone-600 dark:text-stone-400">
                    Hop-In connects owners and residents in a single workspace for hostel discovery, bookings, payments, and day-to-day operations.
                  </p>
                </div>

                {/* Value grid in hero */}
                <div className="grid grid-cols-2 gap-3 max-w-md mx-auto lg:mx-0 text-left">
                  <div className="flex items-start gap-3">
                    <Store className="h-5 w-5 mt-0.5 text-orange-700 dark:text-orange-500" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400">For Owners</p>
                      <p className="text-sm text-stone-600 dark:text-stone-400">Manage listings, rooms, and occupants from structured dashboards.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 mt-0.5 text-orange-700 dark:text-orange-500" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400">For Residents</p>
                      <p className="text-sm text-stone-600 dark:text-stone-400">Find rooms, reserve beds, pay rent, and raise requests from one place.</p>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-3">
                  <button onClick={() => navigate('/signup')} className="flex min-w-[150px] items-center justify-center rounded-xl h-12 px-8 bg-orange-700 hover:bg-orange-800 text-white text-base font-bold shadow-lg shadow-orange-900/20 transition-all transform hover:scale-105">
                    Explore
                  </button>
                  <button onClick={() => scrollToId('#roles')} className="flex min-w-[150px] items-center justify-center rounded-xl h-12 px-8 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 hover:bg-stone-50 dark:hover:bg-stone-800 text-base font-bold transition-colors">
                    View Dashboards
                  </button>
                </div>

                {/* Trust strip */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4 text-stone-600 dark:text-stone-400 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span>Realtime availability & secure access</span>
                  </div>
                  <span className="hidden md:inline-block w-px h-4 bg-stone-300 dark:bg-stone-700" />
                  <span>Built for mobile-first experience</span>
                </div>
              </div>

              {/* Right-side Responsive dashboard snapshot */}
              <div className="w-full flex-1 flex flex-col gap-2">
                {/* Mobile simple preview card */}
                <div className="sm:hidden w-full max-w-sm mx-auto rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-900 dark:bg-stone-950 shadow-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      <span className="text-xs font-semibold text-stone-100">Owner dashboard</span>
                    </div>
                    <span className="text-[10px] text-stone-400">Mobile view</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-xl bg-stone-800/80 px-3 py-2">
                      <div className="flex flex-col">
                        <span className="text-[11px] text-stone-300">Occupancy</span>
                        <span className="text-sm font-semibold text-emerald-400">92%</span>
                      </div>
                      <div className="flex items-end gap-0.5">
                        <span className="h-4 w-1 rounded bg-orange-500/50" />
                        <span className="h-5 w-1 rounded bg-orange-400/70" />
                        <span className="h-6 w-1 rounded bg-orange-300" />
                        <span className="h-5 w-1 rounded bg-orange-400/70" />
                      </div>
                    </div>
                    <div className="rounded-xl bg-stone-800/80 px-3 py-2">
                      <p className="text-[11px] text-stone-400 mb-1">Next checkins</p>
                      <div className="flex justify-between text-[10px] text-stone-300">
                        <span>Room A204 - 3:30 PM</span>
                      </div>
                      <div className="flex justify-between text-[10px] text-stone-300">
                        <span>Room B108 - 5:10 PM</span>
                      </div>
                    </div>
                    <div className="rounded-xl bg-linear-to-r from-orange-600 to-orange-500 px-3 py-2 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-semibold text-white">Secure role access</span>
                        <span className="text-[10px] text-orange-100/90">Owner • Resident</span>
                      </div>
                      <span className="text-[10px] text-white/80">Live demo</span>
                    </div>
                  </div>
                </div>

                {/* Tablet/Desktop full detailed snapshot */}
                <div className="hidden sm:block w-full">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-orange-900/15 bg-stone-900 dark:bg-stone-950 border border-stone-800/80 aspect-4/3 lg:aspect-video gradient-halo">
                    <div className="absolute inset-0 bg-radial-gradient circle at top, rgba(249, 115, 22, 0.15), transparent 60%" />
                    {/* detailed preview */}
                    <div className="relative h-full w-full p-5 md:p-6 flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                        </div>
                        <span className="text-[11px] text-stone-400">Hop-In Owner Dashboard</span>
                      </div>
                      <div className="grid grid-cols-5 gap-4 flex-1">
                        {/* left sidebar cards */}
                        <div className="col-span-2 flex flex-col gap-3">
                          <div className="rounded-xl bg-stone-900/60 border border-stone-700/80 p-3 flex flex-col gap-2">
                            <div className="flex items-center justify-between text-xs text-stone-300">
                              <span className="font-semibold">Occupancy</span>
                              <span className="text-emerald-400">92%</span>
                            </div>
                            <div className="mt-1 flex items-end gap-1">
                              <div className="h-5 w-1.5 rounded bg-orange-500/60" />
                              <div className="h-7 w-1.5 rounded bg-orange-400/80" />
                              <div className="h-9 w-1.5 rounded bg-orange-300" />
                              <div className="h-6 w-1.5 rounded bg-orange-500/50" />
                              <div className="h-8 w-1.5 rounded bg-orange-400/70" />
                            </div>
                          </div>
                          <div className="rounded-xl bg-stone-900/60 border border-stone-700/80 p-3 flex flex-col gap-2">
                            <div className="flex items-center justify-between text-xs text-stone-300">
                              <span className="font-semibold">Upcoming checkins</span>
                              <span className="text-stone-400">Today</span>
                            </div>
                            <div className="flex flex-col gap-1.5 text-[11px] text-stone-400">
                              <div className="flex justify-between">
                                <span>Room A204</span>
                                <span className="text-orange-400">3:30 PM</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Room B108</span>
                                <span className="text-orange-400">5:10 PM</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* right main content */}
                        <div className="col-span-3 flex flex-col gap-3">
                          <div className="rounded-xl bg-stone-900/60 border border-stone-700/80 px-4 py-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Search className="h-4 w-4 text-orange-400" />
                              <div>
                                <p className="text-xs text-stone-300">Search & filter hostels</p>
                                <p className="text-[11px] text-stone-500">Location • Price • Amenities • Ratings</p>
                              </div>
                            </div>
                            <button className="text-[11px] px-3 py-1 rounded-full bg-orange-600 text-white font-semibold">Try search</button>
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-[11px]">
                            <div className="rounded-xl bg-stone-900/60 border border-stone-700/80 p-3 flex flex-col gap-2">
                              <div className="flex items-center gap-2">
                                <CalendarCheck className="h-4 w-4 text-emerald-400" />
                                <span className="text-stone-300 font-semibold">Smart bookings</span>
                              </div>
                              <p className="text-stone-500">Prevent double-booking with live room availability.</p>
                            </div>
                            <div className="rounded-xl bg-stone-900/60 border border-stone-700/80 p-3 flex flex-col gap-2">
                              <div className="flex items-center gap-2">
                                <CreditCard className="h-4 w-4 text-sky-400" />
                                <span className="text-stone-300 font-semibold">Rent payments</span>
                              </div>
                              <p className="text-stone-500">Track payment status and dues in a few clicks.</p>
                            </div>
                          </div>
                          <div className="rounded-xl bg-linear-to-r from-orange-600 to-orange-500 text-[11px] text-white px-4 py-3 flex items-center justify-between">
                            <div>
                              <p className="font-semibold">Secure role access</p>
                              <p className="text-orange-100/80">Separate flows for Owner and Resident roles.</p>
                            </div>
                            <Smartphone className="h-9 w-9 opacity-90" />
                          </div>
                        </div>
                      </div>
                      <p className="mt-2 text-[11px] text-center lg:text-right text-stone-500 dark:text-stone-400">
                        Owner dashboard preview — occupancy, bookings, and payments at a glance.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Role Section - Now only 2 cards */}
        <section id="roles" className="w-full px-4 py-16 bg-white dark:bg-stone-900 border-y border-stone-200 dark:border-stone-800">
          <div className="max-w-[1000px] mx-auto flex flex-col items-center gap-10">
            <div className="text-center max-w-2xl">
              <h2 className="text-3xl font-bold mb-3 text-stone-900 dark:text-stone-100">Designed for every hostel role.</h2>
              <p className="text-stone-600 dark:text-stone-400 text-sm">Choose your role to jump directly into a tailored experience.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6 w-full">
              {/* Resident */}
              <div className="group relative flex flex-col items-center p-7 rounded-2xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 hover:border-orange-500/60 transition-all hover:shadow-xl hover:shadow-orange-500/5 cursor-pointer">
                <div className="w-14 h-14 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-5 text-orange-700 dark:text-orange-500 group-hover:scale-110 transition-transform duration-300">
                  <User className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold mb-1 text-stone-900 dark:text-stone-100">Resident</h3>
                <p className="text-center text-sm text-stone-600 dark:text-stone-400 mb-6">Discover hostels, reserve rooms, pay rent, and raise maintenance requests in seconds.</p>
                <ul className="text-xs text-stone-500 dark:text-stone-400 space-y-1.5 mb-6 self-stretch">
                  <li>Realtime room availability</li>
                  <li>Digital rent payment history</li>
                  <li>Maintenance support tickets</li>
                </ul>
                {/* <button 
                  onClick={user?.role === 'HOSTELLER' || user?.role === 'ADMIN' ? () => navigate('/hosteller/dashboard') : () => navigate('/login')}
                  className="mt-auto w-full py-3 rounded-lg bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-sm font-bold hover:opacity-90 transition-opacity"
                >
                  {user?.role === 'HOSTELLER' || user?.role === 'ADMIN' ? 'Open Resident Dashboard' : 'Resident Login'}
                </button> */}
              </div>

              {/* Owner */}
              <div className="group relative flex flex-col items-center p-7 rounded-2xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 hover:border-orange-500/60 transition-all hover:shadow-xl hover:shadow-orange-500/5 cursor-pointer">
                <div className="w-14 h-14 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-5 text-orange-700 dark:text-orange-500 group-hover:scale-110 transition-transform duration-300">
                  <Store className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold mb-1 text-stone-900 dark:text-stone-100">Owner</h3>
                <p className="text-center text-sm text-stone-600 dark:text-stone-400 mb-6">Publish hostels, manage rooms and occupancy, and keep finances organized.</p>
                <ul className="text-xs text-stone-500 dark:text-stone-400 space-y-1.5 mb-6 self-stretch">
                  <li>Hostel room inventory</li>
                  <li>Booking and check-in management</li>
                  <li>Payment tracking and dues</li>
                </ul>
                {/* <button 
                  onClick={user?.role === 'OWNER' || user?.role === 'ADMIN' ? () => navigate('/owner/dashboard') : () => navigate('/login')}
                  className="mt-auto w-full py-3 rounded-lg border-2 border-orange-700 text-orange-700 dark:text-orange-500 dark:border-orange-500 text-sm font-bold hover:bg-orange-700 hover:text-white dark:hover:bg-orange-500 dark:hover:text-white transition-colors"
                >
                  {user?.role === 'OWNER' || user?.role === 'ADMIN' ? 'Open Owner Dashboard' : 'Owner Login'}
                </button> */}
              </div>
            </div>
          </div>
        </section>

        {/* Feature Strip */}
        <section id="features" className="w-full px-4 py-18 md:py-20 bg-stone-50 dark:bg-stone-950">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col gap-3 mb-10 text-center items-center">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-stone-900 dark:text-stone-100">All the essentials in one place.</h2>
              <p className="text-sm md:text-base max-w-2xl text-stone-600 dark:text-stone-400">From search and booking to payments and analytics, Hop-In covers the end-to-end hostel workflow.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Column 1 */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-orange-700 dark:text-orange-500">
                    <Search className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1 text-stone-900 dark:text-stone-100">Search & discovery</h3>
                    <p className="text-sm leading-relaxed text-stone-600 dark:text-stone-400">Filter hostels by price, location, room type, and amenities with near-instant results.</p>
                  </div>
                </div>
                <div className="flex flex-col gap-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-orange-700 dark:text-orange-500">
                    <CalendarCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1 text-stone-900 dark:text-stone-100">Smart bookings</h3>
                    <p className="text-sm leading-relaxed text-stone-600 dark:text-stone-400">Check live room availability and confirm bookings in a structured, conflict-free flow.</p>
                  </div>
                </div>
              </div>
              {/* Column 2 */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-orange-700 dark:text-orange-500">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1 text-stone-900 dark:text-stone-100">Integrated payments</h3>
                    <p className="text-sm leading-relaxed text-stone-600 dark:text-stone-400">Handle rent, deposits, and add-on services with clear histories and reduced manual tracking.</p>
                  </div>
                </div>
                <div className="flex flex-col gap-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-orange-700 dark:text-orange-500">
                    <BarChart3 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1 text-stone-900 dark:text-stone-100">Dashboards & analytics</h3>
                    <p className="text-sm leading-relaxed text-stone-600 dark:text-stone-400">Track occupancy, revenue, and key metrics through visual dashboards for owners.</p>
                  </div>
                </div>
              </div>
              {/* Column 3 */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-orange-700 dark:text-orange-500">
                    <Store className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1 text-stone-900 dark:text-stone-100">Secure access</h3>
                    <p className="text-sm leading-relaxed text-stone-600 dark:text-stone-400">Role-based authorization keeps owner and resident data safe and organized.</p>
                  </div>
                </div>
                <div className="flex flex-col gap-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-orange-700 dark:text-orange-500">
                    <Smartphone className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1 text-stone-900 dark:text-stone-100">Responsive by default</h3>
                    <p className="text-sm leading-relaxed text-stone-600 dark:text-stone-400">Optimized for mobile, tablet, and desktop so residents and owners stay connected anywhere.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800">
        <div className="container mx-auto py-10 px-4">
          <div className="flex flex-col w-full gap-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
              <div className="flex h-16 items-center gap-3">
                <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-full overflow-hidden bg-linear-to-br from-orange-100 to-orange-200 dark:from-orange-900/50 dark:to-orange-800/50 border-2 border-orange-200/50 dark:border-orange-500/30 shadow-sm ring-1 ring-stone-100/50 dark:ring-stone-800/50">
                  <img src={logo} alt="Hop-In Logo" className="h-10 w-10 object-contain" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-lg tracking-tight text-stone-900 dark:text-stone-100">Hop-In</span>
                  {/* <span className="text-[11px] uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400">Hostel Management</span> */}
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
                <a href="/privacy" className="text-stone-600 hover:text-orange-700 dark:text-stone-400 dark:hover:text-orange-500 transition-colors text-xs font-medium">Privacy Policy</a>
                <a href="/terms" className="text-stone-600 hover:text-orange-700 dark:text-stone-400 dark:hover:text-orange-500 transition-colors text-xs font-medium">Terms of Service</a>
                <a href="/support" className="text-stone-600 hover:text-orange-700 dark:text-stone-400 dark:hover:text-orange-500 transition-colors text-xs font-medium">Contact Support</a>
              </div>
            </div>
            <div className="w-full h-px bg-stone-200 dark:bg-stone-800" />
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-stone-500 dark:text-stone-400 text-xs">{new Date().getFullYear()} Hop-In. All rights reserved.</p>
              {/* <p className="text-stone-500 dark:text-stone-400 text-xs">Built with 🧡 by Praveen Singh.</p> */}
              <div className="flex gap-4">
                <a href="#" className="text-stone-400 hover:text-orange-700 dark:hover:text-orange-500 transition-colors" aria-label="Twitter">
                  <Twitter className="h-4 w-4" />
                </a>
                {/* <a href="https://facebook.com" className="text-stone-400 hover:text-orange-700 dark:hover:text-orange-500 transition-colors" aria-label="Facebook">
                  <Facebook className="h-4 w-4" />
                </a> */}
                {/* <a href="https://instagram.com" className="text-stone-400 hover:text-orange-700 dark:hover:text-orange-500 transition-colors" aria-label="Instagram">
                  <Instagram className="h-4 w-4" />
                </a> */}
                <a href="https://www.linkedin.com/in/praveen-singh-004539286/" className="text-stone-400 hover:text-orange-700 dark:hover:text-orange-500 transition-colors" aria-label="LinkedIn">
                  <Linkedin className="h-4 w-4" />
                </a>
                <a href="https://github.com/singhpraveen77" className="text-stone-400 hover:text-orange-700 dark:hover:text-orange-500 transition-colors" aria-label="GitHub">
                  <Github className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;