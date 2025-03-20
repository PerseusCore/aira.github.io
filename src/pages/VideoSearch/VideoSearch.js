import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as tf from '@tensorflow/tfjs';
import ReactPlayer from 'react-player';
import './VideoSearch.css';

const VideoSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [model, setModel] = useState(null);
  const [modelLoading, setModelLoading] = useState(true);
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([
    'walking', 'running', 'jumping', 'dancing', 'sitting', 'standing',
    'arms', 'legs', 'full-body', 'precision', 'balance', 'speed'
  ]);
  
  const navigate = useNavigate();
  const searchInputRef = useRef(null);
  
  // Load TensorFlow model on component mount
  useEffect(() => {
    const loadModel = async () => {
      try {
        setModelLoading(true);
        // Load MobileNet model for image classification
        // This will be used for video frame analysis
        const loadedModel = await tf.loadLayersModel('https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json');
        setModel(loadedModel);
        console.log('AI model loaded successfully');
        setModelLoading(false);
      } catch (err) {
        console.error('Failed to load AI model:', err);
        setError('Failed to load AI model. Some search features may be limited.');
        setModelLoading(false);
      }
    };
    
    loadModel();
    
    // Focus search input on component mount
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
    
    return () => {
      // Cleanup if needed
    };
  }, []);
  
  // Handle search form submission
  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim() && selectedTags.length === 0) {
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Call the search API
      const response = await fetch(`/api/videos/search?query=${encodeURIComponent(searchQuery)}&tags=${selectedTags.join(',')}`);
      
      if (!response.ok) {
        throw new Error('Failed to search videos');
      }
      
      const data = await response.json();
      setSearchResults(data.results || []);
      setIsLoading(false);
    } catch (err) {
      console.error('Error searching videos:', err);
      setError(err.message || 'An error occurred while searching videos');
      setIsLoading(false);
    }
  };
  
  // Handle tag selection
  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  
  // Navigate to video detail page
  const handleVideoClick = (videoId) => {
    navigate(`/videos/${videoId}`);
  };
  
  // Analyze video content with AI (for demonstration purposes)
  const analyzeVideoContent = async (videoUrl) => {
    if (!model) return null;
    
    try {
      // In a real implementation, this would:
      // 1. Extract frames from the video
      // 2. Process each frame through the AI model
      // 3. Aggregate results to identify actions, objects, etc.
      
      // For demonstration, we'll return mock analysis results
      return {
        actions: ['walking', 'turning', 'gesturing'],
        objects: ['person', 'robot'],
        confidence: 0.87
      };
    } catch (err) {
      console.error('Error analyzing video content:', err);
      return null;
    }
  };
  
  return (
    <div className="video-search-container">
      <div className="search-header">
        <h2>AI Video Search</h2>
        <p className="search-description">
          Search for videos by keywords or select tags to find robot movements and skills
        </p>
      </div>
      
      {modelLoading && (
        <div className="model-loading-message">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading AI model...</span>
          </div>
          <p>Loading AI search capabilities...</p>
        </div>
      )}
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSearch} className="search-form">
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search for robot movements, skills, or actions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            ref={searchInputRef}
          />
          <button 
            className="btn btn-primary" 
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Searching...
              </>
            ) : 'Search'}
          </button>
        </div>
        
        <div className="tags-container mb-4">
          <p className="tags-label">Filter by tags:</p>
          <div className="tags-list">
            {availableTags.map(tag => (
              <button
                key={tag}
                type="button"
                className={`tag-button ${selectedTags.includes(tag) ? 'selected' : ''}`}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </form>
      
      <div className="search-results">
        {isLoading ? (
          <div className="text-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Searching videos...</p>
          </div>
        ) : searchResults.length > 0 ? (
          <>
            <h3>Search Results</h3>
            <div className="row">
              {searchResults.map(video => (
                <div className="col-md-4 mb-4" key={video.id}>
                  <div className="card video-card">
                    <div className="video-thumbnail" onClick={() => handleVideoClick(video.id)}>
                      {video.thumbnailUrl ? (
                        <img 
                          src={video.thumbnailUrl} 
                          alt={video.title} 
                          className="card-img-top"
                        />
                      ) : (
                        <div className="placeholder-thumbnail">
                          <i className="bi bi-film"></i>
                        </div>
                      )}
                      <div className="video-duration">{video.duration}</div>
                    </div>
                    <div className="card-body">
                      <h5 className="card-title">{video.title}</h5>
                      <p className="card-text">{video.description}</p>
                      <div className="video-tags">
                        {video.tags && video.tags.map(tag => (
                          <span key={tag} className="badge bg-secondary me-1">{tag}</span>
                        ))}
                      </div>
                      <div className="video-meta mt-2">
                        <small className="text-muted">
                          Uploaded: {new Date(video.uploadDate).toLocaleDateString()}
                        </small>
                      </div>
                    </div>
                    <div className="card-footer">
                      <button 
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleVideoClick(video.id)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : searchQuery || selectedTags.length > 0 ? (
          <div className="no-results">
            <p>No videos found matching your search criteria.</p>
            <p>Try different keywords or tags.</p>
          </div>
        ) : (
          <div className="search-instructions">
            <h3>How to use AI Video Search</h3>
            <ul>
              <li>Enter keywords related to robot movements or skills</li>
              <li>Select tags to filter by specific categories</li>
              <li>Our AI will analyze video content to find relevant matches</li>
              <li>Click on a video to view details and extract DOF data</li>
            </ul>
            <div className="mt-4">
              <h4>Popular Searches</h4>
              <div className="popular-searches">
                <button 
                  className="btn btn-sm btn-outline-secondary me-2 mb-2"
                  onClick={() => {
                    setSearchQuery('walking pattern');
                    handleSearch({ preventDefault: () => {} });
                  }}
                >
                  Walking Pattern
                </button>
                <button 
                  className="btn btn-sm btn-outline-secondary me-2 mb-2"
                  onClick={() => {
                    setSearchQuery('arm movement');
                    handleSearch({ preventDefault: () => {} });
                  }}
                >
                  Arm Movement
                </button>
                <button 
                  className="btn btn-sm btn-outline-secondary me-2 mb-2"
                  onClick={() => {
                    setSearchQuery('precision grasping');
                    handleSearch({ preventDefault: () => {} });
                  }}
                >
                  Precision Grasping
                </button>
                <button 
                  className="btn btn-sm btn-outline-secondary me-2 mb-2"
                  onClick={() => {
                    setSearchQuery('balance');
                    handleSearch({ preventDefault: () => {} });
                  }}
                >
                  Balance
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoSearch;
