import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Separator } from '../../components/ui/separator';
import AmountCurrency from '../../components/ui/AmountCurrency';
import { AppRoutes } from '../../config/routes';
import orderService from '../../services/orderService';
import SEO from '../../components/SEO';
import { getPageSEO } from '../../config/seo';
import { ArrowLeft } from 'lucide-react';
import useNotificationStore from '../../store/notificationStore';
import { normalizeOrderForDetail } from '../../utils/orderProduct';
import { OrderDetailsSection } from '../../components/sections/OrderDetail';

function OrderDetailsPage() {
  const { id } = useParams(); // Changed from orderId to id to match route parameter
  const navigate = useNavigate();
  const { addNotification } = useNotificationStore();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [completingPayment, setCompletingPayment] = useState(false);
  const [pollingPayment, setPollingPayment] = useState(false);
  const [retryingSeerbit, setRetryingSeerbit] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const orderDetails = await orderService.getOrderById(id);
        setOrder(orderDetails);
      } catch (err) {
        setError('Failed to fetch order details. The order may not exist or you may not have permission to view it.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [id]);

  // Polling for payment confirmation - must be called unconditionally (Rules of Hooks)
  useEffect(() => {
    if (!pollingPayment || !order?._id || order.paymentStatus === 'paid') return;
    const interval = setInterval(async () => {
      try {
        const result = await orderService.confirmCryptoPayment(order._id);
        if (result.success) {
          setPollingPayment(false);
          addNotification('Payment confirmed!', 'success');
          const updatedOrder = await orderService.getOrderById(id);
          setOrder(updatedOrder);
        }
      } catch {
        // Ignore, keep polling
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [pollingPayment, order?._id, id, addNotification]);

  const seoData = getPageSEO('orderDetail', { orderId: id });

  if (loading) {
    return (
      <Layout>
        <SEO {...seoData} />
        <div className="w-[86%] mx-auto py-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-white">Loading order details...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <SEO {...seoData} />
        <div className="w-[86%] mx-auto py-8 text-center text-red-500">{error}</div>
      </Layout>
    );
  }

  // if (!order) {
  //   console.log('Order is null/undefined, showing not found message');
  //   return (
  //     <Layout>
  //       <SEO {...seoData} />
  //       <div className="w-[86%] mx-auto py-8 text-center text-white">Order not found.</div>
  //     </Layout>
  //   );
  // }

  const normalizedOrder = normalizeOrderForDetail(order);

  const handleRefetchOrder = async () => {
    if (!id) return;
    try {
      const updatedOrder = await orderService.getOrderById(id);
      setOrder(updatedOrder);
    } catch (_) {}
  };

  const handleSeerbitRetry = async () => {
    if (!order?._id) return;
    setRetryingSeerbit(true);
    try {
      const result = await orderService.reinitializeSeerbitPayment(order._id);
      if (result?.redirectLink) {
        window.location.href = result.redirectLink;
      } else {
        addNotification('Could not get payment link. Please try again.', 'error');
      }
    } catch (err) {
      addNotification(err.response?.data?.msg || 'Failed to start payment. Please try again.', 'error');
    } finally {
      setRetryingSeerbit(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!order) return;

    try {
      setCancelling(true);
      await orderService.cancelOrder(order._id);
      addNotification('Order cancelled successfully. Refund will be processed within 3-5 business days.', 'success');

      // Refresh order details
      const updatedOrder = await orderService.getOrderById(id);
      setOrder(updatedOrder);

      // Close modal and navigate back to orders list after a short delay
      setShowCancelModal(false);
      setTimeout(() => {
        navigate(AppRoutes.userOrders.path);
      }, 2000);
    } catch (err) {
      // Cancel failed
      addNotification('Failed to cancel order. Please try again.', 'error');
    } finally {
      setCancelling(false);
    }
  };

  return (
    <Layout>
      <SEO {...seoData} />
      <div className="w-[86%] mx-auto py-8">
        <Link to={AppRoutes.userOrders.path} className="flex items-center text-white hover:text-red-500 mb-6">
          <ArrowLeft size={18} className="mr-2" />
          Back to My Orders
        </Link>

        {/* Same order detail as profile ?orderId= — correct product/price/currency */}
        {normalizedOrder && (
          <OrderDetailsSection
            order={normalizedOrder}
            onBackToList={() => navigate(AppRoutes.userOrders.path)}
            onOrderUpdated={handleRefetchOrder}
          />
        )}

        <div className="mt-8 space-y-6">
            {/* Pay Now / Pay again - For pending or failed/cancelled SeerBit orders (retry without new order) */}
            {order.paymentMethod === 'seerbit' &&
              order.paymentStatus !== 'paid' &&
              ['pending', 'failed', 'cancelled', 'refunded'].includes(order.status?.toLowerCase()) && (
              <Card className="bg-[#1F1F21] border-none p-6 rounded-xl">
                <CardContent className="p-0 pt-0">
                  <h2 className="text-xl font-semibold text-white mb-2">
                    {order.status?.toLowerCase() === 'pending' ? 'Complete Payment' : 'Pay Again'}
                  </h2>
                  <p className="text-neutral-300 text-sm mb-4">
                    {order.status?.toLowerCase() === 'pending'
                      ? 'This order is awaiting payment. Click below to complete your payment via bank transfer or card.'
                      : 'Previous payment did not complete. You can pay for this order again without creating a new one.'}
                  </p>
                  <Button
                    onClick={handleSeerbitRetry}
                    disabled={retryingSeerbit}
                    className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold"
                  >
                    {retryingSeerbit ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                        Redirecting to payment…
                      </span>
                    ) : (
                      'Pay Now'
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Cancel Order Section - Only show for cancellable orders */}
            {['pending', 'confirmed', 'processing'].includes(order.status?.toLowerCase()) && (
              <Card className="bg-[#1F1F21] border-none p-6 rounded-xl">
                <CardContent className="p-0 pt-0">
                  <h2 className="text-xl font-semibold text-white mb-4">Order Actions</h2>
                  <div className="space-y-4">
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                      <h3 className="text-red-400 font-medium mb-2">Cancel Order</h3>
                      <p className="text-neutral-300 text-sm mb-4">
                        You can cancel this order before it ships. Refund will be processed within 3-5 business days.
                      </p>
                      <Button
                        onClick={() => setShowCancelModal(true)}
                        className="w-full bg-red-500 hover:bg-red-600 text-white"
                      >
                        Cancel Order & Request Refund
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
        </div>
      </div>

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-[500px] p-8 bg-neutral-900 rounded-2xl shadow-[0px_16px_32px_0px_rgba(0,0,0,0.20)] inline-flex flex-col justify-start items-start gap-6 overflow-hidden relative">
            <button
              onClick={() => setShowCancelModal(false)}
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
                  <div className="text-neutral-400 text-sm font-medium font-['Mona_Sans']">Order #{order.orderNumber || order._id.slice(-8).toUpperCase()}</div>
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
                        <AmountCurrency amount={order.pricing?.subtotal || order.subTotal || 0} fromCurrency={order.currency || 'USDC'} />
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-300">Shipping:</span>
                      <span className="text-neutral-300">
                        <AmountCurrency amount={order.pricing?.delivery || order.deliveryFee || order.deliveryMethod?.price || 0} fromCurrency={order.pricing?.deliveryCurrency || order.deliveryMethod?.currency || order.currency || 'USDC'} />
                      </span>
                    </div>
                    <div className="border-t border-neutral-600 my-2"></div>
                    <div className="flex justify-between items-center">
                      <span className="text-white font-semibold">Total Amount:</span>
                      <span className="text-white font-semibold">
                        <AmountCurrency 
                          amount={
                            (order.pricing?.subtotal || order.subTotal || 0) + 
                            (order.pricing?.delivery || order.deliveryFee || order.deliveryMethod?.price || 0)
                          } 
                          fromCurrency={order.currency || 'USDC'} 
                        />
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="self-stretch flex justify-end items-center gap-3">
                <Button
                  onClick={() => setShowCancelModal(false)}
                  className="px-6 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg"
                  disabled={cancelling}
                >
                  Keep Order
                </Button>
                <Button
                  onClick={handleCancelOrder}
                  disabled={cancelling}
                  className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg disabled:opacity-50"
                >
                  {cancelling ? (
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
    </Layout>
  );
}

export default OrderDetailsPage;