'use client';

import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/auth/AuthModal';
import ItemDisplay from '@/components/bidding/ItemDisplay';
import BidInterface from '@/components/bidding/BidInterface';

export default function Home() {
  const { userEmail, logout } = useAuth();

  return (
    <main className="relative min-h-screen bg-[#f8f9fa] selection:bg-blue-100 selection:text-blue-900 pb-12 sm:pb-20">
      <div className="absolute inset-0 z-0 h-72 bg-linear-to-b from-slate-200/50 to-transparent pointer-events-none" />

      {!userEmail && <AuthModal />}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 space-y-8 lg:space-y-10">
        <header className="flex flex-col sm:flex-row justify-between items-center bg-white/70 backdrop-blur-xl px-6 py-4 rounded-2xl shadow-sm border border-white/80 ring-1 ring-slate-900/5 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-inner">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Vintage Watch Auction
            </h1>
          </div>

          {userEmail && (
            <div className="flex items-center gap-2 bg-slate-50/80 p-1.5 rounded-full border border-slate-200/60 shadow-sm">
              <span className="text-sm text-slate-500 pl-3 hidden sm:inline-block font-medium">
                Bidding as
              </span>
              <span className="text-sm font-semibold text-slate-900 pl-3 sm:pl-1 pr-2 truncate max-w-40">
                {userEmail}
              </span>
              <button
                onClick={logout}
                className="text-sm font-medium text-slate-600 hover:text-red-600 bg-white hover:bg-red-50 px-4 py-1.5 rounded-full transition-all duration-200 border border-slate-200 shadow-sm hover:border-red-100 focus:outline-none focus:ring-2 focus:ring-red-500/20"
              >
                Logout
              </button>
            </div>
          )}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12 items-start">
          <div className="w-full">
            <ItemDisplay />
          </div>

          <div className="w-full lg:sticky lg:top-8">
            <BidInterface />
          </div>
        </div>
      </div>
    </main>
  );
}
