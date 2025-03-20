import React, { useState, useEffect } from 'react';
import ApiService from '../utils/ApiService';

const ArcExportButton = ({ skillId, skillName, onExportSuccess, onExportError }) => {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    try {
      setExporting(true);
      
      // Call the API to export the skill to ARC format
      const response = await fetch(`/api/export/arc/${skillId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        if (onExportSuccess) {
          onExportSuccess(data);
        }
      } else {
        throw new Error(data.error || 'Failed to export to ARC format');
      }
    } catch (error) {
      console.error('Error exporting to ARC format:', error);
      if (onExportError) {
        onExportError(error.message);
      }
    } finally {
      setExporting(false);
    }
  };

  return (
    <button 
      className="btn btn-primary" 
      onClick={handleExport}
      disabled={exporting}
    >
      {exporting ? (
        <>
          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          Exporting to ARC...
        </>
      ) : (
        <>Export to ARC</>
      )}
    </button>
  );
};

export default ArcExportButton;
