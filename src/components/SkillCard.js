import React from 'react';

const SkillCard = ({ skill, onDelete }) => {
  return (
    <div className="card skill-card h-100">
      <div className="card-header">
        <h5 className="card-title mb-0">{skill.name}</h5>
      </div>
      <div className="card-body">
        <p className="card-text">
          {skill.description || 'No description provided'}
        </p>
        <p className="text-muted small">
          Created: {new Date(skill.exportDate).toLocaleDateString()}
        </p>
      </div>
      <div className="card-footer bg-transparent d-flex justify-content-between">
        <a href={`/skills/${skill.id}`} className="btn btn-sm btn-outline-primary">
          View Details
        </a>
        <div>
          <a 
            href={`/api/download/${skill.id}`} 
            className="btn btn-sm btn-outline-success me-2"
            download
          >
            Download
          </a>
          <button 
            className="btn btn-sm btn-outline-danger"
            onClick={() => onDelete(skill.id, skill.name)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkillCard;
