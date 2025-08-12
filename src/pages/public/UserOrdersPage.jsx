import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import orderService from '../../services/orderService';
import Layout from '../../components/Layout';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import AmountCurrency from '../../components/ui/AmountCurrency';
import { AppRoutes } from '../../config/routes';
import { Package, Eye } from 'lucide-react';
import useStore from '../../store/useStore';

function UserOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const { token } = useStore();

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  useEffect(() => {
    filterOrders();
  }, [orders, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const userOrders = await orderService.getOrders(token);
      setOrders(userOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    if (statusFilter === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => 
        order.orderStatus === statusFilter || order.blockchainStatus?.toLowerCase() === statusFilter.toLowerCase()
      ));
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'created':
        return 'text-blue-400 bg-blue-100/10';
      case 'paid':
        return 'text-green-400 bg-green-100/10';
      case 'shipped':
        return 'text-yellow-400 bg-yellow-100/10';
      case 'delivered':
        return 'text-successs-400 bg-successs-100/10';
      case 'cancelled':
        return 'text-dangerd-400 bg-dangerd-100/10';
      default:
        return 'text-neutralneutral-400 bg-neutralneutral-100/10';
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    // Check if timestamp is a number (blockchain timestamp) or string (MongoDB date)
    const date = typeof timestamp === 'number' ? new Date(timestamp * 1000) : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="w-[86%] mx-auto py-8">
          <div className="text-center text-white">Loading your orders...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="w-[86%] mx-auto py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h1 className="text-3xl font-heading-header-2-header-2-bold text-white">My Orders</h1>
          
          {/* Status Filter */}
          <div className="flex items-center gap-4">
            <span className="text-neutralneutral-300 text-sm">Filter by status:</span>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Orders" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="created">Created</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <Card className="p-8 text-center">
            <Package size={64} className="mx-auto text-neutralneutral-500 mb-4" />
            <h2 className="text-xl font-heading-header-3-header-3-bold text-white mb-2">
              {statusFilter === 'all' ? 'No orders yet' : `No ${statusFilter} orders`}
            </h2>
            <p className="text-neutralneutral-400 mb-6">
              {statusFilter === 'all' 
                ? 'Start shopping to see your orders here!' 
                : `You don't have any ${statusFilter} orders.`
              }
            </p>
            {statusFilter === 'all' && (
              <Link to={AppRoutes.home.path}>
                <Button className="bg-primaryp-500 hover:bg-primaryp-400">Start Shopping</Button>
              </Link>
            )}
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <Card key={order._id} className="p-6">
                <div className="flex flex-col lg:flex-row justify-between gap-6">
                  {/* Order Info */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                      <h3 className="text-lg font-body-large-large-bold text-white">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-body-xsmall-xsmall-bold uppercase ${getStatusColor(order.blockchainStatus || order.orderStatus)}`}>
                        {order.blockchainStatus || order.orderStatus}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-neutralneutral-300">
                      <div>
                        <span className="text-neutralneutral-500">Order Date:</span>
                        <span className="ml-2">{formatDate(order.createdAt)}</span>
                      </div>
                      <div>
                        <span className="text-neutralneutral-500">Items:</span>
                        <span className="ml-2">{order.products?.length || 0} item(s)</span>
                      </div>
                      <div>
                        <span className="text-neutralneutral-500">Total:</span>
                        <span className="ml-2 text-primaryp-400 font-body-base-base-bold">
                          <AmountCurrency amount={order.totalAmount} fromCurrency="USDT" />
                        </span>
                      </div>
                      {order.blockchainStatus && (
                        <div>
                          <span className="text-neutralneutral-500">Blockchain Status:</span>
                          <span className="ml-2">{order.blockchainStatus}</span>
                        </div>
                      )}
                      {order.blockchainCreatedAt && (
                        <div>
                          <span className="text-neutralneutral-500">Blockchain Created:</span>
                          <span className="ml-2">{formatDate(order.blockchainCreatedAt)}</span>
                        </div>
                      )}
                      {order.blockchainPaidAt && (
                        <div>
                          <span className="text-neutralneutral-500">Blockchain Paid:</span>
                          <span className="ml-2">{formatDate(order.blockchainPaidAt)}</span>
                        </div>
                      )}
                    </div>

                    {/* Order Items Preview */}
                    {order.products && order.products.length > 0 && (
                      <div className="mt-4">
                        <div className="flex flex-wrap gap-2">
                          {order.products.slice(0, 3).map((item, index) => (
                            <span key={index} className="text-xs bg-neutralneutral-800 px-2 py-1 rounded text-neutralneutral-300">
                              {item.product?.name} x{item.quantity}
                            </span>
                          ))}
                          {order.products.length > 3 && (
                            <span className="text-xs text-neutralneutral-500">
                              +{order.products.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-3 lg:w-48">
                    <Link to={`${AppRoutes.orderDetails.path.replace(':id', order._id)}`}>
                      <Button variant="outline" className="w-full border-neutralneutral-600 text-neutralneutral-300 hover:bg-neutralneutral-800">
                        <Eye size={16} className="mr-2" />
                        View Details
                      </Button>
                    </Link>
                    
                    {order.blockchainStatus?.toLowerCase() === 'delivered' && (
                      <Button className="w-full bg-primaryp-500 hover:bg-primaryp-400">
                        Reorder
                      </Button>
                    )}
                    
                    {['created', 'paid'].includes(order.blockchainStatus?.toLowerCase() || order.orderStatus?.toLowerCase()) && (
                      <Button variant="outline" className="w-full border-dangerd-400 text-dangerd-400 hover:bg-dangerd-400/10">
                        Cancel Order
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Load More Button (if needed) */}
        {filteredOrders.length >= 10 && (
          <div className="text-center mt-8">
            <Button variant="outline" className="border-neutralneutral-600 text-neutralneutral-300">
              Load More Orders
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default UserOrdersPage; 