import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Search } from 'lucide-react';

export default function EmptyProducts({
  title = 'No products found',
  description = 'Try adjusting your filters or search to find what you are looking for.',
  primaryActionLabel = 'Clear filters',
  onPrimaryAction,
  secondaryActionLabel = 'Back to Home',
  onSecondaryAction,
}) {
  return (
    <Card className="w-full flex flex-col items-center justify-center gap-4 bg-neutralneutral-800 border-neutralneutral-700 py-12">
      <div className="w-16 h-16 rounded-full bg-neutralneutral-700 flex items-center justify-center">
        <Search className="text-neutralneutral-300" size={24} />
      </div>
      <h3 className="text-white text-xl font-semibold">{title}</h3>
      <p className="text-neutralneutral-400 text-sm text-center max-w-md">{description}</p>
      <div className="flex items-center gap-3 mt-2">
        {onPrimaryAction && (
          <Button onClick={onPrimaryAction} className="bg-primaryp-500 hover:bg-primaryp-400 text-white">
            {primaryActionLabel}
          </Button>
        )}
        {onSecondaryAction && (
          <Button variant="outline" onClick={onSecondaryAction} className="border-neutralneutral-600 text-neutralneutral-300 hover:bg-neutralneutral-700 hover:text-white">
            {secondaryActionLabel}
          </Button>
        )}
      </div>
    </Card>
  );
}