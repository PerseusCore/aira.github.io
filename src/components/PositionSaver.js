import React from 'react';

const PositionSaver = ({ currentPositionName, setCurrentPositionName, onSavePosition }) => {
  return (
    <div className="position-saver">
      <div className="input-group mb-3">
        <input 
          type="text" 
          className="form-control" 
          placeholder="Position name" 
          value={currentPositionName}
          onChange={(e) => setCurrentPositionName(e.target.value)}
          aria-label="Position name"
        />
        <button 
          className="btn btn-outline-primary" 
          type="button"
          onClick={onSavePosition}
          disabled={!currentPositionName.trim()}
        >
          Save Current
        </button>
      </div>
    </div>
  );
};

export default PositionSaver;
