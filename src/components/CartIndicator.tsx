import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const CartIndicator: React.FC = () => {
  const { state: { items } } = useCart();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Link 
      to="/cart" 
      className="nav-link cart-indicator d-flex align-items-center justify-content-center position-relative"
      title={`${itemCount} items in cart`}
      aria-label={`Shopping cart with ${itemCount} items`}
    >
      <i className="bi bi-cart3 fs-5"></i>
      {itemCount > 0 && (
        <span 
          className="position-absolute cart-badge badge bg-danger rounded-pill"
          style={{ 
            top: '-8px', 
            right: '-8px',
            fontSize: '0.65rem',
            minWidth: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '600'
          }}
        >
          {itemCount > 99 ? '99+' : itemCount}
          <span className="visually-hidden">items in cart</span>
        </span>
      )}
    </Link>
  );
};

export default CartIndicator; 