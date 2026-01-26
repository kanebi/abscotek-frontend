import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import orderService from '../../services/orderService';
import Layout from '../../components/Layout';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import AmountCurrency from '../../components/ui/AmountCurrency';
import { 
  ArrowLeft, 
  Package, 
  User, 
  Mail, 
  Calendar,
  MapPin,
  Truck,
  DollarSign
} from 'lucide-react';
import { AppRoutes } from '../../config/routes';

function OrderDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const data = await orderService.adminGetOrderById(id);
      console.log('Order data received:', data);
      console.log('Order items:', data.items);
      console.log('Items count:', data.items?.length || 0);
      setOrder(data);
    } catch (error) {
      console.error('Error fetching order:', error);
      setErrorMessage('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    
    try {
      await orderService.adminUpdateOrder(id, { status: newStatus });
      setSuccessMessage(`Order status updated to ${newStatus}`);
      fetchOrder();
    } catch (error) {
      console.error('Error updating status:', error);
      const errorMsg = error.response?.data?.msg || error.response?.data?.message || 'Failed to update status';
      setErrorMessage(errorMsg);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case 'pending':
        return 'text-warningw-400 bg-warningw-100/10 border-warningw-400';
      case 'confirmed':
        return 'text-infoi-400 bg-infoi-100/10 border-infoi-400';
      case 'processing':
        return 'text-infoi-400 bg-infoi-100/10 border-infoi-400';
      case 'shipped':
        return 'text-secondarys-400 bg-secondarys-100/10 border-secondarys-400';
      case 'delivered':
        return 'text-successs-400 bg-successs-100/10 border-successs-400';
      case 'cancelled':
        return 'text-dangerd-400 bg-dangerd-100/10 border-dangerd-400';
      case 'refunded':
        return 'text-neutralneutral-400 bg-neutralneutral-100/10 border-neutralneutral-400';
      default:
        return 'text-neutralneutral-400 bg-neutralneutral-100/10 border-neutralneutral-400';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="w-[86%] mx-auto py-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-white text-center">Loading order details...</div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout>
        <div className="w-[86%] mx-auto py-8">
          <div className="max-w-6xl mx-auto">
            <Card className="p-6 bg-dangerd-100/10 border-dangerd-400">
              <p className="text-dangerd-400">Order not found</p>
            </Card>
            <Button 
              onClick={() => navigate(AppRoutes.adminOrders.path)}
              className="mt-4"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Orders
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="w-[86%] mx-auto py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-heading-header-2-header-2-bold text-white mb-2">
                Order #{order.orderNumber || order._id?.slice(-8).toUpperCase()}
              </h1>
              <p className="text-neutralneutral-300">View and manage order details</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate(AppRoutes.adminOrders.path)}
              className="border-neutralneutral-600 text-neutralneutral-300 hover:bg-neutralneutral-800"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Orders
            </Button>
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Items */}
              <Card className="p-6 bg-neutralneutral-900 border-neutralneutral-700">
                <h2 className="text-xl font-heading-header-3-header-3-bold text-white mb-4 flex items-center gap-2">
                  <Package size={20} />
                  Order Items
                </h2>
                {!order.items || order.items.length === 0 ? (
                  <div className="text-center py-8 text-neutralneutral-400">
                    No items found in this order
                  </div>
                ) : (
                  <div className="space-y-4">
                    {order.items.map((item, index) => {
                      // Get product image with multiple fallbacks
                      const productImage = item.product?.images?.[0] || item.productImage || '/images/desktop-1.png';
                      const productName = item.product?.name || item.productName || 'Product';
                      
                      return (
                        <div key={index} className="flex gap-4 p-4 bg-neutralneutral-800 rounded-lg">
                          <img 
                            src={productImage} 
                            alt={productName}
                            className="w-20 h-20 object-cover rounded"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/images/desktop-1.png';
                            }}
                          />
                          <div className="flex-1">
                            <h3 className="text-white font-body-large-large-bold mb-1">
                              {productName}
                            </h3>
                            {item.variant?.name && (
                              <p className="text-neutralneutral-400 text-sm mb-1">
                                Variant: {item.variant.name}
                              </p>
                            )}
                            {item.specs && item.specs.length > 0 && (
                              <div className="text-xs text-neutralneutral-400 mt-1 mb-1">
                                {item.specs.map((spec, idx) => (
                                  <span key={idx}>
                                    {spec.label}: {spec.value}
                                    {idx < item.specs.length - 1 && ', '}
                                  </span>
                                ))}
                              </div>
                            )}
                            <p className="text-neutralneutral-400 text-sm">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-white font-body-large-large-bold">
                              <AmountCurrency 
                                amount={(item.unitPrice || item.price || 0) * (item.quantity || 1)} 
                                fromCurrency={item.currency || order.currency || 'USDT'} 
                              />
                            </p>
                            {item.unitPrice && item.quantity > 1 && (
                            <p className="text-neutralneutral-400 text-sm">
                              <AmountCurrency 
                                amount={item.unitPrice} 
                                fromCurrency={item.currency || order.currency || 'USDT'} 
                              /> each
                            </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Order Summary */}
                <div className="mt-6 pt-6 border-t border-neutralneutral-700 space-y-2">
                  <div className="flex justify-between text-neutralneutral-300">
                    <span>Subtotal:</span>
                    <span><AmountCurrency amount={order.subTotal || 0} fromCurrency={order.currency || 'USDT'} /></span>
                  </div>
                  <div className="flex justify-between text-neutralneutral-300">
                    <span>Delivery Fee:</span>
                    <span><AmountCurrency amount={order.deliveryFee || 0} fromCurrency={order.currency || 'USDT'} /></span>
                  </div>
                  <div className="flex justify-between text-xl font-heading-header-3-header-3-bold text-white pt-2 border-t border-neutralneutral-700">
                    <span>Total:</span>
                    <span><AmountCurrency amount={order.totalAmount || 0} fromCurrency={order.currency || 'USDT'} /></span>
                  </div>
                </div>
              </Card>

              {/* Shipping Address */}
              {order.shippingAddress && (
                <Card className="p-6 bg-neutralneutral-900 border-neutralneutral-700">
                  <h2 className="text-xl font-heading-header-3-header-3-bold text-white mb-4 flex items-center gap-2">
                    <MapPin size={20} />
                    Shipping Address
                  </h2>
                  <div className="text-neutralneutral-300 space-y-1">
                    {order.shippingAddress.fullName && <p className="text-white font-body-large-large-bold">{order.shippingAddress.fullName}</p>}
                    {order.shippingAddress.street && <p>{order.shippingAddress.street}</p>}
                    {order.shippingAddress.city && <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>}
                    {order.shippingAddress.country && <p>{order.shippingAddress.country}</p>}
                    {order.shippingAddress.phone && <p>Phone: {order.shippingAddress.phone}</p>}
                  </div>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Order Status */}
              <Card className="p-6 bg-neutralneutral-900 border-neutralneutral-700">
                <h2 className="text-xl font-heading-header-3-header-3-bold text-white mb-4">
                  Order Status
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-neutralneutral-400 text-sm mb-2">Current Status</label>
                    <span className={`inline-block px-3 py-2 rounded text-sm font-body-small-small-bold uppercase border ${getStatusColor(order.status)}`}>
                      {order.status || 'pending'}
                    </span>
                  </div>
                  <div>
                    <label className="block text-neutralneutral-400 text-sm mb-2">Update Status</label>
                    <Select
                      value={order.status || 'pending'}
                      onValueChange={handleStatusChange}
                      disabled={updating}
                    >
                      <SelectTrigger className="w-full bg-neutralneutral-800 border-neutralneutral-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
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
              </Card>

              {/* Customer Info */}
              <Card className="p-6 bg-neutralneutral-900 border-neutralneutral-700">
                <h2 className="text-xl font-heading-header-3-header-3-bold text-white mb-4 flex items-center gap-2">
                  <User size={20} />
                  Customer
                </h2>
                <div className="space-y-3 text-neutralneutral-300">
                  {order.buyer?.name && (
                    <div className="flex items-center gap-2">
                      <User size={16} />
                      <span>{order.buyer.name}</span>
                    </div>
                  )}
                  {order.buyer?.email && (
                    <div className="flex items-center gap-2">
                      <Mail size={16} />
                      <span className="break-all">{order.buyer.email}</span>
                    </div>
                  )}
                  {order.buyer?.walletAddress && (
                    <div className="flex items-center gap-2">
                      <DollarSign size={16} />
                      <span className="break-all text-xs">{order.buyer.walletAddress}</span>
                    </div>
                  )}
                </div>
              </Card>

              {/* Order Info */}
              <Card className="p-6 bg-neutralneutral-900 border-neutralneutral-700">
                <h2 className="text-xl font-heading-header-3-header-3-bold text-white mb-4">
                  Order Information
                </h2>
                <div className="space-y-3 text-neutralneutral-300 text-sm">
                  <div className="flex justify-between">
                    <span>Order Date:</span>
                    <span className="text-white">
                      {new Date(order.orderDate || order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Order Number:</span>
                    <span className="text-white">{order.orderNumber || 'N/A'}</span>
                  </div>
                  {order.trackingNumber && (
                    <div className="flex justify-between">
                      <span>Tracking:</span>
                      <span className="text-white">{order.trackingNumber}</span>
                    </div>
                  )}
                  {order.deliveryMethod && (
                    <div className="flex items-center gap-2">
                      <Truck size={16} />
                      <span>{order.deliveryMethod.name || 'Standard Delivery'}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Payment Currency:</span>
                    <span className="text-white">{order.currency || 'USDT'}</span>
                  </div>
                  {order.paymentStatus && (
                    <div className="flex justify-between">
                      <span>Payment Status:</span>
                      <span className="text-white capitalize">{order.paymentStatus}</span>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default OrderDetail;
