import React, { useState, useEffect } from 'react';
import './DOFConverter.css';

const DOFConverter = ({ mocapData, onConversionComplete }) => {
  const [conversionStatus, setConversionStatus] = useState('idle');
  const [dofData, setDofData] = useState(null);
  const [error, setError] = useState(null);
  const [exportFormat, setExportFormat] = useState('json');
  const [exportOptions, setExportOptions] = useState({
    name: 'Exported Skill',
    description: 'Skill exported from motion capture data',
    author: '',
    smoothing: 0.5,
    frameRate: 30,
    loop: false
  });
  const [exportStatus, setExportStatus] = useState(null);

  // Convert mocap data to DOF when component mounts or mocap data changes
  useEffect(() => {
    if (mocapData) {
      convertToDOF();
    }
  }, [mocapData]);

  // Convert mocap data to DOF format
  const convertToDOF = async () => {
    if (!mocapData) {
      setError('No motion capture data available');
      return;
    }

    try {
      setConversionStatus('converting');
      setError(null);

      // Call the API to convert mocap data to DOF
      const response = await fetch('/api/dof/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          mocapData,
          metadata: {
            frameRate: exportOptions.frameRate
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to convert mocap data to DOF');
      }

      const data = await response.json();
      setDofData(data.dofData);
      setConversionStatus('completed');

      // Call completion callback if provided
      if (onConversionComplete) {
        onConversionComplete(data.dofData);
      }
    } catch (err) {
      console.error('Error converting to DOF:', err);
      setError(err.message || 'Error converting to DOF');
      setConversionStatus('error');
    }
  };

  // Handle export option changes
  const handleOptionChange = (e) => {
    const { name, value, type, checked } = e.target;
    setExportOptions(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Export DOF data to selected format
  const handleExport = async () => {
    if (!dofData) {
      setError('No DOF data available to export');
      return;
    }

    try {
      setExportStatus({ status: 'exporting', message: 'Exporting DOF data...' });

      // Call the API to export DOF data
      const response = await fetch('/api/dof/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          dofData,
          metadata: exportOptions,
          format: exportFormat
        })
      });

      if (!response.ok) {
        throw new Error('Failed to export DOF data');
      }

      const data = await response.json();
      setExportStatus({
        status: 'success',
        message: 'Export successful',
        downloadUrl: data.downloadUrl,
        filename: data.filename
      });
    } catch (err) {
      console.error('Error exporting DOF data:', err);
      setExportStatus({
        status: 'error',
        message: err.message || 'Error exporting DOF data'
      });
    }
  };

  // Create a skill in the marketplace
  const handleCreateMarketplaceListing = () => {
    // This would navigate to the marketplace listing creation page
    // with the exported skill data
    if (exportStatus?.downloadUrl) {
      window.location.href = `/marketplace/create?skillUrl=${encodeURIComponent(exportStatus.downloadUrl)}&name=${encodeURIComponent(exportOptions.name)}`;
    }
  };

  return (
    <div className="dof-converter">
      <h3>DOF Conversion</h3>

      {conversionStatus === 'idle' && (
        <div className="converter-status">
          <p>Waiting for motion capture data...</p>
        </div>
      )}

      {conversionStatus === 'converting' && (
        <div className="converter-status">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Converting...</span>
          </div>
          <p>Converting motion capture data to DOF format...</p>
        </div>
      )}

      {conversionStatus === 'error' && (
        <div className="converter-status error">
          <div className="alert alert-danger">
            <h5>Conversion Error</h5>
            <p>{error || 'An error occurred during conversion'}</p>
          </div>
          <button 
            className="btn btn-primary"
            onClick={convertToDOF}
          >
            Try Again
          </button>
        </div>
      )}

      {conversionStatus === 'completed' && (
        <div className="conversion-complete">
          <div className="alert alert-success">
            <h5>Conversion Complete!</h5>
            <p>Successfully converted motion capture data to DOF format.</p>
          </div>

          <div className="card mb-4">
            <div className="card-header">
              <h5 className="card-title mb-0">Export Options</h5>
            </div>
            <div className="card-body">
              <form>
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
                    <option value="arcskill">ARC Skill Package</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="skillName" className="form-label">Skill Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="skillName"
                    name="name"
                    value={exportOptions.name}
                    onChange={handleOptionChange}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="skillDescription" className="form-label">Description</label>
                  <textarea 
                    className="form-control" 
                    id="skillDescription"
                    name="description"
                    rows="3"
                    value={exportOptions.description}
                    onChange={handleOptionChange}
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label htmlFor="author" className="form-label">Author</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="author"
                    name="author"
                    value={exportOptions.author}
                    onChange={handleOptionChange}
                  />
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="frameRate" className="form-label">Frame Rate</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        id="frameRate"
                        name="frameRate"
                        min="1"
                        max="60"
                        value={exportOptions.frameRate}
                        onChange={handleOptionChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="smoothing" className="form-label">Smoothing Factor</label>
                      <input 
                        type="range" 
                        className="form-range" 
                        id="smoothing"
                        name="smoothing"
                        min="0"
                        max="1"
                        step="0.1"
                        value={exportOptions.smoothing}
                        onChange={handleOptionChange}
                      />
                      <div className="d-flex justify-content-between">
                        <small>None</small>
                        <small>Max</small>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-3 form-check">
                  <input 
                    type="checkbox" 
                    className="form-check-input" 
                    id="loopEnabled"
                    name="loop"
                    checked={exportOptions.loop}
                    onChange={handleOptionChange}
                  />
                  <label className="form-check-label" htmlFor="loopEnabled">Enable Looping</label>
                </div>

                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={handleExport}
                  disabled={exportStatus?.status === 'exporting'}
                >
                  {exportStatus?.status === 'exporting' ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Exporting...
                    </>
                  ) : 'Export DOF Data'}
                </button>
              </form>

              {exportStatus?.status === 'success' && (
                <div className="alert alert-success mt-3">
                  <p className="mb-2">{exportStatus.message}</p>
                  <div className="d-flex gap-2">
                    <a 
                      href={exportStatus.downloadUrl} 
                      className="btn btn-sm btn-success"
                      download
                    >
                      Download
                    </a>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={handleCreateMarketplaceListing}
                    >
                      Create Marketplace Listing
                    </button>
                  </div>
                </div>
              )}

              {exportStatus?.status === 'error' && (
                <div className="alert alert-danger mt-3">
                  {exportStatus.message}
                </div>
              )}
            </div>
          </div>

          <div className="dof-preview">
            <h5>DOF Data Preview</h5>
            <div className="dof-data-container">
              <pre className="dof-data-preview">
                {JSON.stringify(dofData, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DOFConverter;
