import React, { useState, useEffect } from 'react';
import orderService from '../../services/orderService';
import Layout from '../../components/Layout';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import AmountCurrency from '../../components/ui/AmountCurrency';
import { 
  ClipboardList, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Package,
  User,
  Calendar,
  DollarSign
} from 'lucide-react';

function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const clearMessages = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const fetchOrders = async () => {
    clearMessages();
    setLoading(true);
    try {
      const data = await orderService.adminGetAllOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setErrorMessage('Failed to fetch orders.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    clearMessages();
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      setSuccessMessage(`Order ${orderId} status updated to ${newStatus}.`);
      // Refetch orders to show the change immediately
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      setErrorMessage('Failed to update order status.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-warningw-400 bg-warningw-100/10';
      case 'processing':
        return 'text-infoi-400 bg-infoi-100/10';
      case 'shipped':
        return 'text-secondarys-400 bg-secondarys-100/10';
      case 'delivered':
        return 'text-successs-400 bg-successs-100/10';
      case 'cancelled':
        return 'text-dangerd-400 bg-dangerd-100/10';
      default:
        return 'text-neutralneutral-400 bg-neutralneutral-100/10';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.userId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Layout>
      <div className="w-[86%] mx-auto py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-successs-100/10 rounded-full flex items-center justify-center">
              <ClipboardList size={24} className="text-successs-400" />
            </div>
            <div>
              <h1 className="text-3xl font-heading-header-2-header-2-bold text-white">
                Order Management
              </h1>
              <p className="text-neutralneutral-400">View and manage customer orders</p>
            </div>
          </div>

          {/* Messages */}
          {errorMessage && (
            <Card className="p-4 mb-6 bg-dangerd-100/10 border-dangerd-400">
              <p className="text-dangerd-400">{errorMessage}</p>
            </Card>
          )}
          
          {successMessage && (
            <Card className="p-4 mb-6 bg-successs-100/10 border-successs-400">
              <p className="text-successs-400">{successMessage}</p>
            </Card>
          )}

          {/* Edit Order Form */}
          {/* {editingOrder && (
            <Card className="p-6 mb-6 border-warningw-400">
              <div className="flex items-center gap-2 mb-6">
                <Edit size={20} className="text-warningw-400" />
                <h2 className="text-xl font-heading-header-3-header-3-bold text-white">
                  Edit Order
                </h2>
              </div>
              
              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-neutralneutral-300 text-sm mb-2">User ID:</label>
                    <input
                      type="text"
                      value={editingOrder.userId}
                      onChange={(e) => setEditingOrder({ ...editingOrder, userId: e.target.value })}
                      className="w-full p-3 bg-neutralneutral-800 border border-neutralneutral-600 rounded-lg text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-neutralneutral-300 text-sm mb-2">Total:</label>
                    <input
                      type="number"
                      value={editingOrder.total}
                      onChange={(e) => setEditingOrder({ ...editingOrder, total: parseFloat(e.target.value) })}
                      className="w-full p-3 bg-neutralneutral-800 border border-neutralneutral-600 rounded-lg text-white"
                      required
                    />
                  </div>
                </div>
              </form>
            </Card>
          )} */}

          {/* Orders List */}
          <Card className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <h2 className="text-xl font-heading-header-3-header-3-bold text-white">
                Orders ({orders.length})
              </h2>
              
              {/* Filters */}
              <div className="flex gap-4">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutralneutral-400" />
                  <input
                    type="text"
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-neutralneutral-800 border border-neutralneutral-600 rounded-lg text-white placeholder-neutralneutral-400"
                  />
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8 text-neutralneutral-400">Loading orders...</div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-8">
                <Package size={48} className="text-neutralneutral-500 mx-auto mb-3" />
                <p className="text-neutralneutral-400">
                  {searchTerm || statusFilter !== 'all' ? 'No orders found matching your filters.' : 'No orders found.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div key={order._id} className="p-4 bg-neutralneutral-800 rounded-lg">
                    <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                      {/* Order Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-successs-100/10 rounded-full flex items-center justify-center">
                            <ClipboardList size={20} className="text-successs-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-body-large-large-bold text-white">
                              Order #{order._id.slice(-8).toUpperCase()}
                            </h3>
                            <span className={`px-2 py-1 rounded text-xs font-body-xsmall-xsmall-bold uppercase ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2 text-neutralneutral-300">
                            <User size={14} />
                            <span>User: {order.userId}</span>
                          </div>
                          <div className="flex items-center gap-2 text-neutralneutral-300">
                            <DollarSign size={14} />
                            <span><AmountCurrency amount={order.total} fromCurrency="USDT" /></span>
                          </div>
                          <div className="flex items-center gap-2 text-neutralneutral-300">
                            <Calendar size={14} />
                            <span>{new Date(order.createdAt || Date.now()).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Select
                          value={order.status}
                          onValueChange={(newStatus) => handleStatusChange(order._id, newStatus)}
                        >
                          <SelectTrigger className="w-36 bg-neutralneutral-700 border-neutralneutral-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="paid">Paid</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
}

export default OrderManagement;