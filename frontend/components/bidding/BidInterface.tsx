// 'use client';

// export default function BidInterface() {
//   return (
//     <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col">
//       <h3 className="text-lg font-bold text-gray-900 mb-4">Place Your Bid</h3>

//       <form className="mb-8">
//         <div className="flex gap-4">
//           <div className="relative flex-1">
//             <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">
//               $
//             </span>
//             <input
//               type="number"
//               placeholder="Enter amout"
//               className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:right-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//             ></input>
//           </div>
//           <button
//             type="button"
//             className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
//           >
//             Bid
//           </button>
//         </div>
//         <p className="text-sm text-gray-500 mt-2">Minimum increment: $5</p>
//       </form>

//       {/* History Placeholder */}
//       <div className="flex-1">
//         <h3 className="text-lg font-bold text-gray-900 mb-4">Live Bid History</h3>
//         <div className="space-y-3">{/* Here will be map over real WebSocket data */}</div>
//       </div>
//     </div>
//   );
// }

'use client';
import { useState } from 'react';
import { useBidding } from '@/hooks/useBidding';

export default function BidInterface() {
  const { history, error, placeBid } = useBidding();
  const [amount, setAmount] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    // Pass the input amount as a number, plus a mock email for testing
    placeBid(Number(amount), 'reviewer@example.com');
    setAmount(''); // Clear the input field after clicking Bid
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Place Your Bid</h3>

      <form className="mb-8" onSubmit={handleSubmit}>
        <div className="flex gap-4">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">
              $
            </span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            Bid
          </button>
        </div>

        <div className="flex justify-between items-center mt-2">
          <p className="text-sm text-gray-500">Minimum increment: $5</p>
          {/* Display any validation errors sent back from the NestJS Gateway */}
          {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
        </div>
      </form>

      <div className="flex-1">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Live Bid History</h3>
        <div className="space-y-3">
          {history.length === 0 ? (
            <p className="text-gray-400 text-sm italic">No bids yet. Be the first!</p>
          ) : (
            history.map((bid, index) => (
              <div
                key={bid.id || index}
                className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-100 animate-fade-in-down"
              >
                <div>
                  <p className="font-semibold text-gray-900">${Number(bid.amount).toFixed(2)}</p>
                  <p className="text-xs text-gray-500">{bid.bidderEmail}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">
                    {new Date(bid.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
