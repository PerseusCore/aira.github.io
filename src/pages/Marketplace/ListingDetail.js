import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PayPalButton from '../../components/PayPalButton';

const ListingDetail = ({ listing, onPurchase }) => {
  const [showPayment, setShowPayment] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  
  // Mock data for testing
  const mockListing = {
    id: 1,
    name: 'Walking Pattern',
    description: 'Smooth bipedal walking pattern for humanoid robots. This skill provides a stable and efficient walking gait for AIRA humanoid robots, with adjustable parameters for speed, stride length, and stability.',
    author: 'RoboticsExpert',
    price: '19.99',
    createdAt: new Date().toISOString(),
    category: 'locomotion',
    details: 'This skill was developed using motion capture data from human subjects and optimized for the AIRA robot platform. It includes balance compensation algorithms and adaptive foot placement for uneven terrain.'
  };
  
  const activeListing = listing || mockListing;
  
  const handlePaymentSuccess = (details) => {
    console.log('Payment successful:', details);
    setPurchaseSuccess(true);
    if (onPurchase) {
      onPurchase(activeListing.id, details);
    }
  };
  
  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
  };
  
  return (
    <div className="container my-4">
      <div className="row">
        <div className="col-md-8">
          <h2>{activeListing.name}</h2>
          <p className="lead">{activeListing.description}</p>
          
          <div className="card mb-4">
            <div className="card-header">
              <h4>Skill Details</h4>
            </div>
            <div className="card-body">
              <p>{activeListing.details}</p>
              
              <div className="row mt-4">
                <div className="col-md-6">
                  <h5>Author</h5>
                  <p>{activeListing.author}</p>
                </div>
                <div className="col-md-6">
                  <h5>Category</h5>
                  <p className="text-capitalize">{activeListing.category}</p>
                </div>
              </div>
              
              <div className="row mt-2">
                <div className="col-md-6">
                  <h5>Created</h5>
                  <p>{new Date(activeListing.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="col-md-6">
                  <h5>Compatibility</h5>
                  <p>AIRA Humanoid Robot v2.0+</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="card-header">
              <h4>Requirements</h4>
            </div>
            <div className="card-body">
              <ul>
                <li>AIRA Humanoid Robot with firmware v3.5 or higher</li>
                <li>ARC Software v2023.1 or higher</li>
                <li>Minimum 14 servos for body movements</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">Purchase Skill</h4>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-3">
                <h5>Price:</h5>
                <h5>${activeListing.price}</h5>
              </div>
              
              {purchaseSuccess ? (
                <div>
                  <div className="alert alert-success">
                    Thank you for your purchase! You can now download this skill.
                  </div>
                  <Link to={`/skills/${activeListing.id}/download`} className="btn btn-primary btn-lg w-100">
                    Download Skill
                  </Link>
                </div>
              ) : showPayment ? (
                <div>
                  <h5 className="mb-3">Complete Purchase</h5>
                  <PayPalButton 
                    amount={activeListing.price} 
                    description={`Purchase of ${activeListing.name} skill`}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                  <button 
                    className="btn btn-outline-secondary w-100 mt-3"
                    onClick={() => setShowPayment(false)}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button 
                  className="btn btn-success btn-lg w-100"
                  onClick={() => setShowPayment(true)}
                >
                  Buy Now
                </button>
              )}
              
              <div className="mt-4">
                <h6>Includes:</h6>
                <ul className="list-unstyled">
                  <li><i className="bi bi-check-circle-fill text-success me-2"></i> Lifetime updates</li>
                  <li><i className="bi bi-check-circle-fill text-success me-2"></i> Technical support</li>
                  <li><i className="bi bi-check-circle-fill text-success me-2"></i> Documentation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;
