import React from 'react';

const StepIndicator = ({ steps, currentStep }) => {
  return (
    <div className="step-indicator mb-4">
      <div className="row">
        {steps.map((step, index) => (
          <div className="col text-center mb-3" key={index}>
            <div 
              className={`bg-${index < currentStep ? 'success' : (index === currentStep ? 'primary' : 'light')} 
                p-3 rounded-circle mx-auto mb-3`} 
              style={{ 
                width: '80px', 
                height: '80px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: index <= currentStep ? 'white' : 'inherit'
              }}
            >
              <h2>{index + 1}</h2>
            </div>
            <h5>{step}</h5>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;