import { useEffect, useState, useCallback } from 'react';
import { useSocket } from '../context/SocketContext';

export const useBidding = () => {
  const socket = useSocket();
  const [currentHighest, setCurrentHighest] = useState<number | null>(null);
  const [history, setHistory] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    if (!socket) return;

    setIsConnected(socket.connected);

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    const onAuctionStatus = (data: { currentHighest: number; history: any[] }) => {
      setCurrentHighest(data.currentHighest);
      setHistory(data.history);
    };

    const onAuctionUpdated = (data: { currentHighest: number; history: any[] }) => {
      setCurrentHighest(data.currentHighest);
      setHistory(data.history);
      setError(null);
    };

    const onBidError = (data: { message: string }) => {
      setError(data.message);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('auctionStatus', onAuctionStatus);
    socket.on('auctionUpdated', onAuctionUpdated);
    socket.on('bidError', onBidError);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('auctionStatus', onAuctionStatus);
      socket.off('auctionUpdated', onAuctionUpdated);
      socket.off('bidError', onBidError);
    };
  }, [socket]);

  const placeBid = useCallback(
    (amount: number, bidderEmail: string) => {
      if (!socket || !socket.connected) {
        setError('Live connection is currently offline.');
        return;
      }
      setError(null);
      socket.emit('placeBid', { amount, bidderEmail });
    },
    [socket],
  );

  return {
    currentHighest,
    history,
    error,
    isConnected,
    placeBid,
  };
};
