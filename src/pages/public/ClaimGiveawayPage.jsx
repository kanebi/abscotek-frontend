import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePrivy } from '@privy-io/react-auth';
import Layout from '@/components/Layout';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Carousel from '../../components/ui/Carousel';
import giveawayService from '@/services/giveawayService';
import productService from '@/services/productService';
import deliveryMethodService from '@/services/deliveryMethodService';
import deliveryAddressService from '@/services/deliveryAddressService';
import { DeliveryAddressForm, DeliveryAddressList } from '@/components/checkout';
import CurrencySelection from '@/components/checkout/CurrencySelection';
import CryptoPaymentModal from '@/components/checkout/CryptoPaymentModal';
import useStore from '@/store/useStore';
import { resolveOrderImageUrl } from '@/utils/orderProduct';
import { AppRoutes } from '@/config/routes';
import orderService from '@/services/orderService';
import useNotificationStore from '@/store/notificationStore';

function ClaimModal({ open, onClose, onEligible, productName, loading, error, couponCode, setCouponCode, onCheckEligibility, onConnectWallet }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-neutral-800 rounded-2xl border border-pink-500/30 shadow-xl max-w-md w-full p-6 space-y-4">
        <h3 className="text-lg font-semibold text-white">Claim: {productName}</h3>
        <p className="text-neutral-400 text-sm">
          Connect your wallet (if it’s on the allow list) or enter a valid coupon code to claim this item.
        </p>
        <div>
          <label className="block text-sm text-neutral-300 mb-1">Coupon code (optional)</label>
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-neutral-700 border border-neutral-600 text-white placeholder-neutral-500"
            placeholder="Enter coupon code"
          />
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent border-neutral-600 text-neutral-200 hover:bg-neutral-700 hover:text-white">
            Cancel
          </Button>
          <Button type="button" onClick={onConnectWallet} variant="outline" className="flex-1 bg-transparent border-pink-500/50 text-pink-300 hover:bg-pink-500/20">
            Connect wallet
          </Button>
          <Button type="button" onClick={onCheckEligibility} disabled={loading} className="flex-1 bg-primaryp-300 hover:bg-primaryp-400 text-neutral-900 border-0">
            {loading ? 'Checking…' : 'Check & continue'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ClaimGiveawayPage() {
  const { giveawayId, productId } = useParams();
  const navigate = useNavigate();
  const { login } = usePrivy();
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const currentUser = useStore((state) => state.currentUser);
  const walletAddress = useStore((state) => state.walletAddress);

  const [product, setProduct] = useState(null);
  const [checkResult, setCheckResult] = useState(null);
  const [deliveryMethods, setDeliveryMethods] = useState([]);
  const [selectedDeliveryId, setSelectedDeliveryId] = useState('');
  const [userAddresses, setUserAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCoupon, setModalCoupon] = useState('');
  const [modalCheckLoading, setModalCheckLoading] = useState(false);
  const [modalError, setModalError] = useState('');
  const [eligibleCouponCode, setEligibleCouponCode] = useState('');
  const [paidDeliveryByUser, setPaidDeliveryByUser] = useState(true);
  const [lockPaidDelivery, setLockPaidDelivery] = useState(false);
  const [claimType, setClaimType] = useState('immediate');
  const [claimWindowStart, setClaimWindowStart] = useState(null);
  const [claimWindowEnd, setClaimWindowEnd] = useState(null);
  const [countdownTick, setCountdownTick] = useState(0);
  const [paymentOnDelivery, setPaymentOnDelivery] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState('USDC');
  const [cryptoPaymentData, setCryptoPaymentData] = useState(null);

  const { addNotification } = useNotificationStore();

  const checkClaim = useCallback(async (coupon = '') => {
    if (!giveawayId || !productId) return;
    try {
      const res = await giveawayService.checkClaim(giveawayId, productId, coupon);
      setCheckResult(res);
      return res;
    } catch (e) {
      setCheckResult({ canClaim: false, reason: 'Check failed' });
      return null;
    }
  }, [giveawayId, productId]);

  useEffect(() => {
    if (!productId) return;
    let cancelled = false;
    productService.getProduct(productId).then((p) => { if (!cancelled) setProduct(p); }).catch(() => {});
    return () => { cancelled = true; };
  }, [productId]);

  useEffect(() => {
    let cancelled = false;
    deliveryMethodService.getAllDeliveryMethods().then((list) => {
      if (!cancelled && Array.isArray(list)) {
        setDeliveryMethods(list);
        if (list.length && !selectedDeliveryId) setSelectedDeliveryId(list[0]._id);
      }
    }).catch(() => {});
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;
    const loadAddresses = async () => {
      try {
        const list = await deliveryAddressService.getDeliveryAddresses();
        if (!cancelled && Array.isArray(list)) {
          setUserAddresses(list);
          if (!selectedAddressId && list.length) {
            setSelectedAddressId(list[0]._id);
          }
        }
      } catch (e) {
        // ignore
      }
    };
    loadAddresses();
    return () => { cancelled = true; };
  }, [isAuthenticated]);

  useEffect(() => {
    if (!giveawayId || !productId) return;
    let cancelled = false;
    setLoading(true);
    giveawayService.checkClaim(giveawayId, productId).then((res) => {
      if (!cancelled) {
        setCheckResult(res);
        if (typeof res?.paidDeliveryByUser === 'boolean') {
          setPaidDeliveryByUser(res.paidDeliveryByUser);
          // Lock checkbox to config: when true, user must pay; when false, cannot enable
          setLockPaidDelivery(true);
        } else {
          setLockPaidDelivery(false);
        }
        if (res?.claimType) {
          setClaimType(res.claimType);
        }
        if (res?.claimWindowStart) {
          setClaimWindowStart(new Date(res.claimWindowStart));
        }
        if (res?.claimWindowEnd) {
          setClaimWindowEnd(new Date(res.claimWindowEnd));
        }
      }
    }).catch(() => {
      if (!cancelled) setCheckResult({ canClaim: false, reason: 'Check failed' });
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, [giveawayId, productId, isAuthenticated, walletAddress]);

  // Countdown tick for time-window (re-render every second)
  useEffect(() => {
    if (claimType !== 'time_window' || !claimWindowStart || !claimWindowEnd) return;
    const id = setInterval(() => setCountdownTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [claimType, claimWindowStart, claimWindowEnd]);

  const handleOpenModal = async () => {
    // Always re-check using the latest profile/Privy wallet before showing the modal.
    setModalError('');
    setModalCoupon('');
    const res = await checkClaim('');
    // If backend says wallet is eligible, just render the checkout panel (no modal needed)
    if (res && res.canClaim) {
      return;
    }
    // Otherwise let user connect wallet / enter coupon in the modal
    setModalOpen(true);
  };

  const handleModalCheck = async () => {
    setModalCheckLoading(true);
    setModalError('');
    const res = await checkClaim(modalCoupon);
    setModalCheckLoading(false);
    if (res && res.canClaim) {
      setEligibleCouponCode(modalCoupon);
      setModalOpen(false);
    } else {
      setModalError(res?.reason || 'Not eligible. Connect wallet or use a valid coupon.');
    }
  };

  const handleCompleteClaim = async () => {
    if (!selectedDeliveryId || !giveawayId || !productId || !selectedAddressId) return;
    setClaiming(true);
    setModalError('');
    try {
      const payDeliveryNow = paidDeliveryByUser && !paymentOnDelivery;
      if (payDeliveryNow) {
        if (selectedCurrency === 'NGN') {
          const res = await giveawayService.startSeerbitDeliveryPayment({
            giveawayId,
            productId,
            deliveryMethodId: selectedDeliveryId,
            shippingAddressId: selectedAddressId,
          });
          if (res?.redirectLink) {
            window.location.href = res.redirectLink;
            return;
          }
          throw new Error('Could not start NGN payment');
        }
        const paymentPayload = {
          giveawayId,
          productId,
          deliveryMethodId: selectedDeliveryId,
          shippingAddressId: selectedAddressId,
          currency: selectedCurrency,
          network: 'base',
          walletAddress: walletAddress || undefined,
        };
        const res = await giveawayService.startDeliveryPayment(paymentPayload);
        setCryptoPaymentData({
          orderId: res.orderId,
          paymentAddress: res.paymentAddress,
          amount: res.amount,
          currency: res.currency,
          network: res.network,
          qrCode: res.qrCode,
          expiry: res.expiry,
        });
      } else {
        const payload = {
          giveawayId,
          productId,
          deliveryMethodId: selectedDeliveryId,
          shippingAddressId: selectedAddressId,
          paidDeliveryByUser,
          paymentOnDelivery: paidDeliveryByUser ? paymentOnDelivery : undefined,
        };
        if (eligibleCouponCode) payload.couponCode = eligibleCouponCode;
        const res = await giveawayService.claimGiveaway(payload);
        const orderId = res?.order?._id;
        if (orderId) {
          navigate(`/order-success/${orderId}`);
        } else {
          navigate(AppRoutes.userOrders.path, { state: { message: 'Giveaway claimed successfully' } });
        }
      }
    } catch (e) {
      const msg = e?.response?.data?.errors?.[0]?.msg || 'Claim failed';
      setModalError(msg);
      addNotification(msg, 'error');
    } finally {
      setClaiming(false);
    }
  };

  if (!productId || !giveawayId) {
    return (
      <Layout>
        <p className="text-neutral-400 p-8">Invalid claim link.</p>
      </Layout>
    );
  }

  const canClaimDirect = checkResult?.canClaim === true;
  const claimedFromApi = !!checkResult?.claimed;
  const alreadyClaimedByYou =
    typeof checkResult?.reason === 'string' &&
    checkResult.reason.toLowerCase().startsWith('already claimed by you');
  const now = new Date();
  const hasWindow = claimType === 'time_window' && claimWindowStart && claimWindowEnd;
  const beforeWindow = hasWindow && now < claimWindowStart;
  const afterWindow = hasWindow && now > claimWindowEnd;
  const windowActive = hasWindow && !beforeWindow && !afterWindow;
  const showDeliveryAndClaim = canClaimDirect && isAuthenticated && !claimedFromApi;

  // Countdown values for time-window (updates every second via countdownTick)
  const getTimeLeft = (target) => {
    const diff = Math.max(0, target.getTime() - now.getTime());
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    const h = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const m = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
    const s = Math.floor((diff % (60 * 1000)) / 1000);
    return { days, hours: h, minutes: m, seconds: s };
  };
  const countdownTarget = beforeWindow ? claimWindowStart : windowActive ? claimWindowEnd : null;
  const timeLeft = countdownTarget ? getTimeLeft(countdownTarget) : null;

  return (
    <Layout>
      <SEO title="Claim Giveaway - Abscotek" path={`/claim/${giveawayId}/${productId}`} />
      <div className="min-h-screen bg-neutral-900 py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => navigate(AppRoutes.giveaway.path)}
              className="bg-transparent text-neutral-300 hover:bg-neutral-800 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h2 className="text-lg font-semibold text-white">
              Back to giveaways
            </h2>
          </div>
          <style>{`
            @keyframes giveaway-cta-gradient {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            .giveaway-claim-cta {
              background-image: linear-gradient(
                120deg,
                #a855f7,
                #ec4899,
                #f97316,
                #22c55e
              );
              background-size: 220% 220%;
              animation: giveaway-cta-gradient 3s ease-in-out infinite;
              box-shadow: 0 0 18px rgba(236, 72, 153, 0.5);
            }
          `}</style>
          {loading && !product && <p className="text-neutral-400">Loading…</p>}
          {product && (
            <>
              <div className={`flex flex-col md:flex-row gap-8 mb-8 ${claimedFromApi ? 'opacity-50' : ''}`}>
                {/* Left: product imagery (carousel + desktop image) */}
                <div className="md:w-1/2 flex flex-col gap-4">
                  {/* Mobile carousel */}
                  <div className="md:hidden rounded-2xl overflow-hidden border border-neutral-700 bg-neutral-800/50">
                    <Carousel images={product.images} alt={product.name} />
                  </div>
                  {/* Desktop main image + thumbs */}
                  <div className="hidden md:block rounded-2xl border border-neutral-700 bg-neutral-800/50 overflow-hidden">
                    <div className="aspect-[4/3] bg-neutral-800">
                      <img
                        src={resolveOrderImageUrl(product.images?.[0] || '/images/desktop-1.png')}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {Array.isArray(product.images) && product.images.length > 1 && (
                      <div className="flex gap-2 p-3 overflow-x-auto bg-neutral-900/60">
                        {product.images.slice(0, 6).map((img, idx) => (
                          <div key={idx} className="w-16 h-16 rounded-lg overflow-hidden bg-neutral-700 flex-shrink-0">
                            <img
                              src={resolveOrderImageUrl(img)}
                              alt={`${product.name} ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: claim details */}
                <div className="md:w-1/2 flex flex-col gap-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-semibold text-white">
                      {product.name}
                    </h1>
                    {product.description && (
                      <p className="text-neutral-300 mt-3 text-sm md:text-base">
                        {product.description}
                      </p>
                    )}
                    {hasWindow && (
                      <div className="mt-6 p-6 rounded-2xl border border-primaryp-500/40 bg-gradient-to-br from-primaryp-900/30 to-neutral-800/80 text-center">
                        {afterWindow ? (
                          <>
                            <p className="text-xl md:text-2xl font-semibold text-neutral-400">Claim window ended</p>
                            <p className="text-sm text-neutral-500 mt-1">
                              {claimWindowStart?.toLocaleString()} – {claimWindowEnd?.toLocaleString()}
                            </p>
                          </>
                        ) : timeLeft ? (
                          <>
                            <p className="text-sm md:text-base font-medium text-primaryp-200 mb-4">
                              {beforeWindow ? 'Opens in' : 'Closes in'}
                            </p>
                            <div className="flex justify-center gap-3 md:gap-5 flex-wrap">
                              {timeLeft.days > 0 && (
                                <div className="flex flex-col items-center min-w-[4rem] md:min-w-[5rem]">
                                  <span className="text-3xl md:text-5xl font-bold tabular-nums text-white font-mono">
                                    {String(timeLeft.days).padStart(2, '0')}
                                  </span>
                                  <span className="text-xs md:text-sm text-neutral-400 uppercase tracking-wider mt-1">Days</span>
                                </div>
                              )}
                              <div className="flex flex-col items-center min-w-[4rem] md:min-w-[5rem]">
                                <span className="text-3xl md:text-5xl font-bold tabular-nums text-white font-mono">
                                  {String(timeLeft.hours).padStart(2, '0')}
                                </span>
                                <span className="text-xs md:text-sm text-neutral-400 uppercase tracking-wider mt-1">Hours</span>
                              </div>
                              <div className="flex flex-col items-center min-w-[4rem] md:min-w-[5rem]">
                                <span className="text-3xl md:text-5xl font-bold tabular-nums text-white font-mono">
                                  {String(timeLeft.minutes).padStart(2, '0')}
                                </span>
                                <span className="text-xs md:text-sm text-neutral-400 uppercase tracking-wider mt-1">Min</span>
                              </div>
                              <div className="flex flex-col items-center min-w-[4rem] md:min-w-[5rem]">
                                <span className="text-3xl md:text-5xl font-bold tabular-nums text-white font-mono animate-pulse">
                                  {String(timeLeft.seconds).padStart(2, '0')}
                                </span>
                                <span className="text-xs md:text-sm text-neutral-400 uppercase tracking-wider mt-1">Sec</span>
                              </div>
                            </div>
                            <p className="text-xs text-neutral-500 mt-4">
                              {beforeWindow ? 'Window opens' : 'Window closes'}{' '}
                              {beforeWindow
                                ? claimWindowStart?.toLocaleString()
                                : claimWindowEnd?.toLocaleString()}
                            </p>
                          </>
                        ) : null}
                      </div>
                    )}
                  </div>

                  {!isAuthenticated && !beforeWindow && !afterWindow && (
                    <p className="text-amber-400 text-sm">
                      Log in and connect your wallet to claim this giveaway item.
                    </p>
                  )}

                  {showDeliveryAndClaim && (!hasWindow || windowActive) && (
                    <div className="rounded-xl border border-neutral-600 bg-neutral-800/80 p-6 space-y-4">
                      {isAuthenticated && (
                        <div className="space-y-4">
                          {showAddressForm ? (
                        <DeliveryAddressForm
                          onSave={async (data) => {
                            try {
                              let saved;
                              if (editingAddress && editingAddress._id) {
                                saved = await deliveryAddressService.updateDeliveryAddress(editingAddress._id, data);
                              } else {
                                saved = await deliveryAddressService.createDeliveryAddress(data);
                              }
                              const list = await deliveryAddressService.getDeliveryAddresses();
                              setUserAddresses(list);
                              setSelectedAddressId(saved._id);
                              setShowAddressForm(false);
                              setEditingAddress(null);
                            } catch (_) {
                              // ignore
                            }
                          }}
                          onCancel={() => {
                            setShowAddressForm(false);
                            setEditingAddress(null);
                          }}
                          showCancel={true}
                          editingAddress={editingAddress}
                        />
                      ) : (
                        <DeliveryAddressList
                          addresses={userAddresses}
                          selectedAddressId={selectedAddressId}
                          onSelectAddress={setSelectedAddressId}
                          showContinueButton={false}
                          onAddNew={() => {
                            setEditingAddress(null);
                            setShowAddressForm(true);
                          }}
                          onEdit={(addr) => {
                            setEditingAddress(addr);
                            setShowAddressForm(true);
                          }}
                          onDelete={async (addrId) => {
                            try {
                              await deliveryAddressService.deleteDeliveryAddress(addrId);
                              const list = await deliveryAddressService.getDeliveryAddresses();
                              setUserAddresses(list);
                              if (selectedAddressId === addrId) {
                                setSelectedAddressId(list[0]?._id || null);
                              }
                            } catch (_) {
                              // ignore
                            }
                          }}
                        />
                      )}
                        </div>
                      )}
                      <h3 className="text-white font-medium">Select delivery method</h3>
                  <select
                    value={selectedDeliveryId}
                    onChange={(e) => setSelectedDeliveryId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-700 border border-neutral-600 text-white"
                  >
                    {deliveryMethods.map((m) => (
                      <option key={m._id} value={m._id}>
                        {m.name} — {m.currency} {m.price}
                      </option>
                    ))}
                  </select>
                      {typeof paidDeliveryByUser === 'boolean' && (
                        <div className="flex flex-col gap-3 text-sm text-neutral-300">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              className="accent-primaryp-300"
                              checked={paidDeliveryByUser}
                              onChange={(e) => !lockPaidDelivery && setPaidDeliveryByUser(e.target.checked)}
                              disabled={lockPaidDelivery}
                            />
                            <span>
                              Delivery fee is paid by user
                              {lockPaidDelivery && ' (required for this giveaway)'}
                            </span>
                          </label>
                          {paidDeliveryByUser && (
                            <>
                              <label className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  className="accent-primaryp-300"
                                  checked={paymentOnDelivery}
                                  onChange={(e) => setPaymentOnDelivery(e.target.checked)}
                                />
                                <span>Payment on delivery (pay when item is delivered)</span>
                              </label>
                              {!paymentOnDelivery && (
                                <>
                                  <p className="text-xs text-neutral-400">
                                    Pay delivery fee now with your preferred method below.
                                  </p>
                                  <CurrencySelection
                                    selectedCurrency={selectedCurrency}
                                    onCurrencyChange={setSelectedCurrency}
                                  />
                                  {selectedCurrency === 'USDC' && (
                                    <div className="bg-neutral-800 rounded-lg p-4 border border-neutral-600">
                                      <p className="text-white font-medium">Pay with Crypto Wallet</p>
                                      <p className="text-neutral-400 text-sm mt-1">
                                        Pay delivery fee with USDC on Base network.
                                      </p>
                                    </div>
                                  )}
                                  {selectedCurrency === 'NGN' && (
                                    <div className="bg-neutral-800 rounded-lg p-4 border border-neutral-600">
                                      <p className="text-white font-medium">Pay with Card or Bank (Seerbit)</p>
                                      <p className="text-neutral-400 text-sm mt-1">
                                        Pay delivery fee in NGN via card or bank transfer. You will be redirected to Seerbit.
                                      </p>
                                    </div>
                                  )}
                                </>
                              )}
                            </>
                          )}
                        </div>
                      )}
                      <Button
                        onClick={handleCompleteClaim}
                        disabled={
                          claiming ||
                          !selectedDeliveryId ||
                          !selectedAddressId ||
                          (hasWindow && !windowActive)
                        }
                        className="w-full giveaway-claim-cta text-white py-6 rounded-xl border-0"
                      >
                        {beforeWindow
                          ? 'Claim not open yet'
                          : afterWindow
                          ? 'Claim window ended'
                          : (claiming ? 'Claiming…' : 'Claim giveaway')}
                      </Button>
                      {modalError && <p className="text-red-400 text-sm">{modalError}</p>}
                    </div>
                  )}

                  {!showDeliveryAndClaim && !beforeWindow && !afterWindow && isAuthenticated && !claimedFromApi && (
                    <Button
                      onClick={handleOpenModal}
                      className="w-full giveaway-claim-cta text-white py-6 rounded-xl border-0 mt-4"
                    >
                      Claim
                    </Button>
                  )}

                  {!showDeliveryAndClaim && isAuthenticated && claimedFromApi && (
                    <Button
                      disabled
                      className="w-full bg-neutral-700 text-neutral-300 py-6 rounded-xl border border-neutral-600 mt-4 cursor-not-allowed"
                    >
                      Claimed
                    </Button>
                  )}

                  {!showDeliveryAndClaim && !beforeWindow && !afterWindow && !isAuthenticated && !claimedFromApi && (
                    <Button
                      onClick={login}
                      className="w-full giveaway-claim-cta text-white py-6 rounded-xl border-0 mt-4"
                    >
                      Log in to claim
                    </Button>
                  )}
                  {!showDeliveryAndClaim && !isAuthenticated && claimedFromApi && (
                    <Button
                      disabled
                      className="w-full bg-neutral-700 text-neutral-300 py-6 rounded-xl border border-neutral-600 mt-4 cursor-not-allowed"
                    >
                      Claimed
                    </Button>
                  )}

                  {checkResult?.reason && !canClaimDirect && isAuthenticated && !beforeWindow && !afterWindow && (
                    <p className="text-neutral-500 text-sm mt-2">{checkResult.reason}</p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <ClaimModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onEligible={() => setModalOpen(false)}
        productName={product?.name}
        loading={modalCheckLoading}
        error={modalError}
        couponCode={modalCoupon}
        setCouponCode={setModalCoupon}
        onCheckEligibility={handleModalCheck}
        onConnectWallet={() => { login(); setModalError(''); }}
      />

      {cryptoPaymentData && (
        <CryptoPaymentModal
          orderId={cryptoPaymentData.orderId}
          paymentAddress={cryptoPaymentData.paymentAddress}
          amount={cryptoPaymentData.amount}
          currency={cryptoPaymentData.currency}
          network={cryptoPaymentData.network}
          qrCode={cryptoPaymentData.qrCode}
          expiry={cryptoPaymentData.expiry}
          onClose={() => {
            setCryptoPaymentData(null);
            addNotification('You can complete payment later from My Orders.', 'info');
            navigate(AppRoutes.userOrders.path);
          }}
          onPaymentConfirmed={async () => {
            try {
              await orderService.confirmCryptoPayment(cryptoPaymentData.orderId);
              setCryptoPaymentData(null);
              addNotification('Payment confirmed! Your giveaway claim is complete.', 'success');
              navigate(`/order-success/${cryptoPaymentData.orderId}`);
            } catch (e) {
              addNotification(e?.response?.data?.msg || 'Confirmation failed', 'error');
            }
          }}
          onCancel={async () => {
            try {
              if (cryptoPaymentData?.orderId) {
                await orderService.cancelOrder(cryptoPaymentData.orderId);
                addNotification('Payment cancelled. Order has been cancelled.', 'info');
              }
              setCryptoPaymentData(null);
              navigate(AppRoutes.giveaway.path);
            } catch (e) {
              addNotification('Error cancelling order.', 'error');
            }
          }}
        />
      )}
    </Layout>
  );
}
