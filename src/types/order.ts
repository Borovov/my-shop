export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    country: string;
    postalCode: string;
  };
}

export interface OrdersResponse {
  orders: Order[];
  totalPages: number;
  currentPage: number;
  totalOrders: number;
} 