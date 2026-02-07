import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { 
  DeliveryAddressForm, 
  DeliveryAddressList, 
  DeliveryAddressDisplay,
  DeliveryMethodSelection,
  OrderSummary 
} from '../../components/checkout';
import useStore from '../../store/useStore';
import { AppRoutes } from '../../config/routes';
import deliveryMethodService from '../../services/deliveryMethodService';
import deliveryAddressService from '../../services/deliveryAddressService';
import userService from '../../services/userService';
import orderService from '../../services/orderService';
import { useWeb3Auth } from '../../hooks/useWeb3Auth';
import { Button } from '@/components/ui/button';
import { usePrivy } from '@privy-io/react-auth';
import { PaystackButton } from 'react-paystack';
import { Loader2 } from 'lucide-react';
import CurrencySelection from '../../components/checkout/CurrencySelection';
import currencyConversionService from '../../services/currencyConversionService';
import WalletConnectButton from '../../components/widgets/WalletConnectButton';
import useNotificationStore from '../../store/notificationStore';
import CryptoPaymentModal from '../../components/checkout/CryptoPaymentModal';

// Import Web3Modal for alternative wallet connection (fallback if not available)
// let web3ModalHook = null;
// try {
//   web3ModalHook = require('@web3modal/ethers5/react').useWeb3Modal;
// } catch (error) {
//   console.warn('Web3Modal not available, using Privy only for wallet connection');
// }

// Web3Modal configuration (only if available)
// let web3Modal = null;
// try {
//   const { createWeb3Modal, defaultConfig } = require('@web3modal/ethers5/react');
//
//   const projectId = process.env.REACT_APP_WALLETCONNECT_PROJECT_ID || 'your-project-id';
//   const metadata = {
//     name: 'AbscoTek',
//     description: 'Crypto payment platform',
//     url: window.location.origin,
//     icons: ['https://walletconnect.com/walletconnect-logo.png']
//   };
//
//   const ethersConfig = defaultConfig({
//     metadata,
//     defaultChainId: 1, // Ethereum mainnet
//     enableEIP6963: true,
//     enableInjected: true,
//     enableCoinbase: true,
//     rpcUrl: 'https://cloudflare-eth.com'
//   });
//
//   web3Modal = createWeb3Modal({
//     ethersConfig,
//     chains: [1, 56, 137], // Ethereum, BSC, Polygon
//     projectId,
//     enableAnalytics: true
//   });
// } catch (error) {
//   console.warn('Web3Modal not available, using Privy only for wallet connection');
// }

