import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './hooks/useAuth';
import { useAuth } from './hooks/useAuth';
import { useCartSync } from './hooks/useCartSync';
import CartIndicator from './components/CartIndicator';
import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import OrdersPage from './pages/OrdersPage';
import AdminDashboard from './pages/AdminDashboard';
import NotFoundPage from './pages/NotFoundPage';
import Navbar from './components/Navbar';
import './styles/navbar.css';
import './styles/layout.css';

const AppContent = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  // Setup cart synchronization
  useCartSync({
    isAuthenticated,
    userId: user?.id
  });

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <div className="app-header">
        <Navbar />
      </div>
      <main className="app-content">
        <div className="content-container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductListPage />} />
            <Route path="/products/:id" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route 
              path="/profile" 
              element={
                isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />
              } 
            />
            <Route 
              path="/orders" 
              element={
                isAuthenticated ? <OrdersPage /> : <Navigate to="/login" />
              } 
            />
            <Route 
              path="/admin" 
              element={
                isAuthenticated && user?.role === 'admin' 
                  ? <AdminDashboard /> 
                  : <Navigate to="/" />
              } 
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}
