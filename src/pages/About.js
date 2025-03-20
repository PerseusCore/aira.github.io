import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="container">
      <h2 className="mb-4">About AIRA Robot Skill Export</h2>
      
      <div className="row mb-5">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Overview</h3>
            </div>
            <div className="card-body">
              <p>
                AIRA Robot Skill Export is a web-based tool designed to help users create, manage, and export skills for the AIRA Humanoid Robot. 
                This tool bridges the gap between web interfaces and the Synthiam ARC software, allowing for seamless export of robot skills.
              </p>
              <p>
                The AIRA Humanoid Robot uses the ez-b V4 smart robot controller to control 14 servos for the body and 12 servos for the hands through Synthiam ARC software.
                Our tool provides an intuitive interface for configuring these servos, saving positions, and exporting the resulting skills in formats compatible with ARC.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="row mb-5">
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header">
              <h3 className="card-title">Features</h3>
            </div>
            <div className="card-body">
              <ul>
                <li>Interactive 3D robot visualization</li>
                <li>Intuitive servo position controls</li>
                <li>Position saving and management</li>
                <li>Export to multiple formats (JSON, XML, ARC Skill Package)</li>
                <li>Skill library management</li>
                <li>Detailed skill information and visualization</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header">
              <h3 className="card-title">How to Use</h3>
            </div>
            <div className="card-body">
              <ol>
                <li>
                  <strong>Create a Skill</strong>: Navigate to the <Link to="/export">Create Skill</Link> page and configure your robot's servo positions.
                </li>
                <li>
                  <strong>Save Positions</strong>: Save different positions for your robot to create complex behaviors.
                </li>
                <li>
                  <strong>Export</strong>: Export your skill in your preferred format (JSON, XML, or ARC Skill Package).
                </li>
                <li>
                  <strong>Import to ARC</strong>: Import the exported skill into Synthiam ARC software to use with your AIRA Humanoid Robot.
                </li>
                <li>
                  <strong>Manage Library</strong>: View and manage your skills in the <Link to="/skills">My Skills</Link> page.
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
      
      <div className="row mb-5">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Technical Information</h3>
            </div>
            <div className="card-body">
              <h5>AIRA Humanoid Robot Configuration</h5>
              <p>
                The AIRA Humanoid Robot uses the ez-b V4 smart robot controller to control the following servos:
              </p>
              
              <div className="row">
                <div className="col-md-6">
                  <h6>Body Servos (14)</h6>
                  <ul>
                    <li>Head_Pan</li>
                    <li>Head_Tilt</li>
                    <li>Left_Shoulder</li>
                    <li>Left_Shoulder_Pan</li>
                    <li>Left_Elbow</li>
                    <li>Right_Shoulder</li>
                    <li>Right_Shoulder_Pan</li>
                    <li>Right_Elbow</li>
                    <li>Waist</li>
                    <li>Torso</li>
                    <li>Left_Hip</li>
                    <li>Left_Knee</li>
                    <li>Left_Ankle</li>
                    <li>Right_Hip</li>
                    <li>Right_Knee</li>
                    <li>Right_Ankle</li>
                  </ul>
                </div>
                
                <div className="col-md-6">
                  <h6>Hand Servos (12)</h6>
                  <ul>
                    <li>Left_Thumb</li>
                    <li>Left_Index</li>
                    <li>Left_Middle</li>
                    <li>Left_Ring</li>
                    <li>Left_Pinky</li>
                    <li>Left_Wrist</li>
                    <li>Right_Thumb</li>
                    <li>Right_Index</li>
                    <li>Right_Middle</li>
                    <li>Right_Ring</li>
                    <li>Right_Pinky</li>
                    <li>Right_Wrist</li>
                  </ul>
                </div>
              </div>
              
              <h5 className="mt-4">Export Formats</h5>
              <p>
                The tool supports exporting skills in the following formats:
              </p>
              <ul>
                <li>
                  <strong>JSON</strong>: A standard data interchange format that can be easily processed by various applications.
                </li>
                <li>
                  <strong>XML</strong>: An extensible markup language that is widely used for structured data.
                </li>
                <li>
                  <strong>ARC Skill Package</strong>: A specialized format for direct import into Synthiam ARC software.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Resources</h3>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <h5>External Links</h5>
                  <ul>
                    <li>
                      <a href="https://synthiam.com/" target="_blank" rel="noopener noreferrer">
                        Synthiam Website
                      </a>
                    </li>
                    <li>
                      <a href="https://synthiam.com/Support/Create-Robot-Skill/Overview" target="_blank" rel="noopener noreferrer">
                        ARC Robot Skill Documentation
                      </a>
                    </li>
                    <li>
                      <a href="https://synthiam.com/Community" target="_blank" rel="noopener noreferrer">
                        Synthiam Community
                      </a>
                    </li>
                  </ul>
                </div>
                
                <div className="col-md-6">
                  <h5>Get Started</h5>
                  <div className="d-grid gap-2">
                    <Link to="/export" className="btn btn-primary">
                      Create Your First Skill
                    </Link>
                    <Link to="/skills" className="btn btn-outline-primary">
                      View Your Skills
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
