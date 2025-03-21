import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import myImage from '../assets/isaac-lab-1980x1080.jpg'

const Home = () => {
  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1>AIRA Humanoid Robot Skill Export</h1>
              <p className="lead">
                Create, export, and share robot skills for your AIRA Humanoid Robot with our comprehensive platform
              </p>
              <div className="hero-buttons">
                <Link to="/videos/search" className="btn btn-primary btn-lg me-3">
                  AI Video Search
                </Link>
                <Link to="/marketplace" className="btn btn-outline-primary btn-lg">
                  Explore Marketplace
                </Link>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="hero-image">
                <img src={myImage} alt="AIRA Humanoid Robot" className="img-fluid" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="features-section">
        <div className="container">
          <h2 className="section-title">New Features</h2>
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="bi bi-search"></i>
                </div>
                <h3>AI Video Search</h3>
                <p>
                  Search for videos of specific jobs or tasks using our AI-powered search functionality. Find the perfect movements for your robot.
                </p>
                <Link to="/videos/search" className="btn btn-outline-primary">Try It Now</Link>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="bi bi-upload"></i>
                </div>
                <h3>Video Upload & Processing</h3>
                <p>
                  Upload your own videos and extract motion capture data. Convert movements into DOF data for your AIRA Humanoid Robot.
                </p>
                <Link to="/videos/upload" className="btn btn-outline-primary">Upload Video</Link>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="bi bi-shop"></i>
                </div>
                <h3>Skill Marketplace</h3>
                <p>
                  Buy and sell robot skills in our marketplace. Share your expertise and discover new movements for your robot.
                </p>
                <Link to="/marketplace" className="btn btn-outline-primary">Visit Marketplace</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="workflow-section">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="workflow-steps">
            <div className="workflow-step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>Find or Upload Videos</h4>
                <p>Search for existing videos or upload your own to extract motion data</p>
              </div>
            </div>
            <div className="workflow-step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>Process Motion Capture</h4>
                <p>Our AI analyzes the video to extract joint positions and movements</p>
              </div>
            </div>
            <div className="workflow-step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>Convert to DOF Format</h4>
                <p>Convert motion capture data to DOF format compatible with your robot</p>
              </div>
            </div>
            <div className="workflow-step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h4>Export to ARC Skill</h4>
                <p>Export the processed data as an ARC skill for your AIRA Humanoid Robot</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to enhance your AIRA Humanoid Robot?</h2>
            <p>Start creating, exporting, and sharing robot skills today</p>
            <Link to="/videos/search" className="btn btn-primary btn-lg">Get Started</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
