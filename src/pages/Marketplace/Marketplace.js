import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/LoadingSpinner';
import MarketplaceSkillCard from '../../components/MarketplaceSkillCard';

const Marketplace = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchMarketplaceSkills();
  }, []);

  const fetchMarketplaceSkills = async () => {
    try {
      setLoading(true);
      // In a real implementation, this would fetch from your marketplace API
      // For now, we'll simulate a response
      setTimeout(() => {
        const mockSkills = [
          {
            id: 1,
            name: 'Walking Pattern',
            description: 'Smooth bipedal walking pattern for humanoid robots',
            author: 'RoboticsExpert',
            price: '19.99',
            createdAt: new Date().toISOString(),
            category: 'locomotion'
          },
          {
            id: 2,
            name: 'Arm Manipulation',
            description: 'Precise arm and hand movements for object manipulation',
            author: 'AIRAdev',
            price: '24.99',
            createdAt: new Date().toISOString(),
            category: 'manipulation'
          },
          {
            id: 3,
            name: 'Dance Routine',
            description: 'Fun dance sequence with synchronized movements',
            author: 'DanceBot',
            price: '14.99',
            createdAt: new Date().toISOString(),
            category: 'entertainment'
          }
        ];
        setSkills(mockSkills);
        setLoading(false);
      }, 1000);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handlePurchase = (skillId, paymentDetails) => {
    console.log(`Skill ${skillId} purchased:`, paymentDetails);
    // In a real implementation, you would update the user's purchased skills
    // and handle any necessary backend operations
  };

  const filteredSkills = filter === 'all' 
    ? skills 
    : skills.filter(skill => skill.category === filter);

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Skill Marketplace</h2>
        <div className="dropdown">
          <button 
            className="btn btn-outline-primary dropdown-toggle" 
            type="button" 
            id="filterDropdown" 
            data-bs-toggle="dropdown" 
            aria-expanded="false"
          >
            Filter: {filter === 'all' ? 'All Categories' : filter}
          </button>
          <ul className="dropdown-menu" aria-labelledby="filterDropdown">
            <li><button className="dropdown-item" onClick={() => setFilter('all')}>All Categories</button></li>
            <li><button className="dropdown-item" onClick={() => setFilter('locomotion')}>Locomotion</button></li>
            <li><button className="dropdown-item" onClick={() => setFilter('manipulation')}>Manipulation</button></li>
            <li><button className="dropdown-item" onClick={() => setFilter('entertainment')}>Entertainment</button></li>
          </ul>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center my-5">
          <LoadingSpinner text="Loading marketplace skills..." />
        </div>
      ) : error ? (
        <div className="alert alert-danger">
          {error}
        </div>
      ) : filteredSkills.length === 0 ? (
        <div className="text-center my-5">
          <p className="lead">No skills found in this category.</p>
        </div>
      ) : (
        <div className="row">
          {filteredSkills.map(skill => (
            <div className="col-md-4 mb-4" key={skill.id}>
              <MarketplaceSkillCard 
                skill={skill} 
                onPurchase={handlePurchase} 
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Marketplace;
