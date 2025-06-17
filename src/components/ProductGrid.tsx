import React from 'react';
import type { ProductGridProps } from '../types/product';
import ProductCard from './ProductCard';

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  viewMode,
  columns,
  onAddToCart,
}) => {
  if (viewMode === 'list') {
    return (
      <div className="product-list">
        {products.map((product) => (
          <div key={product.id} className="mb-3">
            <ProductCard
              product={product}
              viewMode={viewMode}
              onAddToCart={onAddToCart}
            />
          </div>
        ))}
      </div>
    );
  }

  const getColumnClass = () => {
    switch (columns) {
      case 2:
        return 'row-cols-1 row-cols-md-2';
      case 3:
        return 'row-cols-1 row-cols-md-2 row-cols-lg-3';
      case 4:
        return 'row-cols-1 row-cols-md-2 row-cols-lg-4';
      default:
        return 'row-cols-1 row-cols-md-2 row-cols-lg-3';
    }
  };

  return (
    <div className={`row ${getColumnClass()} g-4`}>
      {products.map((product) => (
        <div key={product.id} className="col">
          <ProductCard
            product={product}
            viewMode={viewMode}
            onAddToCart={onAddToCart}
          />
        </div>
      ))}
    </div>
  );
};

export default ProductGrid; 