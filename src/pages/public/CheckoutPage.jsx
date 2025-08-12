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
import orderService from '../../services/orderService';

function CheckoutPage() {
  const navigate = useNavigate();
  
  // Mock user addresses - in real app this would come from a store or API
  const [userAddresses, setUserAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderedSuccess, setOrderedSuccess] = useState(false);
  const { cart, clearCart, token, getCartTotal } = useStore();

  // Redirect if cart is empty
  useEffect(() => {
    if (!cart || !cart.items || cart.items.length === 0 && !orderedSuccess) {
      navigate(AppRoutes.cart.path);
    }
  }, [cart, navigate, orderedSuccess]);

  const handleSaveAddress = (addressData) => {
    const newAddress = {
      id: Date.now().toString(),
      ...addressData,
      isDefault: userAddresses.length === 0
    };
    
    if (editingAddress) {
      // Update existing address
      setUserAddresses(prev => 
        prev.map(addr => addr.id === editingAddress.id ? { ...newAddress, id: editingAddress.id } : addr)
      );
      setEditingAddress(null);
    } else {
      // Add new address
      setUserAddresses(prev => [...prev, newAddress]);
      setSelectedAddressId(newAddress.id);
    }
    
    setShowAddressForm(false);
  };

  const handleSelectAddress = (addressId) => {
    setSelectedAddressId(addressId);
  };

  const handleAddNewAddress = () => {
    setEditingAddress(null);
    setShowAddressForm(true);
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setShowAddressForm(true);
  };

  const handleDeleteAddress = (addressId) => {
    setUserAddresses(prev => prev.filter(addr => addr.id !== addressId));
    if (selectedAddressId === addressId) {
      setSelectedAddressId(null);
    }
  };

  const handleEditSelectedAddress = () => {
    const selectedAddress = userAddresses.find(addr => addr.id === selectedAddressId);
    if (selectedAddress) {
      handleEditAddress(selectedAddress);
    }
  };

  const handleDeliveryMethodChange = (method) => {
    setSelectedDeliveryMethod(method);
  };

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    
    try {
      // Validate required data
      if (!selectedAddressId) {
        throw new Error('Please select a delivery address');
      }
      
      if (!selectedDeliveryMethod) {
        throw new Error('Please select a delivery method');
      }

      const productsForOrder = cart.items.map(item => ({
        productId: item.product._id,
        quantity: item.quantity,
      }));

      const orderData = {
        products: productsForOrder,
        totalAmount: getCartTotal(),
        // You might want to include selectedAddress and selectedDeliveryMethod here
        // depending on how your backend handles them.
        // For now, assuming backend handles address and delivery method based on user session or other means.
      };

      const response = await orderService.createOrder(token, orderData);
      
      setOrderedSuccess(true);
      clearCart();
      navigate(AppRoutes.orderSuccess.path.replace(':orderId?', response._id));
          } catch (error) {
        console.error('Error placing order:', error);
        // Show user-friendly error message
        const errorMessage = error.response?.data?.msg || error.message || 'Failed to place order. Please try again.';
        alert(errorMessage);
      } finally {
        setIsPlacingOrder(false);
      }
  };

  const shouldShowAddressForm = showAddressForm || (userAddresses.length === 0 && !showAddressForm);
  const shouldShowAddressList = userAddresses.length > 0 && !showAddressForm && !selectedAddressId;
  const shouldShowSelectedAddress = selectedAddressId && !showAddressForm;
  const selectedAddress = userAddresses.find(addr => addr.id === selectedAddressId);

  if (!cart || !cart.items || cart.items.length === 0) {
    return null; // Will redirect via useEffect
  }

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
                selectedMethod={selectedDeliveryMethod}
                onMethodChange={handleDeliveryMethodChange}
              />
            </>
          )}
          
          {/* Order Summary - Mobile */}
          <OrderSummary 
            onPlaceOrder={handlePlaceOrder}
            isPlacingOrder={isPlacingOrder}
            hasSelectedAddress={!!selectedAddressId}
            deliveryMethod={selectedDeliveryMethod}
            requireDeliveryMethod={shouldShowSelectedAddress}
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
                selectedMethod={selectedDeliveryMethod}
                onMethodChange={handleDeliveryMethodChange}
              />
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
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default CheckoutPage; 