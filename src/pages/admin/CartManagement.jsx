import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import cartService from '../../services/cartService';
import Layout from '../../components/Layout';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { ShoppingCart, Search, Trash2, Package, User, ArrowLeft } from 'lucide-react';
import { AppRoutes } from '../../config/routes';

function CartManagement() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [searchUserId, setSearchUserId] = useState('');

  const clearMessages = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const fetchCart = async (userId) => {
    clearMessages();
    setLoading(true);
    try {
      const data = await cartService.getCartByUserId(userId);
      setCart(data);
    } catch (error) {
      // Fetch failed
      setErrorMessage('Failed to fetch cart. Make sure the user ID is correct and the backend supports fetching carts by user ID.');
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (productId) => {
    clearMessages();
    if (window.confirm('Are you sure you want to remove this item from the cart?')) {
      try {
        await cartService.removeItemFromCart(searchUserId, productId);
        setSuccessMessage('Item removed from cart successfully!');
        fetchCart(searchUserId);
      } catch (error) {
        // Remove failed
        setErrorMessage('Failed to remove item from cart.');
      }
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchUserId.trim()) {
      fetchCart(searchUserId.trim());
    } else {
      setCart(null);
      setErrorMessage('Please enter a User ID to search for a cart.');
    }
  };

  return (
    <Layout>
      <div className="w-[86%] mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-infoi-100/10 rounded-full flex items-center justify-center">
                <ShoppingCart size={24} className="text-infoi-400" />
              </div>
              <div>
                <h1 className="text-3xl font-heading-header-2-header-2-bold text-white">
                  Cart Management
                </h1>
                <p className="text-neutralneutral-400">View and manage user shopping carts</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate(AppRoutes.admin.path)}
              className="border-neutralneutral-600 text-neutralneutral-300 hover:bg-neutralneutral-800"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Dashboard
            </Button>
          </div>

          {/* Messages */}
          {errorMessage && (
            <Card className="p-4 mb-6 bg-dangerd-100/10 border-dangerd-400">
              <p className="text-dangerd-400">{errorMessage}</p>
            </Card>
          )}
          
          {successMessage && (
            <Card className="p-4 mb-6 bg-successs-100/10 border-successs-400">
              <p className="text-successs-400">{successMessage}</p>
            </Card>
          )}

          {/* Search Cart by User ID */}
          <Card className="p-6 mb-6">
            <div className="flex items-center gap-2 mb-6">
              <Search size={20} className="text-primaryp-400" />
              <h2 className="text-xl font-heading-header-3-header-3-bold text-white">
                Search Cart by User ID
              </h2>
            </div>
            
            <form onSubmit={handleSearch} className="flex gap-4">
              <input
                type="text"
                placeholder="Enter User ID"
                value={searchUserId}
                onChange={(e) => setSearchUserId(e.target.value)}
                className="flex-1 p-3 bg-neutralneutral-800 border border-neutralneutral-600 rounded-lg text-white placeholder-neutralneutral-400"
              />
              <Button type="submit" className="bg-infoi-500 hover:bg-infoi-400">
                <Search size={16} className="mr-2" />
                Search Cart
              </Button>
            </form>
          </Card>

          {/* Cart Details */}
          <Card className="p-6">
            <h2 className="text-xl font-heading-header-3-header-3-bold text-white mb-6">
              Cart Details
            </h2>
            
            {loading ? (
              <div className="text-center py-8 text-neutralneutral-400">Loading cart...</div>
            ) : !cart ? (
              <div className="text-center py-8">
                <ShoppingCart size={48} className="text-neutralneutral-500 mx-auto mb-3" />
                <p className="text-neutralneutral-400">
                  {searchUserId ? 'No cart found for this user.' : 'Enter a User ID to search for a cart.'}
                </p>
              </div>
            ) : (
              <div>
                {/* Cart Info */}
                <div className="bg-neutralneutral-800 p-4 rounded-lg mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <ShoppingCart size={16} className="text-infoi-400" />
                      <span className="text-neutralneutral-400">Cart ID:</span>
                      <span className="text-white font-body-base-base-medium">{cart._id}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-primaryp-400" />
                      <span className="text-neutralneutral-400">User ID:</span>
                      <span className="text-white font-body-base-base-medium">{cart.userId}</span>
                    </div>
                  </div>
                </div>

                {/* Cart Items */}
                {cart.items.length === 0 ? (
                  <div className="text-center py-8">
                    <Package size={48} className="text-neutralneutral-500 mx-auto mb-3" />
                    <p className="text-neutralneutral-400">This cart is empty.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h3 className="text-lg font-body-large-large-bold text-white mb-4">
                      Cart Items ({cart.items.length})
                    </h3>
                    
                    {cart.items.map((item) => (
                      <div key={item.productId} className="p-4 bg-neutralneutral-800 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-8 h-8 bg-secondarys-100/10 rounded-full flex items-center justify-center">
                                <Package size={16} className="text-secondarys-400" />
                              </div>
                              <div>
                                <p className="text-white font-body-base-base-semibold">
                                  Product ID: {item.productId}
                                </p>
                                <p className="text-neutralneutral-400 text-sm">
                                  Quantity: {item.quantity}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <Button
                            onClick={() => handleRemoveItem(item.productId)}
                            size="sm"
                            className="bg-dangerd-500 hover:bg-dangerd-400"
                          >
                            <Trash2 size={14} className="mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
}

export default CartManagement;