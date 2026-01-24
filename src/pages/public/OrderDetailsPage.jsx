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
import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import useNotificationStore from '../../store/notificationStore';

function OrderDetailsPage() {
  const { id } = useParams(); // Changed from orderId to id to match route parameter
  const navigate = useNavigate();
  const { addNotification } = useNotificationStore();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    console.log('OrderDetailsPage useEffect triggered, id from params:', id);

    const fetchOrderDetails = async () => {
      if (!id) {
        console.log('No id provided from useParams, setting loading to false');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log('About to call orderService.getOrderById with ID:', id);

        // Check if user is authenticated
        const token = localStorage.getItem('token');
        console.log('Auth token present:', !!token);

        const orderDetails = await orderService.getOrderById(id);
        console.log('Order details received successfully:', orderDetails);
        setOrder(orderDetails);
      } catch (err) {
        console.error('Error in fetchOrderDetails:', err);
        console.error('Error message:', err.message);
        console.error('Error response:', err.response);
        console.error('Error status:', err.response?.status);
        setError('Failed to fetch order details. The order may not exist or you may not have permission to view it.');
      } finally {
        console.log('Setting loading to false');
        setLoading(false);
      }
    };

    console.log('Calling fetchOrderDetails');
    fetchOrderDetails();
  }, [id]);

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

  const { shippingAddress, deliveryMethod, shipping, delivery } = order;

  // Order progress steps based on status
  const getProgressSteps = (status) => {
    const steps = [
      { id: 1, name: "Submit Order", completed: true },
      { id: 2, name: "Waiting for Delivery", completed: false },
      { id: 3, name: "Out for delivery", completed: false },
      { id: 4, name: "Transaction Complete", completed: false },
    ];

    switch (status) {
      case "confirmed":
      case "processing":
        steps[0].completed = true;
        steps[1].completed = true;
        break;
      case "shipped":
        steps[0].completed = true;
        steps[1].completed = true;
        steps[2].completed = true;
        break;
      case "delivered":
        steps.forEach(step => step.completed = true);
        break;
      default:
        break;
    }

    return steps;
  };

  const progressSteps = getProgressSteps(order.status);

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
      console.error('Error cancelling order:', err);
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

        {/* Order Status Card - Mobile */}
        <Card className="flex md:hidden w-full border-none flex-col items-start gap-2.5 px-4 py-4 relative bg-[#1F1F21] rounded-xl overflow-hidden mb-6">
          <CardContent className="flex flex-col items-center gap-8 relative self-stretch w-full flex-[0_0_auto] p-0">
            <div className="flex flex-col items-end gap-8 relative self-stretch w-full flex-[0_0_auto]">
              <div className="flex flex-col items-start gap-[13px] relative self-stretch w-full flex-[0_0_auto]">
                <div className="inline-flex flex-col items-start justify-center gap-1 relative flex-[0_0_auto]">
                  <div className="inline-flex items-center gap-0.5 relative flex-[0_0_auto]">
                    <span className="relative w-fit mt-[-1.00px] font-body-base-base-medium text-neutral-300">
                      Order date:
                    </span>
                    <span className="relative w-fit mt-[-1.00px] font-body-base-base-medium text-neutral-300">
                      {format(new Date(order.orderDate || order.createdAt), 'MMMM d, yyyy')}
                    </span>
                  </div>

                  <div className="inline-flex items-center gap-0.5 relative flex-[0_0_auto]">
                    <span className="relative w-fit mt-[-1.00px] font-body-base-base-medium text-neutral-300">
                      Order NO:
                    </span>
                    <span className="relative w-fit mt-[-1.00px] font-body-base-base-medium text-neutral-300">
                      {order.orderNumber || order._id.slice(-8).toUpperCase()}
                    </span>
                  </div>
                </div>

                <h2 className="relative w-fit font-heading-header-6-header-6-semibold text-white">
                  {order.status}
                </h2>
              </div>

              <Separator className="relative self-stretch w-full h-px bg-[#3f3f3f]" />
            </div>

            <div className="inline-flex items-start gap-[35.72px] relative flex-[0_0_auto]">
              <div className="absolute w-[280px] h-px top-1.5 left-5 bg-[#3f3f3f]" />

              {progressSteps.map((step, index) => (
                <div
                  key={index}
                  className="inline-flex flex-col items-center gap-[5.36px] relative flex-[0_0_auto]"
                >
                  <div
                    className={`relative w-[12.5px] h-[12.5px] ${step.completed ? "bg-primary-500" : "bg-neutral-600"} rounded-[4465.08px] overflow-hidden flex items-center justify-center`}
                  >
                    {step.completed && (
                      <svg
                        className="w-[9px] h-[9px] text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M16.6663 5L7.49967 14.1667L3.33301 10"
                          stroke="none"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  <div
                    className={`relative w-fit ${step.completed ? "text-white" : "text-neutral-600"} text-[7.1px] tracking-[0] leading-[10.7px] whitespace-nowrap`}
                  >
                    {step.name}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Order Status Card - Desktop */}
        <Card className="hidden md:flex border-none w-full bg-[#1F1F21] rounded-xl overflow-hidden mb-8">
          <CardContent className="p-6 w-full">
            <div className="flex flex-col items-center gap-8 w-full">
              {/* Order Header */}
              <div className="flex flex-col items-end gap-8 w-full">
                <div className="flex items-center justify-between w-full">
                  <div className="inline-flex flex-col items-start justify-center gap-1">
                    <div className="inline-flex items-center gap-0.5">
                      <span className="font-body-large-large-regular text-neutral-300">
                        Order date:
                      </span>
                      <span className="font-body-large-large-medium text-neutral-300">
                        {format(new Date(order.orderDate || order.createdAt), 'MMMM d, yyyy')}
                      </span>
                    </div>
                    <div className="inline-flex items-center gap-0.5">
                      <span className="font-body-large-large-regular text-neutral-300">
                        Order NO:
                      </span>
                      <span className="font-body-large-large-medium text-neutral-300">
                        {order.orderNumber || order._id.slice(-8).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="font-heading-header-5-header-5-semibold text-white">
                    {order.status}
                  </div>
                </div>
                <Separator className="w-full bg-[#3f3f3f]" />
              </div>

              {/* Order Progress Tracker */}
              <div className="inline-flex items-start gap-8 md:gap-20 relative overflow-x-auto w-full">
                <div className="absolute w-full md:w-[628px] top-[13px] left-4 md:left-11 h-px bg-[#3f3f3f]" />

                {progressSteps.map((step, index) => (
                  <div
                    key={step.id}
                    className="inline-flex flex-col items-center gap-3 min-w-[100px]"
                  >
                    <div
                      className={`relative w-7 h-7 ${step.completed ? "bg-primary-500" : "bg-neutral-600"} rounded-full overflow-hidden flex items-center justify-center`}
                    >
                      {step.completed && (
                        <svg
                          className="w-5 h-5 text-white"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M16.6663 5L7.49967 14.1667L3.33301 10"
                            stroke="none"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                    <div
                      className={`font-body-large-large-${step.completed ? "medium text-white" : "regular text-neutral-600"} text-center text-xs md:text-sm`}
                    >
                      {step.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-[#1F1F21] border-none p-6 rounded-xl">
              <h2 className="text-xl font-semibold text-white mb-4">Order Summary</h2>
              <div className="space-y-4">
                {order.items?.map(item => (
                  <div key={item.product?._id || item._id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      {item.product?.images && item.product.images.length > 0 ? (
                        <img src={item.product.images[0]} alt={item.product.name || item.productName} className="w-16 h-16 object-cover rounded-lg mr-4" />
                      ) : (
                        <div className="w-16 h-16 bg-neutral-800 rounded-lg mr-4 flex items-center justify-center">
                          <span className="text-neutral-400 text-xs">No Image</span>
                        </div>
                      )}
                      <div>
                        <p className="text-white font-medium">{item.product?.name || item.productName || 'Product'}</p>
                        {item.variant?.name && (
                          <p className="text-sm text-neutral-300">Variant: {item.variant.name}</p>
                        )}
                        {item.specs && item.specs.length > 0 && (
                          <div className="text-xs text-neutral-400 mt-1">
                            {item.specs.map((spec, idx) => (
                              <span key={idx}>
                                {spec.label}: {spec.value}
                                {idx < item.specs.length - 1 && ', '}
                              </span>
                            ))}
                          </div>
                        )}
                        <p className="text-sm text-neutral-400">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="text-white font-medium">
                      <AmountCurrency amount={item.totalPrice || (item.unitPrice * item.quantity)} fromCurrency={item.currency || order.currency} />
                    </p>
                  </div>
                )) || []}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-[#1F1F21] border-none p-6 rounded-xl">
              <h2 className="text-xl font-semibold text-white mb-4">Shipping Address</h2>
              {(shipping || shippingAddress) ? (
                <div className="text-neutral-300 space-y-1">
                  <p><strong>Name:</strong> {shipping?.name || `${shippingAddress?.firstName} ${shippingAddress?.lastName}`}</p>
                  <p><strong>Email:</strong> {shipping?.email || shippingAddress?.email}</p>
                  <p><strong>Phone:</strong> {shipping?.phone || shippingAddress?.phoneNumber}</p>
                  <p><strong>Address:</strong> {shipping?.address || shippingAddress?.streetAddress}</p>
                  {shippingAddress && !shipping && (
                    <>
                      <p><strong>City:</strong> {shippingAddress.city}, {shippingAddress.state}</p>
                      <p><strong>Country:</strong> {shippingAddress.country}</p>
                    </>
                  )}
                </div>
              ) : (
                <p className="text-neutral-400">No address provided.</p>
              )}
            </Card>

            <Card className="bg-[#1F1F21] border-none p-6 rounded-xl">
              <h2 className="text-xl font-semibold text-white mb-4">Payment Summary</h2>
              <div className="space-y-2 text-neutral-300">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span><AmountCurrency amount={order.pricing?.subtotal || order.subTotal || 0} fromCurrency={order.currency} /></span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span><AmountCurrency amount={order.pricing?.delivery || order.deliveryFee || deliveryMethod?.price || 0} fromCurrency={order.currency} /></span>
                </div>
                <div className="border-t border-neutral-700 my-2"></div>
                <div className="flex justify-between text-white font-semibold text-lg">
                  <span>Total</span>
                  <span><AmountCurrency amount={(order.pricing?.subtotal || order.subTotal || 0) + (order.pricing?.delivery || order.deliveryFee || deliveryMethod?.price || 0)} fromCurrency={order.currency} /></span>
                </div>
              </div>
            </Card>

            <Card className="bg-[#1F1F21] border-none p-6 rounded-xl">
              <h2 className="text-xl font-semibold text-white mb-4">Delivery Method</h2>
              {(delivery || deliveryMethod) ? (
                <div className="text-neutral-300 space-y-1">
                  <p><strong>Method:</strong> {delivery?.method || deliveryMethod?.name}</p>
                  <p><strong>Timeframe:</strong> {delivery?.timeframe || deliveryMethod?.estimatedDeliveryTime || 'N/A'}</p>
                  {deliveryMethod && !delivery && deliveryMethod.description && (
                    <p><strong>Description:</strong> {deliveryMethod.description}</p>
                  )}
                </div>
              ) : (
                <p className="text-neutral-400">No delivery method selected.</p>
              )}
            </Card>

            {/* Cancel Order Section - Only show for cancellable orders */}
            {['pending', 'confirmed', 'processing'].includes(order.status?.toLowerCase()) && (
              <Card className="bg-[#1F1F21] border-none p-6 rounded-xl">
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
              </Card>
            )}
          </div>
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
                        <AmountCurrency amount={order.pricing?.subtotal || order.subTotal || 0} fromCurrency={order.currency} />
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-300">Shipping:</span>
                      <span className="text-neutral-300">
                        <AmountCurrency amount={order.pricing?.delivery || order.deliveryFee || deliveryMethod?.price || 0} fromCurrency={order.currency} />
                      </span>
                    </div>
                    <div className="border-t border-neutral-600 my-2"></div>
                    <div className="flex justify-between items-center">
                      <span className="text-white font-semibold">Total Amount:</span>
                      <span className="text-white font-semibold">
                        <AmountCurrency amount={(order.pricing?.subtotal || order.subTotal || 0) + (order.pricing?.delivery || order.deliveryFee || deliveryMethod?.price || 0)} fromCurrency={order.currency} />
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