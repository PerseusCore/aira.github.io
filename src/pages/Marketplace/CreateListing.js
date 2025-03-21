import React from 'react';
import { Link } from 'react-router-dom';

const CreateListing = () => {
  return (
    <div className="container my-4">
      <h2>Create Marketplace Listing</h2>
      <p className="lead">Share your robot skills with the AIRA community</p>
      
      <form className="mt-4">
        <div className="card mb-4">
          <div className="card-header">
            <h4>Skill Information</h4>
          </div>
          <div className="card-body">
            <div className="mb-3">
              <label htmlFor="skillName" className="form-label">Skill Name</label>
              <input type="text" className="form-control" id="skillName" placeholder="Enter a descriptive name" />
            </div>
            
            <div className="mb-3">
              <label htmlFor="skillDescription" className="form-label">Description</label>
              <textarea className="form-control" id="skillDescription" rows="3" placeholder="Describe what your skill does"></textarea>
            </div>
            
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="skillCategory" className="form-label">Category</label>
                <select className="form-select" id="skillCategory">
                  <option value="">Select a category</option>
                  <option value="locomotion">Locomotion</option>
                  <option value="manipulation">Manipulation</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="utility">Utility</option>
                </select>
              </div>
              
              <div className="col-md-6 mb-3">
                <label htmlFor="skillPrice" className="form-label">Price (USD)</label>
                <div className="input-group">
                  <span className="input-group-text">$</span>
                  <input type="number" className="form-control" id="skillPrice" placeholder="19.99" step="0.01" min="0" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="card mb-4">
          <div className="card-header">
            <h4>Skill Details</h4>
          </div>
          <div className="card-body">
            <div className="mb-3">
              <label htmlFor="skillDetails" className="form-label">Detailed Description</label>
              <textarea className="form-control" id="skillDetails" rows="5" placeholder="Provide detailed information about your skill"></textarea>
            </div>
            
            <div className="mb-3">
              <label htmlFor="skillRequirements" className="form-label">Requirements</label>
              <textarea className="form-control" id="skillRequirements" rows="3" placeholder="List any hardware or software requirements"></textarea>
            </div>
          </div>
        </div>
        
        <div className="card mb-4">
          <div className="card-header">
            <h4>Upload Files</h4>
          </div>
          <div className="card-body">
            <div className="mb-3">
              <label htmlFor="skillFile" className="form-label">Skill File (ARC format)</label>
              <input className="form-control" type="file" id="skillFile" />
              <div className="form-text">Upload your skill file in ARC format (.arcskill)</div>
            </div>
            
            <div className="mb-3">
              <label htmlFor="previewImage" className="form-label">Preview Image</label>
              <input className="form-control" type="file" id="previewImage" />
              <div className="form-text">Upload an image that demonstrates your skill (optional)</div>
            </div>
          </div>
        </div>
        
        <div className="d-flex justify-content-between">
          <Link to="/marketplace" className="btn btn-outline-secondary">Cancel</Link>
          <button type="submit" className="btn btn-primary">Create Listing</button>
        </div>
      </form>
    </div>
  );
};

export default CreateListing;
