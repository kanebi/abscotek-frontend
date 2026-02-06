import React from 'react';

const CurrencySelection = ({ selectedCurrency, onCurrencyChange, className = "" }) => {
  // Only support currencies compatible with Ethereum network (Alchemy setup)
  const currencies = [
    { code: 'USDT', name: 'USDT (Crypto)', type: 'crypto' },
    { code: 'USD', name: 'USD (Card/Bank)', type: 'fiat' },
    { code: 'NGN', name: 'NGN (Card/Bank)', type: 'fiat' }
  ];

  return (
    <div className={`rounded-xl p-6 border border-[#2C2C2E] ${className}`} style={{ backgroundColor: '#1F1F21' }}>
      <h3 className="text-xl font-semibold text-white mb-6">Select Currency</h3>
      <div className="space-y-4">
        {currencies.map((currency) => (
          <div 
            key={currency.code}
            className={`p-4 rounded-lg border cursor-pointer transition-all ${
              selectedCurrency === currency.code 
                ? 'bg-primaryp-500/10' 
                : 'border-[#2C2C2E] hover:border-neutral-500'
            }`}
            style={selectedCurrency === currency.code ? { 
              border: '1px solid var(--Primary-P300, #FF5059)', 
              backgroundColor: '#2A2A2C' 
            } : { 
              backgroundColor: '#2A2A2C' 
            }}
            onClick={() => onCurrencyChange(currency.code)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div 
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedCurrency === currency.code 
                      ? 'border-[#FF5059] bg-[#FF5059]' 
                      : 'border-neutral-400'
                  }`}
                >
                  {selectedCurrency === currency.code && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-white font-medium">{currency.name}</div>
                  <div className="text-neutral-400 text-sm">
                    {currency.type === 'crypto' 
                      ? 'Pay from wallet'
                      : 'Pay with card or bank transfer via Paystack'
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CurrencySelection;
