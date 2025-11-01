import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { usePrivy } from '@privy-io/react-auth';
import useStore from '../store/useStore';
import { AppRoutes } from '../config/routes';

const PrivateRoute = ({ children, requireAdmin = false }) => {
  const { authenticated, user } = usePrivy();
  const currentUser = useStore((state) => state.currentUser);
  const location = useLocation();

  // Check if the route is an admin route
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/vendor') || requireAdmin;

  if (!authenticated) {
    // Not authenticated, redirect to appropriate login page
    if (isAdminRoute) {
      return <Navigate to={AppRoutes.login.path} />;
    } else {
      return <Navigate to={AppRoutes.userLogin.path} />;
    }
  }

  if (isAdminRoute && (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'vendor'))) {
    // Authenticated but not an admin/vendor trying to access an admin/vendor route
    return <Navigate to={AppRoutes.home.path} />;
  }

  return children;
};

// Component for user-specific private routes
export const UserPrivateRoute = ({ children }) => {
  const { authenticated } = usePrivy();
  const location = useLocation();

  if (!authenticated) {
    return <Navigate to={AppRoutes.userLogin.path} state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;