import React from 'react';

const ServoControl = ({ name, value, onChange }) => {
  return (
    <div className="mb-3">
      <label htmlFor={name} className="form-label">
        {name.replace('_', ' ')}: {value}°
      </label>
      <input 
        type="range" 
        className="form-range servo-slider" 
        id={name}
        min="0" 
        max="180" 
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
      />
    </div>
  );
};

export default ServoControl;