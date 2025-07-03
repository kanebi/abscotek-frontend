import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';

function DeliveryAddressForm({ onSave, onCancel, showCancel = false, editingAddress = null }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    areaNumber: '+234',
    phoneNumber: '',
    streetAddress: '',
    city: '',
    state: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  // Pre-populate form when editing
  useEffect(() => {
    if (editingAddress) {
      setFormData({
        firstName: editingAddress.firstName || '',
        lastName: editingAddress.lastName || '',
        email: editingAddress.email || '',
        areaNumber: editingAddress.areaNumber || '+234',
        phoneNumber: editingAddress.phoneNumber || '',
        streetAddress: editingAddress.streetAddress || '',
        city: editingAddress.city || '',
        state: editingAddress.state || ''
      });
    }
  }, [editingAddress]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSave && onSave(formData);
    } catch (error) {
      console.error('Error saving address:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Desktop: Card with background, Mobile: No background */}
      <div className="hidden md:block rounded-xl p-6 border border-[#2C2C2E]" style={{ backgroundColor: '#1F1F21' }}>
        <h2 className="text-xl font-semibold text-white mb-6">
          {editingAddress ? 'Edit Address' : 'Delivery Address'}
        </h2>
        
        {/* Separator under heading */}
        <Separator className="mb-6 bg-[#38383a]" />
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* First Name and Last Name */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white text-base font-medium mb-2">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 bg-[#1F1F21] border border-[#2C2C2E] rounded-lg text-white focus:outline-none focus:border-primaryp-500 text-base"
              />
            </div>
            <div>
              <label className="block text-white text-base font-medium mb-2">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 bg-[#1F1F21] border border-[#2C2C2E] rounded-lg text-white focus:outline-none focus:border-primaryp-500 text-base"
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-white text-base font-medium mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2.5 bg-[#1F1F21] border border-[#2C2C2E] rounded-lg text-white focus:outline-none focus:border-primaryp-500 text-base"
            />
          </div>

          {/* Area Number and Phone Number */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-32">
              <label className="block text-white text-base font-medium mb-2 truncate">
                Area Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="areaNumber"
                value={formData.areaNumber}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2.5 bg-[#1F1F21] border border-[#2C2C2E] rounded-lg text-white focus:outline-none focus:border-primaryp-500 text-base text-center"
              />
            </div>
            <div className="flex-1">
              <label className="block text-white text-base font-medium mb-2 truncate">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 bg-[#1F1F21] border border-[#2C2C2E] rounded-lg text-white focus:outline-none focus:border-primaryp-500 text-base"
              />
            </div>
          </div>

          {/* Street Address */}
          <div>
            <label className="block text-white text-base font-medium mb-2">
              Street Address <span className="text-red-500">*</span>
            </label>
            <textarea
              name="streetAddress"
              value={formData.streetAddress}
              onChange={handleInputChange}
              required
              rows={2}
              className="w-full px-4 py-2.5 bg-[#1F1F21] border border-[#2C2C2E] rounded-lg text-white focus:outline-none focus:border-primaryp-500 resize-none text-base"
            />
            <p className="text-neutralneutral-400 text-sm mt-1">
              Detailed street address can help our rider find you quickly.
            </p>
          </div>

          {/* City and State */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white text-base font-medium mb-2">
                City <span className="text-red-500">*</span>
              </label>
              <select
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 bg-[#1F1F21] border border-[#2C2C2E] rounded-lg text-white focus:outline-none focus:border-primaryp-500 appearance-none text-base"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 12px center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '16px'
                }}
              >
                <option value="">Select City</option>
                <option value="lagos">Lagos</option>
                <option value="abuja">Abuja</option>
                <option value="port-harcourt">Port Harcourt</option>
                <option value="kano">Kano</option>
              </select>
            </div>
            <div>
              <label className="block text-white text-base font-medium mb-2">
                State <span className="text-red-500">*</span>
              </label>
              <select
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 bg-[#1F1F21] border border-[#2C2C2E] rounded-lg text-white focus:outline-none focus:border-primaryp-500 appearance-none text-base"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 12px center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '16px'
                }}
              >
                <option value="">Select State</option>
                <option value="lagos">Lagos</option>
                <option value="fct">FCT - Abuja</option>
                <option value="rivers">Rivers</option>
                <option value="kano">Kano</option>
              </select>
            </div>
          </div>
        </form>
      </div>

      {/* Mobile: No card background, direct on page */}
      <div className="md:hidden">
        <h2 className="text-xl font-semibold text-white mb-6">
          {editingAddress ? 'Edit Address' : 'Delivery Address'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* First Name and Last Name */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white text-base font-medium mb-2">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 bg-[#1F1F21] border border-[#2C2C2E] rounded-lg text-white focus:outline-none focus:border-primaryp-500 text-base"
              />
            </div>
            <div>
              <label className="block text-white text-base font-medium mb-2">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 bg-[#1F1F21] border border-[#2C2C2E] rounded-lg text-white focus:outline-none focus:border-primaryp-500 text-base"
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-white text-base font-medium mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2.5 bg-[#1F1F21] border border-[#2C2C2E] rounded-lg text-white focus:outline-none focus:border-primaryp-500 text-base"
            />
          </div>

          {/* Area Number and Phone Number */}
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-3">
              <label className="block text-white text-base font-medium mb-2 truncate">
                Area Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="areaNumber"
                value={formData.areaNumber}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2.5 bg-[#1F1F21] border border-[#2C2C2E] rounded-lg text-white focus:outline-none focus:border-primaryp-500 text-base text-center"
              />
            </div>
            <div className="col-span-9">
              <label className="block text-white text-base font-medium mb-2 truncate">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 bg-[#1F1F21] border border-[#2C2C2E] rounded-lg text-white focus:outline-none focus:border-primaryp-500 text-base"
              />
            </div>
          </div>

          {/* Street Address */}
          <div>
            <label className="block text-white text-base font-medium mb-2">
              Street Address <span className="text-red-500">*</span>
            </label>
            <textarea
              name="streetAddress"
              value={formData.streetAddress}
              onChange={handleInputChange}
              required
              rows={2}
              className="w-full px-4 py-2.5 bg-[#1F1F21] border border-[#2C2C2E] rounded-lg text-white focus:outline-none focus:border-primaryp-500 resize-none text-base"
            />
            <p className="text-neutralneutral-400 text-sm mt-1">
              Detailed street address can help our rider find you quickly.
            </p>
          </div>

          {/* City and State */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white text-base font-medium mb-2">
                City <span className="text-red-500">*</span>
              </label>
              <select
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 bg-[#1F1F21] border border-[#2C2C2E] rounded-lg text-white focus:outline-none focus:border-primaryp-500 appearance-none text-base"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 12px center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '16px'
                }}
              >
                <option value="">Select City</option>
                <option value="lagos">Lagos</option>
                <option value="abuja">Abuja</option>
                <option value="port-harcourt">Port Harcourt</option>
                <option value="kano">Kano</option>
              </select>
            </div>
            <div>
              <label className="block text-white text-base font-medium mb-2">
                State <span className="text-red-500">*</span>
              </label>
              <select
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 bg-[#1F1F21] border border-[#2C2C2E] rounded-lg text-white focus:outline-none focus:border-primaryp-500 appearance-none text-base"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 12px center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '16px'
                }}
              >
                <option value="">Select State</option>
                <option value="lagos">Lagos</option>
                <option value="fct">FCT - Abuja</option>
                <option value="rivers">Rivers</option>
                <option value="kano">Kano</option>
              </select>
            </div>
          </div>
        </form>
      </div>

      {/* Action Buttons - Outside Card */}
      <div className="flex flex-col gap-4 pt-6 px-0 md:px-2">
        <Button 
          type="submit" 
          disabled={isLoading}
          onClick={handleSubmit}
          className="w-full bg-red-500 hover:bg-red-600 text-white px-12 py-3 rounded-lg font-medium disabled:opacity-50 text-base"
        >
          {isLoading ? 'Saving...' : 'Continue'}
        </Button>
        
        {showCancel && (
          <Button 
            type="button" 
            onClick={onCancel}
            variant="outline"
            className="w-full bg-neutralneutral-800 border-[0.5] border-[#FF5059] text-white hover:bg-neutralneutral-900 hover:border-neutralneutral-500 px-12 py-3 rounded-lg font-medium text-base"
          >
            Cancel
          </Button>
        )}
      </div>
    </>
  );
}

export default DeliveryAddressForm; 