'use client';

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { log } from 'console';

export default function AuthModal() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailRegex.test(cleanEmail)) {
      setError('');
      login(cleanEmail);
    } else {
      setError('Please enter a valid email address (e.g. name@example.com)');
    }

    // if (email.trim() && email.includes('@')) {
    //   login(email.trim());
    // }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-2 text-center">Welcome to the Auction</h2>
        <p className="text-gray-500 mb-6 text-center text-sm">
          Please enter your email to start bidding
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              required
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            ></input>
            {error && <p className="mt-2 text-sm text-red-600 font-medium">{error}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            Join Auction
          </button>
        </form>
      </div>
    </div>
  );
}
