import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import InteractiveRobotControl from '../components/InteractiveRobotControl';
import ExportForm from '../components/ExportForm';
import ArcExportPanel from '../components/ArcExportPanel';

const SkillExport = () => {
  const [skillName, setSkillName] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const [exportFormat, setExportFormat] = useState('json');
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
  
  const [savedPositions, setSavedPositions] = useState({});
  const [exportStatus, setExportStatus] = useState({ status: '', message: '' });
  
  const handleServoChange = (servo, value) => {
    setServoPositions({
      ...servoPositions,
      [servo]: parseInt(value)
    });
  };
  
  const handleExport = async () => {
    if (!skillName.trim()) {
      alert('Please enter a skill name');
      return;
    }
    
    setExportStatus({ status: 'loading', message: 'Exporting skill...' });
    
    try {
      const response = await fetch('/api/skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          SkillName: skillName,
          Description: description,
          Author: author,
          Format: exportFormat,
          ExportDate: new Date().toISOString(),
          DOFData: servoPositions,
          SavedPositions: savedPositions
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setExportStatus({ 
          status: 'success', 
          message: 'Skill exported successfully!',
          downloadUrl: data.downloadUrl,
          id: data.id
        });
      } else {
        setExportStatus({ 
          status: 'error', 
          message: data.error || 'Failed to export skill' 
        });
      }
    } catch (error) {
      setExportStatus({ 
        status: 'error', 
        message: 'Error connecting to server' 
      });
    }
  };
  
  const resetForm = () => {
    setSkillName('');
    setDescription('');
    setAuthor('');
    setExportFormat('json');
    setServoPositions({
      // Reset to default positions (90 degrees)
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
    setSavedPositions({});
    setExportStatus({ status: '', message: '' });
  };
  
  return (
    <div className="container">
      <h2 className="mb-4">Create and Export Robot Skill</h2>
      
      <div className="row">
        <div className="col-md-8">
          <ExportForm
            skillName={skillName}
            setSkillName={setSkillName}
            description={description}
            setDescription={setDescription}
            author={author}
            setAuthor={setAuthor}
            exportFormat={exportFormat}
            setExportFormat={setExportFormat}
            onExport={handleExport}
            onReset={resetForm}
            exportStatus={exportStatus}
          />
          
          {exportStatus.status === 'success' && (
            <ArcExportPanel 
              skillId={exportStatus.id}
              skillName={skillName}
            />
          )}
        </div>
        
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-header">
              <h3 className="card-title">Export Options</h3>
            </div>
            <div className="card-body">
              <p>
                Choose your preferred export format:
              </p>
              <ul>
                <li><strong>JSON</strong> - Standard data format, easy to process</li>
                <li><strong>XML</strong> - Structured format for interoperability</li>
                <li><strong>ARC Skill Package</strong> - Ready to import into Synthiam ARC</li>
              </ul>
              <p>
                After exporting, you can download your skill or export it directly to ARC format.
              </p>
              <div className="d-grid gap-2 mt-4">
                <Link to="/skills" className="btn btn-outline-primary">
                  View My Skills
                </Link>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Help</h3>
            </div>
            <div className="card-body">
              <p>
                <strong>How to use:</strong>
              </p>
              <ol>
                <li>Enter skill information (name, description, author)</li>
                <li>Adjust servo positions using the sliders</li>
                <li>Save positions with meaningful names</li>
                <li>Choose your export format</li>
                <li>Click "Export Skill" to create your skill</li>
                <li>Download the exported skill or export directly to ARC</li>
              </ol>
              <p>
                <Link to="/about" className="btn btn-sm btn-outline-secondary">
                  Learn More
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillExport;
