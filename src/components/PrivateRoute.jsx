import React from 'react';
import { Navigate } from 'react-router-dom';
import useStore from '../store/useStore'; // Import useStore
import { AppRoutes } from '../config/routes';

const PrivateRoute = ({ children }) => {
  const currentUser = useStore((state) => state.currentUser); // Get currentUser from Zustand store
  const isAdmin = currentUser && currentUser.isAdmin;

  if (!currentUser) {
    // Not logged in, redirect to login page
    return <Navigate to={AppRoutes.login.path} />;
  }

  if (!isAdmin) {
    // Logged in but not an admin, redirect to home or unauthorized page
    return <Navigate to={AppRoutes.home.path} />;
  }

  return children;
};

export default PrivateRoute;