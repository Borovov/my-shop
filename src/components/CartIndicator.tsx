import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const CartIndicator: React.FC = () => {
  const { state: { items } } = useCart();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Link 
      to="/cart" 
      className="nav-link position-relative d-flex align-items-center"
      title={`${itemCount} items in cart`}
      aria-label={`Shopping cart with ${itemCount} items`}
    >
      <i className="bi bi-cart3 fs-5"></i>
      {itemCount > 0 && (
        <span 
          className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary"
          style={{ fontSize: '0.75rem' }}
        >
          {itemCount > 99 ? '99+' : itemCount}
          <span className="visually-hidden">items in cart</span>
        </span>
      )}
    </Link>
  );
};

export default CartIndicator; 