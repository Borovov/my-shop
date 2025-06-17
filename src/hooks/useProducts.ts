import { useState, useEffect, useCallback } from 'react';
import type { Product, ProductCategory } from '../types/product';

// Temporary mock data
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'MacBook Pro 16"',
    description: 'Powerful laptop for professionals with M2 Pro chip',
    fullDescription: `Experience the next level of performance with the new MacBook Pro 16". 
    Featuring the M2 Pro chip, this laptop delivers exceptional speed and efficiency for demanding tasks. 
    The stunning 16-inch Liquid Retina XDR display provides incredible color accuracy and brightness. 
    With up to 22 hours of battery life, you can work all day without interruption.`,
    price: 2499.99,
    imageUrl: 'https://via.placeholder.com/300x200.png?text=MacBook+Pro',
    category: 'Laptops',
    inStock: true,
    specifications: {
      'Processor': 'Apple M2 Pro',
      'Memory': '16GB unified memory',
      'Storage': '512GB SSD',
      'Display': '16-inch Liquid Retina XDR',
      'Battery': 'Up to 22 hours',
    },
    reviews: [
      {
        id: '101',
        userId: 'user1',
        userName: 'John Doe',
        rating: 5,
        comment: 'Amazing performance and battery life!',
        createdAt: '2024-03-15T10:00:00Z'
      },
      {
        id: '102',
        userId: 'user2',
        userName: 'Jane Smith',
        rating: 4,
        comment: 'Great machine, but quite expensive',
        createdAt: '2024-03-14T15:30:00Z'
      }
    ],
    averageRating: 4.5
  },
  {
    id: '2',
    name: 'iPhone 15 Pro',
    description: 'Latest iPhone with advanced camera system',
    fullDescription: `The iPhone 15 Pro represents the pinnacle of smartphone technology. 
    With its advanced camera system, you can capture professional-quality photos and videos. 
    The A17 Pro chip delivers unprecedented performance, and the titanium design offers both durability and elegance. 
    Experience the next generation of mobile computing with features like Dynamic Island and Always-On display.`,
    price: 999.99,
    imageUrl: 'https://via.placeholder.com/300x200.png?text=iPhone+15',
    category: 'Smartphones',
    inStock: true,
    specifications: {
      'Chip': 'A17 Pro',
      'Display': '6.1-inch Super Retina XDR',
      'Camera': '48MP Main | 12MP Ultra Wide | 12MP Telephoto',
      'Storage': '256GB',
      'Battery': 'Up to 23 hours video playback',
    },
    reviews: [
      {
        id: '201',
        userId: 'user3',
        userName: 'Mike Johnson',
        rating: 5,
        comment: 'Best iPhone ever! The camera is incredible.',
        createdAt: '2024-03-13T09:15:00Z'
      }
    ],
    averageRating: 5
  },
  {
    id: '3',
    name: 'Sony WH-1000XM5',
    description: 'Premium noise-cancelling headphones',
    fullDescription: `Immerse yourself in your music with the Sony WH-1000XM5 headphones. 
    Industry-leading noise cancellation technology lets you enjoy your content without distractions. 
    The 30-hour battery life and quick charging feature ensure your music never stops. 
    Premium sound quality and LDAC support deliver an exceptional audio experience.`,
    price: 399.99,
    imageUrl: 'https://via.placeholder.com/300x200.png?text=Sony+Headphones',
    category: 'Audio',
    inStock: true,
    specifications: {
      'Battery Life': 'Up to 30 hours',
      'Noise Cancellation': 'Advanced ANC',
      'Audio Codec': 'LDAC, AAC, SBC',
      'Weight': '250g',
      'Charging': 'USB-C quick charging',
    },
    reviews: [
      {
        id: '301',
        userId: 'user4',
        userName: 'Sarah Wilson',
        rating: 5,
        comment: 'The noise cancellation is amazing!',
        createdAt: '2024-03-12T14:20:00Z'
      }
    ],
    averageRating: 5
  },
  {
    id: '4',
    name: 'PlayStation 5',
    description: 'Next-gen gaming console with ray tracing',
    fullDescription: `Step into the next generation of gaming with the PlayStation 5. 
    Experience lightning-fast loading times with the custom SSD, immersive 3D audio, and 
    stunning 4K graphics with ray tracing. The DualSense controller provides haptic feedback 
    and adaptive triggers for unprecedented immersion in your games.`,
    price: 499.99,
    imageUrl: 'https://via.placeholder.com/300x200.png?text=PS5',
    category: 'Gaming',
    inStock: false,
    specifications: {
      'CPU': 'AMD Zen 2',
      'GPU': 'AMD RDNA 2',
      'Storage': '825GB Custom SSD',
      'Resolution': 'Up to 4K 120Hz',
      'Ray Tracing': 'Yes',
    },
    reviews: [
      {
        id: '401',
        userId: 'user5',
        userName: 'Tom Brown',
        rating: 5,
        comment: 'Amazing graphics and super fast loading!',
        createdAt: '2024-03-11T16:45:00Z'
      }
    ],
    averageRating: 5
  },
  {
    id: '5',
    name: 'AirPods Pro',
    description: 'Wireless earbuds with active noise cancellation',
    fullDescription: `Experience your music like never before with AirPods Pro. 
    Active Noise Cancellation blocks outside noise, while Transparency mode lets you 
    hear the world around you. With Spatial Audio and Adaptive EQ, your music sounds 
    better than ever. The wireless charging case provides more than 24 hours of battery life.`,
    price: 249.99,
    imageUrl: 'https://via.placeholder.com/300x200.png?text=AirPods+Pro',
    category: 'Audio',
    inStock: true,
    specifications: {
      'Chip': 'H2',
      'Battery': '6 hours listening time',
      'Charging': 'MagSafe Charging Case',
      'Audio Features': 'Active Noise Cancellation, Spatial Audio',
      'Water Resistance': 'IPX4',
    },
    reviews: [
      {
        id: '501',
        userId: 'user6',
        userName: 'Emma Davis',
        rating: 4,
        comment: 'Great sound quality and ANC works well',
        createdAt: '2024-03-10T11:30:00Z'
      }
    ],
    averageRating: 4
  },
  {
    id: '6',
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Premium Android smartphone with S Pen',
    fullDescription: `The Samsung Galaxy S24 Ultra sets a new standard for smartphones. 
    With its advanced AI capabilities, stunning 200MP camera system, and included S Pen, 
    it's the ultimate tool for creativity and productivity. The 6.8" Dynamic AMOLED display 
    offers the best viewing experience with adaptive refresh rate up to 120Hz.`,
    price: 1199.99,
    imageUrl: 'https://via.placeholder.com/300x200.png?text=Galaxy+S24',
    category: 'Smartphones',
    inStock: true,
    specifications: {
      'Display': '6.8" Dynamic AMOLED 2X',
      'Camera': '200MP Main Camera',
      'Processor': 'Snapdragon 8 Gen 3',
      'Battery': '5000mAh',
      'S Pen': 'Included',
    },
    reviews: [],
    averageRating: 0
  },
  {
    id: '7',
    name: 'ROG Strix Gaming Laptop',
    description: 'High-performance gaming laptop',
    fullDescription: `Dominate your games with the ROG Strix gaming laptop. 
    Powered by the latest NVIDIA RTX graphics and Intel Core processor, this laptop 
    delivers exceptional gaming performance. The 165Hz display ensures smooth gameplay, 
    while the advanced cooling system keeps temperatures under control.`,
    price: 1799.99,
    imageUrl: 'https://via.placeholder.com/300x200.png?text=ROG+Strix',
    category: 'Laptops',
    inStock: true,
    specifications: {
      'GPU': 'NVIDIA RTX 4070',
      'CPU': 'Intel Core i9',
      'Display': '15.6" 165Hz',
      'Memory': '32GB DDR5',
      'Storage': '1TB NVMe SSD',
    },
    reviews: [],
    averageRating: 0
  },
  {
    id: '8',
    name: 'Xbox Series X',
    description: 'Powerful gaming console for 4K gaming',
    fullDescription: `Experience true next-generation gaming with the Xbox Series X. 
    With support for 4K resolution at 60 FPS and up to 120 FPS, your games will look 
    and play better than ever. Quick Resume lets you switch between multiple games instantly, 
    while the expanded storage options give you plenty of space for your game library.`,
    price: 499.99,
    imageUrl: 'https://via.placeholder.com/300x200.png?text=Xbox+Series+X',
    category: 'Gaming',
    inStock: true,
    specifications: {
      'CPU': 'Custom Zen 2',
      'GPU': '12 TFLOPS RDNA 2',
      'Storage': '1TB Custom NVMe SSD',
      'Resolution': '4K at 60 FPS',
      'Quick Resume': 'Yes',
    },
    reviews: [],
    averageRating: 0
  },
  {
    id: '9',
    name: 'Magic Keyboard',
    description: 'Premium keyboard for Apple devices',
    fullDescription: `The Magic Keyboard is the perfect companion for your Mac or iPad. 
    With a comfortable and precise typing experience, built-in rechargeable battery, and 
    automatic pairing, it's designed to help you work efficiently. The full-size layout 
    includes document navigation controls and a numeric keypad.`,
    price: 99.99,
    imageUrl: 'https://via.placeholder.com/300x200.png?text=Magic+Keyboard',
    category: 'Accessories',
    inStock: true,
    specifications: {
      'Layout': 'Full-size with numeric keypad',
      'Connection': 'Bluetooth',
      'Battery': 'Rechargeable Li-ion',
      'Charging': 'Lightning to USB',
      'Compatibility': 'Mac, iPad',
    },
    reviews: [],
    averageRating: 0
  },
  {
    id: '10',
    name: 'Samsung Galaxy Watch 6',
    description: 'Advanced smartwatch with health features',
    fullDescription: `Track your health and stay connected with the Galaxy Watch 6. 
    Advanced health sensors monitor your heart rate, sleep quality, and workout performance. 
    With a beautiful AMOLED display and premium design, it's both functional and stylish. 
    Enjoy seamless integration with your smartphone for notifications and calls.`,
    price: 299.99,
    imageUrl: 'https://via.placeholder.com/300x200.png?text=Galaxy+Watch',
    category: 'Accessories',
    inStock: true,
    specifications: {
      'Display': 'Super AMOLED',
      'Health Features': 'Heart Rate, ECG, Sleep Tracking',
      'Battery': 'Up to 40 hours',
      'Water Resistance': '5ATM + IP68',
      'OS': 'Wear OS',
    },
    reviews: [],
    averageRating: 0
  }
];

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | ''>('');

  // Simulate API call
  useEffect(() => {
    const loadProducts = async () => {
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setProducts(mockProducts);
        setLoading(false);
      } catch (err) {
        setError('Failed to load products');
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const filteredProducts = useCallback(() => {
    return products
      .filter(product => {
        const matchesSearch = !searchQuery || 
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesCategory = !selectedCategory || product.category === selectedCategory;
        
        return matchesSearch && matchesCategory;
      });
  }, [products, searchQuery, selectedCategory]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleCategoryChange = useCallback((category: ProductCategory | '') => {
    setSelectedCategory(category);
  }, []);

  const getProductById = useCallback((productId: string) => {
    return products.find(product => product.id === productId);
  }, [products]);

  const getProductsByCategory = useCallback((category: ProductCategory) => {
    return products.filter(product => product.category === category);
  }, [products]);

  return {
    products: filteredProducts(),
    loading,
    error,
    handleSearch,
    handleCategoryChange,
    selectedCategory,
    getProductById,
    getProductsByCategory,
  };
} 