import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppRoutes } from '../config/routes';
import authService from '../services/authService'; // Import authService directly

function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout(); // Call logout from authService
    navigate(AppRoutes.login.path);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md text-center w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
        <p className="text-gray-600 mb-8">Welcome to the admin panel. Select an option below:</p>
        <nav className="flex flex-col space-y-4">
          <Link to={AppRoutes.adminUsers.path} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">Manage Users</Link>
          <Link to={AppRoutes.adminProducts.path} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">Manage Products</Link>
          <Link to={AppRoutes.adminOrders.path} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">Manage Orders</Link>
          <Link to={AppRoutes.adminCarts.path} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">Manage Carts</Link>
          <Link to={AppRoutes.adminDeliveryMethods.path} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">Manage Delivery Methods</Link>
          <Link to={AppRoutes.adminWishlist.path} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">Manage Wishlist</Link>
        </nav>
        <button
          onClick={handleLogout}
          className="mt-8 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 w-full"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default AdminDashboard;