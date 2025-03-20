import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ArcExportPanel = ({ skillId, skillName, skillData }) => {
  const [exportStatus, setExportStatus] = useState({ status: '', message: '', downloadUrl: '' });

  const handleExport = async () => {
    try {
      setExportStatus({ status: 'loading', message: 'Exporting skill to ARC format...' });
      
      // Call the API to export the skill to ARC format
      const response = await fetch(`/api/export/arc/${skillId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setExportStatus({ 
          status: 'success', 
          message: 'Skill exported to ARC format successfully!',
          downloadUrl: data.downloadUrl
        });
      } else {
        throw new Error(data.error || 'Failed to export to ARC format');
      }
    } catch (error) {
      console.error('Error exporting to ARC format:', error);
      setExportStatus({ 
        status: 'error', 
        message: error.message || 'Failed to export to ARC format'
      });
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h3 className="card-title">Export to ARC</h3>
      </div>
      <div className="card-body">
        <p>
          Export <strong>{skillName}</strong> directly to ARC format for use with your AIRA Humanoid Robot.
          This will create an ARC skill package that can be imported into Synthiam ARC software.
        </p>
        
        <div className="d-grid gap-2">
          <button 
            className="btn btn-primary" 
            onClick={handleExport}
            disabled={exportStatus.status === 'loading'}
          >
            {exportStatus.status === 'loading' ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Exporting to ARC...
              </>
            ) : 'Export to ARC Format'}
          </button>
        </div>
        
        {exportStatus.status === 'success' && (
          <div className="alert alert-success mt-3">
            <p>{exportStatus.message}</p>
            <a 
              href={exportStatus.downloadUrl} 
              className="btn btn-sm btn-success"
              download
            >
              Download ARC Skill Package
            </a>
          </div>
        )}
        
        {exportStatus.status === 'error' && (
          <div className="alert alert-danger mt-3">
            {exportStatus.message}
          </div>
        )}
        
        <div className="mt-3">
          <h5>What's included in the ARC Skill Package:</h5>
          <ul>
            <li>Servo configuration for all 26 servos</li>
            <li>Saved positions with proper mapping to ARC servo ports</li>
            <li>Auto-generated skill script to load positions</li>
            <li>ARC metadata for compatibility with Synthiam ARC software</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ArcExportPanel;
