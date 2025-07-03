import React, { useState, useEffect } from 'react';
import deliveryMethodService from '../../services/deliveryMethodService';
import Layout from '../../components/Layout';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import AmountCurrency from '../../components/ui/AmountCurrency';
import { Truck, Plus, Edit, Trash2, Clock, MapPin } from 'lucide-react';

function DeliveryMethodManagement() {
  const [deliveryMethods, setDeliveryMethods] = useState([]);
  const [newDeliveryMethod, setNewDeliveryMethod] = useState({ 
    name: '', 
    description: '', 
    price: '', 
    estimatedDeliveryTime: '' 
  });
  const [editingDeliveryMethod, setEditingDeliveryMethod] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeliveryMethods();
  }, []);

  const clearMessages = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const fetchDeliveryMethods = async () => {
    clearMessages();
    setLoading(true);
    try {
      const data = await deliveryMethodService.getAllDeliveryMethods();
      setDeliveryMethods(data);
    } catch (error) {
      console.error('Error fetching delivery methods:', error);
      setErrorMessage('Failed to fetch delivery methods.');
    } finally {
      setLoading(false);
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
    <Layout>
      <div className="w-[86%] mx-auto py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-warningw-100/10 rounded-full flex items-center justify-center">
              <Truck size={24} className="text-warningw-400" />
            </div>
            <div>
              <h1 className="text-3xl font-heading-header-2-header-2-bold text-white">
                Delivery Method Management
              </h1>
              <p className="text-neutralneutral-400">Configure shipping and delivery options</p>
            </div>
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

          {/* Create New Delivery Method Form */}
          <Card className="p-6 mb-6">
            <div className="flex items-center gap-2 mb-6">
              <Plus size={20} className="text-primaryp-400" />
              <h2 className="text-xl font-heading-header-3-header-3-bold text-white">
                Create New Delivery Method
              </h2>
            </div>
            
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Method Name"
                  value={newDeliveryMethod.name}
                  onChange={(e) => setNewDeliveryMethod({ ...newDeliveryMethod, name: e.target.value })}
                  className="p-3 bg-neutralneutral-800 border border-neutralneutral-600 rounded-lg text-white placeholder-neutralneutral-400"
                  required
                />
                <input
                  type="number"
                  placeholder="Price (USDT)"
                  value={newDeliveryMethod.price}
                  onChange={(e) => setNewDeliveryMethod({ ...newDeliveryMethod, price: e.target.value })}
                  className="p-3 bg-neutralneutral-800 border border-neutralneutral-600 rounded-lg text-white placeholder-neutralneutral-400"
                  required
                />
              </div>
              
              <textarea
                placeholder="Description"
                value={newDeliveryMethod.description}
                onChange={(e) => setNewDeliveryMethod({ ...newDeliveryMethod, description: e.target.value })}
                className="w-full p-3 bg-neutralneutral-800 border border-neutralneutral-600 rounded-lg text-white placeholder-neutralneutral-400"
                rows="3"
              />
              
              <input
                type="text"
                placeholder="Estimated Delivery Time (e.g., 3-5 business days)"
                value={newDeliveryMethod.estimatedDeliveryTime}
                onChange={(e) => setNewDeliveryMethod({ ...newDeliveryMethod, estimatedDeliveryTime: e.target.value })}
                className="w-full p-3 bg-neutralneutral-800 border border-neutralneutral-600 rounded-lg text-white placeholder-neutralneutral-400"
              />
              
              <Button type="submit" className="bg-warningw-500 hover:bg-warningw-400">
                <Plus size={16} className="mr-2" />
                Add Delivery Method
              </Button>
            </form>
          </Card>

          {/* Edit Delivery Method Form */}
          {editingDeliveryMethod && (
            <Card className="p-6 mb-6 border-warningw-400">
              <div className="flex items-center gap-2 mb-6">
                <Edit size={20} className="text-warningw-400" />
                <h2 className="text-xl font-heading-header-3-header-3-bold text-white">
                  Edit Delivery Method
                </h2>
              </div>
              
              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Method Name"
                    value={editingDeliveryMethod.name}
                    onChange={(e) => setEditingDeliveryMethod({ ...editingDeliveryMethod, name: e.target.value })}
                    className="p-3 bg-neutralneutral-800 border border-neutralneutral-600 rounded-lg text-white placeholder-neutralneutral-400"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Price (USDT)"
                    value={editingDeliveryMethod.price}
                    onChange={(e) => setEditingDeliveryMethod({ ...editingDeliveryMethod, price: e.target.value })}
                    className="p-3 bg-neutralneutral-800 border border-neutralneutral-600 rounded-lg text-white placeholder-neutralneutral-400"
                    required
                  />
                </div>
                
                <textarea
                  placeholder="Description"
                  value={editingDeliveryMethod.description}
                  onChange={(e) => setEditingDeliveryMethod({ ...editingDeliveryMethod, description: e.target.value })}
                  className="w-full p-3 bg-neutralneutral-800 border border-neutralneutral-600 rounded-lg text-white placeholder-neutralneutral-400"
                  rows="3"
                />
                
                <input
                  type="text"
                  placeholder="Estimated Delivery Time"
                  value={editingDeliveryMethod.estimatedDeliveryTime}
                  onChange={(e) => setEditingDeliveryMethod({ ...editingDeliveryMethod, estimatedDeliveryTime: e.target.value })}
                  className="w-full p-3 bg-neutralneutral-800 border border-neutralneutral-600 rounded-lg text-white placeholder-neutralneutral-400"
                />
                
                <div className="flex gap-4">
                  <Button type="submit" className="bg-warningw-500 hover:bg-warningw-400">
                    <Edit size={16} className="mr-2" />
                    Update Delivery Method
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => setEditingDeliveryMethod(null)}
                    variant="outline"
                    className="border-neutralneutral-600 text-neutralneutral-300"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Delivery Methods List */}
          <Card className="p-6">
            <h2 className="text-xl font-heading-header-3-header-3-bold text-white mb-6">
              Delivery Methods ({deliveryMethods.length})
            </h2>

            {loading ? (
              <div className="text-center py-8 text-neutralneutral-400">Loading delivery methods...</div>
            ) : deliveryMethods.length === 0 ? (
              <div className="text-center py-8">
                <Truck size={48} className="text-neutralneutral-500 mx-auto mb-3" />
                <p className="text-neutralneutral-400">No delivery methods found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {deliveryMethods.map((method) => (
                  <div key={method._id} className="p-4 bg-neutralneutral-800 rounded-lg">
                    <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                      {/* Method Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-warningw-100/10 rounded-full flex items-center justify-center">
                            <Truck size={20} className="text-warningw-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-body-large-large-bold text-white">
                              {method.name}
                            </h3>
                            <p className="text-primaryp-400 font-body-base-base-bold">
                              <AmountCurrency amount={method.price} fromCurrency="USDT" />
                            </p>
                          </div>
                        </div>
                        
                        {method.description && (
                          <p className="text-neutralneutral-300 text-sm mb-3 max-w-2xl">
                            {method.description}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-4 text-sm text-neutralneutral-400">
                          {method.estimatedDeliveryTime && (
                            <div className="flex items-center gap-2">
                              <Clock size={14} />
                              <span>{method.estimatedDeliveryTime}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          onClick={() => setEditingDeliveryMethod(method)}
                          size="sm"
                          className="bg-warningw-500 hover:bg-warningw-400"
                        >
                          <Edit size={14} className="mr-1" />
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDelete(method._id)}
                          size="sm"
                          className="bg-dangerd-500 hover:bg-dangerd-400"
                        >
                          <Trash2 size={14} className="mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
}

export default DeliveryMethodManagement;