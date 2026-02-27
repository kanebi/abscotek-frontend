import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import Layout from '../../components/Layout';
import { AppRoutes } from '../../config/routes';
import orderService from '../../services/orderService';
import useNotificationStore from '../../store/notificationStore';
import AmountCurrency from '../../components/ui/AmountCurrency';

function OrderSuccessPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const addNotification = useNotificationStore((state) => state.addNotification);
  
  // Fetch order details
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }
      try {
        const orderIdStr = (typeof orderId === 'object' ? orderId.toString() : orderId).trim();
        let orderData = null;
        if (orderIdStr && orderIdStr.length > 10) {
          try {
            orderData = await orderService.getOrderByNumber(orderIdStr);
          } catch (numberError) {
            // Try by ID next
          }
        }
        if (!orderData) {
          orderData = await orderService.getOrderById(orderIdStr);
        }
        if (orderData) {
          setOrder(orderData);
        } else {
          addNotification('Order not found', 'error');
        }
      } catch (error) {
        addNotification('Failed to load order details', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, addNotification]);

  const handleCheckOrderDetails = () => {
    navigate(AppRoutes.userOrders.path);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-900 overflow-hidden">
        <Layout>
          <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)] px-4 py-8">
            <div className="text-white text-lg">Loading order details...</div>
          </div>
        </Layout>
      </div>
    );
  }

  // Use actual order number from the order object or fallback to the URL parameter
  const displayOrderNumber = order?.orderNumber || (typeof orderId === 'object' ? orderId.toString() : orderId) || 'Unknown';

  return (
    <div className="min-h-screen bg-neutral-900 overflow-hidden">
      <Layout>
        {/* Main Content */}
        <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)] px-4 py-8">
          <div className="flex flex-col justify-start items-center gap-8 max-w-md md:max-w-lg lg:max-w-xl">
            {/* Success Message */}
            <div className="flex flex-col justify-start items-center gap-8">
              <div className="flex flex-col justify-start items-center gap-3">
                {/* Thank You Title */}
                <div className="text-center">
                  <span className="text-gray-200 text-2xl md:text-3xl font-bold font-['Mona_Sans'] leading-8 md:leading-10">
                    THANK YOU FOR<br/>YOUR ORDER{' '}
                  </span>
                  <br/>
                  <span className="text-fuchsia-700 text-2xl md:text-3xl font-bold font-['Mona_Sans'] leading-8 md:leading-10">
                    #{displayOrderNumber}
                  </span>
                </div>
                
                {/* Order Information */}
                <div className="flex flex-col justify-start items-center gap-1">
                  <div className="text-center text-white text-base font-semibold font-['Mona_Sans'] leading-normal">
                    ORDER STATUS
                  </div>
                  <div className="text-white text-base font-normal font-['Mona_Sans'] leading-normal">
                    {order?.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1).replace('_', ' ') : 'Processing'}
                  </div>
                </div>

                {/* Payment Information */}
                {order?.paymentMethod && (
                  <div className="flex flex-col justify-start items-center gap-1">
                    <div className="text-center text-white text-base font-semibold font-['Mona_Sans'] leading-normal">
                      PAYMENT METHOD
                    </div>
                    <div className="text-white text-base font-normal font-['Mona_Sans'] leading-normal">
                      {order.paymentMethod === 'wallet' ? 'Crypto Wallet' : 'Card/Bank Transfer'}
                    </div>
                  </div>
                )}

                {/* Total Amount */}
                {order?.totalAmount && (
                  <div className="flex flex-col justify-start items-center gap-1">
                    <div className="text-center text-white text-base font-semibold font-['Mona_Sans'] leading-normal">
                      TOTAL AMOUNT
                    </div>
                    <div className="text-white text-base font-normal font-['Mona_Sans'] leading-normal">
                      <AmountCurrency 
                        amount={
                          order.totalAmount || 
                          order.pricing?.total || 
                          ((order.pricing?.subtotal || order.subTotal || 0) + (order.pricing?.delivery || order.deliveryFee || 0))
                        } 
                        fromCurrency={order.currency || 'USDC'} 
                      />
                    </div>
                  </div>
                )}
                
                {/* Confirmation Text */}
                <div className="w-full max-w-96 text-center text-white text-sm font-normal font-['Mona_Sans'] leading-tight px-4">
                  {order?.status === 'pending_payment' 
                    ? 'Your order is being processed. You will receive a confirmation email once payment is verified.'
                    : 'We are getting started on your order right away, and you will receive an order confirmation email shortly to your registered email address.'
                  }
                </div>
              </div>
              
              {/* Action Button */}
              <div className="w-full max-w-96 px-4">
                <Button
                  onClick={handleCheckOrderDetails}
                  className="w-full px-7 py-3 bg-rose-500 hover:bg-rose-600 rounded-xl text-white text-sm font-medium font-['Mona_Sans'] leading-tight"
                >
                  Check Order Details
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
}

export default OrderSuccessPage; 