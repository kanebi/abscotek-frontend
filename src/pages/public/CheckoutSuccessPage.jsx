import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import orderService from '../../services/orderService';
import useNotificationStore from '../../store/notificationStore';
import { AppRoutes } from '../../config/routes';

/**
 * SeerBit callback: user is redirected here after payment with ?reference=XXX.
 * SeerBit also appends ?code=XX&message=... to the URL.
 * - code "00" (or absent) → verify payment on backend and confirm order.
 * - any other code (e.g. S19 = cancelled, S24 = expired) → payment failed/cancelled;
 *   do NOT attempt verification; show a friendly cancelled message.
 */

// SeerBit codes that mean the user explicitly cancelled or the session expired.
// Any code that is not "00" and not absent is treated as a non-successful payment.
function isSeerbitFailureCode(code) {
  if (!code) return false;
  return code !== '00';
}

function CheckoutSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  // verifying | cancelled | success | error
  const [status, setStatus] = useState('verifying');
  const [errorMsg, setErrorMsg] = useState('');
  const [cancelMsg, setCancelMsg] = useState('');
  const [orderId, setOrderId] = useState(null);
  const addNotification = useNotificationStore((state) => state.addNotification);

  useEffect(() => {
    // SeerBit appends code + message to callbackUrl query string
    const reference = searchParams.get('reference');
    const seerbitCode = searchParams.get('code');
    const seerbitMessage = searchParams.get('message');

    // 1. Detect explicit failure/cancellation codes in the redirect URL
    if (isSeerbitFailureCode(seerbitCode)) {
      const humanMsg = seerbitMessage
        ? decodeURIComponent(seerbitMessage)
        : 'Payment was not completed.';
      setCancelMsg(humanMsg);
      setStatus('cancelled');
      addNotification(humanMsg, 'info');
      return;
    }

    if (!reference) {
      setStatus('error');
      setErrorMsg('Missing payment reference.');
      addNotification('Missing payment reference.', 'error');
      return;
    }

    let aborted = false;
    (async () => {
      try {
        const response = await orderService.verifyPaymentAndCreateOrder({
          paymentMethod: 'seerbit',
          seerbitReference: reference
        });
        if (aborted) return;
        const id = response?.orderId ?? response?._id ?? response?.data?.orderId;
        if (id) {
          setOrderId(id);
          setStatus('success');
          addNotification('Payment confirmed. Thank you!', 'success');
          navigate(AppRoutes.orderSuccess.path.replace(':orderId?', id), { replace: true });
        } else {
          setStatus('error');
          setErrorMsg('Order could not be confirmed. Please check your orders.');
          addNotification('Order could not be confirmed.', 'error');
        }
      } catch (err) {
        if (aborted) return;
        const msg = err.response?.data?.msg || err.message || 'Payment verification failed.';
        setStatus('error');
        setErrorMsg(msg);
        addNotification(msg, 'error');
      }
    })();
    return () => { aborted = true; };
  }, [searchParams, navigate, addNotification]);

  return (
    <Layout>
      <div className="w-[86%] mx-auto py-16 text-center">
        {status === 'verifying' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primaryp-300 mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-white mb-2">Confirming your payment…</h1>
            <p className="text-neutral-400">Please wait — this may take a few seconds.</p>
          </>
        )}
        {status === 'success' && !orderId && (
          <>
            <h1 className="text-xl font-semibold text-white mb-2">Payment confirmed</h1>
            <p className="text-neutral-400">Redirecting to your order…</p>
          </>
        )}
        {status === 'cancelled' && (
          <>
            <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-white mb-2">Payment cancelled</h1>
            <p className="text-neutral-400 mb-6">{cancelMsg}</p>
            <div className="flex gap-4 justify-center">
              <a
                href={AppRoutes.userOrders.path}
                className="px-5 py-2.5 rounded-lg bg-primaryp-300/20 text-primaryp-300 border border-primaryp-300 text-sm font-medium hover:bg-primaryp-300/30 transition-colors"
              >
                View my orders
              </a>
              <a
                href={AppRoutes.home.path}
                className="px-5 py-2.5 rounded-lg border border-neutral-600 text-neutral-300 text-sm font-medium hover:border-neutral-400 hover:text-white transition-colors"
              >
                Back to shop
              </a>
            </div>
          </>
        )}
        {status === 'error' && (
          <>
            <h1 className="text-xl font-semibold text-white mb-2">Payment verification failed</h1>
            <p className="text-neutral-400 mb-2">{errorMsg}</p>
            <p className="text-neutral-500 text-sm mb-6">
              If you were charged, your order may still be processing.
              Please check your orders page or contact support.
            </p>
            <div className="flex gap-4 justify-center">
              <a
                href={AppRoutes.userOrders.path}
                className="px-5 py-2.5 rounded-lg bg-primaryp-300/20 text-primaryp-300 border border-primaryp-300 text-sm font-medium hover:bg-primaryp-300/30 transition-colors"
              >
                View my orders
              </a>
              <button
                onClick={() => window.location.reload()}
                className="px-5 py-2.5 rounded-lg border border-neutral-600 text-neutral-300 text-sm font-medium hover:border-neutral-400 hover:text-white transition-colors"
              >
                Retry
              </button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

export default CheckoutSuccessPage;
