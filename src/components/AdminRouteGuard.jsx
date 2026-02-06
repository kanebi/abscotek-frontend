import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAdminStore from '../store/adminStore';
import { AppRoutes } from '../config/routes';

/**
 * Guards all admin/vendor routes. Ensures:
 * - User is authenticated (admin token + user in store)
 * - User has admin or vendor role
 * Redirects to /admin/login if not allowed.
 */
const AdminRouteGuard = () => {
  const { isAuthenticated, user } = useAdminStore();
  const location = useLocation();

  const isAdminOrVendor = user?.role === 'admin' || user?.role === 'vendor';

  if (!isAuthenticated) {
    return <Navigate to={AppRoutes.adminLogin.path} state={{ from: location }} replace />;
  }

  if (!isAdminOrVendor) {
    return <Navigate to={AppRoutes.adminLogin.path} state={{ from: location, reason: 'access_denied' }} replace />;
  }

  return <Outlet />;
};

export default AdminRouteGuard;
