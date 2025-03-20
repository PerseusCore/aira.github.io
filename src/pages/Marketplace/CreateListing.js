import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './CreateListing.css';

const CreateListing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  // Get skill data from query params if available
  const initialSkillUrl = queryParams.get('skillUrl') || '';
  const initialName = queryParams.get('name') || '';
  
  const [listingData, setListingData] = useState({
    title: initialName,
    description: '',
    price: '',
    category: 'locomotion',
    tags: '',
    skillId: '',
    skillUrl: initialSkillUrl
  });
  
  const [previewImage, setPreviewImage] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const categories = [
    { id: 'locomotion', name: 'Locomotion' },
    { id: 'manipulation', name: 'Manipulation' },
    { id: 'balance', name: 'Balance' },
    { id: 'gestures', name: 'Gestures' },
    { id: 'dance', name: 'Dance' },
    { id: 'sports', name: 'Sports' },
    { id: 'other', name: 'Other' }
  ];
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setListingData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle preview image upload
  const handlePreviewUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file for the preview');
      return;
    }
    
    setPreviewFile(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!listingData.title.trim()) {
      setError('Title is required');
      return;
    }
    
    if (!listingData.description.trim()) {
      setError('Description is required');
      return;
    }
    
    if (!listingData.price || isNaN(parseFloat(listingData.price)) || parseFloat(listingData.price) <= 0) {
      setError('Please enter a valid price');
      return;
    }
    
    if (!listingData.skillUrl && !listingData.skillId) {
      setError('Please provide a skill file or ID');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Create form data for multipart submission
      const formData = new FormData();
      formData.append('title', listingData.title);
      formData.append('description', listingData.description);
      formData.append('price', listingData.price);
      formData.append('category', listingData.category);
      formData.append('tags', listingData.tags);
      
      if (listingData.skillId) {
        formData.append('skillId', listingData.skillId);
      }
      
      if (listingData.skillUrl) {
        formData.append('skillUrl', listingData.skillUrl);
      }
      
      if (previewFile) {
        formData.append('previewImage', previewFile);
      }
      
      // Submit to API
      const response = await fetch('/api/marketplace/listings', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create listing');
      }
      
      const data = await response.json();
      
      setSuccess({
        message: 'Listing created successfully!',
        listingId: data.listing.id
      });
      
      setIsSubmitting(false);
      
      // Reset form after successful submission
      setListingData({
        title: '',
        description: '',
        price: '',
        category: 'locomotion',
        tags: '',
        skillId: '',
        skillUrl: ''
      });
      setPreviewImage(null);
      setPreviewFile(null);
      
    } catch (err) {
      console.error('Error creating listing:', err);
      setError(err.message || 'An error occurred while creating the listing');
      setIsSubmitting(false);
    }
  };
  
  // Navigate to listing detail
  const handleViewListing = () => {
    if (success?.listingId) {
      navigate(`/marketplace/listings/${success.listingId}`);
    }
  };
  
  // Navigate back to marketplace
  const handleBackToMarketplace = () => {
    navigate('/marketplace');
  };
  
  return (
    <div className="create-listing-container">
      <div className="create-listing-header">
        <button 
          className="btn btn-outline-primary mb-3"
          onClick={handleBackToMarketplace}
        >
          &larr; Back to Marketplace
        </button>
        <h2>Create Marketplace Listing</h2>
        <p className="create-listing-description">
          Share your robot skills with the AIRA community and earn money from your creations
        </p>
      </div>
      
      {success ? (
        <div className="success-container">
          <div className="alert alert-success">
            <h4>Success!</h4>
            <p>{success.message}</p>
          </div>
          <div className="d-grid gap-2">
            <button 
              className="btn btn-primary"
              onClick={handleViewListing}
            >
              View Your Listing
            </button>
            <button 
              className="btn btn-outline-primary"
              onClick={() => {
                setSuccess(null);
                setListingData({
                  title: '',
                  description: '',
                  price: '',
                  category: 'locomotion',
                  tags: '',
                  skillId: '',
                  skillUrl: ''
                });
              }}
            >
              Create Another Listing
            </button>
          </div>
        </div>
      ) : (
        <div className="row">
          <div className="col-lg-8">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">Listing Information</h5>
              </div>
              <div className="card-body">
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title *</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="title"
                      name="title"
                      value={listingData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description *</label>
                    <textarea 
                      className="form-control" 
                      id="description"
                      name="description"
                      rows="5"
                      value={listingData.description}
                      onChange={handleInputChange}
                      required
                    ></textarea>
                    <div className="form-text">
                      Provide a detailed description of your skill, including what it does and how it can be used.
                    </div>
                  </div>
                  
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="price" className="form-label">Price ($) *</label>
                        <input 
                          type="number" 
                          className="form-control" 
                          id="price"
                          name="price"
                          min="0.99"
                          step="0.01"
                          value={listingData.price}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="category" className="form-label">Category *</label>
                        <select 
                          className="form-select" 
                          id="category"
                          name="category"
                          value={listingData.category}
                          onChange={handleInputChange}
                          required
                        >
                          {categories.map(category => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="tags" className="form-label">Tags</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="tags"
                      name="tags"
                      value={listingData.tags}
                      onChange={handleInputChange}
                      placeholder="walking, arms, balance (comma separated)"
                    />
                    <div className="form-text">
                      Separate tags with commas
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="skillUrl" className="form-label">Skill URL</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="skillUrl"
                      name="skillUrl"
                      value={listingData.skillUrl}
                      onChange={handleInputChange}
                      placeholder="URL to your exported skill file"
                    />
                    <div className="form-text">
                      Enter the URL to your exported skill file
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="skillId" className="form-label">Skill ID</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="skillId"
                      name="skillId"
                      value={listingData.skillId}
                      onChange={handleInputChange}
                      placeholder="ID of your existing skill"
                    />
                    <div className="form-text">
                      If you've already uploaded a skill, enter its ID here
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="previewImage" className="form-label">Preview Image</label>
                    <input 
                      type="file" 
                      className="form-control" 
                      id="previewImage"
                      accept="image/*"
                      onChange={handlePreviewUpload}
                    />
                    <div className="form-text">
                      Upload an image or GIF that demonstrates your skill
                    </div>
                  </div>
                  
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Creating...
                      </>
                    ) : 'Create Listing'}
                  </button>
                </form>
              </div>
            </div>
          </div>
          
          <div className="col-lg-4">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">Preview</h5>
              </div>
              <div className="card-body">
                <div className="listing-preview">
                  {previewImage ? (
                    <img 
                      src={previewImage} 
                      alt="Preview" 
                      className="preview-image"
                    />
                  ) : (
                    <div className="placeholder-preview">
                      <i className="bi bi-image"></i>
                      <p>Preview image will appear here</p>
                    </div>
                  )}
                </div>
                
                <div className="preview-details mt-3">
                  <h5>{listingData.title || 'Listing Title'}</h5>
                  <p className="preview-description">
                    {listingData.description || 'Listing description will appear here...'}
                  </p>
                  <div className="preview-price">
                    ${parseFloat(listingData.price || 0).toFixed(2)}
                  </div>
                  <div className="preview-tags mt-2">
                    {listingData.tags && listingData.tags.split(',').map((tag, index) => (
                      <span key={index} className="badge bg-secondary me-1">{tag.trim()}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="card mt-4">
              <div className="card-header">
                <h5 className="card-title mb-0">Listing Guidelines</h5>
              </div>
              <div className="card-body">
                <ul className="guidelines-list">
                  <li>Provide accurate and detailed descriptions</li>
                  <li>Set fair prices for your skills</li>
                  <li>Upload high-quality preview images or GIFs</li>
                  <li>Ensure your skill works with AIRA Humanoid Robot</li>
                  <li>Respond promptly to buyer questions</li>
                  <li>Marketplace fee: 15% of sale price</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateListing;
