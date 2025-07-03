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
  const [newOrder, setNewOrder] = useState({ productId: '' });
  const [editingOrder, setEditingOrder] = useState(null);
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
      const data = await orderService.getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setErrorMessage('Failed to fetch orders.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    clearMessages();
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await orderService.deleteOrder(id);
        fetchOrders();
        setSuccessMessage('Order deleted successfully!');
      } catch (error) {
        console.error('Error deleting order:', error);
        setErrorMessage('Failed to delete order.');
      }
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    clearMessages();
    try {
      await orderService.createOrder(newOrder);
      setNewOrder({ productId: '' });
      fetchOrders();
      setSuccessMessage('Order created successfully!');
    } catch (error) {
      console.error('Error creating order:', error);
      setErrorMessage('Failed to create order.');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    clearMessages();
    try {
      await orderService.updateOrder(editingOrder._id, editingOrder);
      setEditingOrder(null);
      fetchOrders();
      setSuccessMessage('Order updated successfully!');
    } catch (error) {
      console.error('Error updating order:', error);
      setErrorMessage('Failed to update order.');
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

          {/* Create New Order Form */}
          <Card className="p-6 mb-6">
            <div className="flex items-center gap-2 mb-6">
              <Plus size={20} className="text-primaryp-400" />
              <h2 className="text-xl font-heading-header-3-header-3-bold text-white">
                Create New Order
              </h2>
            </div>
            
            <form onSubmit={handleCreate} className="space-y-4">
              <input
                type="text"
                placeholder="Product ID (for simple order)"
                value={newOrder.productId}
                onChange={(e) => setNewOrder({ ...newOrder, productId: e.target.value })}
                className="w-full p-3 bg-neutralneutral-800 border border-neutralneutral-600 rounded-lg text-white placeholder-neutralneutral-400"
                required
              />
              
              <Button type="submit" className="bg-successs-500 hover:bg-successs-400">
                <Plus size={16} className="mr-2" />
                Add Order
              </Button>
            </form>
          </Card>

          {/* Edit Order Form */}
          {editingOrder && (
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
                
                <div>
                  <label className="block text-neutralneutral-300 text-sm mb-2">Status:</label>
                  <Select 
                    value={editingOrder.status} 
                    onValueChange={(value) => setEditingOrder({ ...editingOrder, status: value })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex gap-4">
                  <Button type="submit" className="bg-warningw-500 hover:bg-warningw-400">
                    <Edit size={16} className="mr-2" />
                    Update Order
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => setEditingOrder(null)}
                    variant="outline"
                    className="border-neutralneutral-600 text-neutralneutral-300"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          )}

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
                      <div className="flex gap-2">
                        <Button
                          onClick={() => setEditingOrder(order)}
                          size="sm"
                          className="bg-warningw-500 hover:bg-warningw-400"
                        >
                          <Edit size={14} className="mr-1" />
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDelete(order._id)}
                          size="sm"
                          className="bg-dangerd-500 hover:bg-dangerd-400"
                        >
                          <Trash2 size={14} className="mr-1" />
                          Delete
                        </Button>
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