import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import './VideoUpload.css';

const VideoUpload = () => {
  const navigate = useNavigate();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [videoMetadata, setVideoMetadata] = useState({
    title: '',
    description: '',
    tags: ''
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  
  // Handle file drop
  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    setVideoFile(file);
    
    // Create a preview URL for the video
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    
    // Set default title from filename
    const fileName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
    setVideoMetadata(prev => ({
      ...prev,
      title: fileName
    }));
    
    // Reset upload status
    setUploadStatus(null);
    setUploadProgress(0);
  }, []);
  
  // Configure dropzone
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.webm', '.avi', '.mov', '.mkv']
    },
    maxFiles: 1,
    maxSize: 100 * 1024 * 1024 // 100MB
  });
  
  // Handle metadata input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVideoMetadata(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle video upload
  const handleUpload = async () => {
    if (!videoFile) {
      setUploadStatus({
        status: 'error',
        message: 'Please select a video file to upload'
      });
      return;
    }
    
    if (!videoMetadata.title.trim()) {
      setUploadStatus({
        status: 'error',
        message: 'Please enter a title for the video'
      });
      return;
    }
    
    try {
      setUploadStatus({
        status: 'uploading',
        message: 'Uploading video...'
      });
      
      // Create form data
      const formData = new FormData();
      formData.append('video', videoFile);
      formData.append('title', videoMetadata.title);
      formData.append('description', videoMetadata.description);
      formData.append('tags', videoMetadata.tags);
      
      // Upload video with progress tracking
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      });
      
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const response = JSON.parse(xhr.responseText);
          setUploadStatus({
            status: 'success',
            message: 'Video uploaded successfully!',
            videoId: response.video.id
          });
        } else {
          let errorMessage = 'Upload failed';
          try {
            const errorResponse = JSON.parse(xhr.responseText);
            errorMessage = errorResponse.error || errorMessage;
          } catch (e) {
            // Parsing error, use default message
          }
          
          setUploadStatus({
            status: 'error',
            message: errorMessage
          });
        }
      });
      
      xhr.addEventListener('error', () => {
        setUploadStatus({
          status: 'error',
          message: 'Network error occurred during upload'
        });
      });
      
      xhr.addEventListener('abort', () => {
        setUploadStatus({
          status: 'error',
          message: 'Upload was aborted'
        });
      });
      
      xhr.open('POST', '/api/videos/upload');
      xhr.send(formData);
    } catch (error) {
      console.error('Error uploading video:', error);
      setUploadStatus({
        status: 'error',
        message: error.message || 'An error occurred during upload'
      });
    }
  };
  
  // Handle cancel upload
  const handleCancelUpload = () => {
    setVideoFile(null);
    setPreviewUrl(null);
    setVideoMetadata({
      title: '',
      description: '',
      tags: ''
    });
    setUploadStatus(null);
    setUploadProgress(0);
  };
  
  // Navigate to video detail after successful upload
  const handleViewVideo = () => {
    if (uploadStatus?.videoId) {
      navigate(`/videos/${uploadStatus.videoId}`);
    }
  };
  
  // Navigate to search page
  const handleGoToSearch = () => {
    navigate('/videos/search');
  };
  
  return (
    <div className="video-upload-container">
      <div className="upload-header">
        <h2>Upload Video for Motion Capture</h2>
        <p className="upload-description">
          Upload videos of movements to extract motion capture data and convert to DOF format for your AIRA Humanoid Robot
        </p>
      </div>
      
      <div className="row">
        <div className="col-lg-7">
          <div 
            {...getRootProps()} 
            className={`dropzone ${isDragActive ? 'active' : ''} ${isDragReject ? 'reject' : ''} ${videoFile ? 'has-file' : ''}`}
          >
            <input {...getInputProps()} />
            
            {videoFile ? (
              <div className="video-preview">
                <video 
                  src={previewUrl} 
                  controls 
                  className="preview-video"
                />
                <div className="file-info">
                  <p className="file-name">{videoFile.name}</p>
                  <p className="file-size">{(videoFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
              </div>
            ) : isDragActive ? (
              <div className="dropzone-content">
                <i className="bi bi-cloud-arrow-up-fill"></i>
                <p>Drop the video file here...</p>
              </div>
            ) : isDragReject ? (
              <div className="dropzone-content">
                <i className="bi bi-exclamation-circle"></i>
                <p>File type not supported</p>
                <p className="small">Please upload a video file (MP4, WebM, AVI, MOV)</p>
              </div>
            ) : (
              <div className="dropzone-content">
                <i className="bi bi-cloud-arrow-up"></i>
                <p>Drag and drop a video file here, or click to select</p>
                <p className="small">Supported formats: MP4, WebM, AVI, MOV (max 100MB)</p>
              </div>
            )}
          </div>
          
          {videoFile && (
            <button 
              className="btn btn-outline-danger mt-2"
              onClick={handleCancelUpload}
            >
              Remove Video
            </button>
          )}
        </div>
        
        <div className="col-lg-5">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Video Information</h5>
            </div>
            <div className="card-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="videoTitle" className="form-label">Title *</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="videoTitle"
                    name="title"
                    value={videoMetadata.title}
                    onChange={handleInputChange}
                    disabled={uploadStatus?.status === 'uploading' || uploadStatus?.status === 'success'}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="videoDescription" className="form-label">Description</label>
                  <textarea 
                    className="form-control" 
                    id="videoDescription"
                    name="description"
                    rows="3"
                    value={videoMetadata.description}
                    onChange={handleInputChange}
                    disabled={uploadStatus?.status === 'uploading' || uploadStatus?.status === 'success'}
                  ></textarea>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="videoTags" className="form-label">Tags</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="videoTags"
                    name="tags"
                    value={videoMetadata.tags}
                    onChange={handleInputChange}
                    placeholder="walking, arms, balance (comma separated)"
                    disabled={uploadStatus?.status === 'uploading' || uploadStatus?.status === 'success'}
                  />
                  <div className="form-text">
                    Separate tags with commas
                  </div>
                </div>
                
                {uploadStatus?.status === 'uploading' && (
                  <div className="mb-3">
                    <label className="form-label">Upload Progress</label>
                    <div className="progress">
                      <div 
                        className="progress-bar progress-bar-striped progress-bar-animated" 
                        role="progressbar" 
                        style={{ width: `${uploadProgress}%` }}
                        aria-valuenow={uploadProgress} 
                        aria-valuemin="0" 
                        aria-valuemax="100"
                      >
                        {uploadProgress}%
                      </div>
                    </div>
                  </div>
                )}
                
                {uploadStatus?.status === 'error' && (
                  <div className="alert alert-danger" role="alert">
                    {uploadStatus.message}
                  </div>
                )}
                
                {uploadStatus?.status === 'success' ? (
                  <div>
                    <div className="alert alert-success" role="alert">
                      {uploadStatus.message}
                    </div>
                    <div className="d-grid gap-2">
                      <button 
                        type="button" 
                        className="btn btn-primary"
                        onClick={handleViewVideo}
                      >
                        View Video & Process
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-outline-primary"
                        onClick={handleCancelUpload}
                      >
                        Upload Another Video
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="d-grid gap-2">
                    <button 
                      type="button" 
                      className="btn btn-primary"
                      onClick={handleUpload}
                      disabled={!videoFile || uploadStatus?.status === 'uploading'}
                    >
                      {uploadStatus?.status === 'uploading' ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Uploading...
                        </>
                      ) : 'Upload Video'}
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-outline-primary"
                      onClick={handleGoToSearch}
                    >
                      Search Existing Videos
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
      
      <div className="upload-instructions mt-4">
        <h3>How Motion Capture Works</h3>
        <div className="row">
          <div className="col-md-4 mb-3">
            <div className="instruction-step">
              <div className="step-number">1</div>
              <h4>Upload Video</h4>
              <p>Upload a video of the movement you want to capture. For best results, ensure the subject is clearly visible and movements are well-defined.</p>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="instruction-step">
              <div className="step-number">2</div>
              <h4>Process Video</h4>
              <p>Our AI analyzes the video to extract motion capture data, identifying joint positions and movements throughout the video.</p>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="instruction-step">
              <div className="step-number">3</div>
              <h4>Export to DOF</h4>
              <p>Convert the extracted motion data to DOF format for your AIRA Humanoid Robot, ready to import into ARC software.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoUpload;
