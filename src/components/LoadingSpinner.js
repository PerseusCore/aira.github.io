import React from 'react';

const LoadingSpinner = ({ size = 'medium', text = 'Loading...' }) => {
  let spinnerSize;
  switch (size) {
    case 'small':
      spinnerSize = '1rem';
      break;
    case 'large':
      spinnerSize = '3rem';
      break;
    case 'medium':
    default:
      spinnerSize = '2rem';
  }

  return (
    <div className="text-center my-4">
      <div 
        className="loading-spinner mx-auto" 
        style={{ width: spinnerSize, height: spinnerSize }}
      ></div>
      {text && <p className="mt-2">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
