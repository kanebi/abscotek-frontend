import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import ProductManagement from './pages/admin/ProductManagement';
import OrderManagement from './pages/admin/OrderManagement';
import CartManagement from './pages/admin/CartManagement';
import DeliveryMethodManagement from './pages/admin/DeliveryMethodManagement';
import WishlistManagement from './pages/admin/WishlistManagement';

// Public Pages
import LoginPage from './pages/public/LoginPage';
import HomePage from './pages/public/HomePage';
import ProductDetailPage from './pages/public/ProductDetailPage';
import CartPage from './pages/public/CartPage';
import CheckoutPage from './pages/public/CheckoutPage';
import UserOrdersPage from './pages/public/UserOrdersPage';
import OrderDetailsPage from './pages/public/OrderDetailsPage';
import OrderSuccessPage from './pages/public/OrderSuccessPage';
import UserProfilePage from './pages/public/UserProfilePage';
import ReferralPage from './pages/public/ReferralPage';
import WithdrawalPage from './pages/public/WithdrawalPage';

// Components
import PrivateRoute from './components/PrivateRoute';
import Toast from './components/Toast';
import Layout from './components/Layout';

// Configuration
import { AppRoutes } from './config/routes';
import './App.css';

function App() {
  return (
    <Router>
      {/* <AuthProvider> */}
        <div className="App">
          <Toast />
          <Routes>
            {/* Public Routes */}
            <Route path={AppRoutes.home.path} element={<HomePage />} />
            <Route path={AppRoutes.login.path} element={<LoginPage />} />
            <Route path={AppRoutes.productDetail.path} element={<ProductDetailPage />} />
            <Route path={AppRoutes.cart.path} element={<CartPage />} />
            <Route path={AppRoutes.checkout.path} element={<CheckoutPage />} />
            <Route path={AppRoutes.userOrders.path} element={<UserOrdersPage />} />
            <Route path={AppRoutes.orderDetails.path} element={<OrderDetailsPage />} />
            <Route path={AppRoutes.orderSuccess.path} element={<OrderSuccessPage />} />
            <Route path={AppRoutes.userProfile.path} element={<UserProfilePage />} />
            <Route path={AppRoutes.referral.path} element={<ReferralPage />} />
            <Route path={AppRoutes.withdrawal.path} element={<WithdrawalPage />} />
            
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