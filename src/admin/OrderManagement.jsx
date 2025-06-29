import React, { useState, useEffect } from 'react';
import orderService from '../services/orderService';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';

function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [newOrder, setNewOrder] = useState({ productId: '' }); // Assuming a simple order creation for now
  const [editingOrder, setEditingOrder] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const clearMessages = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const fetchOrders = async () => {
    clearMessages();
    setLoading(true);
    try {
      const data = await orderService.getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setErrorMessage('Failed to fetch orders.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    clearMessages();
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await orderService.deleteOrder(id);
        fetchOrders();
        setSuccessMessage('Order deleted successfully!');
      } catch (error) {
        console.error('Error deleting order:', error);
        setErrorMessage('Failed to delete order.');
      }
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    clearMessages();
    try {
      await orderService.createOrder(newOrder);
      setNewOrder({ productId: '' });
      fetchOrders();
      setSuccessMessage('Order created successfully!');
    } catch (error) {
      console.error('Error creating order:', error);
      setErrorMessage('Failed to create order.');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    clearMessages();
    try {
      await orderService.updateOrder(editingOrder._id, editingOrder);
      setEditingOrder(null);
      fetchOrders();
      setSuccessMessage('Order updated successfully!');
    } catch (error) {
      console.error('Error updating order:', error);
      setErrorMessage('Failed to update order.');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Order Management</h2>

      <ErrorMessage message={errorMessage} />
      <SuccessMessage message={successMessage} />

      {/* Create New Order Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-4">Create New Order</h3>
        <form onSubmit={handleCreate} className="space-y-4">
          <input
            type="text"
            placeholder="Product ID (for simple order)"
            value={newOrder.productId}
            onChange={(e) => setNewOrder({ ...newOrder, productId: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
            Add Order
          </button>
        </form>
      </div>

      {/* Edit Order Form */}
      {editingOrder && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-semibold mb-4">Edit Order</h3>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">User ID:</label>
              <input
                type="text"
                value={editingOrder.userId}
                onChange={(e) => setEditingOrder({ ...editingOrder, userId: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Total:</label>
              <input
                type="number"
                value={editingOrder.total}
                onChange={(e) => setEditingOrder({ ...editingOrder, total: parseFloat(e.target.value) })}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Status:</label>
              <input
                type="text"
                value={editingOrder.status}
                onChange={(e) => setEditingOrder({ ...editingOrder, status: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mr-2">
              Update Order
            </button>
            <button type="button" onClick={() => setEditingOrder(null)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400">
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Existing Orders</h3>
        {loading ? (
          <p>Loading orders...</p>
        ) : orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Order ID</th>
                <th className="py-2 px-4 border-b">User ID</th>
                <th className="py-2 px-4 border-b">Total</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b">
                  <td className="py-2 px-4">{order._id}</td>
                  <td className="py-2 px-4">{order.userId}</td>
                  <td className="py-2 px-4">${order.total.toFixed(2)}</td>
                  <td className="py-2 px-4">{order.status}</td>
                  <td className="py-2 px-4 flex space-x-2">
                    <button
                      onClick={() => setEditingOrder(order)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(order._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default OrderManagement;