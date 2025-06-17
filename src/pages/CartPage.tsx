import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const CartPage: React.FC = () => {
  const { state: { items, total }, removeItem, updateQuantity } = useCart();

  if (items.length === 0) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <h1 className="mb-4">Your Cart is Empty</h1>
          <p className="mb-4">Add some products to your cart to see them here.</p>
          <Link to="/products" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h1 className="mb-4">Shopping Cart</h1>
      <div className="row">
        <div className="col-md-8">
          {items.map(item => (
            <div key={item.id} className="card mb-3">
              <div className="row g-0">
                <div className="col-md-3">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="img-fluid rounded-start"
                    style={{ height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div className="col-md-9">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start">
                      <h5 className="card-title">{item.name}</h5>
                      <button
                        className="btn btn-link text-danger"
                        onClick={() => removeItem(item.id)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                    <p className="card-text text-muted">{item.description}</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="input-group" style={{ width: '150px' }}>
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <i className="bi bi-dash"></i>
                        </button>
                        <input
                          type="number"
                          className="form-control text-center"
                          value={item.quantity}
                          min="1"
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (!isNaN(value) && value >= 1) {
                              updateQuantity(item.id, value);
                            }
                          }}
                        />
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <i className="bi bi-plus"></i>
                        </button>
                      </div>
                      <div className="text-end">
                        <p className="mb-0 text-muted">
                          ${item.price.toFixed(2)} × {item.quantity}
                        </p>
                        <h5 className="mb-0">
                          ${(item.price * item.quantity).toFixed(2)}
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Order Summary</h5>
              <div className="d-flex justify-content-between mb-3">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-3">
                <strong>Total</strong>
                <strong>${total.toFixed(2)}</strong>
              </div>
              <Link to="/checkout" className="btn btn-primary w-100">
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
