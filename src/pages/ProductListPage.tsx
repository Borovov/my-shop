import React, { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { ViewMode, ProductCategory } from '../types/product';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../contexts/CartContext';
import ProductSearch from '../components/ProductSearch';
import ProductViewToggle from '../components/ProductViewToggle';
import ProductGrid from '../components/ProductGrid';
import Toast from '../components/Toast';

const ProductListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { 
    products, 
    loading, 
    error, 
    handleSearch, 
    handleCategoryChange,
    selectedCategory 
  } = useProducts();
  const { addItem } = useCart();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [columns, setColumns] = useState(3);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Initialize category from URL params
  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      handleCategoryChange(category as ProductCategory);
    }
  }, [searchParams, handleCategoryChange]);

  const handleAddToCart = useCallback((productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      addItem(product);
      setToast({ message: `${product.name} added to cart!`, type: 'success' });
    }
  }, [products, addItem]);

  const handleCategorySelect = useCallback((category: ProductCategory | '') => {
    handleCategoryChange(category);
    if (category) {
      setSearchParams({ category });
    } else {
      setSearchParams({});
    }
  }, [handleCategoryChange, setSearchParams]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger mt-5" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>
          {selectedCategory ? `${selectedCategory} Products` : 'All Products'}
        </h1>
        <ProductViewToggle
          viewMode={viewMode}
          columns={columns}
          onViewModeChange={setViewMode}
          onColumnsChange={setColumns}
        />
      </div>

      <ProductSearch 
        onSearch={handleSearch} 
        onCategoryChange={handleCategorySelect}
        selectedCategory={selectedCategory}
      />

      {products.length === 0 ? (
        <div className="alert alert-info">
          No products found. Try adjusting your search or category filter.
        </div>
      ) : (
        <ProductGrid
          products={products}
          viewMode={viewMode}
          columns={columns}
          onAddToCart={handleAddToCart}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default ProductListPage;
