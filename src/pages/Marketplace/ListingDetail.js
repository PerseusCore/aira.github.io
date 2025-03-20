import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ListingDetail.css';

const ListingDetail = () => {
  const { listingId } = useParams();
  const navigate = useNavigate();
  
  const [listing, setListing] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [purchaseStatus, setPurchaseStatus] = useState(null);
  
  // Fetch listing details on component mount
  useEffect(() => {
    const fetchListingDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`/api/marketplace/listings/${listingId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch listing details');
        }
        
        const data = await response.json();
        setListing(data.listing);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching listing details:', err);
        setError(err.message || 'An error occurred while fetching listing details');
        setIsLoading(false);
      }
    };
    
    if (listingId) {
      fetchListingDetails();
    }
  }, [listingId]);
  
  // Handle purchase
  const handlePurchase = async () => {
    try {
      setPurchaseStatus({ status: 'processing', message: 'Processing purchase...' });
      
      const response = await fetch(`/api/marketplace/listings/${listingId}/purchase`, {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error('Failed to complete purchase');
      }
      
      const data = await response.json();
      setPurchaseStatus({
        status: 'success',
        message: 'Purchase successful!',
        transaction: data.transaction
      });
    } catch (err) {
      console.error('Error purchasing listing:', err);
      setPurchaseStatus({
        status: 'error',
        message: err.message || 'An error occurred during purchase'
      });
    }
  };
  
  // Navigate back to marketplace
  const handleBackToMarketplace = () => {
    navigate('/marketplace');
  };
  
  if (isLoading) {
    return (
      <div className="listing-detail-container">
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading listing details...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="listing-detail-container">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <button 
          className="btn btn-primary"
          onClick={handleBackToMarketplace}
        >
          Back to Marketplace
        </button>
      </div>
    );
  }
  
  if (!listing) {
    return (
      <div className="listing-detail-container">
        <div className="alert alert-warning" role="alert">
          Listing not found
        </div>
        <button 
          className="btn btn-primary"
          onClick={handleBackToMarketplace}
        >
          Back to Marketplace
        </button>
      </div>
    );
  }
  
  return (
    <div className="listing-detail-container">
      <div className="listing-detail-header">
        <button 
          className="btn btn-outline-primary mb-3"
          onClick={handleBackToMarketplace}
        >
          &larr; Back to Marketplace
        </button>
        <h2>{listing.title}</h2>
        <div className="listing-meta">
          <div className="author-info">
            <span>By {listing.author.name}</span>
            <div className="author-rating">
              <i className="bi bi-star-fill text-warning me-1"></i>
              <span>{listing.author.rating}</span>
            </div>
          </div>
          <div className="listing-rating">
            <i className="bi bi-star-fill text-warning me-1"></i>
            <span>{listing.rating}</span>
            <span className="text-muted ms-1">({listing.reviews.length} reviews)</span>
          </div>
        </div>
      </div>
      
      <div className="row">
        <div className="col-lg-8">
          <div className="listing-preview-container">
            {listing.demoVideoUrl ? (
              <video 
                src={listing.demoVideoUrl} 
                controls 
                className="listing-video"
              />
            ) : listing.previewUrl ? (
              <img 
                src={listing.previewUrl} 
                alt={listing.title} 
                className="listing-image"
              />
            ) : (
              <div className="placeholder-preview">
                <i className="bi bi-robot"></i>
              </div>
            )}
          </div>
          
          <div className="listing-description mt-4">
            <h4>Description</h4>
            <p>{listing.description}</p>
          </div>
          
          <div className="listing-tags mb-4">
            {listing.tags && listing.tags.map(tag => (
              <span key={tag} className="badge bg-secondary me-1">{tag}</span>
            ))}
          </div>
          
          <div className="listing-specifications mb-4">
            <h4>Specifications</h4>
            <div className="row">
              <div className="col-md-6">
                <ul className="specs-list">
                  <li><strong>Servos:</strong> {listing.specifications.servos}</li>
                  <li><strong>Duration:</strong> {listing.specifications.duration}</li>
                </ul>
              </div>
              <div className="col-md-6">
                <ul className="specs-list">
                  <li><strong>Complexity:</strong> {listing.specifications.complexity}</li>
                  <li><strong>Energy Efficiency:</strong> {listing.specifications.energyEfficiency}</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="listing-reviews">
            <h4>Reviews</h4>
            {listing.reviews.length > 0 ? (
              <div className="reviews-list">
                {listing.reviews.map(review => (
                  <div className="review-item" key={review.id}>
                    <div className="review-header">
                      <div className="reviewer">{review.user}</div>
                      <div className="review-rating">
                        {[...Array(5)].map((_, i) => (
                          <i 
                            key={i} 
                            className={`bi ${i < review.rating ? 'bi-star-fill' : 'bi-star'} text-warning`}
                          ></i>
                        ))}
                      </div>
                      <div className="review-date">
                        {new Date(review.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="review-comment">
                      {review.comment}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No reviews yet.</p>
            )}
          </div>
        </div>
        
        <div className="col-lg-4">
          <div className="card purchase-card">
            <div className="card-header">
              <h5 className="card-title mb-0">Purchase</h5>
            </div>
            <div className="card-body">
              <div className="price-display mb-3">
                <span className="price">${listing.price.toFixed(2)}</span>
              </div>
              
              <div className="purchase-stats mb-3">
                <div className="stat-item">
                  <i className="bi bi-cart-check"></i>
                  <span>{listing.sales} sales</span>
                </div>
                <div className="stat-item">
                  <i className="bi bi-calendar"></i>
                  <span>Updated {new Date(listing.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
              
              <button 
                className="btn btn-primary btn-lg w-100 mb-3"
                onClick={handlePurchase}
                disabled={purchaseStatus?.status === 'processing'}
              >
                {purchaseStatus?.status === 'processing' ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Processing...
                  </>
                ) : 'Buy Now'}
              </button>
              
              {purchaseStatus?.status === 'success' && (
                <div className="alert alert-success">
                  <p className="mb-2">{purchaseStatus.message}</p>
                  <a 
                    href={purchaseStatus.transaction.downloadUrl} 
                    className="btn btn-sm btn-success"
                    download
                  >
                    Download Skill
                  </a>
                </div>
              )}
              
              {purchaseStatus?.status === 'error' && (
                <div className="alert alert-danger">
                  {purchaseStatus.message}
                </div>
              )}
              
              <div className="compatibility-info">
                <h6>Compatible with:</h6>
                <ul className="compatibility-list">
                  <li>AIRA Humanoid Robot</li>
                  <li>ARC Software</li>
                  <li>ez-b V4 Controller</li>
                </ul>
              </div>
            </div>
            <div className="card-footer">
              <div className="seller-guarantee">
                <i className="bi bi-shield-check"></i>
                <span>Marketplace Guarantee</span>
              </div>
            </div>
          </div>
          
          <div className="card author-card mt-4">
            <div className="card-header">
              <h5 className="card-title mb-0">About the Author</h5>
            </div>
            <div className="card-body">
              <h6>{listing.author.name}</h6>
              <div className="author-rating mb-2">
                <i className="bi bi-star-fill text-warning me-1"></i>
                <span>{listing.author.rating}</span>
              </div>
              <p>{listing.author.bio}</p>
              <h6>Skills:</h6>
              <ul className="author-skills">
                {listing.author.skills && listing.author.skills.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;
