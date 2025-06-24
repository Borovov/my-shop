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
    <header className="navbar-container sticky-top">
      <nav className="navbar navbar-expand-lg navbar-light py-3">
        <div className="container-fluid px-4">
          {/* Brand */}
          <Link to="/" className="navbar-brand d-flex align-items-center text-decoration-none">
            <div className="brand-icon-wrapper me-3">
              <i className="bi bi-shop brand-icon"></i>
            </div>
            <span className="brand-text">MyShop</span>
          </Link>

          {/* Mobile Toggle */}
          <button
            className="navbar-toggler border-0 p-2"
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
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item dropdown me-2">
                <button
                  className="nav-link dropdown-toggle btn btn-link border-0 fw-medium px-3 py-2"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-grid-3x3-gap me-2"></i>
                  Categories
                </button>
                <ul className="dropdown-menu dropdown-menu-modern">
                  <li>
                    <Link to="/products" className="dropdown-item">
                      <i className="bi bi-collection me-2"></i>
                      All Products
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider my-2" /></li>
                  <li>
                    <Link to="/products?category=Laptops" className="dropdown-item">
                      <i className="bi bi-laptop me-2"></i>
                      Laptops
                    </Link>
                  </li>
                  <li>
                    <Link to="/products?category=Smartphones" className="dropdown-item">
                      <i className="bi bi-phone me-2"></i>
                      Smartphones
                    </Link>
                  </li>
                  <li>
                    <Link to="/products?category=Audio" className="dropdown-item">
                      <i className="bi bi-headphones me-2"></i>
                      Audio
                    </Link>
                  </li>
                  <li>
                    <Link to="/products?category=Gaming" className="dropdown-item">
                      <i className="bi bi-controller me-2"></i>
                      Gaming
                    </Link>
                  </li>
                  <li>
                    <Link to="/products?category=Accessories" className="dropdown-item">
                      <i className="bi bi-plug me-2"></i>
                      Accessories
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="nav-item me-2">
                <Link to="/products" className="nav-link fw-medium px-3 py-2">
                  <i className="bi bi-shop me-2"></i>
                  Products
                </Link>
              </li>
            </ul>

            {/* Right Side Navigation */}
            <ul className="navbar-nav align-items-center">
              {/* Cart */}
              <li className="nav-item me-3">
                <CartIndicator />
              </li>

              {/* User Navigation */}
              {isAuthenticated && user ? (
                <li className="nav-item dropdown">
                  <button
                    className="nav-link dropdown-toggle btn btn-link border-0 d-flex align-items-center user-dropdown-toggle px-3 py-2"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <div className="user-avatar me-2">
                      <img
                        src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                        alt={user.name}
                        className="rounded-circle"
                        width="32"
                        height="32"
                      />
                    </div>
                    <span className="user-name d-none d-md-inline">{user.name}</span>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end dropdown-menu-modern">
                    <li className="dropdown-header px-3 py-2">
                      <div className="d-flex align-items-center">
                        <img
                          src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                          alt={user.name}
                          className="rounded-circle me-2"
                          width="24"
                          height="24"
                        />
                        <div>
                          <div className="fw-medium">{user.name}</div>
                          <small className="text-muted">{user.email}</small>
                        </div>
                      </div>
                    </li>
                    <li><hr className="dropdown-divider my-2" /></li>
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
                    <li><hr className="dropdown-divider my-2" /></li>
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
              ) : (
                <>
                  <li className="nav-item me-2">
                    <Link to="/login" className="nav-link fw-medium px-3 py-2">
                      <i className="bi bi-box-arrow-in-right me-2"></i>
                      Login
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/register" className="btn btn-primary btn-modern px-4 py-2">
                      <i className="bi bi-person-plus me-2"></i>
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