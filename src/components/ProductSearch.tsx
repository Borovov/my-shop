import React, { useState, useCallback } from 'react';
import type { ProductSearchProps, ProductCategory } from '../types/product';

const categories: ProductCategory[] = [
  'Laptops',
  'Smartphones',
  'Audio',
  'Gaming',
  'Accessories'
];

const ProductSearch: React.FC<ProductSearchProps> = ({ 
  onSearch, 
  onCategoryChange,
  selectedCategory 
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  }, [searchTerm, onSearch]);

  return (
    <div className="mb-4">
      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-6">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="btn btn-outline-primary">
                Search
              </button>
            </div>
          </div>
          <div className="col-md-6">
            <select
              className="form-select"
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value as ProductCategory | '')}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductSearch; 