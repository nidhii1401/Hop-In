import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { verifyOtp, clearError } from "../../redux/slices/authSlices.js";
import { useNavigate } from "react-router-dom";
import Loader from '../Common/UI/Loader.jsx';
import { Mail, ArrowRight, ShieldCheck } from "lucide-react";
import { toastError, toastSuccess } from '../../utils/toast.js';

const VerifyOtp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get email from Redux state (saved during signup or failed login)
  const { loading, error, tempEmail, user } = useSelector((state) => state.auth || {});

  const [otp, setOtp] = useState("");

  useEffect(() => {
    // If no email is found in state (user refreshed page), redirect to login
    if (!tempEmail && !user) {
      navigate("/login");
    }

    // If verification succeeded (user exists), redirect to dashboard/home
    if (user) {
      navigate("/"); // or /dashboard
    }

    return () => {
      dispatch(clearError());
    };
  }, [tempEmail, user, navigate, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toastError("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      await dispatch(verifyOtp({ email: tempEmail, otp })).unwrap();
      toastSuccess('Email verified');
    } catch (err) {
      const msg = err?.message || err || 'Verification failed';
      toastError(typeof msg === 'string' ? msg : 'Verification failed');
    }
  };

  // Mask email for privacy (e.g., a***@gmail.com)
  const maskedEmail = tempEmail 
    ? tempEmail.replace(/^(.)(.*)(.@.*)$/, "$1***$3") 
    : "your email";

  return (
    <div className="min-h-screen w-full bg-stone-50 dark:bg-stone-950 font-sans flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-stone-900 rounded-xl shadow-lg border border-stone-200 dark:border-stone-800 p-8">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="bg-orange-100 dark:bg-orange-900/30 p-4 rounded-full mb-4 animate-in zoom-in duration-300">
            <ShieldCheck className="h-10 w-10 text-orange-600 dark:text-orange-500" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
            Verify your account
          </h1>
          <p className="mt-2 text-sm text-stone-500 dark:text-stone-400 max-w-[280px]">
            We've sent a 6-digit verification code to <span className="font-semibold text-stone-800 dark:text-stone-200">{maskedEmail}</span>
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-lg text-center animate-in fade-in slide-in-from-top-2">
            {typeof error === 'string' ? error : "Verification failed. Try again."}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-700 dark:text-stone-300 ml-1">
              Enter Verification Code
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
              <input
                type="text"
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))} // Numbers only
                placeholder="123456"
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 text-lg tracking-widest font-mono focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
                autoFocus
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || otp.length < 6}
            className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-700 dark:bg-orange-600 dark:hover:bg-orange-700 text-white rounded-lg font-semibold shadow-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader size="sm" showText={false} />
                Verifying...
              </>
            ) : (
              <>
                Verify Email <ArrowRight size={18} />
              </>
            )}
          </button>

          <div className="text-center text-sm text-stone-500 dark:text-stone-400 mt-6">
            Didn't receive the code?{' '}
            <button 
              type="button"
              className="text-orange-600 dark:text-orange-500 font-semibold hover:underline"
              onClick={() => alert("Resend logic here (optional)")}
            >
              Resend
            </button>
          </div>
          
          <div className="text-center mt-4">
             <button
              type="button" 
              onClick={() => navigate('/login')}
              className="text-xs text-stone-400 hover:text-stone-600 transition-colors"
            >
              ← Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;
