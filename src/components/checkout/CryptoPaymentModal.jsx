import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import AmountCurrency from '../ui/AmountCurrency';
import orderService from '../../services/orderService';
import useNotificationStore from '../../store/notificationStore';

function CryptoPaymentModal({ 
  orderId, 
  paymentAddress, 
  amount, 
  currency, 
  network,
  qrCode,
  expiry,
  onClose,
  onPaymentConfirmed,
  onCancel
}) {
  const [copied, setCopied] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('waiting');
  const [confirmations, setConfirmations] = useState(0);
  const [requiredConfirmations, setRequiredConfirmations] = useState(3);
  const { addNotification } = useNotificationStore();

  // Poll for payment status
  useEffect(() => {
    if (!orderId) return;

    const interval = setInterval(async () => {
      try {
        const status = await orderService.checkCryptoPaymentStatus(orderId);
        setPaymentStatus(status.status);
        setConfirmations(status.confirmations || 0);
        setRequiredConfirmations(status.requiredConfirmations || 3);

        if (status.status === 'paid') {
          clearInterval(interval);
          addNotification('Payment confirmed!', 'success');
          if (onPaymentConfirmed) {
            onPaymentConfirmed();
          }
        } else if (status.status === 'expired') {
          clearInterval(interval);
          addNotification('Payment expired. Please create a new order.', 'error');
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [orderId, onPaymentConfirmed, addNotification]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(paymentAddress);
    setCopied(true);
    addNotification('Address copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusMessage = () => {
    switch (paymentStatus) {
      case 'paid':
        return 'Payment confirmed!';
      case 'pending_confirmation':
        return `Waiting for confirmations (${confirmations}/${requiredConfirmations})...`;
      case 'expired':
        return 'Payment expired';
      case 'waiting':
      default:
        return 'Waiting for payment...';
    }
  };

  const getStatusColor = () => {
    switch (paymentStatus) {
      case 'paid':
        return 'text-green-400';
      case 'pending_confirmation':
        return 'text-yellow-400';
      case 'expired':
        return 'text-red-400';
      default:
        return 'text-neutral-400';
    }
  };

  const getNetworkDetails = () => {
    const networks = {
      ethereum: {
        name: 'Ethereum',
        symbol: 'ETH',
        explorer: 'https://etherscan.io',
        blockTime: '~12 seconds',
        confirmations: 3
      },
      polygon: {
        name: 'Polygon',
        symbol: 'MATIC',
        explorer: 'https://polygonscan.com',
        blockTime: '~2 seconds',
        confirmations: 3
      },
      bsc: {
        name: 'Binance Smart Chain',
        symbol: 'BNB',
        explorer: 'https://bscscan.com',
        blockTime: '~3 seconds',
        confirmations: 3
      }
    };
    return networks[network] || networks.ethereum;
  };

  const networkDetails = getNetworkDetails();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1F1F21] rounded-lg border border-neutral-700 p-6 shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Pay with Crypto</h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Amount */}
          <div className="text-center">
            <p className="text-neutral-400 text-sm mb-1">Amount to Pay</p>
            <p className="text-2xl font-bold text-white">
              <AmountCurrency amount={amount} fromCurrency={currency} />
            </p>
            <div className="mt-2 p-3 bg-[#2C2C2E] rounded-lg">
              <p className="text-neutral-300 text-sm font-medium">{networkDetails.name} Network</p>
              <p className="text-neutral-400 text-xs mt-1">
                Block time: {networkDetails.blockTime} • Confirmations: {networkDetails.confirmations} blocks
              </p>
              <a 
                href={`${networkDetails.explorer}/address/${paymentAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primaryp-300 hover:text-primaryp-400 text-xs mt-1 inline-block"
              >
                View on {networkDetails.name} Explorer →
              </a>
            </div>
          </div>

          {/* QR Code */}
          {qrCode && (
            <div className="flex justify-center bg-white p-4 rounded-lg">
              <img src={qrCode} alt="Payment QR Code" className="w-48 h-48" />
            </div>
          )}

          {/* Payment Address */}
          <div>
            <p className="text-neutral-400 text-sm mb-2">Send payment to:</p>
            <div className="flex items-center gap-2 bg-[#2C2C2E] rounded-lg p-3">
              <code className="flex-1 text-xs text-white break-all font-mono">
                {paymentAddress}
              </code>
              <button
                onClick={copyToClipboard}
                className="flex-shrink-0 p-2 hover:bg-[#38383a] rounded transition-colors"
                title="Copy address"
              >
                {copied ? (
                  <Check size={16} className="text-green-400" />
                ) : (
                  <Copy size={16} className="text-neutral-400" />
                )}
              </button>
            </div>
          </div>

          {/* Payment Status */}
          <div className="bg-[#2C2C2E] rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              {paymentStatus === 'waiting' || paymentStatus === 'pending_confirmation' ? (
                <Loader2 size={16} className="animate-spin text-yellow-400" />
              ) : null}
              <p className={`text-sm font-medium ${getStatusColor()}`}>
                {getStatusMessage()}
              </p>
            </div>
            {paymentStatus === 'pending_confirmation' && (
              <div className="mt-2">
                <div className="w-full bg-[#38383a] rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all"
                    style={{ width: `${(confirmations / requiredConfirmations) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-neutral-400 mt-1">
                  {confirmations} of {requiredConfirmations} confirmations
                </p>
              </div>
            )}
          </div>

          {/* Expiry */}
          {expiry && (
            <p className="text-xs text-neutral-500 text-center">
              Payment expires: {new Date(expiry).toLocaleString()}
            </p>
          )}

          {/* Instructions */}
          <div className="bg-[#2C2C2E] rounded-lg p-4">
            <p className="text-sm text-neutral-400 mb-2">Instructions:</p>
            <ol className="text-xs text-neutral-500 space-y-1 list-decimal list-inside">
              <li>Send exactly <strong className="text-white"><AmountCurrency amount={amount} fromCurrency={currency} /></strong> to the address above</li>
              <li>Wait for blockchain confirmations (usually 1-3 minutes)</li>
              <li>Your order will be confirmed automatically</li>
            </ol>
          </div>

          {/* Action Buttons - List View */}
          <div className="flex flex-col space-y-3">
            {onCancel && (
              <Button
                onClick={onCancel}
                variant="outline"
                className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-500"
              >
                Cancel Payment
              </Button>
            )}
            <Button
              onClick={onClose}
              className="w-full bg-primaryp-300 hover:bg-primaryp-400 text-white"
            >
              Close (Payment will continue processing)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CryptoPaymentModal;
