import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { env } from '../../config/env';

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
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [stateSuggestions, setStateSuggestions] = useState([]);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [showStateSuggestions, setShowStateSuggestions] = useState(false);

  const cityInputRef = useRef(null);
  const stateInputRef = useRef(null);

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

    // Handle autocomplete for city and state
    if (name === 'city') {
      handleCityInput(value);
    } else if (name === 'state') {
      handleStateInput(value);
    }
  };

  // Google Places API integration
  const loadGooglePlacesScript = () => {
    if (window.google && window.google.maps && window.google.maps.places) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      if (document.querySelector('script[src*="maps.googleapis.com"]')) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${env.GOOGLE_PLACES_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  const handleCityInput = async (value) => {
    if (!value.trim()) {
      setCitySuggestions([]);
      setShowCitySuggestions(false);
      return;
    }

    try {
      await loadGooglePlacesScript();

      const service = new window.google.maps.places.AutocompleteService();
      service.getPlacePredictions(
        {
          input: value,
          types: ['(cities)'],
          componentRestrictions: { country: 'ng' } // Restrict to Nigeria
        },
        (predictions, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            const cities = predictions.map(prediction => ({
              description: prediction.description,
              placeId: prediction.place_id
            }));
            setCitySuggestions(cities);
            setShowCitySuggestions(true);
          } else {
            setCitySuggestions([]);
            setShowCitySuggestions(false);
          }
        }
      );
    } catch (error) {
      // Load failed
      setCitySuggestions([]);
      setShowCitySuggestions(false);
    }
  };

  const handleStateInput = async (value) => {
    if (!value.trim()) {
      setStateSuggestions([]);
      setShowStateSuggestions(false);
      return;
    }

    try {
      await loadGooglePlacesScript();

      const service = new window.google.maps.places.AutocompleteService();
      service.getPlacePredictions(
        {
          input: value,
          types: ['administrative_area_level_1'],
          componentRestrictions: { country: 'ng' } // Restrict to Nigeria
        },
        (predictions, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            const states = predictions.map(prediction => ({
              description: prediction.description,
              placeId: prediction.place_id
            }));
            setStateSuggestions(states);
            setShowStateSuggestions(true);
          } else {
            setStateSuggestions([]);
            setShowStateSuggestions(false);
          }
        }
      );
    } catch (error) {
      // Load failed
      setStateSuggestions([]);
      setShowStateSuggestions(false);
    }
  };

  const handleCitySelect = (suggestion) => {
    setFormData(prev => ({
      ...prev,
      city: suggestion.description
    }));
    setCitySuggestions([]);
    setShowCitySuggestions(false);
  };

  const handleStateSelect = (suggestion) => {
    setFormData(prev => ({
      ...prev,
      state: suggestion.description
    }));
    setStateSuggestions([]);
    setShowStateSuggestions(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Call the real API through the parent component
      await onSave(formData);
    } catch (error) {
      // Save failed
      // Handle error (could add error state/toast here)
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
            <div className="relative">
              <label className="block text-white text-base font-medium mb-2">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                onFocus={() => formData.city && setShowCitySuggestions(true)}
                onBlur={() => setTimeout(() => setShowCitySuggestions(false), 200)}
                ref={cityInputRef}
                required
                placeholder="Start typing city name..."
                className="w-full px-4 py-2.5 bg-[#1F1F21] border border-[#2C2C2E] rounded-lg text-white focus:outline-none focus:border-primaryp-500 text-base"
              />
              {showCitySuggestions && citySuggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-[#1F1F21] border border-[#2C2C2E] rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {citySuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-[#2C2C2E] cursor-pointer text-white text-sm"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleCitySelect(suggestion);
                      }}
                    >
                      {suggestion.description}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="relative">
              <label className="block text-white text-base font-medium mb-2">
                State <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                onFocus={() => formData.state && setShowStateSuggestions(true)}
                onBlur={() => setTimeout(() => setShowStateSuggestions(false), 200)}
                ref={stateInputRef}
                required
                placeholder="Start typing state name..."
                className="w-full px-4 py-2.5 bg-[#1F1F21] border border-[#2C2C2E] rounded-lg text-white focus:outline-none focus:border-primaryp-500 text-base"
              />
              {showStateSuggestions && stateSuggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-[#1F1F21] border border-[#2C2C2E] rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {stateSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-[#2C2C2E] cursor-pointer text-white text-sm"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleStateSelect(suggestion);
                      }}
                    >
                      {suggestion.description}
                    </div>
                  ))}
                </div>
              )}
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
            <div className="relative">
              <label className="block text-white text-base font-medium mb-2">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                onFocus={() => formData.city && setShowCitySuggestions(true)}
                onBlur={() => setTimeout(() => setShowCitySuggestions(false), 200)}
                ref={cityInputRef}
                required
                placeholder="Start typing city name..."
                className="w-full px-4 py-2.5 bg-[#1F1F21] border border-[#2C2C2E] rounded-lg text-white focus:outline-none focus:border-primaryp-500 text-base"
              />
              {showCitySuggestions && citySuggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-[#1F1F21] border border-[#2C2C2E] rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {citySuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-[#2C2C2E] cursor-pointer text-white text-sm"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleCitySelect(suggestion);
                      }}
                    >
                      {suggestion.description}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="relative">
              <label className="block text-white text-base font-medium mb-2">
                State <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                onFocus={() => formData.state && setShowStateSuggestions(true)}
                onBlur={() => setTimeout(() => setShowStateSuggestions(false), 200)}
                ref={stateInputRef}
                required
                placeholder="Start typing state name..."
                className="w-full px-4 py-2.5 bg-[#1F1F21] border border-[#2C2C2E] rounded-lg text-white focus:outline-none focus:border-primaryp-500 text-base"
              />
              {showStateSuggestions && stateSuggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-[#1F1F21] border border-[#2C2C2E] rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {stateSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-[#2C2C2E] cursor-pointer text-white text-sm"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleStateSelect(suggestion);
                      }}
                    >
                      {suggestion.description}
                    </div>
                  ))}
                </div>
              )}
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