import React from 'react';
import type { ProductViewToggleProps } from '../types/product';

const ProductViewToggle: React.FC<ProductViewToggleProps> = ({
  viewMode,
  columns,
  onViewModeChange,
  onColumnsChange,
}) => {
  return (
    <div className="btn-group mb-4">
      <button
        type="button"
        className={`btn btn-outline-secondary ${viewMode === 'grid' ? 'active' : ''}`}
        onClick={() => onViewModeChange('grid')}
      >
        <i className="bi bi-grid"></i> Grid
      </button>
      <button
        type="button"
        className={`btn btn-outline-secondary ${viewMode === 'list' ? 'active' : ''}`}
        onClick={() => onViewModeChange('list')}
      >
        <i className="bi bi-list"></i> List
      </button>
      
      {viewMode === 'grid' && (
        <div className="btn-group" role="group">
          <button
            type="button"
            className="btn btn-outline-secondary dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {columns} Columns
          </button>
          <ul className="dropdown-menu">
            {[2, 3, 4].map((col) => (
              <li key={col}>
                <button
                  className={`dropdown-item ${columns === col ? 'active' : ''}`}
                  onClick={() => onColumnsChange(col)}
                >
                  {col} Columns
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProductViewToggle; 