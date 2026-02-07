import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Separator } from '../../components/ui/separator';
import AmountCurrency from '../../components/ui/AmountCurrency';
import useStore from '../../store/useStore';
import { AppRoutes } from '../../config/routes';
import { Heart, ShoppingCart, Trash2, ArrowLeft, Loader2 } from 'lucide-react';
import SEO from '../../components/SEO';
import { getPageSEO } from '../../config/seo';

function WishlistPage() {
  const [isRemoving, setIsRemoving] = useState(null);
  const [isAddingToCart, setIsAddingToCart] = useState(null);
  const navigate = useNavigate();
  
  const {
    wishlist,
    wishlistLoading,
    isAuthenticated,
    currentUser,
    fetchWishlist,
    removeFromWishlist,
    addToCart
  } = useStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    }
  }, [isAuthenticated, fetchWishlist]);

  const handleRemoveFromWishlist = async (productId) => {
    setIsRemoving(productId);
    try {
      await removeFromWishlist(productId);
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    } finally {
      setIsRemoving(null);
    }
  };

  const handleAddToCart = async (productId) => {
    setIsAddingToCart(productId);
    try {
      await addToCart(productId, 1);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAddingToCart(null);
    }
  };

  // SEO configuration
  const seoData = getPageSEO('wishlist', { path: '/wishlist' });

  if (!isAuthenticated) {
    return (
      <Layout>
        <SEO {...seoData} />
        <div className="w-[86%] mx-auto py-8 min-h-[60vh]">
          <div className="max-w-4xl mx-auto">
            <Card className="p-8 text-center bg-neutral-900 border-neutral-700">
              <Heart size={64} className="mx-auto mb-4 text-neutral-600" />
              <h2 className="text-2xl font-heading-header-2-header-2-bold text-white mb-4">
                Sign in to view your wishlist
              </h2>
              <p className="text-neutral-400 mb-6">
                Save your favorite items and access them anytime
              </p>
              <Button
                onClick={() => navigate(AppRoutes.home.path)}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Continue Shopping
              </Button>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  if (wishlistLoading) {
    return (
      <Layout>
        <SEO {...seoData} />
        <div className="w-[86%] mx-auto py-8 min-h-[60vh]">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-white" />
              <div className="text-center text-white">Loading your wishlist...</div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const wishlistItems = wishlist?.items || [];
  const isEmpty = wishlistItems.length === 0;

  return (
    <Layout>
      <SEO {...seoData} />
      <div className="w-[94%] md:w-[86%] mx-auto py-4 md:py-8 min-h-[60vh]">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 md:mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-heading-header-2-header-2-bold text-white mb-2">
                My Wishlist
              </h1>
              <p className="text-neutral-400 text-sm md:text-base">
                {isEmpty ? 'No items yet' : `${wishlistItems.length} ${wishlistItems.length === 1 ? 'item' : 'items'}`}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate(AppRoutes.home.path)}
              className="border-neutral-800 bg-neutral-900 text-white hover:bg-neutral-800 w-full md:w-auto"
            >
              <ArrowLeft size={16} className="mr-2" />
              Continue Shopping
            </Button>
          </div>

          {isEmpty ? (
            <Card className="p-12 text-center bg-neutral-900 border-neutral-700">
              <Heart size={64} className="mx-auto mb-4 text-neutral-600" />
              <h2 className="text-2xl font-heading-header-3-header-3-bold text-white mb-4">
                Your wishlist is empty
              </h2>
              <p className="text-neutral-400 mb-6">
                Start adding items you love to your wishlist
              </p>
              <Button
                onClick={() => navigate(AppRoutes.home.path)}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Start Shopping
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {wishlistItems.map((item) => {
                const product = item.product || item;
                const productImage = product.images?.[0] || product.image || '/images/desktop-1.png';
                const productName = product.name || 'Product';
                const productPrice = product.price || 0;
                const productId = product._id || product.id;

                const isInStock = product.stock > 0;

                return (
                  <Card key={productId} className="p-4 md:p-6 bg-neutral-900 border-neutral-700">
                    <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                      {/* Product Image */}
                      <Link to={`${AppRoutes.productDetail.path.replace(':id', productId)}`}>
                        <div className="w-full md:w-32 h-48 md:h-32 bg-neutral-800 rounded-lg flex-shrink-0 overflow-hidden relative">
                          <img
                            src={productImage}
                            alt={productName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/images/desktop-1.png';
                            }}
                          />
                          {!isInStock && (
                            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                              <span className="text-white font-bold text-sm">OUT OF STOCK</span>
                            </div>
                          )}
                        </div>
                      </Link>

                      {/* Product Info */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <Link to={`${AppRoutes.productDetail.path.replace(':id', productId)}`}>
                            <h3 className="text-lg md:text-xl font-body-large-large-bold text-white mb-2 hover:text-red-500 transition-colors">
                              {productName}
                            </h3>
                          </Link>
                          {product.brand && (
                            <p className="text-neutral-400 text-sm mb-1">
                              Brand: {product.brand}
                            </p>
                          )}
                          {product.category && (
                            <p className="text-neutral-400 text-sm mb-2">
                              Category: {product.category}
                            </p>
                          )}
                          {!isInStock && (
                            <p className="text-red-500 text-sm font-medium">
                              Currently unavailable
                            </p>
                          )}
                        </div>

                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mt-4">
                          <div className="text-xl md:text-2xl font-heading-header-3-header-3-bold text-white">
                            <AmountCurrency amount={productPrice} fromCurrency="USD" />
                          </div>

                          <div className="flex gap-2 md:gap-3 w-full md:w-auto">
                            {isInStock && (
                              <Button
                                onClick={() => handleAddToCart(productId)}
                                disabled={isAddingToCart === productId}
                                className="bg-red-500 hover:bg-red-600 text-white flex-1 md:flex-none text-sm md:text-base"
                              >
                                {isAddingToCart === productId ? (
                                  <Loader2 size={16} className="mr-2 animate-spin" />
                                ) : (
                                  <ShoppingCart size={16} className="mr-2" />
                                )}
                                {isAddingToCart === productId ? 'Adding...' : 'Add to Cart'}
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              onClick={() => handleRemoveFromWishlist(productId)}
                              disabled={isRemoving === productId}
                              className="border-neutral-800 bg-neutral-900 text-white hover:bg-neutral-800 flex-1 md:flex-none text-sm md:text-base"
                            >
                              {isRemoving === productId ? (
                                <Loader2 size={16} className="mr-2 animate-spin" />
                              ) : (
                                <Trash2 size={16} className="mr-2" />
                              )}
                              {isRemoving === productId ? 'Removing...' : 'Remove'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default WishlistPage;
