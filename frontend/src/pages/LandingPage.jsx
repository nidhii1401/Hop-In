import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { userLogout } from '../redux/slices/authSlices.js';
import { 
  Coffee, 
  Menu, 
  User, 
  Store, 
  CheckCircle2, 
  DoorOpen, 
  CreditCard, 
  Twitter, 
  Facebook, 
  Instagram 
} from 'lucide-react';

const LandingPage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await dispatch(userLogout()).unwrap();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen w-full bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans selection:bg-orange-200">
      
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-stone-200 dark:border-stone-800 bg-white/95 dark:bg-stone-900/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-orange-700 dark:text-orange-500">
            <Coffee className="h-8 w-8" />
            <h2 className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100">Hop-In</h2>
          </div>

          {/* Desktop Nav Actions */}
          <div className="hidden md:flex gap-3">
            {user ? (
              <>
                <span className="flex items-center px-4 py-2 text-sm font-medium text-stone-600 dark:text-stone-400">
                  Welcome, {user.fullName}
                </span>
                <button 
                  onClick={handleLogout}
                  className="flex items-center justify-center rounded-lg px-6 py-2 text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border border-red-200 dark:border-red-800"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => navigate('/login')}
                  className="flex items-center justify-center rounded-lg px-6 py-2 text-sm font-bold text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors border border-transparent"
                >
                  Login
                </button>
                <button 
                  onClick={() => navigate('/signup')}
                  className="flex items-center justify-center rounded-lg px-6 py-2 bg-orange-700 hover:bg-orange-800 text-white text-sm font-bold shadow-md shadow-orange-900/20 transition-colors"
                >
                  Sign up
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-stone-700 dark:text-stone-200"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
        
        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 p-4 flex flex-col gap-3">
            {user ? (
              <>
                <div className="text-sm text-stone-600 dark:text-stone-400 px-2">
                  Welcome, {user.fullName}
                </div>
                <button 
                  onClick={handleLogout}
                  className="w-full rounded-lg px-6 py-3 text-sm font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => navigate('/login')}
                  className="w-full rounded-lg px-6 py-3 text-sm font-bold text-stone-700 dark:text-stone-200 bg-stone-200 dark:bg-stone-800"
                >
                  Login
                </button>
                <button 
                  onClick={() => navigate('/signup')}
                  className="w-full rounded-lg px-6 py-3 bg-orange-700 text-white text-sm font-bold"
                >
                  Sign up
                </button>
              </>
            )}
          </div>
        )}
      </header>

      <main className="flex-1 flex flex-col items-center">
        {/* Hero Section */}
        <section className="w-full px-4 py-12 md:py-20 flex justify-center bg-stone-50 dark:bg-stone-950">
          <div className="max-w-7xl w-full">
            <div className="flex flex-col-reverse lg:flex-row gap-10 lg:gap-16 items-center">
              
              {/* Text Content */}
              <div className="flex flex-col gap-6 flex-1 text-center lg:text-left">
                <div className="flex flex-col gap-4">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight text-stone-900 dark:text-stone-50">
                    Manage Your Stay,<br />
                    <span className="text-orange-700 dark:text-orange-500">Sip by Sip.</span>
                  </h1>
                  <h2 className="text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0 text-stone-600 dark:text-stone-400">
                    The all-in-one platform for hostel owners and residents. Simplified booking, payments, and management, brewed to perfection.
                  </h2>
                </div>
                
                <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-4">
                  <button 
                    onClick={() => navigate('/signup')}
                    className="flex min-w-[140px] items-center justify-center rounded-xl h-12 px-8 bg-orange-700 hover:bg-orange-800 text-white text-base font-bold shadow-lg shadow-orange-900/20 transition-all transform hover:scale-105"
                  >
                    Get Started
                  </button>
                  <button 
                    onClick={() => window.scrollTo({ top: document.querySelector('#role-selection')?.offsetTop || 0, behavior: 'smooth' })}
                    className="flex min-w-[140px] items-center justify-center rounded-xl h-12 px-8 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 hover:bg-stone-50 dark:hover:bg-stone-800 text-base font-bold transition-colors"
                  >
                    Learn More
                  </button>
                </div>

                {/* Trust Indicators */}
                <div className="flex items-center justify-center lg:justify-start gap-2 pt-2 text-stone-600 dark:text-stone-400 text-sm font-medium">
                  <CheckCircle2 className="text-orange-700 h-5 w-5" />
                  <span>Trusted by 500+ Hostels</span>
                </div>
              </div>

              {/* Hero Image */}
              <div 
                className="w-full flex-1 rounded-2xl overflow-hidden shadow-2xl shadow-orange-900/10 aspect-video lg:aspect-[4/3] bg-cover bg-center relative group"
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAMuEMntum6cOoPZNLDG5beDNESetu1d7Tn6BpVrKJu_Viccppkoizci8FLTzk8hqmPi_n1ylM5EiVy99_YKiB6dizO0SOAk3DI10rFyka-CCpYBbCIqsMzMRy7TE0CAZLj3tL-QLq-D_Hvc85TAtqEoh4fEkBC9BVaXgecKiWQp-2Br5i-WCLUKp6frf71DmDHzb3oP3EX_1hQD6LYWd7slrrunxZPvPDxeL-5ZjA8Lk1q4gaQJHfe0WTx3FTv4vaynAFSoWKrkYJF")' }}
              >
                <div className="absolute inset-0 bg-orange-900/10 group-hover:bg-transparent transition-colors duration-500"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Role Selection Section */}
        <section id="role-selection" className="w-full px-4 py-16 bg-white dark:bg-stone-900 border-y border-stone-200 dark:border-stone-800">
          <div className="max-w-[1000px] mx-auto flex flex-col items-center gap-10">
            <div className="text-center max-w-2xl">
              <h2 className="text-3xl font-bold mb-4 text-stone-900 dark:text-stone-100">Who are you?</h2>
              <p className="text-stone-600 dark:text-stone-400">Select your role to access your personalized dashboard.</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 w-full">
              {/* Hosteller Card */}
              <div className="group relative flex flex-col items-center p-8 rounded-2xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 hover:border-orange-500/50 transition-all hover:shadow-xl hover:shadow-orange-500/5 cursor-pointer">
                <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-6 text-orange-700 dark:text-orange-500 group-hover:scale-110 transition-transform duration-300">
                  <User className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-stone-900 dark:text-stone-100">I'm a Resident</h3>
                <p className="text-center text-stone-600 dark:text-stone-400 mb-8">Pay rent, request maintenance, and join events.</p>
                <button 
                  onClick={() => (user?.role === 'HOSTELLER' || user?.role === 'ADMIN') ? navigate('/hosteller/dashboard') : navigate('/login')}
                  className="mt-auto w-full py-3 rounded-lg bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-bold hover:opacity-90 transition-opacity"
                >
                  {(user?.role === 'HOSTELLER' || user?.role === 'ADMIN') ? 'Go to Dashboard' : 'Resident Login'}
                </button>
              </div>

              {/* Owner Card */}
              <div className="group relative flex flex-col items-center p-8 rounded-2xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 hover:border-orange-500/50 transition-all hover:shadow-xl hover:shadow-orange-500/5 cursor-pointer">
                <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-6 text-orange-700 dark:text-orange-500 group-hover:scale-110 transition-transform duration-300">
                  <Store className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-stone-900 dark:text-stone-100">I'm an Owner</h3>
                <p className="text-center text-stone-600 dark:text-stone-400 mb-8">Manage rooms, track payments, and oversee operations.</p>
                <button 
                  onClick={() => (user?.role === 'OWNER' || user?.role === 'ADMIN') ? navigate('/owner/dashboard') : navigate('/login')}
                  className="mt-auto w-full py-3 rounded-lg border-2 border-orange-700 text-orange-700 dark:text-orange-500 dark:border-orange-500 font-bold hover:bg-orange-700 hover:text-white dark:hover:bg-orange-500 dark:hover:text-white transition-colors"
                >
                  {(user?.role === 'OWNER' || user?.role === 'ADMIN') ? 'Go to Dashboard' : 'Owner Login'}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Section */}
        <section className="w-full px-4 py-20 bg-stone-50 dark:bg-stone-950">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col gap-4 mb-12 text-center items-center">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
                Why choose Hop-In?
              </h2>
              <p className="text-lg max-w-2xl text-stone-600 dark:text-stone-400">
                Everything you need to manage your hostel life, brewed to perfection.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="flex flex-col gap-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-orange-700 dark:text-orange-500">
                  <DoorOpen className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-stone-900 dark:text-stone-100">Easy Check-ins</h3>
                  <p className="leading-relaxed text-stone-600 dark:text-stone-400">
                    Digital check-ins that are as smooth as your morning latte. No more paperwork piles.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex flex-col gap-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-orange-700 dark:text-orange-500">
                  <CreditCard className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-stone-900 dark:text-stone-100">Seamless Payments</h3>
                  <p className="leading-relaxed text-stone-600 dark:text-stone-400">
                    Pay rent and fees instantly without the bitter aftertaste of manual transaction tracking.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex flex-col gap-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-orange-700 dark:text-orange-500">
                  <Coffee className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-stone-900 dark:text-stone-100">Community Events</h3>
                  <p className="leading-relaxed text-stone-600 dark:text-stone-400">
                    Connect with fellow residents over coffee and shared experiences organized in-app.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800">
        <div className="container mx-auto py-12 px-4">
          <div className="flex flex-col w-full gap-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
              <div className="flex items-center gap-2 text-orange-700 dark:text-orange-500">
                <Coffee className="h-6 w-6" />
                <span className="font-bold text-lg text-stone-900 dark:text-stone-100">Hop-In</span>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
                <a className="text-stone-600 hover:text-orange-700 dark:text-stone-400 dark:hover:text-orange-500 transition-colors text-sm font-medium" href="#">Privacy Policy</a>
                <a className="text-stone-600 hover:text-orange-700 dark:text-stone-400 dark:hover:text-orange-500 transition-colors text-sm font-medium" href="#">Terms of Service</a>
                <a className="text-stone-600 hover:text-orange-700 dark:text-stone-400 dark:hover:text-orange-500 transition-colors text-sm font-medium" href="#">Contact Support</a>
              </div>
            </div>
            
            <div className="w-full h-px bg-stone-200 dark:bg-stone-800"></div>
            
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-stone-500 dark:text-stone-400 text-sm">© 2024 Hop-In. All rights reserved.</p>
              <div className="flex gap-4">
                <a className="text-stone-400 hover:text-orange-700 dark:hover:text-orange-500 transition-colors" href="#">
                  <Twitter className="h-5 w-5" />
                </a>
                <a className="text-stone-400 hover:text-orange-700 dark:hover:text-orange-500 transition-colors" href="#">
                  <Facebook className="h-5 w-5" />
                </a>
                <a className="text-stone-400 hover:text-orange-700 dark:hover:text-orange-500 transition-colors" href="#">
                  <Instagram className="h-5 w-5" />
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
