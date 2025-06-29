import React, { useState, useEffect } from 'react';
import wishlistService from '../services/wishlistService';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';

function WishlistManagement() {
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const clearMessages = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const fetchWishlist = async () => {
    clearMessages();
    setLoading(true);
    try {
      const data = await wishlistService.getWishlist();
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
        fetchWishlist(); // Refresh wishlist after removal
      } catch (error) {
        console.error('Error removing item:', error);
        setErrorMessage('Failed to remove item from wishlist.');
      }
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Wishlist Management</h2>

      <ErrorMessage message={errorMessage} />
      <SuccessMessage message={successMessage} />

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Current User's Wishlist</h3>
        {loading ? (
          <p>Loading wishlist...</p>
        ) : !wishlist || wishlist.items.length === 0 ? (
          <p>Wishlist is empty or no wishlist found for the current user.</p>
        ) : (
          <div>
            <p className="mb-2"><strong>Wishlist ID:</strong> {wishlist._id}</p>
            <p className="mb-4"><strong>User ID:</strong> {wishlist.userId}</p>
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Product ID</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {wishlist.items.map((item) => (
                  <tr key={item.productId} className="border-b">
                    <td className="py-2 px-4">{item.productId}</td>
                    <td className="py-2 px-4">
                      <button
                        onClick={() => handleRemoveItem(item.productId)}
                        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default WishlistManagement;