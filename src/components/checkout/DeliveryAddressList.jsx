import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Plus, MapPin, Edit3, Trash2 } from 'lucide-react';

function DeliveryAddressList({ 
  addresses = [], 
  selectedAddressId, 
  onSelectAddress, 
  onAddNew, 
  onEdit, 
  onDelete 
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectAddress = async (addressId) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      onSelectAddress && onSelectAddress(addressId);
    } catch (error) {
      console.error('Error selecting address:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatAddress = (address) => {
    return `${address.streetAddress}, ${address.city}, ${address.state}`;
  };

  return (
    <div className="rounded-xl p-6 border border-[#2C2C2E]" style={{ backgroundColor: '#1F1F21' }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Delivery Address</h2>
        <Button 
          onClick={onAddNew}
          className="bg-primaryp-500 hover:bg-primaryp-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
        >
          <Plus size={16} />
          Add New
        </Button>
      </div>

      {/* Separator under heading row */}
      <Separator className="mb-6 bg-[#38383a]" />

      {addresses.length === 0 ? (
        <div className="text-center py-8">
          <MapPin className="w-12 h-12 text-neutralneutral-400 mx-auto mb-4" />
          <p className="text-neutralneutral-400 mb-4">No saved addresses found</p>
          <Button 
            onClick={onAddNew}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium"
          >
            Add Your First Address
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((address, index) => (
            <div key={address._id}>
              <div 
                className={`w-full p-5 rounded-xl border cursor-pointer transition-all ${
                  selectedAddressId === address._id 
                    ? 'bg-zinc-800 outline outline-1 outline-offset-[-1px] outline-rose-500' 
                    : 'border-[#2C2C2E] hover:border-neutralneutral-500 bg-zinc-800'
                }`}
                onClick={() => handleSelectAddress(address._id)}
              >
                <div className="flex items-start justify-between w-full">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-3">
                      <div 
                        className={`w-4 h-4 rounded-full border-2 ${
                          selectedAddressId === address._id 
                            ? 'border-[#FF5059] bg-[#FF5059]' 
                            : 'border-neutralneutral-400'
                        }`}
                      />
                      <h3 className="text-white font-medium">
                        {address.firstName} {address.lastName}
                      </h3>
                      {address.isDefault && (
                        <span className="bg-primaryp-500 text-white text-xs px-2 py-1 rounded">
                          Default
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-col justify-start items-start gap-3 flex-1 min-w-0">
                      <div className="flex justify-start items-center gap-1 w-full">
                        <div className="text-white text-base font-medium leading-normal flex-shrink-0">Name:</div>
                        <div className="text-white text-base font-normal leading-normal truncate">{address.firstName} {address.lastName}</div>
                      </div>
                      <div className="flex justify-start items-center gap-1 w-full">
                        <div className="text-white text-base font-medium leading-normal flex-shrink-0">Email:</div>
                        <div className="text-white text-base font-normal leading-normal truncate">{address.email}</div>
                      </div>
                      <div className="flex justify-start items-center gap-1 w-full">
                        <div className="text-white text-base font-medium leading-normal flex-shrink-0">Phone:</div>
                        <div className="text-white text-base font-normal leading-normal truncate">{address.areaNumber} {address.phoneNumber}</div>
                      </div>
                      <div className="flex justify-start items-center gap-1 w-full">
                        <div className="text-white text-base font-medium leading-normal flex-shrink-0">Address:</div>
                        <div className="text-white text-base font-normal leading-normal truncate">{formatAddress(address)}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit && onEdit(address);
                      }}
                      variant="ghost"
                      size="sm"
                      className="text-neutralneutral-300 hover:text-white p-2 hover:bg-neutralneutral-700"
                    >
                      <Edit3 size={18} />
                    </Button>
                    
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete && onDelete(address._id);
                      }}
                      variant="ghost"
                      size="sm"
                      className="text-neutralneutral-300 hover:text-red-500 p-2 hover:bg-neutralneutral-700"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </div>
              </div>
              
              {index < addresses.length - 1 && (
                <Separator className="my-4 bg-[#38383a]" />
              )}
            </div>
          ))}
          
          <div className="pt-4">
            <Button 
              disabled={!selectedAddressId || isLoading}
              className="w-full md:w-auto bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-medium disabled:opacity-50"
            >
              {isLoading ? 'Loading...' : 'Continue'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DeliveryAddressList; 