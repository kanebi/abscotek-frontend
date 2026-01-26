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
import useNotificationStore from '../../store/notificationStore';

function UserOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const { token } = useStore();
  const { addNotification } = useNotificationStore();

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
      const userOrders = await orderService.getOrders();
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
      case 'pending':
        return 'text-yellow-400 bg-yellow-500/20';
      case 'confirmed':
        return 'text-blue-400 bg-blue-500/20';
      case 'processing':
        return 'text-orange-400 bg-orange-500/20';
      case 'shipped':
        return 'text-purple-400 bg-purple-500/20';
      case 'delivered':
        return 'text-green-400 bg-green-500/20';
      case 'cancelled':
        return 'text-red-400 bg-red-500/20';
      case 'refunded':
        return 'text-gray-400 bg-gray-500/20';
      default:
        return 'text-neutral-400 bg-neutral-500/20';
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

  const handleCancelOrder = async () => {
    if (!orderToCancel) return;

    try {
      setCancellingOrderId(orderToCancel._id);
      await orderService.cancelOrder(orderToCancel._id);
      addNotification('Order cancelled successfully. Refund will be processed within 3-5 business days.', 'success');

      // Refresh orders list
      await fetchOrders();

      // Close modal
      setShowCancelModal(false);
      setOrderToCancel(null);
    } catch (err) {
      console.error('Error cancelling order:', err);
      addNotification('Failed to cancel order. Please try again.', 'error');
    } finally {
      setCancellingOrderId(null);
    }
  };

  const openCancelModal = (order) => {
    setOrderToCancel(order);
    setShowCancelModal(true);
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <Card className="bg-[#1F1F21] border-none p-8 text-center rounded-xl">
            <Package size={64} className="mx-auto text-neutral-500 mb-4" />
            <h2 className="text-xl font-heading-header-3-header-3-bold text-white mb-2">
              {statusFilter === 'all' ? 'No orders yet' : `No ${statusFilter} orders`}
            </h2>
            <p className="text-neutral-400 mb-6">
              {statusFilter === 'all'
                ? 'Start shopping to see your orders here!'
                : `You don't have any ${statusFilter} orders.`
              }
            </p>
            {statusFilter === 'all' && (
              <Link to={AppRoutes.home.path}>
                <Button className="bg-primary-500 hover:bg-primary-600 text-white">Start Shopping</Button>
              </Link>
            )}
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <Card key={order._id} className="bg-[#1F1F21] border-none p-6 rounded-xl">
                <div className="flex flex-col lg:flex-row justify-between gap-6">
                  {/* Order Info */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                      <h3 className="text-lg font-body-large-large-bold text-white">
                        Order #{order.orderNumber || order._id.slice(-8).toUpperCase()}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-body-xsmall-xsmall-bold uppercase ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-neutral-300">
                      <div>
                        <span className="text-neutral-500">Order Date:</span>
                        <span className="ml-2">{formatDate(order.orderDate || order.createdAt)}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500">Items:</span>
                        <span className="ml-2">{order.items?.length || order.products?.length || 0} item(s)</span>
                      </div>
                      <div>
                        <span className="text-neutral-500">Total:</span>
                        <span className="ml-2 text-primary-400 font-body-base-base-bold">
                          <AmountCurrency 
                            amount={
                              order.totalAmount || 
                              order.pricing?.total || 
                              ((order.pricing?.subtotal || order.subTotal || 0) + (order.pricing?.delivery || order.deliveryFee || 0))
                            } 
                            fromCurrency={order.currency || "USDT"} 
                          />
                        </span>
                      </div>
                      {order.trackingNumber && (
                        <div>
                          <span className="text-neutral-500">Tracking:</span>
                          <span className="ml-2">{order.trackingNumber}</span>
                        </div>
                      )}
                    </div>

                    {/* Order Items Preview */}
                    {(order.items || order.products) && (order.items?.length > 0 || order.products?.length > 0) && (
                      <div className="mt-4">
                        <div className="flex flex-wrap gap-2">
                          {(order.items || order.products).slice(0, 3).map((item, index) => (
                            <span key={index} className="text-xs bg-neutral-800 px-2 py-1 rounded text-neutral-300">
                              {item.productName || item.product?.name || item.name || 'Product'} x{item.quantity}
                            </span>
                          ))}
                          {(order.items || order.products).length > 3 && (
                            <span className="text-xs text-neutral-500">
                              +{(order.items || order.products).length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-3 lg:w-48">
                    <Link to={`${AppRoutes.orderDetails.path.replace(':id', order._id)}`}>
                      <Button className="w-full bg-primary-500 hover:bg-primary-600 text-white">
                        <Eye size={16} className="mr-2" />
                        View Details
                      </Button>
                    </Link>

                    {order.status?.toLowerCase() === 'delivered' && (
                      <Button className="w-full bg-primary-500 hover:bg-primary-600 text-white">
                        Reorder
                      </Button>
                    )}

                    {['pending', 'confirmed', 'processing'].includes(order.status?.toLowerCase()) && (
                      <Button
                        variant="outline"
                        className="w-full bg-inherit border-red-500 text-red-400 hover:text-red-50 hover:bg-red-800/30"
                        onClick={() => openCancelModal(order)}
                        disabled={cancellingOrderId === order._id}
                      >
                        {cancellingOrderId === order._id ? 'Cancelling...' : 'Cancel Order'}
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
            <Button variant="outline" className="border-neutral-600 text-neutral-300 hover:bg-neutral-800">
              Load More Orders
            </Button>
          </div>
        )}

        {/* Cancel Order Modal */}
        {showCancelModal && orderToCancel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-[500px] p-8 bg-neutral-900 rounded-2xl shadow-[0px_16px_32px_0px_rgba(0,0,0,0.20)] inline-flex flex-col justify-start items-start gap-6 overflow-hidden relative">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setOrderToCancel(null);
                }}
                className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300"
              >
                ×
              </button>

              <div className="self-stretch flex flex-col justify-start items-start gap-4">
                <div className="inline-flex justify-start items-center gap-4">
                  <div className="w-12 h-12 flex items-center justify-center relative overflow-visible bg-red-500/20 rounded-full">
                    <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div className="flex flex-col justify-start items-start gap-1">
                    <div className="text-white text-xl font-bold font-['Mona_Sans']">Cancel Order</div>
                    <div className="text-neutral-400 text-sm font-medium font-['Mona_Sans']">Order #{orderToCancel.orderNumber || orderToCancel._id.slice(-8).toUpperCase()}</div>
                  </div>
                </div>

                <div className="self-stretch flex flex-col justify-start items-start gap-4">
                  <div className="text-neutral-300 text-base font-medium font-['Mona_Sans'] leading-relaxed">
                    Are you sure you want to cancel this order? This action cannot be undone.
                  </div>

                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 w-full">
                    <div className="text-yellow-400 text-sm font-medium font-['Mona_Sans'] mb-2">Important Information:</div>
                    <ul className="text-neutral-300 text-sm font-['Mona_Sans'] space-y-1">
                      <li>• Refund will be processed within 3-5 business days</li>
                      <li>• Amount will be credited to your original payment method</li>
                      <li>• You cannot undo this action once confirmed</li>
                    </ul>
                  </div>

                  <div className="bg-neutral-800 rounded-lg p-4 w-full">
                    <div className="text-white text-sm font-medium font-['Mona_Sans'] mb-2">Order Summary:</div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-300">Subtotal:</span>
                        <span className="text-neutral-300">
                          <AmountCurrency amount={orderToCancel.pricing?.subtotal || orderToCancel.subTotal || 0} fromCurrency={orderToCancel.currency || 'USDT'} />
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-300">Shipping:</span>
                        <span className="text-neutral-300">
                          <AmountCurrency amount={orderToCancel.pricing?.delivery || orderToCancel.deliveryFee || orderToCancel.deliveryMethod?.price || 0} fromCurrency={orderToCancel.pricing?.deliveryCurrency || orderToCancel.deliveryMethod?.currency || orderToCancel.currency || 'USDT'} />
                        </span>
                      </div>
                      <div className="border-t border-neutral-600 my-2"></div>
                      <div className="flex justify-between items-center">
                        <span className="text-white font-semibold">Total Amount:</span>
                        <span className="text-white font-semibold">
                          <AmountCurrency amount={orderToCancel.pricing?.total || orderToCancel.totalAmount || (orderToCancel.pricing?.subtotal || orderToCancel.subTotal || 0) + (orderToCancel.pricing?.delivery || orderToCancel.deliveryFee || orderToCancel.deliveryMethod?.price || 0)} fromCurrency={orderToCancel.currency || 'USDT'} />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="self-stretch flex justify-end items-center gap-3">
                  <Button
                    onClick={() => {
                      setShowCancelModal(false);
                      setOrderToCancel(null);
                    }}
                    className="px-6 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg"
                    disabled={cancellingOrderId !== null}
                  >
                    Keep Order
                  </Button>
                  <Button
                    onClick={handleCancelOrder}
                    disabled={cancellingOrderId !== null}
                    className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg disabled:opacity-50"
                  >
                    {cancellingOrderId === orderToCancel._id ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Cancelling...
                      </div>
                    ) : (
                      'Cancel Order'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default UserOrdersPage;