import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userLogin, clearError } from "../../redux/slices/authSlices.js"; 
import { useNavigate, Link } from "react-router-dom";
import Loader from '../Common/UI/Loader.jsx';
import { Zap, Eye, EyeOff, Building } from "lucide-react";
import { toastError, toastSuccess } from '../../utils/toast.js';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // 1. Get requiresVerification from Redux
  const { loading, error, user, requiresVerification } = useSelector((state) => state.auth);

  const [role, setRole] = useState("HOSTELLER"); // Only for dummy data button
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  useEffect(() => {
    // 2. Check for Verification Redirect First
    if (requiresVerification) {
      navigate("/verify-otp");
      return;
    }

    // 3. Then Check for Successful Login
    if (user) {
      if (user.role === "OWNER" || user.role === "ADMIN") {
        navigate("/owner/dashboard");
      } else {
        navigate("/hosteller/dashboard");
      }
    }

    // Cleanup error on unmount
    return () => {
      dispatch(clearError());
    };
  }, [user, requiresVerification, navigate, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fillDummyData = () => {
    const dummyData = role === 'OWNER' ? {
      email: 'praveensingh99036@gmail.com',
      password: '123456'
    } : {
      email: 'student@hopin.com',
      password: 'password123'
    };
    setFormData(dummyData);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await dispatch(userLogin(formData)).unwrap();
      toastSuccess('Welcome back!');
    } catch (err) {
      const msg = err?.msg || err?.message || err || 'Login failed';
      toastError(typeof msg === 'string' ? msg : 'Login failed');
    }
  };

  return (
    <div className="min-h-screen w-full bg-stone-50 dark:bg-stone-950 font-sans flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-stone-900 rounded-xl shadow-lg border border-stone-200 dark:border-stone-800 p-8">
        
        {/* Header matching Layout */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-full mb-4">
            <Building className="h-8 w-8 text-orange-700 dark:text-orange-500" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
            Sign in to access your Hop-In account
          </p>
          
          {process.env.NODE_ENV === 'development' && (
            <div className="flex gap-2 mt-4">
               <button
                type="button"
                onClick={() => { setRole("HOSTELLER"); fillDummyData(); }}
                className="flex items-center gap-1 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs rounded-full transition-colors"
              >
                <Zap size={12} /> Student
              </button>
              <button
                type="button"
                onClick={() => { setRole("OWNER"); fillDummyData(); }}
                className="flex items-center gap-1 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs rounded-full transition-colors"
              >
                <Zap size={12} /> Owner
              </button>
            </div>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-lg text-center animate-in fade-in slide-in-from-top-2">
            {typeof error === 'string' ? error : error.message || "Login Failed"}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          
          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-700 dark:text-stone-300">Email Address</label>
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

          {/* Password */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-stone-700 dark:text-stone-300">Password</label>
              <a href="#" className="text-sm font-medium text-orange-600 dark:text-orange-500 hover:text-orange-700 dark:hover:text-orange-400">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all pr-12"
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-orange-600 hover:bg-orange-700 dark:bg-orange-600 dark:hover:bg-orange-700 text-white rounded-lg font-semibold shadow-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader size="sm" showText={false} />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-200 dark:border-stone-800"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-stone-900 px-2 text-stone-500">Or continue with</span>
            </div>
          </div>

          <div className="text-center text-sm text-stone-600 dark:text-stone-400">
            Don't have an account?{' '}
            <Link 
              to="/signup" 
              className="font-semibold text-orange-600 dark:text-orange-500 hover:text-orange-700 dark:hover:text-orange-400 transition-colors"
            >
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
