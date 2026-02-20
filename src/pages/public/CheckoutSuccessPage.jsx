import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import orderService from '../../services/orderService';
import useNotificationStore from '../../store/notificationStore';
import { AppRoutes } from '../../config/routes';

/**
 * SeerBit callback: user is redirected here after payment with ?reference=XXX.
 * We verify the payment and create/confirm the order, then redirect to order success.
 */
function CheckoutSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying | success | error
  const [orderId, setOrderId] = useState(null);
  const addNotification = useNotificationStore((state) => state.addNotification);

  useEffect(() => {
    const reference = searchParams.get('reference');
    if (!reference) {
      setStatus('error');
      addNotification('Missing payment reference.', 'error');
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const response = await orderService.verifyPaymentAndCreateOrder({
          paymentMethod: 'seerbit',
          seerbitReference: reference
        });
        if (cancelled) return;
        const id = response?.orderId ?? response?._id ?? response?.data?.orderId;
        if (id) {
          setOrderId(id);
          setStatus('success');
          addNotification('Payment confirmed. Thank you!', 'success');
          navigate(AppRoutes.orderSuccess.path.replace(':orderId?', id), { replace: true });
        } else {
          setStatus('error');
          addNotification('Order could not be confirmed.', 'error');
        }
      } catch (err) {
        if (cancelled) return;
        setStatus('error');
        const msg = err.response?.data?.msg || err.message || 'Payment verification failed.';
        addNotification(msg, 'error');
      }
    })();
    return () => { cancelled = true; };
  }, [searchParams, navigate, addNotification]);

  return (
    <Layout>
      <div className="w-[86%] mx-auto py-16 text-center">
        {status === 'verifying' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primaryp-300 mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-white mb-2">Confirming your payment...</h1>
            <p className="text-neutral-400">Please wait.</p>
          </>
        )}
        {status === 'success' && !orderId && (
          <>
            <h1 className="text-xl font-semibold text-white mb-2">Payment confirmed</h1>
            <p className="text-neutral-400">Redirecting to your order...</p>
          </>
        )}
        {status === 'error' && (
          <>
            <h1 className="text-xl font-semibold text-white mb-2">Something went wrong</h1>
            <p className="text-neutral-400 mb-4">Check your orders or contact support if the amount was charged.</p>
            <a
              href={AppRoutes.userOrders.path}
              className="text-primaryp-300 hover:underline"
            >
              View my orders
            </a>
          </>
        )}
      </div>
    </Layout>
  );
}

export default CheckoutSuccessPage;
