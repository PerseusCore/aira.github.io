import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TabNavigation from './TabNavigation';
import ServoGroup from './ServoGroup';
import PositionSaver from './PositionSaver';
import PositionList from './PositionList';
import RobotVisualization from './RobotVisualization';
import LoadingSpinner from './LoadingSpinner';
import Alert from './Alert';

const InteractiveRobotControl = ({ 
  externalServoPositions, 
  onExternalServoChange, 
  externalSavedPositions,
  onExternalSavePosition,
  onExternalLoadPosition,
  onExternalDeletePosition,
  hideRobotVisualization = false
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('body');
  const [servoPositions, setServoPositions] = useState({
    // Body servos
    Head_Pan: 90,
    Head_Tilt: 90,
    Left_Shoulder: 90,
    Left_Shoulder_Pan: 90,
    Left_Elbow: 90,
    Right_Shoulder: 90,
    Right_Shoulder_Pan: 90,
    Right_Elbow: 90,
    Waist: 90,
    Torso: 90,
    Left_Hip: 90,
    Left_Knee: 90,
    Left_Ankle: 90,
    Right_Hip: 90,
    Right_Knee: 90,
    Right_Ankle: 90,
    
    // Hand servos
    Left_Thumb: 90,
    Left_Index: 90,
    Left_Middle: 90,
    Left_Ring: 90,
    Left_Pinky: 90,
    Left_Wrist: 90,
    Right_Thumb: 90,
    Right_Index: 90,
    Right_Middle: 90,
    Right_Ring: 90,
    Right_Pinky: 90,
    Right_Wrist: 90
  });
  
  // Use external servo positions if provided
  const activeServoPositions = externalServoPositions || servoPositions;
  
  const [savedPositions, setSavedPositions] = useState({});
  // Use external saved positions if provided
  const activeSavedPositions = externalSavedPositions || savedPositions;
  
  const [currentPositionName, setCurrentPositionName] = useState('');
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  
  const bodyServos = [
    'Head_Pan', 'Head_Tilt', 
    'Left_Shoulder', 'Left_Shoulder_Pan', 'Left_Elbow', 
    'Right_Shoulder', 'Right_Shoulder_Pan', 'Right_Elbow',
    'Waist', 'Torso',
    'Left_Hip', 'Left_Knee', 'Left_Ankle',
    'Right_Hip', 'Right_Knee', 'Right_Ankle'
  ];
  
  const handServos = [
    'Left_Thumb', 'Left_Index', 'Left_Middle', 'Left_Ring', 'Left_Pinky', 'Left_Wrist',
    'Right_Thumb', 'Right_Index', 'Right_Middle', 'Right_Ring', 'Right_Pinky', 'Right_Wrist'
  ];
  
  const handleServoChange = (servo, value) => {
    if (onExternalServoChange) {
      // If external handler is provided, use it
      onExternalServoChange(servo, value);
    } else {
      // Otherwise use internal state
      setServoPositions({
        ...servoPositions,
        [servo]: parseInt(value)
      });
    }
  };
  
  const handleSavePosition = () => {
    if (!currentPositionName.trim()) {
      setAlert({
        show: true,
        type: 'warning',
        message: 'Please enter a position name'
      });
      return;
    }
    
    if (onExternalSavePosition) {
      // If external handler is provided, use it
      onExternalSavePosition(currentPositionName, activeServoPositions);
    } else {
      // Otherwise use internal state
      setSavedPositions({
        ...savedPositions,
        [currentPositionName]: { ...activeServoPositions }
      });
    }
    
    setCurrentPositionName('');
    setAlert({
      show: true,
      type: 'success',
      message: `Position "${currentPositionName}" saved successfully`
    });
    
    // Hide alert after 3 seconds
    setTimeout(() => {
      setAlert({ show: false, type: '', message: '' });
    }, 3000);
  };
  
  const handleLoadPosition = (positionName) => {
    if (activeSavedPositions[positionName]) {
      if (onExternalLoadPosition) {
        // If external handler is provided, use it
        onExternalLoadPosition(positionName);
      } else {
        // Otherwise use internal state
        setServoPositions(activeSavedPositions[positionName]);
      }
      
      setAlert({
        show: true,
        type: 'info',
        message: `Position "${positionName}" loaded`
      });
      
      // Hide alert after 3 seconds
      setTimeout(() => {
        setAlert({ show: false, type: '', message: '' });
      }, 3000);
    }
  };
  
  const handleDeletePosition = (positionName) => {
    if (window.confirm(`Are you sure you want to delete the position "${positionName}"?`)) {
      if (onExternalDeletePosition) {
        // If external handler is provided, use it
        onExternalDeletePosition(positionName);
      } else {
        // Otherwise use internal state
        const updatedPositions = { ...savedPositions };
        delete updatedPositions[positionName];
        setSavedPositions(updatedPositions);
      }
      
      setAlert({
        show: true,
        type: 'danger',
        message: `Position "${positionName}" deleted`
      });
      
      // Hide alert after 3 seconds
      setTimeout(() => {
        setAlert({ show: false, type: '', message: '' });
      }, 3000);
    }
  };
  
  const handleResetAllServos = () => {
    if (window.confirm('Are you sure you want to reset all servos to default positions?')) {
      const resetPositions = {};
      [...bodyServos, ...handServos].forEach(servo => {
        resetPositions[servo] = 90;
      });
      
      if (onExternalServoChange) {
        // If external handler is provided, reset each servo individually
        Object.entries(resetPositions).forEach(([servo, value]) => {
          onExternalServoChange(servo, value);
        });
      } else {
        // Otherwise use internal state
        setServoPositions(resetPositions);
      }
      
      setAlert({
        show: true,
        type: 'info',
        message: 'All servos reset to default positions'
      });
      
      // Hide alert after 3 seconds
      setTimeout(() => {
        setAlert({ show: false, type: '', message: '' });
      }, 3000);
    }
  };
  
  const handleMirrorLeftRight = () => {
    const mirroredPositions = { ...activeServoPositions };
    
    // Mirror body servos
    mirroredPositions.Left_Shoulder = activeServoPositions.Right_Shoulder;
    mirroredPositions.Left_Shoulder_Pan = activeServoPositions.Right_Shoulder_Pan;
    mirroredPositions.Left_Elbow = activeServoPositions.Right_Elbow;
    mirroredPositions.Left_Hip = activeServoPositions.Right_Hip;
    mirroredPositions.Left_Knee = activeServoPositions.Right_Knee;
    mirroredPositions.Left_Ankle = activeServoPositions.Right_Ankle;
    
    mirroredPositions.Right_Shoulder = activeServoPositions.Left_Shoulder;
    mirroredPositions.Right_Shoulder_Pan = activeServoPositions.Left_Shoulder_Pan;
    mirroredPositions.Right_Elbow = activeServoPositions.Left_Elbow;
    mirroredPositions.Right_Hip = activeServoPositions.Left_Hip;
    mirroredPositions.Right_Knee = activeServoPositions.Left_Knee;
    mirroredPositions.Right_Ankle = activeServoPositions.Left_Ankle;
    
    // Mirror hand servos
    mirroredPositions.Left_Thumb = activeServoPositions.Right_Thumb;
    mirroredPositions.Left_Index = activeServoPositions.Right_Index;
    mirroredPositions.Left_Middle = activeServoPositions.Right_Middle;
    mirroredPositions.Left_Ring = activeServoPositions.Right_Ring;
    mirroredPositions.Left_Pinky = activeServoPositions.Right_Pinky;
    mirroredPositions.Left_Wrist = activeServoPositions.Right_Wrist;
    
    mirroredPositions.Right_Thumb = activeServoPositions.Left_Thumb;
    mirroredPositions.Right_Index = activeServoPositions.Left_Index;
    mirroredPositions.Right_Middle = activeServoPositions.Left_Middle;
    mirroredPositions.Right_Ring = activeServoPositions.Left_Ring;
    mirroredPositions.Right_Pinky = activeServoPositions.Left_Pinky;
    mirroredPositions.Right_Wrist = activeServoPositions.Left_Wrist;
    
    if (onExternalServoChange) {
      // If external handler is provided, update each servo individually
      Object.entries(mirroredPositions).forEach(([servo, value]) => {
        onExternalServoChange(servo, value);
      });
    } else {
      // Otherwise use internal state
      setServoPositions(mirroredPositions);
    }
    
    setAlert({
      show: true,
      type: 'info',
      message: 'Left and right sides mirrored'
    });
    
    // Hide alert after 3 seconds
    setTimeout(() => {
      setAlert({ show: false, type: '', message: '' });
    }, 3000);
  };
  
  const tabs = [
    { id: 'body', label: 'Body Servos' },
    { id: 'hands', label: 'Hand Servos' }
  ];
  
  return (
    <div className="interactive-robot-control">
      {alert.show && (
        <Alert 
          type={alert.type} 
          message={alert.message} 
          onClose={() => setAlert({ show: false, type: '', message: '' })}
        />
      )}
      
      <div className="row">
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-header">
              <TabNavigation 
                tabs={tabs} 
                activeTab={activeTab} 
                onTabChange={setActiveTab} 
              />
            </div>
            <div className="card-body">
              {activeTab === 'body' && (
                <ServoGroup 
                  title="Body Servo Positions" 
                  servos={bodyServos} 
                  servoPositions={activeServoPositions} 
                  onServoChange={handleServoChange} 
                />
              )}
              
              {activeTab === 'hands' && (
                <ServoGroup 
                  title="Hand Servo Positions" 
                  servos={handServos} 
                  servoPositions={activeServoPositions} 
                  onServoChange={handleServoChange} 
                />
              )}
              
              <div className="mt-4 d-flex justify-content-between">
                <button 
                  className="btn btn-outline-secondary" 
                  onClick={handleResetAllServos}
                >
                  Reset All Servos
                </button>
                <button 
                  className="btn btn-outline-primary" 
                  onClick={handleMirrorLeftRight}
                >
                  Mirror Left/Right
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-header">
              <h3 className="card-title">Saved Positions</h3>
            </div>
            <div className="card-body">
              <PositionSaver 
                currentPositionName={currentPositionName}
                setCurrentPositionName={setCurrentPositionName}
                onSavePosition={handleSavePosition}
              />
              
              <PositionList 
                positions={activeSavedPositions}
                onLoad={handleLoadPosition}
                onDelete={handleDeletePosition}
              />
            </div>
          </div>
          
          {!hideRobotVisualization && (
            <div className="card mb-4">
              <div className="card-header">
                <h3 className="card-title">Robot Preview</h3>
              </div>
              <div className="card-body">
                <div className="robot-preview">
                  <RobotVisualization servoPositions={activeServoPositions} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InteractiveRobotControl;