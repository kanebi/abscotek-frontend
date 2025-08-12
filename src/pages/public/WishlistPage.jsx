import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { Button } from '../../components/ui/button';
import { Separator } from '../../components/ui/separator';
import AmountCurrency from '../../components/ui/AmountCurrency';
import { Link } from 'react-router-dom';
import useStore from '../../store/useStore';
import { AppRoutes } from '../../config/routes';
import { Trash2 } from 'lucide-react';
import SEO from '../../components/SEO';
import { getPageSEO } from '../../config/seo';

function WishlistPage() {
  const { token, wishlist, fetchWishlist, removeFromWishlist } = useStore();
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    if (token) {
      fetchWishlist();
    }
  }, [token, fetchWishlist]);

  const handleRemoveFromWishlist = async (productId) => {
    setIsRemoving(true);
    try {
      await removeFromWishlist(productId);
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
    } finally {
      setIsRemoving(false);
    }
  };

  const seoData = getPageSEO('wishlist', { path: '/wishlist' });

  if (!token) {
    return (
      <Layout>
        <SEO {...seoData} />
        <div className="w-[86%] mx-auto py-8 text-center text-white">
          Please log in to view your wishlist.
        </div>
      </Layout>
    );
  }

  if (!wishlist || wishlist.items.length === 0) {
    return (
      <Layout>
        <SEO {...seoData} />
        <div className="w-[86%] mx-auto py-8">
          <h1 className="md:text-2xl text-xl font-semibold font-heading-header-2-header-2-bold text-white mb-8">Your Wishlist</h1>
          <div className="flex flex-col items-center justify-center md:min-h-[400px] min-h-[500px] text-center">
            <div className="w-16 h-16 mb-6">
              <img 
                src="/images/ion-gift-sharp.svg" 
                alt="Empty wishlist" 
                className="w-full h-full opacity-90"
              />
            </div>
            <p className="text-neutralneutral-100 font-body-base-base-regular text-lg">
              Your wishlist is empty
            </p>
            <Link to={AppRoutes.productList.path} className="mt-4 text-blue-500 hover:underline">
              Start browsing products
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO {...seoData} />
      <div className="w-[86%] mx-auto py-8">
        <h1 className="md:text-3xl text-xl font-heading-header-2-header-2-bold text-white mb-8">Your Wishlist</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.items.map((item) => (
            <Card key={item.product._id} className="bg-[#1F1F21] rounded-xl p-4 flex flex-col">
              <Link to={`${AppRoutes.productDetail.path}/${item.product._id}`}>
                <img 
                  src={item.product.image} 
                  alt={item.product.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              </Link>
              <h3 className="text-white font-medium text-lg mb-2">{item.product.name}</h3>
              <div className="text-white text-xl font-semibold mb-4">
                <AmountCurrency amount={item.product.price} fromCurrency="USDT" />
              </div>
              <div className="flex justify-between items-center mt-auto">
                <Button 
                  variant="destructive"
                  onClick={() => handleRemoveFromWishlist(item.product._id)}
                  disabled={isRemoving}
                  className="flex items-center gap-2"
                >
                  <Trash2 size={18} /> Remove
                </Button>
                <Link to={`${AppRoutes.productDetail.path}/${item.product._id}`}>
                  <Button>View Product</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default WishlistPage;