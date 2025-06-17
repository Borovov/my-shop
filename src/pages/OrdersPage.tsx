import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useOrders } from '../hooks/useOrders';

const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { orders, loading, error, currentPage, totalPages, fetchOrders } = useOrders();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchOrders(1);
  }, [isAuthenticated, navigate, fetchOrders]);

  const handlePageChange = (page: number) => {
    fetchOrders(page);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h1 className="mb-4">My Orders</h1>

      {orders.length === 0 ? (
        <div className="alert alert-info">
          You haven't placed any orders yet.
        </div>
      ) : (
        <>
          {orders.map(order => (
            <div key={order.id} className="card mb-4 shadow-sm">
              <div className="card-header bg-light">
                <div className="row align-items-center">
                  <div className="col">
                    <strong>Order #{order.id}</strong>
                  </div>
                  <div className="col text-center">
                    <span className={`badge bg-${
                      order.status === 'delivered' ? 'success' :
                      order.status === 'processing' ? 'primary' :
                      order.status === 'shipped' ? 'info' :
                      order.status === 'cancelled' ? 'danger' : 'warning'
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <div className="col text-end">
                    <small className="text-muted">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="row">
                  {order.items.map(item => (
                    <div key={item.id} className="col-12 mb-3">
                      <div className="d-flex align-items-center">
                        <img
                          src={item.imageUrl}
                          alt={item.productName}
                          className="me-3"
                          style={{ width: '64px', height: '64px', objectFit: 'cover' }}
                        />
                        <div className="flex-grow-1">
                          <h6 className="mb-0">{item.productName}</h6>
                          <small className="text-muted">
                            Quantity: {item.quantity} × ${item.price.toFixed(2)}
                          </small>
                        </div>
                        <div className="text-end">
                          <strong>${(item.price * item.quantity).toFixed(2)}</strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <hr />
                <div className="row">
                  <div className="col-md-6">
                    <h6 className="mb-2">Shipping Address</h6>
                    <p className="mb-0 small">
                      {order.shippingAddress.fullName}<br />
                      {order.shippingAddress.address}<br />
                      {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
                      {order.shippingAddress.country}
                    </p>
                  </div>
                  <div className="col-md-6 text-md-end">
                    <h6 className="mb-2">Order Total</h6>
                    <h4 className="mb-0">${order.total.toFixed(2)}</h4>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {totalPages > 1 && (
            <nav aria-label="Orders pagination">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                </li>
                {[...Array(totalPages)].map((_, index) => (
                  <li
                    key={index + 1}
                    className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </>
      )}
    </div>
  );
};

export default OrdersPage; 