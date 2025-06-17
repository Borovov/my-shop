import type { Product } from './product';

export interface CartItem extends Product {
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  total: number;
}

export interface CartResponse {
  items: CartItem[];
  userId: string;
  updatedAt: string;
} 