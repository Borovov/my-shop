import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import type { Product } from '../types/product';
import type { CartItem, CartState } from '../types/cart';

interface CartContextType {
  state: CartState;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  mergeWithServerCart?: (serverItems: CartItem[]) => void;
}

const CART_STORAGE_KEY = 'myshop_cart';

const initialState: CartState = {
  items: [],
  total: 0,
};

// Load cart from localStorage
const loadStoredCart = (): CartState => {
  try {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);
      return {
        items: parsedCart.items || [],
        total: calculateTotal(parsedCart.items || [])
      };
    }
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
  }
  return initialState;
};

type CartAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'MERGE_CART'; payload: CartItem[] }
  | { type: 'SET_CART'; payload: CartState };

const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  let newState: CartState;

  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        newState = {
          items: updatedItems,
          total: calculateTotal(updatedItems),
        };
      } else {
        const newItems = [...state.items, { ...action.payload, quantity: 1 }];
        newState = {
          items: newItems,
          total: calculateTotal(newItems),
        };
      }
      break;
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload);
      newState = {
        items: newItems,
        total: calculateTotal(newItems),
      };
      break;
    }

    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;
      if (quantity < 1) {
        return state;
      }

      const updatedItems = state.items.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      );

      newState = {
        items: updatedItems,
        total: calculateTotal(updatedItems),
      };
      break;
    }

    case 'MERGE_CART': {
      // Merge items from server with local cart
      const mergedItems = [...state.items];
      
      action.payload.forEach(serverItem => {
        const existingItemIndex = mergedItems.findIndex(item => item.id === serverItem.id);
        
        if (existingItemIndex >= 0) {
          // Update quantity if item exists
          mergedItems[existingItemIndex] = {
            ...mergedItems[existingItemIndex],
            quantity: mergedItems[existingItemIndex].quantity + serverItem.quantity
          };
        } else {
          // Add new item if it doesn't exist
          mergedItems.push(serverItem);
        }
      });

      newState = {
        items: mergedItems,
        total: calculateTotal(mergedItems),
      };
      break;
    }

    case 'SET_CART':
      newState = action.payload;
      break;

    case 'CLEAR_CART':
      newState = initialState;
      break;

    default:
      return state;
  }

  // Save to localStorage after each change
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newState));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }

  return newState;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState, loadStoredCart);

  const addItem = useCallback((product: Product) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
  }, []);

  const removeItem = useCallback((productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const mergeWithServerCart = useCallback((serverItems: CartItem[]) => {
    dispatch({ type: 'MERGE_CART', payload: serverItems });
  }, []);

  return (
    <CartContext.Provider value={{ 
      state, 
      addItem, 
      removeItem, 
      updateQuantity, 
      clearCart,
      mergeWithServerCart 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 