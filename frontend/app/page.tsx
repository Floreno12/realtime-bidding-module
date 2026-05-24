'use client';

import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/auth/AuthModal';
import ItemDisplay from '@/components/bidding/ItemDisplay';
import BidInterface from '@/components/bidding/BidInterface';

export default function Home() {
  const { userEmail, logout } = useAuth();

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {!userEmail && <AuthModal />}
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="flex flex-col sm:flex-row justify-between items-center bg-white p-6 rounded-xl shadow-sm gap-4 border border-gray-100 ">
          <h1 className="text-2xl font-bold text-gray-900">Vintage Watch Auction</h1>
          {userEmail && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Bidding as: <strong className="text-blue-600">{userEmail}</strong>
              </span>
              <button
                onClick={logout}
                className="text-sm text-red-600 hover:text-red-800 font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ItemDisplay />
          <BidInterface />
        </div>
      </div>
    </main>
  );
}
