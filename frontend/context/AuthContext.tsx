'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  userEmail: string | null;
  login: (email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const storedEmail = localStorage.getItem('auction_user_email');
    if (storedEmail) {
      setUserEmail(storedEmail);
    }
  }, []);

  const login = (email: string) => {
    localStorage.setItem('auction_user_email', email);
    setUserEmail(email);
  };

  const logout = () => {
    localStorage.removeItem('auction_user_email');
    setUserEmail(null);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ userEmail, login, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
