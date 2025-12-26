// src/components/ErrorBoundary.jsx
import React from "react";
import { Frown, Home, RefreshCw } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleGoHome = () => {
    resetErrorBoundary?.();
    navigate("/");
  };

  const handleGoBack = () => {
    resetErrorBoundary?.();
    if (location.key !== "default") {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex items-center justify-center px-4">
      <div className="w-full max-w-xl mx-auto bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-sm p-8 md:p-10 text-center space-y-6">
        {/* Icon + Code */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center border border-orange-100 dark:border-orange-800">
            <Frown className="w-8 h-8 text-orange-600 dark:text-orange-400" />
          </div>
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-orange-600 dark:text-orange-400">
            Something went wrong
          </p>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-stone-900 dark:text-stone-100">
            Oops! Page not found
          </h1>
          <p className="text-sm md:text-base text-stone-600 dark:text-stone-400 max-w-md">
            The page you are looking for doesn&apos;t exist or an unexpected
            error occurred. Please check the URL or return to a safe page.
          </p>
        </div>

        {/* Optional error message (dev-friendly) */}
        {error && (
          <div className="text-xs text-left bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-lg p-3 font-mono text-stone-500 dark:text-stone-400 overflow-x-auto max-h-32">
            <span className="font-semibold text-stone-700 dark:text-stone-200">
              Error:
            </span>{" "}
            {error.message || "Unknown error"}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={handleGoHome}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-orange-600 text-white text-sm font-semibold shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1 focus:ring-offset-stone-50 dark:focus:ring-offset-stone-950 transition-colors"
          >
            <Home className="w-4 h-4" />
            Go to Homepage
          </button>
          <button
            onClick={handleGoBack}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-stone-200 dark:border-stone-700 text-sm font-semibold text-stone-700 dark:text-stone-200 bg-white dark:bg-stone-900 hover:border-orange-300 hover:text-orange-700 dark:hover:border-orange-500 dark:hover:text-orange-300 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Go Back
          </button>
        </div>

        {/* Small hint */}
        <p className="text-xs text-stone-400 dark:text-stone-500">
          If this keeps happening, contact support or try again later.
        </p>
      </div>
    </div>
  );
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // You can log to a monitoring service here
    console.error("ErrorBoundary caught an error:", error, info);
  }

  resetErrorBoundary = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback
          error={this.state.error}
          resetErrorBoundary={this.resetErrorBoundary}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
