const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { Builder } = require('xml2js');

// DOF data conversion service
class DOFConverter {
  constructor() {
    this.jointMapping = {
      // MediaPipe pose landmarks to AIRA robot servo mapping
      // Head
      0: 'Head_Pan',    // nose
      1: 'Head_Tilt',   // left eye inner
      2: 'Head_Tilt',   // left eye
      3: 'Head_Tilt',   // left eye outer
      4: 'Head_Tilt',   // right eye inner
      5: 'Head_Tilt',   // right eye
      6: 'Head_Tilt',   // right eye outer
      
      // Shoulders
      11: 'Left_Shoulder',  // left shoulder
      12: 'Left_Shoulder_Pan',
      13: 'Right_Shoulder', // right shoulder
      14: 'Right_Shoulder_Pan',
      
      // Elbows
      13: 'Left_Elbow',     // left elbow
      14: 'Right_Elbow',    // right elbow
      
      // Wrists
      15: 'Left_Wrist',     // left wrist
      16: 'Right_Wrist',    // right wrist
      
      // Torso
      23: 'Waist',          // hip center
      24: 'Torso',          // spine
      
      // Hips
      23: 'Left_Hip',       // left hip
      24: 'Right_Hip',      // right hip
      
      // Knees
      25: 'Left_Knee',      // left knee
      26: 'Right_Knee',     // right knee
      
      // Ankles
      27: 'Left_Ankle',     // left ankle
      28: 'Right_Ankle',    // right ankle
      
      // Hands (simplified mapping)
      // In reality, MediaPipe hand landmarks would be used for detailed hand tracking
      17: 'Left_Thumb',     // left pinky
      18: 'Left_Index',     // left index
      19: 'Right_Thumb',    // right pinky
      20: 'Right_Index'     // right index
    };
  }
  
  // Convert mocap data to DOF data
  convertToDOF(mocapData) {
    const dofData = {
      // Default servo positions (90 degrees is center)
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
    };
    
    // Process mocap data and map to DOF values
    // This is a simplified example - actual implementation would involve
    // complex angle calculations based on 3D joint positions
    for (const [landmarkId, landmark] of Object.entries(mocapData.landmarks)) {
      const servoName = this.jointMapping[landmarkId];
      if (servoName) {
        // Convert 3D position to servo angle (simplified)
        // In reality, this would involve inverse kinematics and angle calculations
        const angle = this.calculateServoAngle(landmark, servoName);
        dofData[servoName] = angle;
      }
    }
    
    return dofData;
  }
  
  // Calculate servo angle from landmark position (simplified)
  calculateServoAngle(landmark, servoName) {
    // This is a simplified calculation
    // In reality, this would involve complex 3D math and inverse kinematics
    
    // Normalize x, y, z to -1 to 1 range
    const x = (landmark.x - 0.5) * 2;
    const y = (landmark.y - 0.5) * 2;
    const z = landmark.z;
    
    // Different calculation based on joint type
    let angle = 90; // Default center position
    
    if (servoName.includes('Shoulder')) {
      // Shoulder angle based on arm position
      angle = 90 + (y * 45); // Range: 45-135 degrees
    } else if (servoName.includes('Elbow')) {
      // Elbow angle calculation
      angle = 90 - (z * 60); // Range: 30-150 degrees
    } else if (servoName.includes('Hip')) {
      // Hip angle calculation
      angle = 90 + (y * 30); // Range: 60-120 degrees
    } else if (servoName.includes('Knee')) {
      // Knee angle calculation
      angle = 90 + (z * 45); // Range: 45-135 degrees
    } else if (servoName === 'Waist') {
      // Waist rotation based on hip orientation
      angle = 90 + (x * 45); // Range: 45-135 degrees
    } else if (servoName === 'Head_Pan') {
      // Head pan (left-right) based on face orientation
      angle = 90 + (x * 60); // Range: 30-150 degrees
    } else if (servoName === 'Head_Tilt') {
      // Head tilt (up-down) based on face orientation
      angle = 90 + (y * 30); // Range: 60-120 degrees
    }
    
    // Ensure angle is within valid range (0-180 degrees)
    return Math.max(0, Math.min(180, Math.round(angle)));
  }
  
  // Convert DOF data to ARC skill format
  convertToARCSkill(dofData, metadata) {
    const arcSkill = {
      SkillName: metadata.name || 'Exported Skill',
      Description: metadata.description || 'Skill exported from mocap data',
      Author: metadata.author || 'AIRA Robot Skill Export',
      Version: '1.0',
      ExportDate: new Date().toISOString(),
      Format: 'arcskill',
      DOFData: dofData,
      SavedPositions: metadata.positions || {},
      Configuration: {
        FrameRate: metadata.frameRate || 30,
        LoopEnabled: metadata.loop || false,
        SmoothingFactor: metadata.smoothing || 0.5
      }
    };
    
    return arcSkill;
  }
  
