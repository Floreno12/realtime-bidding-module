import { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

const socket: Socket = io('http://localhost:3001', {
  autoConnect: false,
});

export const useBidding = () => {
  const [currentHighest, setCurrentHighest] = useState<number>(50);
  const [history, setHistory] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    socket.connect();

    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));

    socket.on('auctionStatus', (data) => {
      setCurrentHighest(data.currentHighest);
      setHistory(data.history);
    });

    socket.on('auctionUpdated', (data) => {
      setCurrentHighest(data.currentHighest);
      setHistory(data.history);
      setError(null);
    });

    socket.on('bidError', (data) => {
      setError(data.message);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('auctionStatus');
      socket.off('auctionUpdated');
      socket.off('bidError');
      socket.disconnect();
    };
  }, []);

  const placeBid = useCallback((amount: number, bidderEmail: string) => {
    setError(null);
    socket.emit('placeBid', { amount, bidderEmail });
  }, []);

  return {
    currentHighest,
    history,
    error,
    isConnected,
    placeBid,
  };
};
