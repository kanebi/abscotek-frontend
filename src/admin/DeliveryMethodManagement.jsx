import React, { useState, useEffect } from 'react';
import deliveryMethodService from '../services/deliveryMethodService';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';

function DeliveryMethodManagement() {
  const [deliveryMethods, setDeliveryMethods] = useState([]);
  const [newDeliveryMethod, setNewDeliveryMethod] = useState({ name: '', description: '', price: '', estimatedDeliveryTime: '' });
  const [editingDeliveryMethod, setEditingDeliveryMethod] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    fetchDeliveryMethods();
  }, []);

  const clearMessages = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const fetchDeliveryMethods = async () => {
    clearMessages();
    try {
      const data = await deliveryMethodService.getAllDeliveryMethods();
      setDeliveryMethods(data);
    } catch (error) {
      console.error('Error fetching delivery methods:', error);
      setErrorMessage('Failed to fetch delivery methods.');
    }
  };

  const handleDelete = async (id) => {
    clearMessages();
    if (window.confirm('Are you sure you want to delete this delivery method?')) {
      try {
        await deliveryMethodService.deleteDeliveryMethod(id);
        fetchDeliveryMethods();
        setSuccessMessage('Delivery method deleted successfully!');
      } catch (error) {
        console.error('Error deleting delivery method:', error);
        setErrorMessage('Failed to delete delivery method.');
      }
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    clearMessages();
    try {
      await deliveryMethodService.createDeliveryMethod(newDeliveryMethod);
      setNewDeliveryMethod({ name: '', description: '', price: '', estimatedDeliveryTime: '' });
      fetchDeliveryMethods();
      setSuccessMessage('Delivery method created successfully!');
    } catch (error) {
      console.error('Error creating delivery method:', error);
      setErrorMessage('Failed to create delivery method.');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    clearMessages();
    try {
      await deliveryMethodService.updateDeliveryMethod(editingDeliveryMethod._id, editingDeliveryMethod);
      setEditingDeliveryMethod(null);
      fetchDeliveryMethods();
      setSuccessMessage('Delivery method updated successfully!');
    } catch (error) {
      console.error('Error updating delivery method:', error);
      setErrorMessage('Failed to update delivery method.');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Delivery Method Management</h2>

      <ErrorMessage message={errorMessage} />
      <SuccessMessage message={successMessage} />

      {/* Create New Delivery Method Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-4">Create New Delivery Method</h3>
        <form onSubmit={handleCreate} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={newDeliveryMethod.name}
            onChange={(e) => setNewDeliveryMethod({ ...newDeliveryMethod, name: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
          <textarea
            placeholder="Description"
            value={newDeliveryMethod.description}
            onChange={(e) => setNewDeliveryMethod({ ...newDeliveryMethod, description: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md"
            rows="3"
          ></textarea>
          <input
            type="number"
            placeholder="Price"
            value={newDeliveryMethod.price}
            onChange={(e) => setNewDeliveryMethod({ ...newDeliveryMethod, price: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
          <input
            type="text"
            placeholder="Estimated Delivery Time"
            value={newDeliveryMethod.estimatedDeliveryTime}
            onChange={(e) => setNewDeliveryMethod({ ...newDeliveryMethod, estimatedDeliveryTime: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
            Add Delivery Method
          </button>
        </form>
      </div>

      {/* Edit Delivery Method Form */}
      {editingDeliveryMethod && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-semibold mb-4">Edit Delivery Method</h3>
          <form onSubmit={handleUpdate} className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              value={editingDeliveryMethod.name}
              onChange={(e) => setEditingDeliveryMethod({ ...editingDeliveryMethod, name: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
            <textarea
              placeholder="Description"
              value={editingDeliveryMethod.description}
              onChange={(e) => setEditingDeliveryMethod({ ...editingDeliveryMethod, description: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md"
              rows="3"
            ></textarea>
            <input
              type="number"
              placeholder="Price"
              value={editingDeliveryMethod.price}
              onChange={(e) => setEditingDeliveryMethod({ ...editingDeliveryMethod, price: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
            <input
              type="text"
              placeholder="Estimated Delivery Time"
              value={editingDeliveryMethod.estimatedDeliveryTime}
              onChange={(e) => setEditingDeliveryMethod({ ...editingDeliveryMethod, estimatedDeliveryTime: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mr-2">
              Update Delivery Method
            </button>
            <button type="button" onClick={() => setEditingDeliveryMethod(null)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400">
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* Delivery Methods Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Existing Delivery Methods</h3>
        {deliveryMethods.length === 0 ? (
          <p>No delivery methods found.</p>
        ) : (
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Description</th>
                <th className="py-2 px-4 border-b">Price</th>
                <th className="py-2 px-4 border-b">Estimated Time</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {deliveryMethods.map((method) => (
                <tr key={method._id} className="border-b">
                  <td className="py-2 px-4">{method.name}</td>
                  <td className="py-2 px-4">{method.description}</td>
                  <td className="py-2 px-4">${method.price.toFixed(2)}</td>
                  <td className="py-2 px-4">{method.estimatedDeliveryTime}</td>
                  <td className="py-2 px-4 flex space-x-2">
                    <button
                      onClick={() => setEditingDeliveryMethod(method)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(method._id)}
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

export default DeliveryMethodManagement;