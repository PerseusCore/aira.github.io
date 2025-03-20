const fs = require('fs');
const path = require('path');

// ARC Skill Export Utility
class ARCSkillExporter {
  constructor() {
    this.exportDir = path.join(__dirname, '../../exports');
    if (!fs.existsSync(this.exportDir)) {
      fs.mkdirSync(this.exportDir, { recursive: true });
    }
  }

  // Export skill to ARC format
  exportToARC(skillData) {
    try {
      // Create ARC-specific structure
      const arcSkill = {
        SkillName: skillData.SkillName,
        Description: skillData.Description || '',
        Author: skillData.Author || 'Unknown',
        Version: '1.0.0',
        CreationDate: skillData.ExportDate || new Date().toISOString(),
        ARCVersion: '2023.1',
        TargetController: 'EZ-B V4',
        RequiredPlugins: [],
        CompatibleControllers: ['EZ-B V4', 'EZ-B V5'],
        ServoConfiguration: this._convertDOFToServoConfig(skillData.DOFData),
        SavedPositions: this._convertSavedPositions(skillData.SavedPositions || {}),
        SkillScript: this._generateSkillScript(skillData)
      };

      // Generate unique filename
      const filename = `${skillData.SkillName.replace(/\s+/g, '_')}_${Date.now()}.arcskill`;
      const filePath = path.join(this.exportDir, filename);

      // Write to file
      fs.writeFileSync(filePath, JSON.stringify(arcSkill, null, 2));

      return {
        success: true,
        filePath: filePath,
        filename: filename
      };
    } catch (error) {
      console.error('Error exporting to ARC format:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Convert DOF data to ARC servo configuration
  _convertDOFToServoConfig(dofData) {
    if (!dofData) return {};

    const servoConfig = {};
    
    // Map DOF names to ARC servo ports
    const servoMapping = {
      // Body servos
      'Head_Pan': 'D0',
      'Head_Tilt': 'D1',
      'Left_Shoulder': 'D2',
      'Left_Elbow': 'D3',
      'Right_Shoulder': 'D4',
      'Right_Elbow': 'D5',
      'Waist': 'D6',
      'Torso': 'D7',
      'Left_Hip': 'D8',
      'Left_Knee': 'D9',
      'Left_Ankle': 'D10',
      'Right_Hip': 'D11',
      'Right_Knee': 'D12',
      'Right_Ankle': 'D13',
      
      // Hand servos
      'Left_Thumb': 'D14',
      'Left_Index': 'D15',
      'Left_Middle': 'D16',
      'Left_Ring': 'D17',
      'Left_Pinky': 'D18',
      'Left_Wrist': 'D19',
      'Right_Thumb': 'D20',
      'Right_Index': 'D21',
      'Right_Middle': 'D22',
      'Right_Ring': 'D23',
      'Right_Pinky': 'D24',
      'Right_Wrist': 'D25'
    };

    // Create servo configuration
    Object.keys(dofData).forEach(servoName => {
      const port = servoMapping[servoName] || `D${Object.keys(servoConfig).length}`;
      servoConfig[port] = {
        Name: servoName,
        DefaultPosition: dofData[servoName],
        MinPosition: 0,
        MaxPosition: 180,
        Speed: 10 // Default speed
      };
    });

    return servoConfig;
  }

  // Convert saved positions to ARC format
  _convertSavedPositions(savedPositions) {
    const arcPositions = {};
    
    Object.keys(savedPositions).forEach(positionName => {
      const dofData = savedPositions[positionName];
      const servoPositions = {};
      
      // Map DOF names to ARC servo ports
      Object.keys(dofData).forEach(servoName => {
        const servoMapping = {
          // Body servos
          'Head_Pan': 'D0',
          'Head_Tilt': 'D1',
          'Left_Shoulder': 'D2',
          'Left_Shoulder_Pan': 'D3',
          'Left_Elbow': 'D4',
          'Right_Shoulder': 'D5',
          'Right_Shoulder_Pan': 'D6',
          'Right_Elbow': 'D7',
          'Waist': 'D14',
          'Torso': 'D15',
          'Left_Hip': 'D8',
          'Left_Knee': 'D9',
          'Left_Ankle': 'D10',
          'Right_Hip': 'D11',
          'Right_Knee': 'D12',
          'Right_Ankle': 'D13',
          
          // Hand servos
          'Left_Thumb': 'V1',
          'Left_Index': 'V2',
          'Left_Middle': 'V3',
          'Left_Ring': 'V4',
          'Left_Pinky': 'V5',
          'Left_Wrist': 'V6',
          'Right_Thumb': 'V7',
          'Right_Index': 'V8',
          'Right_Middle': 'V9',
          'Right_Ring': 'V10',
          'Right_Pinky': 'V11',
          'Right_Wrist': 'V12'
        };
        
        const port = servoMapping[servoName] || `D${Object.keys(servoPositions).length}`;
        servoPositions[port] = dofData[servoName];
      });
      
      arcPositions[positionName] = {
        ServoPositions: servoPositions,
        Speed: 10 // Default speed
      };
    });
    
    return arcPositions;
  }

  // Generate ARC skill script
  _generateSkillScript(skillData) {
    // Create a simple script that loads each saved position
    let script = `// Auto-generated script for ${skillData.SkillName}\n`;
    script += `// Created: ${new Date().toLocaleString()}\n\n`;
    script += `// Initialize skill\nfunction Initialize() {\n  Console.WriteLine("Initializing ${skillData.SkillName}...");\n}\n\n`;
    script += `// Main skill function\nfunction Main() {\n`;
    
    // Add code to load each saved position
    const savedPositions = skillData.SavedPositions || {};
    if (Object.keys(savedPositions).length > 0) {
      script += `  // Load saved positions\n`;
      Object.keys(savedPositions).forEach(positionName => {
        script += `  LoadPosition("${positionName}");\n`;
        script += `  Sleep(1000); // Wait 1 second\n\n`;
      });
    } else {
      script += `  Console.WriteLine("No saved positions to load.");\n`;
    }
    
    script += `  Console.WriteLine("Skill execution completed.");\n`;
    script += `}\n\n`;
    
    // Add helper functions
    script += `// Helper function to load a position\nfunction LoadPosition(positionName) {\n`;
    script += `  Console.WriteLine("Loading position: " + positionName);\n`;
    script += `  Skill.LoadPosition(positionName);\n`;
    script += `}\n`;
    
    return script;
  }
}

module.exports = ARCSkillExporter;
