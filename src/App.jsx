import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminDashboard from './admin/AdminDashboard';
import UserManagement from './admin/UserManagement';
import ProductManagement from './admin/ProductManagement';
import OrderManagement from './admin/OrderManagement';
import CartManagement from './admin/CartManagement';
import DeliveryMethodManagement from './admin/DeliveryMethodManagement';
import WishlistManagement from './admin/WishlistManagement';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import PrivateRoute from './components/PrivateRoute';
import { AppRoutes } from './config/routes';
import './App.css';
import Toast from './components/Toast';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      {/* <AuthProvider> */}
        <div className="App">
          <Toast />
          <Routes>
            <Route path={AppRoutes.home.path} element={<HomePage />} />
            <Route path={AppRoutes.login.path} element={<LoginPage />} />
            {/* Example: wrap other public pages with Layout if needed */}
            {/* <Route path="/about" element={<Layout><AboutPage /></Layout>} /> */}
            {/* Protected Admin Routes */}
            <Route path={AppRoutes.admin.path} element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
            <Route path={AppRoutes.adminUsers.path} element={<PrivateRoute><UserManagement /></PrivateRoute>} />
            <Route path={AppRoutes.adminProducts.path} element={<PrivateRoute><ProductManagement /></PrivateRoute>} />
            <Route path={AppRoutes.adminOrders.path} element={<PrivateRoute><OrderManagement /></PrivateRoute>} />
            <Route path={AppRoutes.adminCarts.path} element={<PrivateRoute><CartManagement /></PrivateRoute>} />
            <Route path={AppRoutes.adminDeliveryMethods.path} element={<PrivateRoute><DeliveryMethodManagement /></PrivateRoute>} />
            <Route path={AppRoutes.adminWishlist.path} element={<PrivateRoute><WishlistManagement /></PrivateRoute>} />
          </Routes>
        </div>
      {/* </AuthProvider> */}
    </Router>
  );
}

export default App;