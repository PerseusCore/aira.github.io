import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Marketplace.css';

const Marketplace = () => {
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const navigate = useNavigate();
  
  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'locomotion', name: 'Locomotion' },
    { id: 'manipulation', name: 'Manipulation' },
    { id: 'balance', name: 'Balance' },
    { id: 'gestures', name: 'Gestures' },
    { id: 'dance', name: 'Dance' },
    { id: 'sports', name: 'Sports' }
  ];
  
  // Fetch marketplace listings on component mount
  useEffect(() => {
    fetchListings();
  }, [selectedCategory, sortBy]);
  
  // Fetch listings from API
  const fetchListings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      let url = `/api/marketplace/listings?`;
      if (selectedCategory !== 'all') {
        url += `category=${selectedCategory}&`;
      }
      url += `sort=${sortBy}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch marketplace listings');
      }
      
      const data = await response.json();
      setListings(data.listings || []);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching marketplace listings:', err);
      setError(err.message || 'An error occurred while fetching listings');
      setIsLoading(false);
    }
  };
  
  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      return;
    }
    
    navigate(`/marketplace/search?query=${encodeURIComponent(searchQuery)}`);
  };
  
  // Navigate to listing detail
  const handleListingClick = (listingId) => {
    navigate(`/marketplace/listings/${listingId}`);
  };
  
  // Navigate to create listing page
  const handleCreateListing = () => {
    navigate('/marketplace/create');
  };
  
  return (
    <div className="marketplace-container">
      <div className="marketplace-header">
        <h2>AIRA Robot Skill Marketplace</h2>
        <p className="marketplace-description">
          Discover, buy, and sell robot skills for your AIRA Humanoid Robot
        </p>
      </div>
      
      <div className="marketplace-search-bar">
        <form onSubmit={handleSearch} className="d-flex">
          <input 
            type="text" 
            className="form-control me-2" 
            placeholder="Search for robot skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="btn btn-primary" type="submit">Search</button>
        </form>
      </div>
      
      <div className="marketplace-filters">
        <div className="row align-items-center">
          <div className="col-md-6">
            <div className="category-filter">
              <label className="me-2">Category:</label>
              <select 
                className="form-select" 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-md-6">
            <div className="sort-filter d-flex justify-content-md-end">
              <label className="me-2">Sort by:</label>
              <select 
                className="form-select" 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest</option>
                <option value="popular">Most Popular</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      <div className="marketplace-actions">
        <button 
          className="btn btn-success"
          onClick={handleCreateListing}
        >
          <i className="bi bi-plus-circle me-2"></i>
          Create Listing
        </button>
      </div>
      
      {isLoading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading marketplace listings...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : listings.length > 0 ? (
        <div className="marketplace-listings">
          <div className="row">
            {listings.map(listing => (
              <div className="col-md-4 mb-4" key={listing.id}>
                <div className="card listing-card" onClick={() => handleListingClick(listing.id)}>
                  <div className="listing-preview">
                    {listing.previewUrl ? (
                      <img 
                        src={listing.previewUrl} 
                        alt={listing.title} 
                        className="card-img-top"
                      />
                    ) : (
                      <div className="placeholder-preview">
                        <i className="bi bi-robot"></i>
                      </div>
                    )}
                    <div className="listing-price">${listing.price.toFixed(2)}</div>
                  </div>
                  <div className="card-body">
                    <h5 className="card-title">{listing.title}</h5>
                    <p className="card-text">{listing.description}</p>
                    <div className="listing-meta">
                      <div className="author">
                        <small>By {listing.author.name}</small>
                      </div>
                      <div className="rating">
                        <i className="bi bi-star-fill text-warning me-1"></i>
                        <span>{listing.rating}</span>
                        <small className="text-muted ms-1">({listing.reviews})</small>
                      </div>
                    </div>
                    <div className="listing-tags mt-2">
                      {listing.tags && listing.tags.map(tag => (
                        <span key={tag} className="badge bg-secondary me-1">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="card-footer">
                    <small className="text-muted">
                      {listing.sales} sales
                    </small>
                    <button 
                      className="btn btn-sm btn-primary float-end"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleListingClick(listing.id);
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="no-listings">
          <p>No listings found matching your criteria.</p>
          <p>Try a different category or create your own listing.</p>
        </div>
      )}
      
      <div className="marketplace-features mt-5">
        <h3 className="text-center mb-4">Marketplace Features</h3>
        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="bi bi-search"></i>
              </div>
              <h4>Discover Skills</h4>
              <p>Browse and search for robot skills created by the community. Find the perfect movements for your AIRA Humanoid Robot.</p>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="bi bi-cart-check"></i>
              </div>
              <h4>Buy Skills</h4>
              <p>Purchase skills directly from creators. All skills are compatible with your AIRA Humanoid Robot and ARC software.</p>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="bi bi-currency-dollar"></i>
              </div>
              <h4>Sell Your Skills</h4>
              <p>Create and sell your own robot skills. Share your expertise and earn money from your creations.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
