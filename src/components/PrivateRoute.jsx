import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useStore from '../store/useStore';
import { AppRoutes } from '../config/routes';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const currentUser = useStore((state) => state.currentUser);
  const location = useLocation();

  // Check if the route is an admin route
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/vendor');

  if (!isAuthenticated) {
    // Not authenticated, redirect to admin login page
    return <Navigate to={AppRoutes.login.path} />;
  }

  if (isAdminRoute && (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'vendor'))) {
    // Authenticated but not an admin/vendor trying to access an admin/vendor route
    return <Navigate to={AppRoutes.home.path} />;
  }

  return children;
};

export default PrivateRoute;