function CheckoutPage() {
  const navigate = useNavigate();
  const { isAuthenticated, authenticateAndLogin, balance } = useWeb3Auth();
  const { authenticated, user: privyUser, login } = usePrivy();

  // Web3Modal hook (only if available)
  // const { open } = web3ModalHook ? web3ModalHook() : { open: () => {} };
  const openWeb3Modal = () => {
    // Fallback implementation if Web3Modal is not available
    addNotification("Alternative wallet connection not available. Please use Privy wallet.", "info");
  };
  
  const [userAddresses, setUserAddresses] = useState([]);
  const [deliveryMethods, setDeliveryMethods] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [orderedSuccess, setOrderedSuccess] = useState(false);
  const [pendingOrderId, setPendingOrderId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('crypto'); // 'crypto' - Direct blockchain payment
  const [cryptoPaymentData, setCryptoPaymentData] = useState(null); // { orderId, paymentAddress, amount, currency, network, qrCode, expiry }
  // Initialize with default currency, will be synced with cart.currency when cart loads
  const [selectedCurrency, setSelectedCurrency] = useState('USDC');
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [paymentAmount, setPaymentAmount] = useState(0); // Separate state for payment button amount
  const [isLoading, setIsLoading] = useState(true); // Single loading state
  const [subtotalInUSD, setSubtotalInUSD] = useState(0);
  const [deliveryCostInUSD, setDeliveryCostInUSD] = useState(0);
  const [subtotalDisplay, setSubtotalDisplay] = useState(0); // In display currency (USD or NGN)
  const [deliveryDisplay, setDeliveryDisplay] = useState(0);
  const { cart, clearCart, userCurrency, setIsAuthenticated, setWalletAddress, currentUser, walletAddress, cartLoading, fetchCart, isAuthenticated: storeAuthenticated } = useStore();
  const { addNotification } = useNotificationStore();

  // Get wallet address from Privy or store
  const userWalletAddress = walletAddress || privyUser?.wallet?.address;

  // Use store's isAuthenticated as source of truth
  const isUserAuthenticated = storeAuthenticated && currentUser;

  // Prevent redirects if user is authenticated
  const shouldRedirect = !isUserAuthenticated && !cartLoading;

  // Debug authentication state
  console.log('CheckoutPage - Auth state:', {
    privyAuthenticated: authenticated,
    storeAuthenticated,
    isUserAuthenticated,
    privyUser: !!privyUser,
    currentUser: !!currentUser,
    token: !!localStorage.getItem('token'),
    tokenValue: localStorage.getItem('token')?.substring(0, 20) + '...',
    userWalletAddress
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Sync frontend delivery methods with backend to get proper IDs
        const frontendMethods = [
          {
            id: 'lagos',
            name: 'Lagos: 1-2 days',
            price: 5000,
            currency: 'NGN'
          },
          {
            id: 'other-state',
            name: 'Other State: 3-5 days',
            price: 10000,
            currency: 'NGN'
          }
        ];
        
        const syncedMethods = await deliveryMethodService.syncDeliveryMethods(frontendMethods);
        setDeliveryMethods(syncedMethods);
        console.log('Synced delivery methods:', syncedMethods);
        
        // Restore selected delivery method from localStorage
        const savedDeliveryMethod = localStorage.getItem('selectedDeliveryMethod');
        if (savedDeliveryMethod) {
          try {
            const parsedMethod = JSON.parse(savedDeliveryMethod);
            // Verify the method still exists in the synced methods (check by both _id and id)
            const methodExists = syncedMethods.find(m => 
              m._id === parsedMethod._id || m.id === parsedMethod.id
            );
            if (methodExists) {
              setSelectedDeliveryMethod(methodExists); // Use the synced method
              console.log('Restored delivery method from localStorage:', methodExists);
            } else {
              console.log('Saved delivery method no longer exists, clearing localStorage');
              localStorage.removeItem('selectedDeliveryMethod');
            }
          } catch (error) {
            console.error('Error parsing saved delivery method:', error);
            localStorage.removeItem('selectedDeliveryMethod');
          }
        }
          
         if (isUserAuthenticated) {
           // Load cart and user data for authenticated users
           await fetchCart();

           // Fetch user addresses
           await refetchAddresses();
          }
        } catch (error) {
          console.error("Failed to fetch checkout data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [authenticated, fetchCart]);

  // Fetch addresses when authentication state changes
  useEffect(() => {
    console.log("Auth state changed:", { isUserAuthenticated, storeAuthenticated });
    if (isUserAuthenticated) {
      console.log("User authenticated, fetching addresses...");
      refetchAddresses();
    } else {
      console.log("Not authenticated, skipping address fetch");
    }
  }, [isUserAuthenticated]);

  // Removed redirect logic to prevent blank screen
  // The page will show appropriate content based on cart and auth state

  // Sync selectedCurrency with cart's base currency when cart loads
  useEffect(() => {
    if (cart?.currency) {
      // Use cart's base currency (not converted currency)
      // This ensures we start with the original currency
      setSelectedCurrency(cart.currency);
    }
  }, [cart?.currency]);

  // Handle currency conversion: native items are always USD; convert only when needed
  useEffect(() => {
    // Set payment method based on selected currency
    if (selectedCurrency === 'USDC') {
      setPaymentMethod('crypto');
    } else {
      setPaymentMethod('paystack');
    }

    const updateAmounts = async () => {
      if (!cart?.items?.length) {
        setConvertedAmount(0);
        setPaymentAmount(0);
        setSubtotalInUSD(0);
        setDeliveryCostInUSD(0);
        setSubtotalDisplay(0);
        setDeliveryDisplay(0);
        return;
      }

      try {
        // Native currency is always USD (items and delivery stored/calculated in USD)
        const subtotalInUSD = cart.items.reduce((total, item) => {
          return total + (item.unitPrice || item.product?.price || item.price) * item.quantity;
        }, 0);

        // Normalize delivery to USD (delivery methods may come as NGN from server)
        let deliveryCostInUSD = 0;
        if (selectedDeliveryMethod) {
          if (selectedDeliveryMethod.currency === 'NGN') {
            deliveryCostInUSD = await currencyConversionService.convertCurrency(
              selectedDeliveryMethod.price,
              'NGN',
              'USD'
            );
          } else {
            deliveryCostInUSD = selectedDeliveryMethod.price;
          }
        }

        const totalInUSD = subtotalInUSD + Number(deliveryCostInUSD);
        setSubtotalInUSD(subtotalInUSD);
        setDeliveryCostInUSD(Number(deliveryCostInUSD));

        // Display currency: USD/USDC = native; NGN = convert; no selection = user default
        const displayCurrency = selectedCurrency || userCurrency;
        if (displayCurrency === 'USD' || displayCurrency === 'USDC') {
          setSubtotalDisplay(subtotalInUSD);
          setDeliveryDisplay(Number(deliveryCostInUSD));
          setConvertedAmount(totalInUSD);
          setPaymentAmount(totalInUSD);
        } else {
          const subtotalConv = await currencyConversionService.convertCurrency(subtotalInUSD, 'USD', displayCurrency);
          const deliveryConv = await currencyConversionService.convertCurrency(Number(deliveryCostInUSD), 'USD', displayCurrency);
          const totalConv = await currencyConversionService.convertCurrency(totalInUSD, 'USD', displayCurrency);
          setSubtotalDisplay(Number(subtotalConv));
          setDeliveryDisplay(Number(deliveryConv));
          setConvertedAmount(Number(totalConv));
          setPaymentAmount(Number(totalConv));
        }
      } catch (error) {
        console.error('Currency conversion failed:', error);
        setConvertedAmount(0);
        setPaymentAmount(0);
      }
    };

    updateAmounts();
  }, [selectedCurrency, cart, selectedDeliveryMethod, userCurrency]);

  const refetchAddresses = async () => {
    try {
      // Check if user is authenticated before fetching addresses
      if (!isUserAuthenticated) {
        console.log("User not authenticated, skipping address fetch");
        return;
      }
      
      console.log("Fetching delivery addresses...");
      console.log("Current token:", localStorage.getItem('token')?.substring(0, 20) + '...');
      
      const addresses = await deliveryAddressService.getDeliveryAddresses();
      console.log("Delivery addresses fetched successfully:", addresses);
    setUserAddresses(addresses);
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      
      if (error.response?.status === 401) {
        console.log("Authentication failed when fetching addresses");
        // Don't clear auth state here, just log the error
      }
    }
  };

  const handleSaveAddress = async (addressData) => {
    try {
      // Check if user is authenticated before saving address
      if (!isUserAuthenticated) {
        console.error("User not authenticated, cannot save address");
        console.log("Auth state:", { isUserAuthenticated, storeAuthenticated, token: !!localStorage.getItem('token') });
        addNotification("Please login to save addresses", "error");
        return;
      }

      if (editingAddress) {
        await deliveryAddressService.updateDeliveryAddress(editingAddress._id, addressData);
      } else {
        await deliveryAddressService.createDeliveryAddress(addressData);
      }
      await refetchAddresses();
      setShowAddressForm(false);
      setEditingAddress(null);
      addNotification(editingAddress ? "Address updated successfully!" : "Address saved successfully!", "success");
    } catch (error) {
      console.error("Failed to save address:", error);
      if (error.response?.status === 401) {
        const errorMsg = error.response?.data?.errors?.[0]?.details || "Authentication failed. Please login again.";
        if (errorMsg.includes("Too many requests")) {
          addNotification("Too many requests. Please wait a moment and try again.", "error");
        } else {
          addNotification("Authentication failed. Please login again.", "error");
          // Clear auth state and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('userInfo');
          localStorage.removeItem('walletAddress');
          navigate('/login');
        }
      } else {
        addNotification("Failed to save address. Please try again.", "error");
      }
    }
  };

  const handleSelectAddress = (addressId) => {
    setSelectedAddressId(addressId);
  };

  const handleAddNewAddress = () => {
    // Check if user is authenticated before showing address form
      if (!isUserAuthenticated) {
        console.error("User not authenticated, cannot add address");
        console.log("Auth state:", { isUserAuthenticated, storeAuthenticated, token: !!localStorage.getItem('token') });
        addNotification("Please login to add addresses", "error");
        return;
      }
    setEditingAddress(null);
    setShowAddressForm(true);
  };

  const handleEditAddress = (address) => {
    // Check if user is authenticated before editing address
      if (!isUserAuthenticated) {
        console.error("User not authenticated, cannot edit address");
        console.log("Auth state:", { isUserAuthenticated, storeAuthenticated, token: !!localStorage.getItem('token') });
        addNotification("Please login to edit addresses", "error");
        return;
      }
    setEditingAddress(address);
    setShowAddressForm(true);
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      // Check if user is authenticated before deleting address
      if (!isUserAuthenticated) {
        console.error("User not authenticated, cannot delete address");
        console.log("Auth state:", { isUserAuthenticated, storeAuthenticated, token: !!localStorage.getItem('token') });
        addNotification("Please login to delete addresses", "error");
        return;
      }

      console.log("Deleting address with ID:", addressId);
      console.log("Current token:", localStorage.getItem('token')?.substring(0, 20) + '...');
      
      await deliveryAddressService.deleteDeliveryAddress(addressId);
      console.log("Address deleted successfully");
      
      await refetchAddresses();
      if (selectedAddressId === addressId) {
        setSelectedAddressId(null);
      }
      addNotification("Address deleted successfully!", "success");
    } catch (error) {
      console.error("Failed to delete address:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      
      if (error.response?.status === 401) {
        const errorMsg = error.response?.data?.errors?.[0]?.details || "Authentication failed. Please login again.";
        if (errorMsg.includes("Too many requests")) {
          addNotification("Too many requests. Please wait a moment and try again.", "error");
        } else {
          addNotification("Authentication failed. Please login again.", "error");
          // Clear auth state and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('userInfo');
          localStorage.removeItem('walletAddress');
          navigate('/login');
        }
      } else if (error.response?.status === 404) {
        addNotification("Address not found. It may have already been deleted.", "error");
        // Refresh addresses to get current state
        await refetchAddresses();
      } else {
        addNotification(`Failed to delete address: ${error.response?.data?.msg || error.message}`, "error");
      }
    }
  };

  const handleEditSelectedAddress = () => {
    const selectedAddress = userAddresses.find(addr => addr._id === selectedAddressId);
    if (selectedAddress) {
      handleEditAddress(selectedAddress);
    }
  };

  const handleDeliveryMethodChange = (method) => {
    setSelectedDeliveryMethod(method);
    // Persist delivery method selection to localStorage
    if (method && method._id) {
      localStorage.setItem('selectedDeliveryMethod', JSON.stringify(method));
    }
  };

  // Get network based on selected currency (only Ethereum supported)
  const getNetworkFromCurrency = (currency) => {
    // All supported currencies use Ethereum network
    return 'ethereum';
  };

  // Check if currency is crypto (USDC for crypto payments)
  const isCryptoCurrency = (currency) => {
    return currency === 'USDC';
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      addNotification("Please select a shipping address.", "error");
      return;
    }

    if (!selectedDeliveryMethod) {
      addNotification("Please select a delivery method.", "error");
      return;
    }

    if (!isUserAuthenticated) {
      addNotification("Please login to place an order.", "error");
      return;
    }

    if (!cart || !cart.items || cart.items.length === 0) {
      addNotification("Your cart is empty.", "error");
      return;
    }

    // All currencies are supported (USDC, USD, NGN)
    // No need to restrict payment methods

    setIsPlacingOrder(true);
    
    try {
      const orderData = {
        shippingAddressId: selectedAddressId,
        deliveryMethodId: selectedDeliveryMethod._id,
        currency: selectedCurrency, // Use selected currency instead of userCurrency
        paymentMethod: paymentMethod,
        walletAddress: userWalletAddress,
        notes: "", // Or get from a form field
        convertedAmount: convertedAmount, // Include converted amount
      };

      // Route to appropriate payment method based on selected currency
      if (paymentMethod === 'crypto' && selectedCurrency === 'USDC') {
        // Crypto payment for USDC
        console.log('Creating crypto payment order...');
        
        // Get network from selected currency
        const network = getNetworkFromCurrency(selectedCurrency);
        
        // Determine order currency based on user location
        // If user is from Nigeria and NGN selected: use NGN (currency provider converted)
        // Otherwise: use USD (base currency from server)
        const isUserFromNigeria = userCurrency === 'NGN';
        const isCurrencyProviderUSD = userCurrency === 'USD';
        const orderCurrency = (isUserFromNigeria && selectedCurrency === 'NGN') ? 'NGN' : 'USD';
        
        const cryptoOrderData = {
          deliveryMethodId: selectedDeliveryMethod._id,
          shippingAddressId: selectedAddressId,
          currency: selectedCurrency, // Payment currency (what user selected to pay with)
          orderCurrency: orderCurrency, // Currency for order calculations (NGN if Nigeria+NGN, else USD)
          network: network,
          notes: "",
          walletAddress: userWalletAddress || undefined, // User's connected wallet - attach to user if not already set
        };
        
        console.log('Crypto payment order data:', {
          isUserFromNigeria,
          isCurrencyProviderUSD,
          orderCurrency, // NGN if Nigeria+NGN, else USD
          paymentCurrency: selectedCurrency, // What user pays with
          network,
          convertedAmount
        });

        const cryptoResponse = await orderService.createCryptoPaymentOrder(cryptoOrderData);
        console.log('Crypto payment order created:', cryptoResponse);

        // Store crypto payment data to show modal
        setCryptoPaymentData({
          orderId: cryptoResponse.orderId,
          paymentAddress: cryptoResponse.paymentAddress,
          amount: cryptoResponse.amount,
          currency: cryptoResponse.currency,
          network: cryptoResponse.network,
          qrCode: cryptoResponse.qrCode,
          expiry: cryptoResponse.expiry
        });

        setIsPlacingOrder(false);
      } else {
        // Paystack payment for USD/NGN
        // The PaystackButton component will handle the payment
        // Just set processing state
        setIsPlacingOrder(false);
        // PaystackButton will trigger handlePaystackSuccess when payment is complete
      }
    } catch (error) {
      console.error('Error placing order:', error);
      const errorMessage = error.response?.data?.msg || error.message || 'Failed to place order. Please try again.';
      addNotification(errorMessage, "error");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // Paystack payment handler
  const handlePaystackSuccess = async (reference) => {
    setIsProcessingPayment(true);
    try {
      console.log('Paystack payment successful:', reference);
      console.log('Current state at payment success:', {
        selectedDeliveryMethod,
        selectedAddressId,
        selectedCurrency,
        paymentMethod
      });
      addNotification('Payment successful! Your order is being processed...', 'success');

      // Extract the actual reference string from the Paystack response
      const paystackRef = typeof reference === 'object' ? reference.reference : reference;
      console.log('Extracted Paystack reference:', paystackRef);

      // Validate required data before proceeding
      if (!selectedDeliveryMethod || !selectedDeliveryMethod._id) {
        console.error('No delivery method selected:', selectedDeliveryMethod);
        console.error('Available delivery methods:', deliveryMethods);
        
        // Try to auto-select the first available delivery method as fallback
        if (deliveryMethods && deliveryMethods.length > 0) {
          console.log('Auto-selecting first available delivery method as fallback');
          const fallbackMethod = deliveryMethods[0];
          setSelectedDeliveryMethod(fallbackMethod);
          
          // Use the fallback method for the order
          const orderData = {
            deliveryMethodId: fallbackMethod._id,
            shippingAddressId: selectedAddressId,
            paymentMethod: 'paystack',
            paystackReference: paystackRef,
            currency: selectedCurrency,
            notes: ''
          };
          
          console.log('Using fallback delivery method:', fallbackMethod);
          console.log('Paystack order data being sent:', orderData);
          
          const response = await orderService.verifyPaymentAndCreateOrder(orderData);
          console.log('Fallback method response:', response);
          
          // Check for orderNumber in response (could be in response directly or in response.data)
          const orderNumber = response?.orderNumber || response?.data?.orderNumber;
          
          if (orderNumber) {
            await clearCart();
            setOrderedSuccess(true);
            // Clear saved delivery method from localStorage
            localStorage.removeItem('selectedDeliveryMethod');
            console.log('Paystack order success redirecting with order number:', orderNumber);
            navigate(AppRoutes.orderSuccess.path.replace(':orderId?', orderNumber));
          } else {
            console.error('Order creation/verification failed - no orderNumber in response:', response);
            addNotification('Payment successful but order processing failed. Please contact support.', 'error');
          }
          return;
        } else {
          addNotification('No delivery methods available. Please contact support.', 'error');
          return;
        }
      }

      if (!selectedAddressId) {
        console.error('No shipping address selected:', selectedAddressId);
        addNotification('Shipping address is required. Please try again.', 'error');
        return;
      }

      // Send payment reference to backend for verification and order creation/update
      const orderData = {
        deliveryMethodId: selectedDeliveryMethod._id,
        shippingAddressId: selectedAddressId,
        paymentMethod: 'paystack',
        paystackReference: paystackRef, // Use the extracted reference string
        currency: selectedCurrency,
        notes: ''
      };

      console.log('Paystack order data being sent:', orderData);
      console.log('Selected delivery method:', selectedDeliveryMethod);
      console.log('Selected address ID:', selectedAddressId);

      console.log('Verifying payment and creating order with Paystack reference:', paystackRef);
      const response = await orderService.verifyPaymentAndCreateOrder(orderData);
      console.log('Full response from verifyPaymentAndCreateOrder:', response);

      // Check for orderNumber in response (could be in response directly or in response.data)
      const orderNumber = response?.orderNumber || response?.data?.orderNumber;
      
      if (orderNumber) {
        await clearCart();
        setOrderedSuccess(true);
        // Clear saved delivery method from localStorage
        localStorage.removeItem('selectedDeliveryMethod');
        console.log('Paystack order success redirecting with order number:', orderNumber);
        navigate(AppRoutes.orderSuccess.path.replace(':orderId?', orderNumber));
      } else {
        console.error('Order creation/verification failed - no orderNumber in response:', response);
        addNotification('Payment successful but order processing failed. Please contact support.', 'error');
      }

    } catch (error) {
      console.error('Error processing Paystack payment success:', error);
      console.error('Error details:', error.response?.data || error.message);
      addNotification('Payment successful but there was an issue processing your order. Please contact support.', 'error');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handlePaystackClose = () => {
    console.log('Paystack payment cancelled');
    setIsPlacingOrder(false);
  };

  const shouldShowAddressForm = showAddressForm || (userAddresses.length === 0 && !showAddressForm);
  const shouldShowAddressList = userAddresses.length > 0 && !showAddressForm && !selectedAddressId;
  const shouldShowSelectedAddress = selectedAddressId && !showAddressForm;
  const selectedAddress = userAddresses.find(addr => addr._id === selectedAddressId);

  // Show loading state while data is loading
  if (isLoading) {
    return (
      <Layout>
        <div className="w-[86%] mx-auto py-8 mb-10 text-center">
          <h1 className="text-2xl md:text-3xl font-heading-header-2-header-2-bold text-white mb-8">
            Loading checkout...
          </h1>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primaryp-300 mx-auto"></div>
        </div>
      </Layout>
    );
  }

  // Only check cart after loading is complete
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <Layout>
        <div className="w-[86%] mx-auto py-8 mb-10 text-center">
          <h1 className="text-2xl md:text-3xl font-heading-header-2-header-2-bold text-white mb-8">
            Your cart is empty
          </h1>
          <p className="text-neutral-400 mb-8">
            Add some items to your cart before proceeding to checkout.
          </p>
          <Button 
            onClick={() => navigate(AppRoutes.cart.path)}
            className="bg-primaryp-300 hover:bg-primaryp-400 text-white px-6 py-3 rounded-lg"
          >
            Go to Cart
          </Button>
        </div>
      </Layout>
    );
  }

  // Show login prompt if not authenticated, but don't block the page
  if (!isUserAuthenticated) {
    return (
      <Layout>
        <div className="w-[86%] mx-auto py-8 mb-10 text-center">
          <h1 className="text-2xl md:text-3xl font-heading-header-2-header-2-bold text-white mb-8">
            Please login to proceed with checkout
          </h1>
          <p className="text-neutral-400 mb-8">
            You need to be logged in to access your saved addresses and complete your order.
          </p>
          <WalletConnectButton onConnect={authenticateAndLogin} />
        </div>
      </Layout>
    );
  }

  // Currency and payment method selection component
  const PaymentMethodSelection = () => {
    const isCrypto = isCryptoCurrency(selectedCurrency);
    const network = getNetworkFromCurrency(selectedCurrency);

    return (
      <div className="space-y-6">
        {/* Currency Selection */}
        <CurrencySelection 
          selectedCurrency={selectedCurrency}
          onCurrencyChange={setSelectedCurrency}
        />
        
        {/* Payment Method Display - Only show for crypto currencies */}
        {isCrypto && (
          <div className="bg-neutral-800 rounded-lg p-6">
            <h3 className="text-white text-lg font-semibold mb-4">Payment Method</h3>
            <div className="space-y-3">
              <div className="w-full text-left p-4 rounded-lg border-2 border-primaryp-300 bg-primaryp-300/10">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded-full border-2 border-primaryp-300 bg-primaryp-300 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium">Pay with Crypto Wallet</div>
                    <div className="text-neutral-400 text-sm">
                      Pay directly with USDC on Base network - Zero fees, instant confirmation
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout>
      <div className="w-[86%] mx-auto py-8 mb-10">
        <h1 className="text-2xl md:text-3xl font-heading-header-2-header-2-bold text-white mb-8">
          Checkout
        </h1>
        
        {/* Mobile Layout */}
        <div className="md:hidden space-y-6">
          {/* Address Section - Mobile */}
          {shouldShowAddressForm && (
            <DeliveryAddressForm 
              onSave={handleSaveAddress}
              onCancel={userAddresses.length > 0 ? () => setShowAddressForm(false) : undefined}
              showCancel={userAddresses.length > 0}
              editingAddress={editingAddress}
            />
          )}
          
          {shouldShowAddressList && (
            <DeliveryAddressList
              addresses={userAddresses}
              selectedAddressId={selectedAddressId}
              onSelectAddress={handleSelectAddress}
              onAddNew={handleAddNewAddress}
              onEdit={handleEditAddress}
              onDelete={handleDeleteAddress}
            />
          )}

          {shouldShowSelectedAddress && (
            <>
              <DeliveryAddressDisplay
                address={selectedAddress}
                onEdit={handleEditSelectedAddress}
                onAddNew={handleAddNewAddress}
              />
              
              <DeliveryMethodSelection
                methods={deliveryMethods}
                selectedMethod={selectedDeliveryMethod}
                onMethodChange={handleDeliveryMethodChange}
              />
              
              {/* Payment Method Selection - Mobile */}
              {selectedDeliveryMethod && (
                <PaymentMethodSelection />
              )}
            </>
          )}
          
          {/* Order Summary - Mobile */}
          <OrderSummary 
            onPlaceOrder={handlePlaceOrder}
            isPlacingOrder={isPlacingOrder}
            hasSelectedAddress={!!selectedAddressId}
            deliveryMethod={selectedDeliveryMethod}
            requireDeliveryMethod={shouldShowSelectedAddress}
            balance={balance}
            currency={selectedCurrency}
            convertedAmount={convertedAmount}
            paymentAmount={paymentAmount}
            paymentMethod={paymentMethod}
            userWalletAddress={userWalletAddress}
            onPaystackSuccess={handlePaystackSuccess}
            onPaystackClose={handlePaystackClose}
            subtotalInUSD={subtotalInUSD}
            deliveryCostInUSD={deliveryCostInUSD}
            subtotalDisplay={subtotalDisplay}
            deliveryDisplay={deliveryDisplay}
          />
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Address and Delivery Method */}
          <div className="lg:col-span-2 space-y-6">
            {/* Address Section - Desktop */}
            {shouldShowAddressForm && (
              <DeliveryAddressForm 
                onSave={handleSaveAddress}
                onCancel={userAddresses.length > 0 ? () => setShowAddressForm(false) : undefined}
                showCancel={userAddresses.length > 0}
                editingAddress={editingAddress}
              />
            )}
            
            {shouldShowAddressList && (
              <DeliveryAddressList
                addresses={userAddresses}
                selectedAddressId={selectedAddressId}
                onSelectAddress={handleSelectAddress}
                onAddNew={handleAddNewAddress}
                onEdit={handleEditAddress}
                onDelete={handleDeleteAddress}
              />
            )}

            {shouldShowSelectedAddress && (
              <DeliveryAddressDisplay
                address={selectedAddress}
                onEdit={handleEditSelectedAddress}
                onAddNew={handleAddNewAddress}
              />
            )}

            {/* Delivery Method - Only show when address is selected */}
            {shouldShowSelectedAddress && (
              <DeliveryMethodSelection
                methods={deliveryMethods}
                selectedMethod={selectedDeliveryMethod}
                onMethodChange={handleDeliveryMethodChange}
              />
            )}

            {/* Payment Method Selection - Only show when delivery method is selected */}
            {shouldShowSelectedAddress && selectedDeliveryMethod && (
              <PaymentMethodSelection />
            )}
          </div>
          
          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary 
              onPlaceOrder={handlePlaceOrder}
              isPlacingOrder={isPlacingOrder}
              hasSelectedAddress={!!selectedAddressId}
              deliveryMethod={selectedDeliveryMethod}
              requireDeliveryMethod={shouldShowSelectedAddress}
              balance={balance}
              currency={selectedCurrency}
              convertedAmount={convertedAmount}
              paymentAmount={paymentAmount}
              paymentMethod={paymentMethod}
              userWalletAddress={userWalletAddress}
              onPaystackSuccess={handlePaystackSuccess}
              onPaystackClose={handlePaystackClose}
              subtotalInUSD={subtotalInUSD}
              deliveryCostInUSD={deliveryCostInUSD}
              subtotalDisplay={subtotalDisplay}
              deliveryDisplay={deliveryDisplay}
            />
          </div>
        </div>
      </div>

      {/* Crypto Payment Modal */}
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
            addNotification('Order saved. You can continue payment later from My Orders.', 'info');
            navigate(AppRoutes.userOrders.path);
          }}
          onPaymentConfirmed={async () => {
            await clearCart();
            setCryptoPaymentData(null);
            addNotification('Payment confirmed! Your order is being processed.', 'success');
            navigate(AppRoutes.userOrders.path);
          }}
          onCancel={async () => {
            try {
              // Cancel the order
              if (cryptoPaymentData.orderId) {
                await orderService.cancelOrder(cryptoPaymentData.orderId);
                addNotification('Payment cancelled. Order has been cancelled.', 'info');
              }
              setCryptoPaymentData(null);
              navigate(AppRoutes.userOrders.path);
            } catch (error) {
              console.error('Error cancelling order:', error);
              addNotification('Error cancelling order. Please try again.', 'error');
            }
          }}
        />
      )}

      {/* Payment Processing Overlay */}
      {isProcessingPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primaryp-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Processing Payment
            </h3>
            <p className="text-gray-600">
              Please wait while we verify your payment and create your order...
            </p>
          </div>
        </div>
      )}

      {/* Web3Modal (only if available) */}
      {/* {web3Modal && <w3m-button />} */}
    </Layout>
  );
}

export default CheckoutPage; 
