const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const xml2js = require('xml2js');
const ARCSkillExporter = require('../utils/ARCSkillExporter');

// Data storage directory
const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Export formats directory
const exportDir = path.join(__dirname, '../../exports');
if (!fs.existsSync(exportDir)) {
  fs.mkdirSync(exportDir, { recursive: true });
}

// Initialize ARC Skill Exporter
const arcExporter = new ARCSkillExporter();

// Convert JSON to XML
const convertToXml = (skillData) => {
  const builder = new xml2js.Builder({
    rootName: 'ARCSkill',
    xmldec: { version: '1.0', encoding: 'UTF-8' }
  });
  
  return builder.buildObject(skillData);
};

// Create ARC Skill Package
const createArcSkillPackage = (skillData) => {
  // Use the ARCSkillExporter to create a proper ARC skill package
  const result = arcExporter.exportToARC(skillData);
  
  if (result.success) {
    return {
      success: true,
      filePath: result.filePath,
      filename: result.filename
    };
  } else {
    throw new Error(result.error || 'Failed to create ARC skill package');
  }
};

// Get all skills
router.get('/skills', (req, res) => {
  try {
    const skills = [];
    if (fs.existsSync(dataDir)) {
      const files = fs.readdirSync(dataDir);
      files.forEach(file => {
        if (file.endsWith('.json')) {
          const filePath = path.join(dataDir, file);
          const fileContent = fs.readFileSync(filePath, 'utf8');
          const skill = JSON.parse(fileContent);
          skills.push({
            id: file.replace('.json', ''),
            name: skill.SkillName || 'Unnamed Skill',
            description: skill.Description || '',
            exportDate: skill.ExportDate || new Date().toISOString(),
            format: skill.Format || 'json',
            author: skill.Author || 'Unknown'
          });
        }
      });
    }
    res.json(skills);
  } catch (error) {
    console.error('Error getting skills:', error);
    res.status(500).json({ error: 'Failed to get skills' });
  }
});

// Get a specific skill
router.get('/skills/:id', (req, res) => {
  try {
    const skillId = req.params.id;
    const filePath = path.join(dataDir, `${skillId}.json`);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Skill not found' });
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const skill = JSON.parse(fileContent);
    res.json(skill);
  } catch (error) {
    console.error('Error getting skill:', error);
    res.status(500).json({ error: 'Failed to get skill' });
  }
});

// Create a new skill
router.post('/skills', (req, res) => {
  try {
    const skill = req.body;
    
    if (!skill.SkillName) {
      return res.status(400).json({ error: 'Skill name is required' });
    }
    
    // Add export date if not provided
    if (!skill.ExportDate) {
      skill.ExportDate = new Date().toISOString();
    }
    
    // Generate a unique ID
    const skillId = `${skill.SkillName.replace(/\s+/g, '_')}_${Date.now()}`;
    const filePath = path.join(dataDir, `${skillId}.json`);
    
    // Save the JSON version
    fs.writeFileSync(filePath, JSON.stringify(skill, null, 2));
    
    // Create different export formats if requested
    let exportFilePath = '';
    let exportResult = null;
    
    if (skill.Format === 'xml') {
      const xmlData = convertToXml(skill);
      exportFilePath = path.join(exportDir, `${skillId}.xml`);
      fs.writeFileSync(exportFilePath, xmlData);
    } else if (skill.Format === 'arcskill') {
      exportResult = createArcSkillPackage(skill);
      if (exportResult.success) {
        exportFilePath = exportResult.filePath;
      } else {
        throw new Error('Failed to create ARC skill package');
      }
    } else {
      // Default to JSON
      exportFilePath = path.join(exportDir, `${skillId}.json`);
      fs.writeFileSync(exportFilePath, JSON.stringify(skill, null, 2));
    }
    
    res.status(201).json({ 
      id: skillId,
      message: 'Skill created successfully',
      downloadUrl: `/api/download/${skillId}`
    });
  } catch (error) {
    console.error('Error creating skill:', error);
    res.status(500).json({ error: 'Failed to create skill' });
  }
});

