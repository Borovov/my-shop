import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';

const HomePage: React.FC = () => {
  const { products, loading, error } = useProducts();

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger mt-5" role="alert">
        {error}
      </div>
    );
  }

  // Get featured products (first 4 in-stock products)
  const featuredProducts = products
    .filter(product => product.inStock)
    .slice(0, 4);

  // Get unique categories
  const categories = Array.from(new Set(products.map(product => product.category)));

  return (
    <div className="container py-5">
      {/* Hero Section */}
      <div className="px-4 py-5 my-5 text-center">
        <h1 className="display-4 fw-bold">Welcome to MyShop</h1>
        <div className="col-lg-6 mx-auto">
          <p className="lead mb-4">
            Discover our wide range of high-quality electronics and accessories.
            From headphones to laptops, we have everything you need.
          </p>
          <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
            <Link to="/products" className="btn btn-primary btn-lg px-4 gap-3">
              Browse Products
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <section className="mb-5">
        <h2 className="mb-4">Featured Products</h2>
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
          {featuredProducts.map(product => (
            <div key={product.id} className="col">
              <div className="card h-100">
                <img
                  src={product.imageUrl}
                  className="card-img-top"
                  alt={product.name}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text text-truncate">{product.description}</p>
                  <p className="card-text">
                    <strong>${product.price.toFixed(2)}</strong>
                  </p>
                  <Link
                    to={`/products?category=${encodeURIComponent(product.category)}`}
                    className="btn btn-outline-primary"
                  >
                    View More
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section>
        <h2 className="mb-4">Shop by Category</h2>
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {categories.map(category => (
            <div key={category} className="col">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{category}</h5>
                  <p className="card-text">
                    {products.filter(p => p.category === category).length} products
                  </p>
                  <Link
                    to={`/products?category=${encodeURIComponent(category)}`}
                    className="btn btn-outline-primary"
                  >
                    Browse {category}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