  // Export DOF data to different formats
  exportDOF(dofData, metadata, format) {
    switch (format.toLowerCase()) {
      case 'json':
        return this.exportToJSON(dofData, metadata);
      case 'xml':
        return this.exportToXML(dofData, metadata);
      case 'arcskill':
        return this.exportToARCSkill(dofData, metadata);
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }
  
  // Export to JSON format
  exportToJSON(dofData, metadata) {
    const jsonData = {
      name: metadata.name || 'Exported Skill',
      description: metadata.description || 'Skill exported from mocap data',
      author: metadata.author || 'AIRA Robot Skill Export',
      exportDate: new Date().toISOString(),
      dofData: dofData,
      savedPositions: metadata.positions || {}
    };
    
    return JSON.stringify(jsonData, null, 2);
  }
  
  // Export to XML format
  exportToXML(dofData, metadata) {
    const xmlData = {
      Skill: {
        Name: metadata.name || 'Exported Skill',
        Description: metadata.description || 'Skill exported from mocap data',
        Author: metadata.author || 'AIRA Robot Skill Export',
        ExportDate: new Date().toISOString(),
        DOFData: dofData,
        SavedPositions: metadata.positions || {}
      }
    };
    
    const builder = new Builder({
      rootName: 'AIRARobotSkill',
      xmldec: { version: '1.0', encoding: 'UTF-8' }
    });
    
    return builder.buildObject(xmlData);
  }
  
  // Export to ARC skill format
  exportToARCSkill(dofData, metadata) {
    const arcSkill = this.convertToARCSkill(dofData, metadata);
    
    // In a real implementation, this would generate the actual ARC skill package
    // For now, we'll just return the JSON representation
    return JSON.stringify(arcSkill, null, 2);
  }
}

// Create a new DOF converter instance
const dofConverter = new DOFConverter();

// Convert mocap data to DOF
router.post('/convert', async (req, res) => {
  try {
    const { mocapData, metadata } = req.body;
    
    if (!mocapData || !mocapData.landmarks) {
      return res.status(400).json({ error: 'Invalid mocap data format' });
    }
    
    // Convert mocap data to DOF data
    const dofData = dofConverter.convertToDOF(mocapData);
    
    res.json({
      success: true,
      dofData,
      message: 'Mocap data converted to DOF successfully'
    });
  } catch (error) {
    console.error('Error converting mocap data:', error);
    res.status(500).json({ error: 'Failed to convert mocap data' });
  }
});

// Export DOF data to specified format
router.post('/export', async (req, res) => {
  try {
    const { dofData, metadata, format } = req.body;
    
    if (!dofData) {
      return res.status(400).json({ error: 'DOF data is required' });
    }
    
    // Export DOF data to specified format
    const exportedData = dofConverter.exportDOF(dofData, metadata || {}, format || 'json');
    
    // Generate filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${metadata?.name || 'exported-skill'}_${timestamp}.${format || 'json'}`;
    const filePath = path.join(__dirname, '../../exports', filename);
    
    // Ensure exports directory exists
    const exportsDir = path.join(__dirname, '../../exports');
    if (!fs.existsSync(exportsDir)) {
      fs.mkdirSync(exportsDir, { recursive: true });
    }
    
    // Write exported data to file
    fs.writeFileSync(filePath, exportedData);
    
    res.json({
      success: true,
      message: `DOF data exported to ${format || 'json'} successfully`,
      filename,
      downloadUrl: `/api/dof/download/${filename}`
    });
  } catch (error) {
    console.error('Error exporting DOF data:', error);
    res.status(500).json({ error: 'Failed to export DOF data' });
  }
});

// Download exported DOF file
router.get('/download/:filename', async (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../../exports', filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    // Determine content type based on file extension
    let contentType = 'application/json';
    if (filename.endsWith('.xml')) {
      contentType = 'application/xml';
    } else if (filename.endsWith('.arcskill')) {
      contentType = 'application/octet-stream';
    }
    
    // Set headers for file download
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    
    // Send the file
    res.sendFile(filePath);
  } catch (error) {
    console.error('Error downloading DOF file:', error);
    res.status(500).json({ error: 'Failed to download DOF file' });
  }
});

// Get DOF data from video
router.post('/from-video/:videoId', async (req, res) => {
  try {
    const videoId = req.params.videoId;
    
    // TODO: Implement actual video processing to extract mocap data
    
    // Mock response for now
    res.json({
      success: true,
      message: 'DOF data extraction started',
      jobId: `dof-extraction-${Date.now()}`,
      estimatedTime: '2 minutes'
    });
  } catch (error) {
    console.error('Error extracting DOF data from video:', error);
    res.status(500).json({ error: 'Failed to extract DOF data from video' });
  }
});

// Get DOF extraction status
router.get('/status/:jobId', async (req, res) => {
  try {
    const jobId = req.params.jobId;
    
    // TODO: Implement job status checking
    
    // Mock response for now
    res.json({
      success: true,
      status: 'completed',
      progress: 100,
      result: {
        dofData: {
          // Sample DOF data for one frame
          Head_Pan: 90,
          Head_Tilt: 85,
          Left_Shoulder: 120,
          Left_Shoulder_Pan: 90,
          Left_Elbow: 45,
          Right_Shoulder: 60,
          Right_Shoulder_Pan: 60,
          Right_Elbow: 135,
          Waist: 90,
          Torso: 95,
          Left_Hip: 100,
          Left_Knee: 110,
          Left_Ankle: 90,
          Right_Hip: 80,
          Right_Knee: 70,
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
        },
        frames: 120,
        duration: '10 seconds'
      }
    });
  } catch (error) {
    console.error('Error checking DOF extraction status:', error);
    res.status(500).json({ error: 'Failed to check DOF extraction status' });
  }
});

module.exports = router;
