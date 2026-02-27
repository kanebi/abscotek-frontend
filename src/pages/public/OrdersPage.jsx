import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import AmountCurrency from '../../components/ui/AmountCurrency';
import useStore from '../../store/useStore';
import { AppRoutes } from '../../config/routes';
import orderService from '../../services/orderService';
import SEO from '../../components/SEO';
import { getPageSEO } from '../../config/seo';
import { format } from 'date-fns';

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useStore();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const userOrders = await orderService.getOrders();
        setOrders(userOrders);
        setError(null);
      } catch (err) {
        setError('Failed to fetch orders. Please try again later.');
        // Error
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  const seoData = getPageSEO('orders');

  if (loading) {
    return (
      <Layout>
        <SEO {...seoData} />
        <div className="w-[86%] mx-auto py-8">
          <h1 className="md:text-3xl text-xl font-heading-header-2-header-2-bold text-white mb-8">My Orders</h1>
          <div className="text-center text-white">Loading your orders...</div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <SEO {...seoData} />
        <div className="w-[86%] mx-auto py-8">
          <h1 className="md:text-3xl text-xl font-heading-header-2-header-2-bold text-white mb-8">My Orders</h1>
          <div className="text-center text-red-500">{error}</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO {...seoData} />
      <div className="w-[86%] mx-auto py-8">
        <h1 className="md:text-3xl text-xl font-heading-header-2-header-2-bold text-white mb-8">My Orders</h1>
        
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center md:min-h-[400px] min-h-[500px] text-center">
            <p className="text-neutralneutral-100 font-body-base-base-regular text-lg">
              You haven't placed any orders yet.
            </p>
            <Link to={AppRoutes.home.path}>
              <Button className="mt-4 bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-lg">
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <Card key={order._id} className="bg-[#1F1F21] border-none p-6 rounded-xl">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div className="flex-1 space-y-2">
                    <p className="text-sm text-neutralneutral-400">Order ID: {order._id}</p>
                    <p className="text-white font-semibold">Placed on {format(new Date(order.createdAt), 'MMMM d, yyyy')}</p>
                    <p className={`text-sm font-medium px-2 py-1 rounded-full inline-block capitalize ${order.status === 'delivered' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {order.status}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-white">
                      <AmountCurrency amount={order.totalAmount} fromCurrency={order.currency} />
                    </p>
                    <Link to={AppRoutes.orderDetail.path.replace(':orderId', order._id)}>
                      <Button variant="link" className="text-red-500 hover:text-red-600 p-0 h-auto mt-2">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default OrdersPage;
