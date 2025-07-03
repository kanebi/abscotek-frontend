import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { AppRoutes } from '../../config/routes';
import authService from '../../services/authService';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  Truck, 
  Heart, 
  ClipboardList,
  LogOut,
  BarChart3
} from 'lucide-react';

function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate(AppRoutes.login.path);
  };

  const adminMenuItems = [
    {
      title: 'Manage Users',
      description: 'View, edit, and manage user accounts',
      path: AppRoutes.adminUsers.path,
      icon: Users,
      color: 'bg-primaryp-500 hover:bg-primaryp-400'
    },
    {
      title: 'Manage Products',
      description: 'Add, edit, and manage product catalog',
      path: AppRoutes.adminProducts.path,
      icon: Package,
      color: 'bg-secondarys-500 hover:bg-secondarys-400'
    },
    {
      title: 'Manage Orders',
      description: 'View and process customer orders',
      path: AppRoutes.adminOrders.path,
      icon: ClipboardList,
      color: 'bg-successs-500 hover:bg-successs-400'
    },
    {
      title: 'Manage Carts',
      description: 'View and manage shopping carts',
      path: AppRoutes.adminCarts.path,
      icon: ShoppingCart,
      color: 'bg-infoi-500 hover:bg-infoi-400'
    },
    {
      title: 'Delivery Methods',
      description: 'Configure shipping and delivery options',
      path: AppRoutes.adminDeliveryMethods.path,
      icon: Truck,
      color: 'bg-warningw-500 hover:bg-warningw-400'
    },
    {
      title: 'Manage Wishlist',
      description: 'View and manage user wishlists',
      path: AppRoutes.adminWishlist.path,
      icon: Heart,
      color: 'bg-dangerd-500 hover:bg-dangerd-400'
    }
  ];

  return (
    <Layout>
      <div className="w-[86%] mx-auto py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-primaryp-100/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <BarChart3 size={48} className="text-primaryp-400" />
            </div>
            <h1 className="text-4xl font-heading-header-1-header-1-bold text-white mb-4">
              Admin Dashboard
            </h1>
            <p className="text-xl text-neutralneutral-300">
              Manage your e-commerce platform
            </p>
          </div>

          {/* Admin Menu Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {adminMenuItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <Link key={index} to={item.path}>
                  <Card className="p-6 hover:scale-105 transition-transform duration-200 cursor-pointer group">
                    <div className="flex flex-col items-center text-center">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${item.color} group-hover:scale-110 transition-transform duration-200`}>
                        <IconComponent size={32} className="text-white" />
                      </div>
                      <h3 className="text-xl font-heading-header-3-header-3-bold text-white mb-2">
                        {item.title}
                      </h3>
                      <p className="text-neutralneutral-400 text-sm">
                        {item.description}
                      </p>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>

          {/* Quick Stats or Actions */}
          <Card className="p-6 mb-8">
            <h2 className="text-2xl font-heading-header-2-header-2-bold text-white mb-4">
              Quick Actions
            </h2>
            <div className="flex flex-wrap gap-4">
              <Button className="bg-primaryp-500 hover:bg-primaryp-400">
                View Reports
              </Button>
              <Button variant="outline" className="border-neutralneutral-600 text-neutralneutral-300">
                System Settings
              </Button>
              <Button variant="outline" className="border-neutralneutral-600 text-neutralneutral-300">
                Backup Data
              </Button>
            </div>
          </Card>

          {/* Logout Section */}
          <div className="text-center">
            <Button
              onClick={handleLogout}
              className="bg-dangerd-500 hover:bg-dangerd-400 text-white px-8 py-3"
            >
              <LogOut size={20} className="mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default AdminDashboard;