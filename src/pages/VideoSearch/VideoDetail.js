import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactPlayer from 'react-player';
import './VideoDetail.css';

const VideoDetail = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  
  const [video, setVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingStatus, setProcessingStatus] = useState(null);
  const [processingJobId, setProcessingJobId] = useState(null);
  const [exportOptions, setExportOptions] = useState({
    format: 'json',
    name: '',
    description: ''
  });
  const [exportStatus, setExportStatus] = useState(null);
  
  // Fetch video details on component mount
  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`/api/videos/${videoId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch video details');
        }
        
        const data = await response.json();
        setVideo(data.video);
        setExportOptions(prev => ({
          ...prev,
          name: `Skill from ${data.video.title}`,
          description: `Exported from video: ${data.video.title}`
        }));
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching video details:', err);
        setError(err.message || 'An error occurred while fetching video details');
        setIsLoading(false);
      }
    };
    
    if (videoId) {
      fetchVideoDetails();
    }
  }, [videoId]);
  
  // Check processing status periodically if a job is running
  useEffect(() => {
    let statusInterval;
    
    if (processingJobId) {
      statusInterval = setInterval(async () => {
        try {
          const response = await fetch(`/api/videos/process/status/${processingJobId}`);
          
          if (!response.ok) {
            throw new Error('Failed to check processing status');
          }
          
          const data = await response.json();
          setProcessingStatus(data);
          
          // If processing is complete, clear the interval
          if (data.status === 'completed' || data.status === 'failed') {
            clearInterval(statusInterval);
          }
        } catch (err) {
          console.error('Error checking processing status:', err);
          clearInterval(statusInterval);
        }
      }, 2000);
    }
    
    return () => {
      if (statusInterval) {
        clearInterval(statusInterval);
      }
    };
  }, [processingJobId]);
  
  // Start video processing for mocap data
  const handleProcessVideo = async () => {
    try {
      setProcessingStatus({ status: 'starting', progress: 0 });
      
      const response = await fetch(`/api/videos/process/${videoId}`, {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error('Failed to start video processing');
      }
      
      const data = await response.json();
      setProcessingJobId(data.jobId);
      setProcessingStatus({
        status: 'processing',
        progress: 0,
        message: 'Processing started'
      });
    } catch (err) {
      console.error('Error processing video:', err);
      setProcessingStatus({
        status: 'failed',
        message: err.message || 'Failed to process video'
      });
    }
  };
  
  // Export mocap data to DOF
  const handleExportToDOF = async () => {
    try {
      setExportStatus({ status: 'exporting', message: 'Exporting to DOF...' });
      
      const response = await fetch(`/api/videos/export/${videoId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          format: exportOptions.format,
          name: exportOptions.name,
          description: exportOptions.description
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to export to DOF');
      }
      
      const data = await response.json();
      setExportStatus({
        status: 'success',
        message: 'Export successful',
        skill: data.skill
      });
    } catch (err) {
      console.error('Error exporting to DOF:', err);
      setExportStatus({
        status: 'error',
        message: err.message || 'Failed to export to DOF'
      });
    }
  };
  
  // Handle input changes for export options
  const handleExportOptionChange = (e) => {
    const { name, value } = e.target;
    setExportOptions(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Navigate back to search
  const handleBackToSearch = () => {
    navigate('/videos/search');
  };
  
  if (isLoading) {
    return (
      <div className="video-detail-container">
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading video details...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="video-detail-container">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <button 
          className="btn btn-primary"
          onClick={handleBackToSearch}
        >
          Back to Search
        </button>
      </div>
    );
  }
  
  if (!video) {
    return (
      <div className="video-detail-container">
        <div className="alert alert-warning" role="alert">
          Video not found
        </div>
        <button 
          className="btn btn-primary"
          onClick={handleBackToSearch}
        >
          Back to Search
        </button>
      </div>
    );
  }
  
  return (
    <div className="video-detail-container">
      <div className="video-detail-header">
        <button 
          className="btn btn-outline-primary mb-3"
          onClick={handleBackToSearch}
        >
          &larr; Back to Search
        </button>
        <h2>{video.title}</h2>
        <p className="video-description">{video.description}</p>
      </div>
      
      <div className="row">
        <div className="col-lg-8">
          <div className="video-player-container">
            <ReactPlayer
              url={video.url}
              controls
              width="100%"
              height="100%"
              className="react-player"
            />
          </div>
          
          <div className="video-metadata mt-3">
            <div className="video-tags mb-2">
              {video.tags && video.tags.map(tag => (
                <span key={tag} className="badge bg-secondary me-1">{tag}</span>
              ))}
            </div>
            <div className="video-info">
              <span className="me-3">
                <i className="bi bi-calendar"></i> {new Date(video.uploadDate).toLocaleDateString()}
              </span>
              <span className="me-3">
                <i className="bi bi-clock"></i> {video.duration}
              </span>
              <span>
                <i className="bi bi-eye"></i> {video.views} views
              </span>
            </div>
          </div>
        </div>
        
        <div className="col-lg-4">
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="card-title mb-0">Motion Capture Data</h5>
            </div>
            <div className="card-body">
              {video.mocapData?.available ? (
                <div>
                  <p>Motion capture data is available for this video.</p>
                  <ul className="mocap-stats">
                    <li><strong>Joints:</strong> {video.mocapData.joints}</li>
                    <li><strong>Frames:</strong> {video.mocapData.frames}</li>
                  </ul>
                </div>
              ) : processingStatus?.status === 'completed' ? (
                <div>
                  <div className="alert alert-success">
                    <p className="mb-0">Processing complete!</p>
                  </div>
                  <ul className="mocap-stats">
                    <li><strong>Joints:</strong> {processingStatus.result.mocapData.joints}</li>
                    <li><strong>Frames:</strong> {processingStatus.result.mocapData.frames}</li>
                    <li><strong>Duration:</strong> {processingStatus.result.mocapData.duration}</li>
                  </ul>
                </div>
              ) : processingStatus?.status === 'processing' ? (
                <div>
                  <div className="progress mb-3">
                    <div 
                      className="progress-bar progress-bar-striped progress-bar-animated" 
                      role="progressbar" 
                      style={{ width: `${processingStatus.progress}%` }}
                      aria-valuenow={processingStatus.progress} 
                      aria-valuemin="0" 
                      aria-valuemax="100"
                    ></div>
                  </div>
                  <p className="text-center">{processingStatus.message || 'Processing video...'}</p>
                </div>
              ) : processingStatus?.status === 'failed' ? (
                <div className="alert alert-danger">
                  <p className="mb-0">Processing failed: {processingStatus.message}</p>
                  <button 
                    className="btn btn-sm btn-outline-danger mt-2"
                    onClick={handleProcessVideo}
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <div>
                  <p>No motion capture data available for this video.</p>
                  <button 
                    className="btn btn-primary"
                    onClick={handleProcessVideo}
                  >
                    Process Video
                  </button>
                  <p className="text-muted small mt-2">
                    This will analyze the video to extract motion capture data.
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {(video.mocapData?.available || processingStatus?.status === 'completed') && (
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="card-title mb-0">Export to DOF</h5>
              </div>
              <div className="card-body">
                <form>
                  <div className="mb-3">
                    <label htmlFor="exportFormat" className="form-label">Export Format</label>
                    <select 
                      className="form-select" 
                      id="exportFormat"
                      name="format"
                      value={exportOptions.format}
                      onChange={handleExportOptionChange}
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
                      onChange={handleExportOptionChange}
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
                      onChange={handleExportOptionChange}
                    ></textarea>
                  </div>
                  
                  <button 
                    type="button" 
                    className="btn btn-primary"
                    onClick={handleExportToDOF}
                    disabled={exportStatus?.status === 'exporting'}
                  >
                    {exportStatus?.status === 'exporting' ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Exporting...
                      </>
                    ) : 'Export to DOF'}
                  </button>
                </form>
                
                {exportStatus?.status === 'success' && (
                  <div className="alert alert-success mt-3">
                    <p className="mb-2">{exportStatus.message}</p>
                    <a 
                      href={exportStatus.skill.downloadUrl} 
                      className="btn btn-sm btn-success"
                      download
                    >
                      Download Skill
                    </a>
                  </div>
                )}
                
                {exportStatus?.status === 'error' && (
                  <div className="alert alert-danger mt-3">
                    {exportStatus.message}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoDetail;
