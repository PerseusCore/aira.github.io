import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import RobotVisualization from '../components/RobotVisualization';

const SkillDetail = () => {
  const { id } = useParams();
  const [skill, setSkill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('details');
  const [activePositionTab, setActivePositionTab] = useState('body');
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [currentServoPositions, setCurrentServoPositions] = useState(null);

  useEffect(() => {
    const fetchSkill = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/skills/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch skill details');
        }
        
        const data = await response.json();
        setSkill(data);
        setCurrentServoPositions(data.DOFData);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchSkill();
  }, [id]);

  const handlePositionSelect = (positionName) => {
    setSelectedPosition(positionName);
    setCurrentServoPositions(skill.SavedPositions[positionName]);
  };

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

  if (loading) {
    return (
      <div className="container text-center my-5">
        <div className="loading-spinner"></div>
        <p className="mt-3">Loading skill details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger">
          {error}
        </div>
        <Link to="/skills" className="btn btn-primary">
          Back to Skills
        </Link>
      </div>
    );
  }

  if (!skill) {
    return (
      <div className="container my-5">
        <div className="alert alert-warning">
          Skill not found
        </div>
        <Link to="/skills" className="btn btn-primary">
          Back to Skills
        </Link>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{skill.SkillName}</h2>
        <div>
          <Link to="/skills" className="btn btn-outline-secondary me-2">
            Back to Skills
          </Link>
          <a 
            href={`/api/download/${id}`} 
            className="btn btn-primary"
            download
          >
            Download Skill
          </a>
        </div>
      </div>

      <div className="row">
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-header">
              <ul className="nav nav-tabs card-header-tabs">
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeTab === 'details' ? 'active' : ''}`}
                    onClick={() => setActiveTab('details')}
                  >
                    Details
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeTab === 'positions' ? 'active' : ''}`}
                    onClick={() => setActiveTab('positions')}
                  >
                    Positions
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeTab === 'json' ? 'active' : ''}`}
                    onClick={() => setActiveTab('json')}
                  >
                    JSON
                  </button>
                </li>
              </ul>
            </div>
            <div className="card-body">
              {activeTab === 'details' && (
                <div>
                  <div className="mb-3">
                    <h5>Description</h5>
                    <p>{skill.Description || 'No description provided'}</p>
                  </div>
                  
                  <div className="mb-3">
                    <h5>Author</h5>
                    <p>{skill.Author || 'Unknown'}</p>
                  </div>
                  
                  <div className="mb-3">
                    <h5>Export Date</h5>
                    <p>{new Date(skill.ExportDate).toLocaleString()}</p>
                  </div>
                  
                  <div className="mb-3">
                    <h5>Format</h5>
                    <p>{skill.Format || 'JSON'}</p>
                  </div>
                  
                  <div className="mb-3">
                    <h5>Servo Positions</h5>
                    <div className="row">
                      <div className="col-md-6">
                        <h6>Body Servos</h6>
                        <ul className="list-group">
                          {bodyServos.map(servo => (
                            <li className="list-group-item d-flex justify-content-between align-items-center" key={servo}>
                              {servo.replace('_', ' ')}
                              <span className="badge bg-primary rounded-pill">
                                {skill.DOFData[servo]}°
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="col-md-6">
                        <h6>Hand Servos</h6>
                        <ul className="list-group">
                          {handServos.map(servo => (
                            <li className="list-group-item d-flex justify-content-between align-items-center" key={servo}>
                              {servo.replace('_', ' ')}
                              <span className="badge bg-primary rounded-pill">
                                {skill.DOFData[servo]}°
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'positions' && (
                <div>
                  <div className="row">
                    <div className="col-md-4">
                      <h5>Saved Positions</h5>
                      {Object.keys(skill.SavedPositions || {}).length === 0 ? (
                        <p className="text-muted">No positions saved</p>
                      ) : (
                        <div className="list-group">
                          {Object.keys(skill.SavedPositions).map(positionName => (
                            <button 
                              key={positionName}
                              className={`list-group-item list-group-item-action ${selectedPosition === positionName ? 'active' : ''}`}
                              onClick={() => handlePositionSelect(positionName)}
                            >
                              {positionName}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="col-md-8">
                      {selectedPosition ? (
                        <div>
                          <h5>Position: {selectedPosition}</h5>
                          <ul className="nav nav-tabs mb-3">
                            <li className="nav-item">
                              <button 
                                className={`nav-link ${activePositionTab === 'body' ? 'active' : ''}`}
                                onClick={() => setActivePositionTab('body')}
                              >
                                Body Servos
                              </button>
                            </li>
                            <li className="nav-item">
                              <button 
                                className={`nav-link ${activePositionTab === 'hands' ? 'active' : ''}`}
                                onClick={() => setActivePositionTab('hands')}
                              >
                                Hand Servos
                              </button>
                            </li>
                          </ul>
                          
                          {activePositionTab === 'body' && (
                            <div className="row">
                              {bodyServos.map(servo => (
                                <div className="col-md-6 mb-2" key={servo}>
                                  <div className="d-flex justify-content-between">
                                    <span>{servo.replace('_', ' ')}</span>
                                    <span className="badge bg-primary rounded-pill">
                                      {skill.SavedPositions[selectedPosition][servo]}°
                                    </span>
                                  </div>
                                  <div className="progress">
                                    <div 
                                      className="progress-bar" 
                                      role="progressbar" 
                                      style={{ width: `${skill.SavedPositions[selectedPosition][servo] / 1.8}%` }}
                                      aria-valuenow={skill.SavedPositions[selectedPosition][servo]}
                                      aria-valuemin="0" 
                                      aria-valuemax="180"
                                    ></div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {activePositionTab === 'hands' && (
                            <div className="row">
                              {handServos.map(servo => (
                                <div className="col-md-6 mb-2" key={servo}>
                                  <div className="d-flex justify-content-between">
                                    <span>{servo.replace('_', ' ')}</span>
                                    <span className="badge bg-primary rounded-pill">
                                      {skill.SavedPositions[selectedPosition][servo]}°
                                    </span>
                                  </div>
                                  <div className="progress">
                                    <div 
                                      className="progress-bar" 
                                      role="progressbar" 
                                      style={{ width: `${skill.SavedPositions[selectedPosition][servo] / 1.8}%` }}
                                      aria-valuenow={skill.SavedPositions[selectedPosition][servo]}
                                      aria-valuemin="0" 
                                      aria-valuemax="180"
                                    ></div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-muted">Select a position to view details</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'json' && (
                <div>
                  <h5>JSON Data</h5>
                  <div className="preview-container">
                    <pre>{JSON.stringify(skill, null, 2)}</pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="card-title mb-0">Robot Preview</h5>
            </div>
            <div className="card-body">
              <RobotVisualization servoPositions={currentServoPositions} />
              
              {selectedPosition && (
                <div className="text-center mt-3">
                  <p className="mb-0">Showing position: {selectedPosition}</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Export Options</h5>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <a 
                  href={`/api/download/${id}`} 
                  className="btn btn-primary"
                  download
                >
                  Download as JSON
                </a>
                <Link to="/export" className="btn btn-outline-primary">
                  Create New Skill
                </Link>
                <Link to={`/skills`} className="btn btn-outline-secondary">
                  Back to Skills
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillDetail;
