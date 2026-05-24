'use client';

import { useState } from 'react';
import { useBidding } from '@/hooks/useBidding';

export default function BidInterface() {
  const { history, error, placeBid } = useBidding();
  const [amount, setAmount] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    placeBid(Number(amount), 'reviewer@example.com');
    setAmount('');
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-lg flex flex-col h-full overflow-hidden">
      <div className="bg-gray-50 border-b border-gray-100 p-6">
        <h3 className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1">
          Action Desk
        </h3>
        <h2 className="text-xl font-black text-gray-900 tracking-tight">Place Your Bid</h2>
      </div>

      <div className="p-6 flex flex-col grow">
        {/* Bid Form */}
        <form className="mb-8" onSubmit={handleSubmit}>
          <div className="flex gap-3">
            <div className="relative flex-1 group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-lg transition-colors group-focus-within:text-gray-900">
                $
              </span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-8 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-lg font-semibold text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all shadow-sm"
              />
            </div>
            <button
              type="submit"
              disabled={!amount}
              className="bg-gray-900 hover:bg-black disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold uppercase tracking-wider text-sm px-8 py-3.5 rounded-xl shadow-md hover:shadow-xl transition-all active:scale-95 flex items-center justify-center"
            >
              Bid Now
            </button>
          </div>

          <div className="flex justify-between items-start mt-3 min-h-6">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
              Min. increment: <span className="text-gray-900 font-bold">$5.00</span>
            </p>
            {error && (
              <p className="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded border border-red-100 animate-pulse">
                {error}
              </p>
            )}
          </div>
        </form>

        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-end mb-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              Live Bid History
            </h3>
            <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              {history.length} Bids
            </span>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-87.5  pr-2">
            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <p className="text-gray-400 text-sm font-medium">No bids have been placed yet.</p>
                <p className="text-gray-500 text-xs mt-1">Be the first to start the auction</p>
              </div>
            ) : (
              history.map((bid, index) => {
                const isWinning = index === 0;
                const initial = bid.bidderEmail ? bid.bidderEmail.charAt(0).toUpperCase() : '?';

                return (
                  <div
                    key={bid.id || index}
                    className={`group flex items-center p-4 rounded-xl border transition-all duration-500 ${
                      isWinning
                        ? 'bg-linear-to-r from-gray-900 to-gray-800 border-gray-900 shadow-md transform scale-[1.02] '
                        : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 mr-4 shadow-inner ${
                        isWinning
                          ? 'bg-amber-400 text-gray-900'
                          : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
                      }`}
                    >
                      {initial}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <p
                          className={`font-black text-lg truncate ${isWinning ? 'text-white' : 'text-gray-900'}`}
                        >
                          ${Number(bid.amount).toFixed(2)}
                        </p>
                        {isWinning && (
                          <span className="ml-2 text-[10px] font-bold tracking-widest uppercase bg-amber-400 text-gray-900 px-2 py-0.5 rounded-sm shadow-sm">
                            Winning
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-xs truncate ${isWinning ? 'text-gray-400' : 'text-gray-500'}`}
                      >
                        {bid.bidderEmail}
                      </p>
                    </div>

                    <div className="text-right pl-4">
                      <p
                        className={`text-[10px] font-bold uppercase tracking-wider ${isWinning ? 'text-gray-500' : 'text-gray-400'}`}
                      >
                        {new Date(bid.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
