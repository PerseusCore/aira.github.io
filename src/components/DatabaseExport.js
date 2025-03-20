import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const DatabaseExport = () => {
  const [exportFormat, setExportFormat] = useState('json');
  const [exportStatus, setExportStatus] = useState({ status: '', message: '' });
  const [includePositions, setIncludePositions] = useState(true);
  const [includeMetadata, setIncludeMetadata] = useState(true);
  
  const handleExportDatabase = async () => {
    try {
      setExportStatus({ status: 'loading', message: 'Exporting database...' });
      
      const response = await fetch('/api/export/database', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          format: exportFormat,
          includePositions,
          includeMetadata
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to export database');
      }
      
      const data = await response.json();
      
      setExportStatus({ 
        status: 'success', 
        message: 'Database exported successfully!',
        downloadUrl: data.downloadUrl
      });
    } catch (error) {
      console.error('Error exporting database:', error);
      setExportStatus({ 
        status: 'error', 
        message: error.message || 'Failed to export database'
      });
    }
  };
  
  return (
    <div className="card mb-4">
      <div className="card-header">
        <h3 className="card-title">Export Database</h3>
      </div>
      <div className="card-body">
        <p>
          Export your entire skills database for backup or transfer to another system.
        </p>
        
        <div className="mb-3">
          <label htmlFor="exportFormat" className="form-label">Export Format</label>
          <select 
            className="form-select" 
            id="exportFormat"
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value)}
          >
            <option value="json">JSON</option>
            <option value="xml">XML</option>
            <option value="csv">CSV</option>
          </select>
        </div>
        
        <div className="mb-3">
          <div className="form-check">
            <input 
              className="form-check-input" 
              type="checkbox" 
              id="includePositions"
              checked={includePositions}
              onChange={(e) => setIncludePositions(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="includePositions">
              Include Saved Positions
            </label>
          </div>
        </div>
        
        <div className="mb-3">
          <div className="form-check">
            <input 
              className="form-check-input" 
              type="checkbox" 
              id="includeMetadata"
              checked={includeMetadata}
              onChange={(e) => setIncludeMetadata(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="includeMetadata">
              Include Metadata (creation dates, author info)
            </label>
          </div>
        </div>
        
        <div className="d-grid gap-2">
          <button 
            className="btn btn-primary" 
            onClick={handleExportDatabase}
            disabled={exportStatus.status === 'loading'}
          >
            {exportStatus.status === 'loading' ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Exporting Database...
              </>
            ) : 'Export Database'}
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
              Download Database
            </a>
          </div>
        )}
        
        {exportStatus.status === 'error' && (
          <div className="alert alert-danger mt-3">
            {exportStatus.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default DatabaseExport;
