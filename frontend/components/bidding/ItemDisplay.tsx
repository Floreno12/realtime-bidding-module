'use client';

import { useBidding } from '@/hooks/useBidding';

export default function ItemDisplay() {
  const { currentHighest, isConnected } = useBidding();

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
      <div className="w-64 h-64 bg-gray-100 rounded-full mb-6 flex items-center justify-center overflow-hidden border-4 border-gray-50 ">
        <span className="text-gray-400 text-sm">Image here</span>
        <div className={`absolute top-4 right-4 w-3 h-3 rounded-full`}>
          ${isConnected ? 'bg-green-500' : 'bg-red-500'}{' '}
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-2">Vintage Rolex Day-Date "Rresident"</h2>
      <p className="text-gray-500 mb-6 max-w-sm">
        An iconic 1980s reference featuring the signature day and date complications. Housed in a
        classic 36mm case with a fluted bezed, this legendary timepiece represents the pinnacle of
        vintage luxury and horological history.
      </p>
      <div className="w-full grid grid-cols-2 gap-4 border-t border-gray-100 pt-6">
        <div className="text-left">
          <p className="text-sm text-gray-500 font-medium">Starting Price</p>
          <p className="text-xl font-semibold text-gray-900">$50.00</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500 font-medium"> Current Highest Bid</p>
          <p className="text-2xl font-bold text-green-600">${currentHighest.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
