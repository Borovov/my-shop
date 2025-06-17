import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../hooks/useAuth';
import type { Review } from '../types/product';
import Toast from '../components/Toast';

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProductById } = useProducts();
  const { addItem } = useCart();
  const { isAuthenticated, user } = useAuth();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const product = getProductById(id!);

  if (!product) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          Product not found. <button className="btn btn-link" onClick={() => navigate('/products')}>Return to products</button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product);
    setToast({ message: `${product.name} added to cart!`, type: 'success' });
  };

  const handleReviewSubmit = async (review: Omit<Review, 'id' | 'userId' | 'userName' | 'createdAt'>) => {
    // Here you would typically make an API call to save the review
    console.log('Submitting review:', review);
    setToast({ message: 'Review submitted successfully!', type: 'success' });
  };

  return (
    <div className="container py-5">
      <div className="row">
        {/* Product Image */}
        <div className="col-md-6 mb-4">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="img-fluid rounded"
            style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
          />
        </div>

        {/* Product Details */}
        <div className="col-md-6">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <button className="btn btn-link p-0" onClick={() => navigate('/products')}>Products</button>
              </li>
              <li className="breadcrumb-item">
                <button 
                  className="btn btn-link p-0" 
                  onClick={() => navigate(`/products?category=${product.category}`)}
                >
                  {product.category}
                </button>
              </li>
              <li className="breadcrumb-item active" aria-current="page">{product.name}</li>
            </ol>
          </nav>

          <h1 className="mb-3">{product.name}</h1>
          
          <div className="mb-3">
            <span className="h3">${product.price.toFixed(2)}</span>
            <span className="ms-3">
              <i className="bi bi-star-fill text-warning"></i>
              <span className="ms-1">{product.averageRating.toFixed(1)}</span>
              <span className="text-muted ms-2">({product.reviews.length} reviews)</span>
            </span>
          </div>

          <p className="lead mb-4">{product.description}</p>

          <div className="mb-4">
            <button
              className="btn btn-primary btn-lg"
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>

          <div className="mb-4">
            <h5>Product Description</h5>
            <p>{product.fullDescription}</p>
          </div>

          <div className="mb-4">
            <h5>Specifications</h5>
            <table className="table">
              <tbody>
                {Object.entries(product.specifications).map(([key, value]) => (
                  <tr key={key}>
                    <th className="w-25">{key}</th>
                    <td>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-5">
        <h3>Customer Reviews</h3>
        
        {isAuthenticated && (
          <div className="mb-4">
            <h5>Write a Review</h5>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleReviewSubmit({
                rating: Number(formData.get('rating')),
                comment: formData.get('comment') as string,
              });
              (e.target as HTMLFormElement).reset();
            }}>
              <div className="mb-3">
                <label className="form-label">Rating</label>
                <select name="rating" className="form-select" required>
                  <option value="">Select rating</option>
                  {[5, 4, 3, 2, 1].map(rating => (
                    <option key={rating} value={rating}>{rating} stars</option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Comment</label>
                <textarea
                  name="comment"
                  className="form-control"
                  rows={3}
                  required
                  placeholder="Share your thoughts about this product..."
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary">
                Submit Review
              </button>
            </form>
          </div>
        )}

        {product.reviews.length > 0 ? (
          <div className="row row-cols-1 row-cols-md-2 g-4">
            {product.reviews.map(review => (
              <div key={review.id} className="col">
                <div className="card h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h6 className="card-subtitle text-muted">{review.userName}</h6>
                      <div>
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <i key={i} className="bi bi-star-fill text-warning me-1"></i>
                        ))}
                      </div>
                    </div>
                    <p className="card-text">{review.comment}</p>
                    <small className="text-muted">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="alert alert-info">
            No reviews yet. {!isAuthenticated && 'Log in to be the first to review this product!'}
          </div>
        )}
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default ProductPage;
