import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import wishlistService from '../../services/wishlistService';
import Layout from '../../components/Layout';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Heart, Search, Trash2, Package, User, ArrowLeft } from 'lucide-react';
import { AppRoutes } from '../../config/routes';

function WishlistManagement() {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [searchUserId, setSearchUserId] = useState('');

  const clearMessages = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const fetchWishlist = async (userId = null) => {
    clearMessages();
    setLoading(true);
    try {
      let data;
      if (userId) {
        // This would need a backend endpoint to fetch any user's wishlist by ID
        data = await wishlistService.getWishlistByUserId(userId);
      } else {
        data = await wishlistService.getWishlist();
      }
      setWishlist(data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      setErrorMessage("Failed to fetch wishlist. This component currently fetches the authenticated user's wishlist. For admin management, you might need a backend endpoint to fetch any user's wishlist by ID.");
      setWishlist(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (productId) => {
    clearMessages();
    if (window.confirm('Are you sure you want to remove this item from the wishlist?')) {
      try {
        await wishlistService.removeItemFromWishlist(productId);
        setSuccessMessage('Item removed from wishlist successfully!');
        fetchWishlist(searchUserId || null);
      } catch (error) {
        console.error('Error removing item:', error);
        setErrorMessage('Failed to remove item from wishlist.');
      }
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchUserId.trim()) {
      fetchWishlist(searchUserId.trim());
    } else {
      fetchWishlist();
    }
  };

  const handleLoadCurrentUser = () => {
    setSearchUserId('');
    fetchWishlist();
  };

  return (
    <Layout>
      <div className="w-[86%] mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-dangerd-100/10 rounded-full flex items-center justify-center">
                <Heart size={24} className="text-dangerd-400" />
              </div>
              <div>
                <h1 className="text-3xl font-heading-header-2-header-2-bold text-white">
                  Wishlist Management
                </h1>
                <p className="text-neutralneutral-400">View and manage user wishlists</p>
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

          {/* Search Controls */}
          <Card className="p-6 mb-6">
            <div className="flex items-center gap-2 mb-6">
              <Search size={20} className="text-primaryp-400" />
              <h2 className="text-xl font-heading-header-3-header-3-bold text-white">
                Search Wishlist
              </h2>
            </div>
            
            <div className="space-y-4">
              <form onSubmit={handleSearch} className="flex gap-4">
                <input
                  type="text"
                  placeholder="Enter User ID (optional)"
                  value={searchUserId}
                  onChange={(e) => setSearchUserId(e.target.value)}
                  className="flex-1 p-3 bg-neutralneutral-800 border border-neutralneutral-600 rounded-lg text-white placeholder-neutralneutral-400"
                />
                <Button type="submit" className="bg-dangerd-500 hover:bg-dangerd-400">
                  <Search size={16} className="mr-2" />
                  Search
                </Button>
              </form>
              
              <div className="text-center">
                <Button 
                  onClick={handleLoadCurrentUser}
                  variant="outline" 
                  className="border-neutralneutral-600 text-neutralneutral-300"
                >
                  Load Current User's Wishlist
                </Button>
              </div>
            </div>
          </Card>

          {/* Wishlist Details */}
          <Card className="p-6">
            <h2 className="text-xl font-heading-header-3-header-3-bold text-white mb-6">
              Wishlist Details
            </h2>
            
            {loading ? (
              <div className="text-center py-8 text-neutralneutral-400">Loading wishlist...</div>
            ) : !wishlist ? (
              <div className="text-center py-8">
                <Heart size={48} className="text-neutralneutral-500 mx-auto mb-3" />
                <p className="text-neutralneutral-400">
                  No wishlist found. Try searching for a specific user or load the current user's wishlist.
                </p>
              </div>
            ) : (
              <div>
                {/* Wishlist Info */}
                <div className="bg-neutralneutral-800 p-4 rounded-lg mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Heart size={16} className="text-dangerd-400" />
                      <span className="text-neutralneutral-400">Wishlist ID:</span>
                      <span className="text-white font-body-base-base-medium">{wishlist._id}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-primaryp-400" />
                      <span className="text-neutralneutral-400">User ID:</span>
                      <span className="text-white font-body-base-base-medium">{wishlist.userId}</span>
                    </div>
                  </div>
                </div>

                {/* Wishlist Items */}
                {!wishlist.items || wishlist.items.length === 0 ? (
                  <div className="text-center py-8">
                    <Package size={48} className="text-neutralneutral-500 mx-auto mb-3" />
                    <p className="text-neutralneutral-400">This wishlist is empty.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h3 className="text-lg font-body-large-large-bold text-white mb-4">
                      Wishlist Items ({wishlist.items.length})
                    </h3>
                    
                    {wishlist.items.map((item) => (
                      <div key={item.productId} className="p-4 bg-neutralneutral-800 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-8 h-8 bg-dangerd-100/10 rounded-full flex items-center justify-center">
                                <Heart size={16} className="text-dangerd-400" />
                              </div>
                              <div>
                                <p className="text-white font-body-base-base-semibold">
                                  Product ID: {item.productId}
                                </p>
                                <p className="text-neutralneutral-400 text-sm">
                                  Added to wishlist
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

          {/* Admin Note */}
          <Card className="p-4 bg-infoi-100/10 border-infoi-400">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-infoi-100/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Package size={16} className="text-infoi-400" />
              </div>
              <div>
                <h3 className="text-infoi-400 font-body-base-base-semibold mb-1">Admin Note</h3>
                <p className="text-neutralneutral-300 text-sm">
                  This component currently shows the authenticated user's wishlist by default. 
                  To manage any user's wishlist by ID, you may need to implement additional 
                  backend endpoints that support admin-level access to user wishlists.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

export default WishlistManagement;