import React from 'react';

const PositionList = ({ positions, onLoad, onDelete }) => {
  return (
    <div className="position-list">
      {Object.keys(positions).length === 0 ? (
        <p className="text-muted">No positions saved yet</p>
      ) : (
        <div className="list-group">
          {Object.keys(positions).map(positionName => (
            <div 
              className="list-group-item list-group-item-action position-item d-flex justify-content-between align-items-center" 
              key={positionName}
            >
              <span 
                className="position-name"
                onClick={() => onLoad(positionName)}
                style={{ cursor: 'pointer', flexGrow: 1 }}
              >
                {positionName}
              </span>
              <button 
                className="btn btn-sm btn-outline-danger"
                onClick={() => onDelete(positionName)}
                aria-label={`Delete ${positionName}`}
              >
                <i className="bi bi-trash"></i>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PositionList;
