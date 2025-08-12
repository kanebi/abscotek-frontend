import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { AppRoutes } from '../../config/routes';
import authService from '../../services/authService';
import { 
  Package, 
  ShoppingCart, 
  Truck, 
  LogOut,
  BarChart3,
  Settings
} from 'lucide-react';

function VendorDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate(AppRoutes.login.path);
  };

  const vendorMenuItems = [
    {
      title: 'My Products',
      description: 'Manage your product catalog',
      path: '/vendor/products',
      icon: Package,
      color: 'bg-primaryp-500 hover:bg-primaryp-400'
    },
    {
      title: 'My Orders',
      description: 'View and process customer orders',
      path: '/vendor/orders',
      icon: ShoppingCart,
      color: 'bg-successs-500 hover:bg-successs-400'
    },
    {
      title: 'Analytics',
      description: 'View sales and performance metrics',
      path: '/vendor/analytics',
      icon: BarChart3,
      color: 'bg-infoi-500 hover:bg-infoi-400'
    },
    {
      title: 'Settings',
      description: 'Manage your vendor profile',
      path: '/vendor/settings',
      icon: Settings,
      color: 'bg-warningw-500 hover:bg-warningw-400'
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-heading-header-1-header-1-bold text-white mb-2">
              Vendor Dashboard
            </h1>
            <p className="text-neutralneutral-400 font-body-base-base-regular">
              Manage your products, orders, and business analytics
            </p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-neutralneutral-600 text-neutralneutral-300 hover:bg-neutralneutral-700 hover:text-white"
          >
            <LogOut size={16} className="mr-2" />
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {vendorMenuItems.map((item, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-neutralneutral-800 border-neutralneutral-700">
              <Link to={item.path}>
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className={`p-4 rounded-full ${item.color} text-white`}>
                    <item.icon size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-heading-header-5-header-5-bold text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-neutralneutral-400 font-body-small-small-regular">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Link>
            </Card>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-12">
          <h2 className="text-2xl font-heading-header-3-header-3-bold text-white mb-6">
            Quick Stats
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 bg-neutralneutral-800 border-neutralneutral-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-neutralneutral-400 font-body-small-small-regular">Total Products</p>
                  <p className="text-2xl font-heading-header-4-header-4-bold text-white">24</p>
                </div>
                <Package size={24} className="text-primaryp-400" />
              </div>
            </Card>
            
            <Card className="p-6 bg-neutralneutral-800 border-neutralneutral-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-neutralneutral-400 font-body-small-small-regular">Pending Orders</p>
                  <p className="text-2xl font-heading-header-4-header-4-bold text-white">8</p>
                </div>
                <ShoppingCart size={24} className="text-successs-400" />
              </div>
            </Card>
            
            <Card className="p-6 bg-neutralneutral-800 border-neutralneutral-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-neutralneutral-400 font-body-small-small-regular">Monthly Sales</p>
                  <p className="text-2xl font-heading-header-4-header-4-bold text-white">$12,450</p>
                </div>
                <BarChart3 size={24} className="text-infoi-400" />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default VendorDashboard; 