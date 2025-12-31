import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userSignup, clearError } from "../../redux/slices/authSlices.js";
import { useNavigate, Link } from "react-router-dom";
import Loader from '../Common/UI/Loader.jsx';
import { Building, Eye, EyeOff, RefreshCw } from "lucide-react";
import { toastError, toastSuccess } from '../../utils/toast.js';

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { loading, error, requiresVerification, user } = useSelector((state) => state.auth || {});

  const [role, setRole] = useState("HOSTELLER");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    avatarUrl: "" 
  });

  // Avatar Logic
  const currentAvatarUrl = formData.avatarUrl || 
    `https://api.dicebear.com/7.x/adventurer/svg?seed=${formData.fullName.replace(/\s+/g, '') || 'default'}`;

  const generateRandomAvatar = () => {
    const randomSeed = Math.random().toString(36).substring(7);
    setFormData(prev => ({
      ...prev,
      avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${randomSeed}`
    }));
  };

  useEffect(() => {
    if (requiresVerification) {
      navigate("/verify-otp");
      return;
    }

    if (user) {
      navigate("/");
    }

    return () => {
      dispatch(clearError());
    };
  }, [requiresVerification, user, navigate, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toastError("Passwords do not match");
      return;
    }

    try {
      await dispatch(userSignup({ 
        ...formData, 
        role,
        avatarUrl: currentAvatarUrl 
      })).unwrap();
      toastSuccess('Verification code sent to your email');
    } catch (err) {
      console.error("Signup failed:", err);
      const msg = err?.message || err || 'Signup failed';
      toastError(typeof msg === 'string' ? msg : 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen w-full bg-stone-50 dark:bg-stone-950 font-sans flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white dark:bg-stone-900 rounded-xl shadow-lg border border-stone-200 dark:border-stone-800 p-8">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
          
          {/* Avatar Preview Section */}
          <div className="relative group mb-6">
           <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-orange-100 dark:border-orange-900/30 bg-stone-100 shadow-sm">
              <img 
                src={currentAvatarUrl} 
                alt="Avatar" 
                className="w-full h-full object-cover"
              />
            </div>
            <button
              type="button"
              onClick={generateRandomAvatar}
              className="absolute bottom-0 right-0 bg-orange-600 text-white p-1.5 rounded-full hover:bg-orange-700 transition-colors shadow-sm ring-2 ring-white dark:ring-stone-900"
              title="Generate Random Avatar"
            >
              <RefreshCw size={14} />
            </button>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
            Create an account
          </h1>
          <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
            Enter your details to get started with Hop-In
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-lg text-center animate-in fade-in slide-in-from-top-2">
            {typeof error === 'string' ? error : error.message || "Signup Failed"}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Role selector */}
          <div className="p-1.5 bg-stone-100 dark:bg-stone-800 rounded-lg flex gap-1">
            {['HOSTELLER', 'OWNER'].map((r) => (
              <label 
                key={r}
                className={`flex-1 flex items-center justify-center py-2 rounded-md text-sm font-semibold cursor-pointer transition-all duration-200 ${
                  role === r 
                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-sm ring-1 ring-stone-200 dark:ring-stone-600' 
                    : 'text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200'
                }`}
              >
                <span className="capitalize">{r.toLowerCase()}</span>
                <input
                  type="radio"
                  name="role"
                  value={r}
                  checked={role === r}
                  onChange={() => setRole(r)}
                  className="hidden" 
                />
              </label>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-700 dark:text-stone-300">Full Name</label>
            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              placeholder="e.g. Alex Doe"
              className="w-full px-4 py-2.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700 dark:text-stone-300">Email</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700 dark:text-stone-300">Phone</label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className="w-full px-4 py-2.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700 dark:text-stone-300">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700 dark:text-stone-300">Confirm</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-2.5 px-4 bg-orange-600 hover:bg-orange-700 dark:bg-orange-600 dark:hover:bg-orange-700 text-white rounded-lg font-semibold shadow-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader size="sm" showText={false} />
                Creating Account...
              </>
            ) : (
              "Sign Up"
            )}
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-200 dark:border-stone-800"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-stone-900 px-2 text-stone-500">Or</span>
            </div>
          </div>

          <div className="text-center text-sm text-stone-600 dark:text-stone-400">
            Already have an account?{' '}
            <Link 
              to="/login" 
              className="font-semibold text-orange-600 dark:text-orange-500 hover:text-orange-700 dark:hover:text-orange-400 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
