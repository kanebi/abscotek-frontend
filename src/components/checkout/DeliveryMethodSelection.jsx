import React from 'react';
import { Separator } from '../ui/separator';
import DeliveryPriceDisplay from './DeliveryPriceDisplay';

// Default frontend delivery methods
const defaultDeliveryMethods = [
  {
    id: 'lagos',
    name: 'Lagos: 1-2 days',
    price: 5000,
    currency: 'NGN'
  },
  {
    id: 'other-state',
    name: 'Other State: 3-5 days',
    price: 10000,
    currency: 'NGN'
  }
];

function DeliveryMethodSelection({ 
  selectedMethod, 
  onMethodChange, 
  methods = defaultDeliveryMethods // Allow passing methods from parent
}) {
  const handleMethodSelect = (methodId) => {
    const method = methods.find(m => m.id === methodId);
    onMethodChange && onMethodChange(method);
  };

  return (
    <div className="rounded-xl p-6 border border-[#2C2C2E]" style={{ backgroundColor: '#1F1F21' }}>
      <h2 className="text-xl font-semibold text-white mb-6">Delivery Method</h2>
      <Separator className="mb-6 bg-[#38383a]" />
      
      <div className="space-y-4">
        {methods.map((method) => (
          <div 
            key={method.id}
            className={`p-4 rounded-lg border cursor-pointer transition-all ${
              selectedMethod?.id === method.id 
                ? 'bg-primaryp-500/10' 
                : 'border-[#2C2C2E] hover:border-neutralneutral-500'
            }`}
            style={selectedMethod?.id === method.id ? { 
              border: '1px solid var(--Primary-P300, #FF5059)', 
              backgroundColor: '#2A2A2C' 
            } : { 
              backgroundColor: '#2A2A2C' 
            }}
            onClick={() => handleMethodSelect(method.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div 
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedMethod?.id === method.id 
                      ? 'border-[#FF5059] bg-[#FF5059]' 
                      : 'border-neutralneutral-400'
                  }`}
                >
                  {selectedMethod?.id === method.id && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
                <span className="text-white font-medium">{method.name}</span>
              </div>
              <span className="text-white font-medium">
                <DeliveryPriceDisplay price={method.price} currency={method.currency || 'NGN'} />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DeliveryMethodSelection; 