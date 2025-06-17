import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import CartIndicator from './CartIndicator';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="navbar-container shadow-sm">
      <nav className="navbar navbar-expand-lg">
        <div className="container">
          {/* Brand */}
          <Link to="/" className="navbar-brand d-flex align-items-center">
            <i className="bi bi-shop fs-4 me-2"></i>
            <span className="fw-bold">MyShop</span>
          </Link>

          {/* Mobile Toggle */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarContent"
            aria-controls="navbarContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Navigation Items */}
          <div className="collapse navbar-collapse" id="navbarContent">
            {/* Main Navigation */}
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 align-items-center">
              <li className="nav-item dropdown">
                <button
                  className="nav-link dropdown-toggle btn btn-link"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Categories
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <Link to="/products" className="dropdown-item">
                      All Products
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <Link to="/products?category=Laptops" className="dropdown-item">
                      Laptops
                    </Link>
                  </li>
                  <li>
                    <Link to="/products?category=Smartphones" className="dropdown-item">
                      Smartphones
                    </Link>
                  </li>
                  <li>
                    <Link to="/products?category=Audio" className="dropdown-item">
                      Audio
                    </Link>
                  </li>
                  <li>
                    <Link to="/products?category=Gaming" className="dropdown-item">
                      Gaming
                    </Link>
                  </li>
                  <li>
                    <Link to="/products?category=Accessories" className="dropdown-item">
                      Accessories
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="nav-item">
                <Link to="/products" className="nav-link">
                  Products
                </Link>
              </li>
              <li className="nav-item">
                <CartIndicator />
              </li>
            </ul>

            {/* User Navigation */}
            <ul className="navbar-nav align-items-center">
              {isAuthenticated && user ? (
                <>
                  <li className="nav-item dropdown">
                    <button
                      className="nav-link dropdown-toggle btn btn-link d-flex align-items-center"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i className="bi bi-person-circle fs-5 me-2"></i>
                      <span>{user.name}</span>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li>
                        <Link to="/profile" className="dropdown-item">
                          <i className="bi bi-person me-2"></i>
                          Profile
                        </Link>
                      </li>
                      <li>
                        <Link to="/orders" className="dropdown-item">
                          <i className="bi bi-box me-2"></i>
                          Orders
                        </Link>
                      </li>
                      {user.role === 'admin' && (
                        <li>
                          <Link to="/admin" className="dropdown-item">
                            <i className="bi bi-gear me-2"></i>
                            Admin Panel
                          </Link>
                        </li>
                      )}
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <button
                          className="dropdown-item text-danger"
                          onClick={handleLogout}
                        >
                          <i className="bi bi-box-arrow-right me-2"></i>
                          Logout
                        </button>
                      </li>
                    </ul>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link to="/login" className="nav-link">
                      <i className="bi bi-box-arrow-in-right me-1"></i>
                      Login
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/register" className="btn btn-primary ms-2">
                      Sign Up
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar; 