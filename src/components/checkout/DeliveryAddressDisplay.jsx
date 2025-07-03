import React from 'react';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Edit3, Plus } from 'lucide-react';

function DeliveryAddressDisplay({ address, onEdit, onAddNew }) {
  if (!address) {
    return null;
  }

  const formatAddress = (addr) => {
    return `${addr.streetAddress}, ${addr.city}, ${addr.state}`;
  };

  return (
    <div className="rounded-xl p-6 border border-[#2C2C2E]" style={{ backgroundColor: '#1F1F21' }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Delivery Address</h2>
        <Button
          onClick={onAddNew}
          variant="ghost"
          size="sm"
          className="text-neutralneutral-300 hover:text-white p-2 hover:bg-neutralneutral-700"
        >
          <Plus size={20} />
        </Button>
      </div>
      
      <Separator className="mb-6 bg-[#38383a]" />
      
      <div className="w-full p-5 bg-zinc-800 rounded-xl outline outline-1 outline-offset-[-1px] outline-rose-500 flex justify-between items-start">
        <div className="flex-1 flex justify-between items-start min-w-0">
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
              <div className="text-white text-base font-normal leading-normal truncate">{address.areaNumber}{address.phoneNumber}</div>
            </div>
            <div className="flex justify-start items-center gap-1 w-full">
              <div className="text-white text-base font-medium leading-normal flex-shrink-0">Address:</div>
              <div className="text-white text-base font-normal leading-normal truncate">{formatAddress(address)}</div>
            </div>
          </div>
          <div className="w-6 h-6 relative overflow-hidden cursor-pointer" onClick={onEdit}>
            <Edit3 size={20} className="text-neutralneutral-300 hover:text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeliveryAddressDisplay; 