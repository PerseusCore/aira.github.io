import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SkillCard from '../components/SkillCard';
import LoadingSpinner from '../components/LoadingSpinner';
import DatabaseExport from '../components/DatabaseExport';

const SkillList = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showExportPanel, setShowExportPanel] = useState(false);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/skills');
      
      if (!response.ok) {
        throw new Error('Failed to fetch skills');
      }
      
      const data = await response.json();
      setSkills(data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleDeleteSkill = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete the skill "${name}"?`)) {
      return;
    }
    
    try {
      const response = await fetch(`/api/skills/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete skill');
      }
      
      // Refresh skills list
      fetchSkills();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Robot Skills</h2>
        <div>
          <button 
            className="btn btn-outline-primary me-2"
            onClick={() => setShowExportPanel(!showExportPanel)}
          >
            {showExportPanel ? 'Hide Export Panel' : 'Export Database'}
          </button>
          <Link to="/export" className="btn btn-primary">
            Create New Skill
          </Link>
        </div>
      </div>
      
      {showExportPanel && (
        <DatabaseExport />
      )}
      
      {loading ? (
        <div className="text-center my-5">
          <LoadingSpinner text="Loading skills..." />
        </div>
      ) : error ? (
        <div className="alert alert-danger">
          {error}
        </div>
      ) : skills.length === 0 ? (
        <div className="text-center my-5">
          <p className="lead">You haven't created any skills yet.</p>
          <Link to="/export" className="btn btn-primary mt-3">
            Create Your First Skill
          </Link>
        </div>
      ) : (
        <div className="row">
          {skills.map(skill => (
            <div className="col-md-4 mb-4" key={skill.id}>
              <SkillCard 
                skill={skill} 
                onDelete={() => handleDeleteSkill(skill.id, skill.name)} 
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SkillList;
