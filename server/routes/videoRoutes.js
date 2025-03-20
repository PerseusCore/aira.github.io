const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set up storage for uploaded videos
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = path.join(__dirname, '../../uploads/videos');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// File filter to only accept video files
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only video files are allowed.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB file size limit
  }
});

// Upload video route
router.post('/upload', upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file uploaded' });
    }

    // Save video metadata to database
    const videoMetadata = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype,
      uploadDate: new Date(),
      tags: req.body.tags ? req.body.tags.split(',') : [],
      description: req.body.description || '',
      title: req.body.title || req.file.originalname,
      userId: req.body.userId || 'anonymous'
    };

    // TODO: Save to database
    
    // Return success response
    res.status(201).json({
      success: true,
      message: 'Video uploaded successfully',
      video: {
        id: Date.now().toString(), // Temporary ID until database integration
        ...videoMetadata,
        url: `/api/videos/${req.file.filename}`
      }
    });
  } catch (error) {
    console.error('Error uploading video:', error);
    res.status(500).json({ error: 'Failed to upload video' });
  }
});

// Process video for mocap data
router.post('/process/:videoId', async (req, res) => {
  try {
    const videoId = req.params.videoId;
    
    // TODO: Implement video processing for mocap data
    
    // Mock response for now
    res.json({
      success: true,
      message: 'Video processing started',
      jobId: `process-${Date.now()}`,
      estimatedTime: '60 seconds'
    });
  } catch (error) {
    console.error('Error processing video:', error);
    res.status(500).json({ error: 'Failed to process video' });
  }
});

// Get processing status
router.get('/process/status/:jobId', async (req, res) => {
  try {
    const jobId = req.params.jobId;
    
    // TODO: Implement job status checking
    
    // Mock response for now
    res.json({
      success: true,
      status: 'completed',
      progress: 100,
      result: {
        mocapData: {
          frames: 120,
          joints: 26,
          duration: '10 seconds'
        },
        previewUrl: '/api/videos/preview/sample.gif'
      }
    });
  } catch (error) {
    console.error('Error checking processing status:', error);
    res.status(500).json({ error: 'Failed to check processing status' });
  }
});

// Search videos
router.get('/search', async (req, res) => {
  try {
    const { query, tags, limit = 10, page = 1 } = req.query;
    
    // TODO: Implement video search
    
    // Mock response for now
    res.json({
      success: true,
      results: [
        {
          id: '1',
          title: 'Walking Motion Sample',
          description: 'Humanoid robot walking motion capture',
          thumbnailUrl: '/assets/thumbnails/walking.jpg',
          duration: '15 seconds',
          tags: ['walking', 'locomotion', 'bipedal'],
          uploadDate: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Arm Movement Pattern',
          description: 'Complex arm movement patterns for humanoid robots',
          thumbnailUrl: '/assets/thumbnails/arm-movement.jpg',
          duration: '22 seconds',
          tags: ['arms', 'manipulation', 'precision'],
          uploadDate: new Date().toISOString()
        }
      ],
      pagination: {
        total: 2,
        page: 1,
        limit: 10,
        pages: 1
      }
    });
  } catch (error) {
    console.error('Error searching videos:', error);
    res.status(500).json({ error: 'Failed to search videos' });
  }
});

// Get video by ID
router.get('/:videoId', async (req, res) => {
  try {
    const videoId = req.params.videoId;
    
    // TODO: Implement video retrieval
    
    // Mock response for now
    res.json({
      success: true,
      video: {
        id: videoId,
        title: 'Sample Video',
        description: 'Sample video description',
        url: `/api/videos/stream/${videoId}`,
        thumbnailUrl: '/assets/thumbnails/sample.jpg',
        duration: '30 seconds',
        tags: ['sample', 'test'],
        uploadDate: new Date().toISOString(),
        views: 120,
        mocapData: {
          available: true,
          joints: 26,
          frames: 300
        }
      }
    });
  } catch (error) {
    console.error('Error getting video:', error);
    res.status(500).json({ error: 'Failed to get video' });
  }
});

// Stream video
router.get('/stream/:filename', async (req, res) => {
  try {
    const filename = req.params.filename;
    const videoPath = path.join(__dirname, '../../uploads/videos', filename);
    
    if (!fs.existsSync(videoPath)) {
      return res.status(404).json({ error: 'Video not found' });
    }
    
    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;
    
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(videoPath, { start, end });
      
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4'
      });
      
      file.pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4'
      });
      
      fs.createReadStream(videoPath).pipe(res);
    }
  } catch (error) {
    console.error('Error streaming video:', error);
    res.status(500).json({ error: 'Failed to stream video' });
  }
});

// Export mocap data to DOF
router.post('/export/:videoId', async (req, res) => {
  try {
    const videoId = req.params.videoId;
    const { format, name, description } = req.body;
    
    // TODO: Implement mocap data export to DOF
    
    // Mock response for now
    res.json({
      success: true,
      message: 'Mocap data exported successfully',
      skill: {
        id: `skill-${Date.now()}`,
        name: name || 'Exported Skill',
        description: description || 'Skill exported from video mocap data',
        format: format || 'json',
        downloadUrl: `/api/skills/download/skill-${Date.now()}`
      }
    });
  } catch (error) {
    console.error('Error exporting mocap data:', error);
    res.status(500).json({ error: 'Failed to export mocap data' });
  }
});

module.exports = router;
