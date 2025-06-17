export type ProductCategory = 
  | 'Laptops'
  | 'Smartphones'
  | 'Audio'
  | 'Gaming'
  | 'Accessories';

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  fullDescription: string;
  price: number;
  imageUrl: string;
  category: ProductCategory;
  inStock: boolean;
  specifications: Record<string, string>;
  reviews: Review[];
  averageRating: number;
}

export type ViewMode = 'grid' | 'list';

export interface ProductGridProps {
  products: Product[];
  viewMode: ViewMode;
  columns: number;
  onAddToCart: (productId: string) => void;
}

export interface ProductCardProps {
  product: Product;
  viewMode: ViewMode;
  onAddToCart: (productId: string) => void;
  showFullDescription?: boolean;
}

export interface ProductSearchProps {
  onSearch: (query: string) => void;
  onCategoryChange: (category: ProductCategory | '') => void;
  selectedCategory: ProductCategory | '';
}

export interface ProductViewToggleProps {
  viewMode: ViewMode;
  columns: number;
  onViewModeChange: (mode: ViewMode) => void;
  onColumnsChange: (columns: number) => void;
}

export interface ReviewFormProps {
  productId: string;
  onSubmit: (review: Omit<Review, 'id' | 'userId' | 'userName' | 'createdAt'>) => void;
} 