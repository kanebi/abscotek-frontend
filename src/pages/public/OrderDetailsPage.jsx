import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import AmountCurrency from '../../components/ui/AmountCurrency';
import { AppRoutes } from '../../config/routes';
import orderService from '../../services/orderService';
import SEO from '../../components/SEO';
import { getPageSEO } from '../../config/seo';
import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react';

function OrderDetailsPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const orderDetails = await orderService.getOrderById(orderId);
        setOrder(orderDetails);
        setError(null);
      } catch (err) {
        setError('Failed to fetch order details. The order may not exist or you may not have permission to view it.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const seoData = getPageSEO('orderDetail', { orderId });

  if (loading) {
    return (
      <Layout>
        <SEO {...seoData} />
        <div className="w-[86%] mx-auto py-8 text-center text-white">Loading order details...</div>
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

  if (!order) {
    return (
      <Layout>
        <SEO {...seoData} />
        <div className="w-[86%] mx-auto py-8 text-center text-white">Order not found.</div>
      </Layout>
    );
  }

  const { shippingAddress, deliveryMethod } = order;

  return (
    <Layout>
      <SEO {...seoData} />
      <div className="w-[86%] mx-auto py-8">
        <Link to={AppRoutes.userOrders.path} className="flex items-center text-white hover:text-red-500 mb-6">
          <ArrowLeft size={18} className="mr-2" />
          Back to My Orders
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="md:text-3xl text-xl font-heading-header-2-header-2-bold text-white">Order Details</h1>
            <p className="text-sm text-neutralneutral-400">Order ID: {order._id}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-neutralneutral-400">
              Placed on {format(new Date(order.createdAt), 'MMMM d, yyyy')}
            </p>
            <p className={`text-sm font-medium px-2 py-1 rounded-full inline-block capitalize mt-1 ${order.status === 'delivered' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
              {order.status}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-[#1F1F21] border-none p-6 rounded-xl">
              <h2 className="text-xl font-semibold text-white mb-4">Order Summary</h2>
              <div className="space-y-4">
                {order.items?.map(item => (
                  <div key={item.product._id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      {item.product.images && item.product.images.length > 0 ? (
                        <img src={item.product.images[0]} alt={item.product.name} className="w-16 h-16 object-cover rounded-lg mr-4" />
                      ) : (
                        <div className="w-16 h-16 bg-neutralneutral-800 rounded-lg mr-4 flex items-center justify-center">
                          <span className="text-neutralneutral-400 text-xs">No Image</span>
                        </div>
                      )}
                      <div>
                        <p className="text-white font-medium">{item.product.name}</p>
                        <p className="text-sm text-neutralneutral-400">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="text-white font-medium">
                      <AmountCurrency amount={item.unitPrice} fromCurrency={item.product.currency || order.currency} />
                    </p>
                  </div>
                )) || []}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-[#1F1F21] border-none p-6 rounded-xl">
              <h2 className="text-xl font-semibold text-white mb-4">Shipping Address</h2>
              {shippingAddress ? (
                <div className="text-neutralneutral-300 space-y-1">
                  <p>{shippingAddress.firstName} {shippingAddress.lastName}</p>
                  <p>{shippingAddress.streetAddress}</p>
                  <p>{shippingAddress.city}, {shippingAddress.state}</p>
                  <p>{shippingAddress.country}</p>
                  <p>Phone: {shippingAddress.phoneNumber}</p>
                </div>
              ) : (
                <p className="text-neutralneutral-400">No address provided.</p>
              )}
            </Card>

            <Card className="bg-[#1F1F21] border-none p-6 rounded-xl">
              <h2 className="text-xl font-semibold text-white mb-4">Payment Summary</h2>
              <div className="space-y-2 text-neutralneutral-300">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span><AmountCurrency amount={order.subTotal} fromCurrency={order.currency} /></span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{deliveryMethod ? <AmountCurrency amount={deliveryMethod.price} fromCurrency={deliveryMethod.currency} /> : 'N/A'}</span>
                </div>
                <div className="border-t border-neutralneutral-700 my-2"></div>
                <div className="flex justify-between text-white font-semibold text-lg">
                  <span>Total</span>
                  <span><AmountCurrency amount={order.totalAmount} fromCurrency={order.currency} /></span>
                </div>
              </div>
            </Card>

            <Card className="bg-[#1F1F21] border-none p-6 rounded-xl">
              <h2 className="text-xl font-semibold text-white mb-4">Delivery Method</h2>
              {deliveryMethod ? (
                <div className="text-neutralneutral-300 space-y-1">
                  <p><strong>Method:</strong> {deliveryMethod.name}</p>
                  <p><strong>Description:</strong> {deliveryMethod.description || 'N/A'}</p>
                  <p><strong>Estimated Time:</strong> {deliveryMethod.estimatedDeliveryTime || 'N/A'}</p>
                </div>
              ) : (
                <p className="text-neutralneutral-400">No delivery method selected.</p>
              )}
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default OrderDetailsPage; 