import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PayPalButton from '../components/PayPalButton';

const SkillDetail = ({ skill, onPurchase }) => {
  const [showPayment, setShowPayment] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  
  const handlePaymentSuccess = (details) => {
    console.log('Payment successful:', details);
    setPurchaseSuccess(true);
    if (onPurchase) {
      onPurchase(skill.id, details);
    }
  };
  
  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
  };
  
  return (
    <div className="card h-100">
      <div className="card-header bg-primary text-white">
        <h5 className="card-title mb-0">{skill.name}</h5>
      </div>
      <div className="card-body">
        <p className="card-text">{skill.description || 'No description available'}</p>
        <div className="mb-3">
          <strong>Created:</strong> {new Date(skill.createdAt).toLocaleDateString()}
        </div>
        <div className="mb-3">
          <strong>Author:</strong> {skill.author || 'Unknown'}
        </div>
        <div className="mb-3">
          <strong>Price:</strong> ${skill.price || '9.99'}
        </div>
        
        {purchaseSuccess ? (
          <div className="alert alert-success">
            Thank you for your purchase! You can now download this skill.
          </div>
        ) : showPayment ? (
          <div className="mt-3">
            <h5>Complete Purchase</h5>
            <PayPalButton 
              amount={skill.price || '9.99'} 
              description={`Purchase of ${skill.name} skill`}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
            <button 
              className="btn btn-outline-secondary mt-2"
              onClick={() => setShowPayment(false)}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button 
            className="btn btn-success mt-2"
            onClick={() => setShowPayment(true)}
          >
            Purchase Skill
          </button>
        )}
      </div>
      <div className="card-footer d-flex justify-content-between">
        <Link to={`/skills/${skill.id}`} className="btn btn-outline-primary">
          View Details
        </Link>
        {purchaseSuccess && (
          <Link to={`/skills/${skill.id}/download`} className="btn btn-primary">
            Download
          </Link>
        )}
      </div>
    </div>
  );
};

export default SkillDetail;
