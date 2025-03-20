import React, { useState, useEffect } from 'react';
import * as poseDetection from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs-backend-webgl';
import './MocapProcessor.css';

const MocapProcessor = ({ videoUrl, onProcessingComplete }) => {
  const [processingStatus, setProcessingStatus] = useState('idle');
  const [progress, setProgress] = useState(0);
  const [mocapData, setMocapData] = useState(null);
  const [error, setError] = useState(null);
  const [model, setModel] = useState(null);
  const [videoElement, setVideoElement] = useState(null);
  const [canvasElement, setCanvasElement] = useState(null);

  // Load pose detection model
  useEffect(() => {
    const loadModel = async () => {
      try {
        setProcessingStatus('loading_model');
        
        // Load MoveNet model
        const detectorConfig = {
          modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER,
          enableSmoothing: true
        };
        
        const detector = await poseDetection.createDetector(
          poseDetection.SupportedModels.MoveNet,
          detectorConfig
        );
        
        setModel(detector);
        setProcessingStatus('model_loaded');
      } catch (err) {
        console.error('Error loading pose detection model:', err);
        setError('Failed to load pose detection model');
        setProcessingStatus('error');
      }
    };
    
    loadModel();
  }, []);

  // Set up video and canvas elements
  useEffect(() => {
    if (videoUrl && processingStatus === 'model_loaded') {
      const video = document.createElement('video');
      video.src = videoUrl;
      video.crossOrigin = 'anonymous';
      video.muted = true;
      video.playsInline = true;
      
      const canvas = document.createElement('canvas');
      
      setVideoElement(video);
      setCanvasElement(canvas);
    }
  }, [videoUrl, processingStatus]);

  // Process video frames
  const processVideo = async () => {
    if (!model || !videoElement || !videoUrl) {
      setError('Model or video not loaded');
      return;
    }
    
    try {
      setProcessingStatus('processing');
      setProgress(0);
      
      // Load video metadata
      await new Promise((resolve) => {
        videoElement.onloadedmetadata = () => resolve();
        videoElement.load();
      });
      
      // Set canvas dimensions
      canvasElement.width = videoElement.videoWidth;
      canvasElement.height = videoElement.videoHeight;
      const ctx = canvasElement.getContext('2d');
      
      // Start video playback
      await videoElement.play();
      
      // Get video duration and calculate frame rate
      const duration = videoElement.duration;
      const frameRate = 10; // Process 10 frames per second
      const totalFrames = Math.floor(duration * frameRate);
      const frameInterval = 1000 / frameRate;
      
      // Initialize mocap data structure
      const landmarks = [];
      
      // Process frames
      for (let frameIndex = 0; frameIndex < totalFrames; frameIndex++) {
        // Seek to specific time
        videoElement.currentTime = frameIndex / frameRate;
        
        // Wait for video to seek
        await new Promise((resolve) => {
          videoElement.onseeked = () => resolve();
        });
        
        // Draw current frame to canvas
        ctx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
        
        // Detect pose in current frame
        const poses = await model.estimatePoses(videoElement);
        
        if (poses.length > 0) {
          // Store landmarks with timestamp
          landmarks.push({
            timestamp: frameIndex / frameRate,
            keypoints: poses[0].keypoints
          });
        }
        
        // Update progress
        const newProgress = Math.floor((frameIndex / totalFrames) * 100);
        setProgress(newProgress);
      }
      
      // Process completed
      const processedData = {
        frameCount: landmarks.length,
        duration: duration,
        frameRate: frameRate,
        landmarks: landmarks
      };
      
      setMocapData(processedData);
      setProcessingStatus('completed');
      
      // Call completion callback
      if (onProcessingComplete) {
        onProcessingComplete(processedData);
      }
    } catch (err) {
      console.error('Error processing video:', err);
      setError(err.message || 'Error processing video');
      setProcessingStatus('error');
    } finally {
      // Clean up
      if (videoElement) {
        videoElement.pause();
      }
    }
  };

  // Start processing when model and video are loaded
  useEffect(() => {
    if (processingStatus === 'model_loaded' && videoElement && videoUrl) {
      processVideo();
    }
  }, [processingStatus, videoElement, videoUrl]);

  // Convert mocap data to DOF format
  const convertToDOF = async () => {
    if (!mocapData) return null;
    
    try {
      const response = await fetch('/api/dof/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ mocapData })
      });
      
      if (!response.ok) {
        throw new Error('Failed to convert mocap data to DOF');
      }
      
      const data = await response.json();
      return data.dofData;
    } catch (err) {
      console.error('Error converting to DOF:', err);
      return null;
    }
  };

  return (
    <div className="mocap-processor">
      {processingStatus === 'idle' && (
        <div className="processor-status">
          <p>Ready to process video</p>
        </div>
      )}
      
      {processingStatus === 'loading_model' && (
        <div className="processor-status">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading model...</span>
          </div>
          <p>Loading pose detection model...</p>
        </div>
      )}
      
      {processingStatus === 'processing' && (
        <div className="processor-status">
          <div className="progress mb-3">
            <div 
              className="progress-bar progress-bar-striped progress-bar-animated" 
              role="progressbar" 
              style={{ width: `${progress}%` }}
              aria-valuenow={progress} 
              aria-valuemin="0" 
              aria-valuemax="100"
            >
              {progress}%
            </div>
          </div>
          <p>Processing video frames... This may take several minutes.</p>
        </div>
      )}
      
      {processingStatus === 'completed' && (
        <div className="processor-status success">
          <div className="alert alert-success">
            <h5>Processing Complete!</h5>
            <p>Successfully extracted motion capture data from video.</p>
          </div>
          <div className="mocap-stats">
            <div className="row">
              <div className="col-md-4">
                <div className="stat-item">
                  <div className="stat-value">{mocapData.frameCount}</div>
                  <div className="stat-label">Frames</div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="stat-item">
                  <div className="stat-value">{mocapData.duration.toFixed(1)}</div>
                  <div className="stat-label">Seconds</div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="stat-item">
                  <div className="stat-value">{mocapData.landmarks[0].keypoints.length}</div>
                  <div className="stat-label">Keypoints</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {processingStatus === 'error' && (
        <div className="processor-status error">
          <div className="alert alert-danger">
            <h5>Processing Error</h5>
            <p>{error || 'An error occurred during processing'}</p>
          </div>
          <button 
            className="btn btn-primary"
            onClick={processVideo}
          >
            Try Again
          </button>
        </div>
      )}
      
      {/* Hidden video and canvas elements for processing */}
      <div style={{ display: 'none' }}>
        <div id="video-container"></div>
        <div id="canvas-container"></div>
      </div>
    </div>
  );
};

export default MocapProcessor;
