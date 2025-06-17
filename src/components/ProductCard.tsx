import React from 'react';
import type { ProductCardProps } from '../types/product';

const ProductCard: React.FC<ProductCardProps> = ({ product, viewMode, onAddToCart }) => {
  const isGridView = viewMode === 'grid';

  const cardClasses = isGridView
    ? 'card h-100'
    : 'card mb-3';

  const imageClasses = isGridView
    ? 'card-img-top'
    : 'card-img-start';

  return (
    <div className={cardClasses}>
      <img 
        src={product.imageUrl} 
        className={imageClasses} 
        alt={product.name}
        style={{ height: isGridView ? '200px' : '150px', objectFit: 'cover' }}
      />
      <div className="card-body">
        <h5 className="card-title">{product.name}</h5>
        <p className="card-text text-truncate">{product.description}</p>
        <div className="d-flex justify-content-between align-items-center">
          <span className="h5 mb-0">${product.price.toFixed(2)}</span>
          <button
            className="btn btn-primary"
            onClick={() => onAddToCart(product.id)}
            disabled={!product.inStock}
          >
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 