// Download a skill
router.get('/download/:id', (req, res) => {
  try {
    const skillId = req.params.id;
    const jsonFilePath = path.join(dataDir, `${skillId}.json`);
    
    if (!fs.existsSync(jsonFilePath)) {
      return res.status(404).json({ error: 'Skill not found' });
    }
    
    const fileContent = fs.readFileSync(jsonFilePath, 'utf8');
    const skill = JSON.parse(fileContent);
    
    let downloadFilePath = '';
    let contentType = 'application/json';
    let fileExtension = 'json';
    
    // Determine the correct file to download based on format
    if (skill.Format === 'xml') {
      downloadFilePath = path.join(exportDir, `${skillId}.xml`);
      contentType = 'application/xml';
      fileExtension = 'xml';
      
      // Create XML file if it doesn't exist
      if (!fs.existsSync(downloadFilePath)) {
        const xmlData = convertToXml(skill);
        fs.writeFileSync(downloadFilePath, xmlData);
      }
    } else if (skill.Format === 'arcskill') {
      // Use the ARCSkillExporter to create the ARC skill package
      const exportResult = createArcSkillPackage(skill);
      if (exportResult.success) {
        downloadFilePath = exportResult.filePath;
        contentType = 'application/octet-stream';
        fileExtension = 'arcskill';
      } else {
        throw new Error('Failed to create ARC skill package');
      }
    } else {
      // Default to JSON
      downloadFilePath = path.join(exportDir, `${skillId}.json`);
      
      // Create JSON export file if it doesn't exist
      if (!fs.existsSync(downloadFilePath)) {
        fs.writeFileSync(downloadFilePath, fileContent);
      }
    }
    
    // Set headers for file download
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename=${skill.SkillName.replace(/\s+/g, '_')}.${fileExtension}`);
    
    // Send the file
    res.sendFile(downloadFilePath);
  } catch (error) {
    console.error('Error downloading skill:', error);
    res.status(500).json({ error: 'Failed to download skill' });
  }
});

// Delete a skill
router.delete('/skills/:id', (req, res) => {
  try {
    const skillId = req.params.id;
    const jsonFilePath = path.join(dataDir, `${skillId}.json`);
    
    if (!fs.existsSync(jsonFilePath)) {
      return res.status(404).json({ error: 'Skill not found' });
    }
    
    // Read the skill to get the format
    const fileContent = fs.readFileSync(jsonFilePath, 'utf8');
    const skill = JSON.parse(fileContent);
    
    // Delete the JSON file
    fs.unlinkSync(jsonFilePath);
    
    // Delete export files if they exist
    const exportFormats = ['json', 'xml', 'arcskill'];
    exportFormats.forEach(format => {
      const exportFilePath = path.join(exportDir, `${skillId}.${format}`);
      if (fs.existsSync(exportFilePath)) {
        fs.unlinkSync(exportFilePath);
      }
    });
    
    res.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    console.error('Error deleting skill:', error);
    res.status(500).json({ error: 'Failed to delete skill' });
  }
});

// Get all saved positions for a skill
router.get('/skills/:id/positions', (req, res) => {
  try {
    const skillId = req.params.id;
    const filePath = path.join(dataDir, `${skillId}.json`);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Skill not found' });
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const skill = JSON.parse(fileContent);
    
    res.json(skill.SavedPositions || {});
  } catch (error) {
    console.error('Error getting positions:', error);
    res.status(500).json({ error: 'Failed to get positions' });
  }
});

// Add a new position to a skill
router.post('/skills/:id/positions', (req, res) => {
  try {
    const skillId = req.params.id;
    const { name, positions } = req.body;
    
    if (!name || !positions) {
      return res.status(400).json({ error: 'Position name and data are required' });
    }
    
    const filePath = path.join(dataDir, `${skillId}.json`);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Skill not found' });
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const skill = JSON.parse(fileContent);
    
    // Initialize SavedPositions if it doesn't exist
    if (!skill.SavedPositions) {
      skill.SavedPositions = {};
    }
    
    // Add the new position
    skill.SavedPositions[name] = positions;
    
    // Save the updated skill
    fs.writeFileSync(filePath, JSON.stringify(skill, null, 2));
    
    res.status(201).json({ 
      message: 'Position added successfully',
      name: name
    });
  } catch (error) {
    console.error('Error adding position:', error);
    res.status(500).json({ error: 'Failed to add position' });
  }
});

// Delete a position from a skill
router.delete('/skills/:id/positions/:name', (req, res) => {
  try {
    const skillId = req.params.id;
    const positionName = req.params.name;
    
    const filePath = path.join(dataDir, `${skillId}.json`);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Skill not found' });
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const skill = JSON.parse(fileContent);
    
    // Check if the position exists
    if (!skill.SavedPositions || !skill.SavedPositions[positionName]) {
      return res.status(404).json({ error: 'Position not found' });
    }
    
    // Delete the position
    delete skill.SavedPositions[positionName];
    
    // Save the updated skill
    fs.writeFileSync(filePath, JSON.stringify(skill, null, 2));
    
    res.json({ message: 'Position deleted successfully' });
  } catch (error) {
    console.error('Error deleting position:', error);
    res.status(500).json({ error: 'Failed to delete position' });
  }
});

// Export a skill to ARC format
router.post('/export/arc/:id', (req, res) => {
  try {
    const skillId = req.params.id;
    const jsonFilePath = path.join(dataDir, `${skillId}.json`);
    
    if (!fs.existsSync(jsonFilePath)) {
      return res.status(404).json({ error: 'Skill not found' });
    }
    
    const fileContent = fs.readFileSync(jsonFilePath, 'utf8');
    const skill = JSON.parse(fileContent);
    
    // Use the ARCSkillExporter to create the ARC skill package
    const exportResult = arcExporter.exportToARC(skill);
    
    if (exportResult.success) {
      res.json({
        success: true,
        message: 'Skill exported to ARC format successfully',
        downloadUrl: `/api/download/arc/${path.basename(exportResult.filePath)}`
      });
    } else {
      throw new Error(exportResult.error || 'Failed to export skill to ARC format');
    }
  } catch (error) {
    console.error('Error exporting skill to ARC format:', error);
    res.status(500).json({ error: 'Failed to export skill to ARC format' });
  }
});

// Download an ARC skill package
router.get('/download/arc/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(exportDir, filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'ARC skill package not found' });
    }
    
    // Set headers for file download
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    
    // Send the file
    res.sendFile(filePath);
  } catch (error) {
    console.error('Error downloading ARC skill package:', error);
    res.status(500).json({ error: 'Failed to download ARC skill package' });
  }
});

// Export entire database
router.post('/export/database', (req, res) => {
  try {
    const { format, includePositions, includeMetadata } = req.body;
    
    if (!fs.existsSync(dataDir)) {
      return res.status(404).json({ error: 'No database found' });
    }
    
    // Read all skill files
    const files = fs.readdirSync(dataDir);
    const skills = [];
    
    files.forEach(file => {
      if (file.endsWith('.json')) {
        const filePath = path.join(dataDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        let skill = JSON.parse(fileContent);
        
        // Filter out positions if not requested
        if (!includePositions && skill.SavedPositions) {
          delete skill.SavedPositions;
        }
        
        // Filter out metadata if not requested
        if (!includeMetadata) {
          delete skill.ExportDate;
          delete skill.Author;
        }
        
        skills.push({
          id: file.replace('.json', ''),
          ...skill
        });
      }
    });
    
    // Generate export filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const exportFilename = `database_export_${timestamp}`;
    let exportFilePath = '';
    let contentType = '';
    
    // Export in requested format
    if (format === 'xml') {
      const builder = new xml2js.Builder({
        rootName: 'Database',
        xmldec: { version: '1.0', encoding: 'UTF-8' }
      });
      
      const xmlData = builder.buildObject({ skills });
      exportFilePath = path.join(exportDir, `${exportFilename}.xml`);
      fs.writeFileSync(exportFilePath, xmlData);
      contentType = 'application/xml';
    } else if (format === 'csv') {
      // Create CSV content
      let csvContent = 'ID,Name,Description,Author,ExportDate,Format\n';
      
      skills.forEach(skill => {
        csvContent += `"${skill.id}","${skill.SkillName || ''}","${skill.Description || ''}","${skill.Author || ''}","${skill.ExportDate || ''}","${skill.Format || 'json'}"\n`;
      });
      
      exportFilePath = path.join(exportDir, `${exportFilename}.csv`);
      fs.writeFileSync(exportFilePath, csvContent);
      contentType = 'text/csv';
    } else {
      // Default to JSON
      exportFilePath = path.join(exportDir, `${exportFilename}.json`);
      fs.writeFileSync(exportFilePath, JSON.stringify({ skills }, null, 2));
      contentType = 'application/json';
    }
    
    res.json({
      success: true,
      message: 'Database exported successfully',
      downloadUrl: `/api/download/database/${path.basename(exportFilePath)}`
    });
  } catch (error) {
    console.error('Error exporting database:', error);
    res.status(500).json({ error: 'Failed to export database' });
  }
});

// Download database export
router.get('/download/database/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(exportDir, filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Database export not found' });
    }
    
    // Determine content type based on file extension
    let contentType = 'application/json';
    if (filename.endsWith('.xml')) {
      contentType = 'application/xml';
    } else if (filename.endsWith('.csv')) {
      contentType = 'text/csv';
    }
    
    // Set headers for file download
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    
    // Send the file
    res.sendFile(filePath);
  } catch (error) {
    console.error('Error downloading database export:', error);
    res.status(500).json({ error: 'Failed to download database export' });
  }
});

module.exports = router;
