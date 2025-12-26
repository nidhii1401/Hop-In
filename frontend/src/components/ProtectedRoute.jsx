import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const dashboardFor = (role) => {
  if (role === 'OWNER') return '/owner/dashboard';
  if (role === 'HOSTELLER') return '/hosteller/dashboard';
  if (role === 'ADMIN') return '/owner/dashboard';
  return '/login';
};

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950">
        <div className="animate-spin h-8 w-8 border-2 border-orange-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Admin can access everything
  if (user.role === 'ADMIN') {
    return children;
  }

  // Owner-only sections allow Owner or Admin (handled above)
  if (requiredRole === 'OWNER' && user.role !== 'OWNER') {
    return <Navigate to={dashboardFor(user.role)} replace />;
  }

  // Hosteller-only sections allow Hosteller or Admin (handled above)
  if (requiredRole === 'HOSTELLER' && user.role !== 'HOSTELLER') {
    return <Navigate to={dashboardFor(user.role)} replace />;
  }

  // If a specific role is demanded and doesn't match
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={dashboardFor(user.role)} replace />;
  }

  return children;
};

export default ProtectedRoute;
