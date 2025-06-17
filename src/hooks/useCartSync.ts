import { useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import type { CartItem } from '../types/cart';

interface UseCartSyncProps {
  isAuthenticated: boolean;
  userId?: string;
}

export const useCartSync = ({ isAuthenticated, userId }: UseCartSyncProps) => {
  const { state: { items }, mergeWithServerCart } = useCart();

  // Sync with server when user logs in
  useEffect(() => {
    if (isAuthenticated && userId) {
      // Fetch user's cart from server
      const fetchServerCart = async () => {
        try {
          const response = await fetch(`/api/cart/${userId}`);
          if (response.ok) {
            const serverCart = await response.json();
            // Merge server cart with local cart
            mergeWithServerCart?.(serverCart.items);
          }
        } catch (error) {
          console.error('Error fetching cart from server:', error);
        }
      };

      fetchServerCart();
    }
  }, [isAuthenticated, userId, mergeWithServerCart]);

  // Sync local cart changes to server
  useEffect(() => {
    if (isAuthenticated && userId) {
      const syncToServer = async () => {
        try {
          await fetch(`/api/cart/${userId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ items }),
          });
        } catch (error) {
          console.error('Error syncing cart to server:', error);
        }
      };

      // Debounce the sync to avoid too many requests
      const timeoutId = setTimeout(syncToServer, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [isAuthenticated, userId, items]);
}; 