import React from 'react';

const ServoGroup = ({ title, servos, servoPositions, onServoChange }) => {
  return (
    <div className="servo-group">
      <h4>{title}</h4>
      <div className="row">
        {servos.map(servo => (
          <div className="col-md-6 mb-3" key={servo}>
            <label htmlFor={servo} className="form-label">{servo.replace('_', ' ')}: {servoPositions[servo]}°</label>
            <input 
              type="range" 
              className="form-range servo-slider" 
              id={servo}
              min="0" 
              max="180" 
              value={servoPositions[servo]}
              onChange={(e) => onServoChange(servo, e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServoGroup;
