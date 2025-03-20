import React from 'react';

const ExportForm = ({ 
  skillName, 
  setSkillName, 
  description, 
  setDescription, 
  author, 
  setAuthor, 
  exportFormat, 
  setExportFormat,
  onExport,
  onReset,
  exportStatus
}) => {
  return (
    <div className="card mb-4">
      <div className="card-header">
        <h3 className="card-title">Skill Information</h3>
      </div>
      <div className="card-body">
        <div className="mb-3">
          <label htmlFor="skillName" className="form-label">Skill Name</label>
          <input 
            type="text" 
            className="form-control" 
            id="skillName" 
            value={skillName}
            onChange={(e) => setSkillName(e.target.value)}
            placeholder="Enter skill name"
            required
          />
        </div>
        
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea 
            className="form-control" 
            id="description" 
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter skill description"
          ></textarea>
        </div>
        
        <div className="mb-3">
          <label htmlFor="author" className="form-label">Author</label>
          <input 
            type="text" 
            className="form-control" 
            id="author" 
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Enter author name"
          />
        </div>
        
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

        <div className="d-grid gap-2 d-md-flex">
          <button 
            className="btn btn-primary me-md-2" 
            onClick={onExport}
            disabled={exportStatus.status === 'loading' || !skillName.trim()}
          >
            {exportStatus.status === 'loading' ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Exporting...
              </>
            ) : 'Export Skill'}
          </button>
          <button className="btn btn-secondary" onClick={onReset}>
            Reset Form
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
              Download Skill
            </a>
            <a 
              href={`/skills/${exportStatus.id}`}
              className="btn btn-sm btn-outline-success ms-2"
            >
              View Skill Details
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

export default ExportForm;
