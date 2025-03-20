import React from 'react';

const FeatureCard = ({ title, description, buttonText, buttonLink }) => {
  return (
    <div className="card h-100">
      <div className="card-header">
        <h3 className="card-title">{title}</h3>
      </div>
      <div className="card-body">
        <p>{description}</p>
        {buttonText && buttonLink && (
          <a href={buttonLink} className="btn btn-primary">
            {buttonText}
          </a>
        )}
      </div>
    </div>
  );
};

export default FeatureCard;