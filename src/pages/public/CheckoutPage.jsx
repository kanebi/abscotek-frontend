import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { DeliveryAddressForm, DeliveryAddressList, OrderSummary } from '../../components/checkout';
import useStore from '../../store/useStore';
import { AppRoutes } from '../../config/routes';

function CheckoutPage() {
  const navigate = useNavigate();
  
  // Mock user addresses - in real app this would come from a store or API
  const [userAddresses, setUserAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  
  const { cart, clearCart } = useStore();

  // Redirect if cart is empty
  React.useEffect(() => {
    if (!cart || !cart.items || cart.items.length === 0) {
      navigate(AppRoutes.cart.path);
    }
  }, [cart, navigate]);

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

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    
    try {
      // Simulate order placement
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear cart and navigate to success page
      clearCart();
      navigate(AppRoutes.orderSuccess.path.replace(':orderId?', '12345'));
    } catch (error) {
      console.error('Error placing order:', error);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const shouldShowAddressForm = showAddressForm || (userAddresses.length === 0 && !showAddressForm);
  const shouldShowAddressList = userAddresses.length > 0 && !showAddressForm;

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
          
          {/* Order Summary - Mobile */}
          <OrderSummary 
            onPlaceOrder={handlePlaceOrder}
            isPlacingOrder={isPlacingOrder}
            hasSelectedAddress={!!selectedAddressId}
          />
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Address Section - Desktop */}
          <div className="lg:col-span-2">
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
          </div>
          
          {/* Order Summary - Desktop */}
          <div className="lg:col-span-1">
            <OrderSummary 
              onPlaceOrder={handlePlaceOrder}
              isPlacingOrder={isPlacingOrder}
              hasSelectedAddress={!!selectedAddressId}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default CheckoutPage; 