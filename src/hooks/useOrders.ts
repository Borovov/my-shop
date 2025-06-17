import { useState, useCallback } from 'react';
import type { Order, OrdersResponse } from '../types/order';

// Генерация большего количества моковых заказов
const generateMockOrders = (): Order[] => {
  const products = [
    {
      id: '1',
      name: 'Smartphone X',
      price: 999.99,
      imageUrl: '/images/smartphone-x.jpg'
    },
    {
      id: '2',
      name: 'Wireless Headphones',
      price: 199.99,
      imageUrl: '/images/headphones.jpg'
    },
    {
      id: '3',
      name: 'Laptop Pro',
      price: 1499.99,
      imageUrl: '/images/laptop.jpg'
    },
    {
      id: '4',
      name: 'Smart Watch',
      price: 299.99,
      imageUrl: '/images/smartwatch.jpg'
    },
    {
      id: '5',
      name: 'Tablet Air',
      price: 649.99,
      imageUrl: '/images/tablet.jpg'
    },
    {
      id: '6',
      name: 'Gaming Console',
      price: 499.99,
      imageUrl: '/images/console.jpg'
    }
  ];

  const statuses: Order['status'][] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  const addresses = [
    {
      fullName: 'John Doe',
      address: '123 Main St',
      city: 'New York',
      country: 'USA',
      postalCode: '10001'
    },
    {
      fullName: 'Jane Smith',
      address: '456 Park Avenue',
      city: 'Los Angeles',
      country: 'USA',
      postalCode: '90001'
    },
    {
      fullName: 'Robert Johnson',
      address: '789 Oak Road',
      city: 'Chicago',
      country: 'USA',
      postalCode: '60601'
    }
  ];

  return Array.from({ length: 35 }, (_, index) => {
    const orderItems = Array.from(
      { length: Math.floor(Math.random() * 4) + 1 },
      (_, itemIndex) => {
        const product = products[Math.floor(Math.random() * products.length)];
        const quantity = Math.floor(Math.random() * 3) + 1;
        return {
          id: `${index + 1}-${itemIndex + 1}`,
          productId: product.id,
          productName: product.name,
          price: product.price,
          quantity,
          imageUrl: product.imageUrl
        };
      }
    );

    const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const address = addresses[Math.floor(Math.random() * addresses.length)];
    
    // Генерация случайной даты за последние 6 месяцев
    const date = new Date();
    date.setMonth(date.getMonth() - Math.floor(Math.random() * 6));
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    
    return {
      id: String(index + 1).padStart(5, '0'),
      userId: '1',
      items: orderItems,
      total,
      status,
      createdAt: date.toISOString(),
      updatedAt: date.toISOString(),
      shippingAddress: address
    };
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); // Сортировка по дате (новые первыми)
};

const mockOrders = generateMockOrders();
const ITEMS_PER_PAGE = 10;

export const useOrders = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ordersData, setOrdersData] = useState<OrdersResponse>({
    orders: [],
    totalPages: 0,
    currentPage: 1,
    totalOrders: 0
  });

  const fetchOrders = useCallback(async (page: number = 1) => {
    setLoading(true);
    setError(null);

    try {
      // Имитация задержки сети
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Имитация ответа сервера
      const totalOrders = mockOrders.length;
      const totalPages = Math.ceil(totalOrders / ITEMS_PER_PAGE);
      const startIndex = (page - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const paginatedOrders = mockOrders.slice(startIndex, endIndex);

      setOrdersData({
        orders: paginatedOrders,
        totalPages,
        currentPage: page,
        totalOrders
      });
    } catch (err) {
      setError('Failed to fetch orders. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    ...ordersData,
    loading,
    error,
    fetchOrders
  };
}; 