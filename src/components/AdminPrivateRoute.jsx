import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAdminStore from '../store/adminStore';
import { AppRoutes } from '../config/routes';

const AdminPrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAdminStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={AppRoutes.adminLogin.path} state={{ from: location }} replace />;
  }

  return children;
};

export default AdminPrivateRoute;
