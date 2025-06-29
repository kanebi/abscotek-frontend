import React, { useState, useEffect } from 'react';
import cartService from '../services/cartService';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';

function CartManagement() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [searchUserId, setSearchUserId] = useState('');

  const clearMessages = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  useEffect(() => {
    // Initial fetch might be for the authenticated user's cart, or empty if no search ID
    if (!searchUserId) {
      setCart(null);
      setLoading(false);
      return;
    }
    fetchCart(searchUserId);
  }, [searchUserId]);

  const fetchCart = async (userId) => {
    clearMessages();
    setLoading(true);
    try {
      const data = await cartService.getCartByUserId(userId);
      setCart(data);
    } catch (error) {
      console.error('Error fetching cart:', error);
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
        // Assuming removeItemFromCart also needs a userId for admin context
        await cartService.removeItemFromCart(searchUserId, productId);
        setSuccessMessage('Item removed from cart successfully!');
        fetchCart(searchUserId); // Refresh cart after removal
      } catch (error) {
        console.error('Error removing item:', error);
        setErrorMessage('Failed to remove item from cart.');
      }
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchUserId) {
      fetchCart(searchUserId);
    } else {
      setCart(null);
      setErrorMessage('Please enter a User ID to search for a cart.');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Cart Management</h2>

      <ErrorMessage message={errorMessage} />
      <SuccessMessage message={successMessage} />

      {/* Search Cart by User ID */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-4">Search Cart by User ID</h3>
        <form onSubmit={handleSearch} className="flex space-x-2">
          <input
            type="text"
            placeholder="Enter User ID"
            value={searchUserId}
            onChange={(e) => setSearchUserId(e.target.value)}
            className="flex-grow p-2 border border-gray-300 rounded-md"
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
            Search Cart
          </button>
        </form>
      </div>

      {/* Cart Details */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Cart Details</h3>
        {loading ? (
          <p>Loading cart...</p>
        ) : !cart ? (
          <p>No cart found for this user or no user ID provided.</p>
        ) : (
          <div>
            <p className="mb-2"><strong>Cart ID:</strong> {cart._id}</p>
            <p className="mb-4"><strong>User ID:</strong> {cart.userId}</p>
            {cart.items.length === 0 ? (
              <p>This cart is empty.</p>
            ) : (
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Product ID</th>
                    <th className="py-2 px-4 border-b">Quantity</th>
                    <th className="py-2 px-4 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.items.map((item) => (
                    <tr key={item.productId} className="border-b">
                      <td className="py-2 px-4">{item.productId}</td>
                      <td className="py-2 px-4">{item.quantity}</td>
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
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default CartManagement;