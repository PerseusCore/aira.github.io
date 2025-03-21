import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const RobotVisualization = ({ servoPositions }) => {
  const mountRef = useRef(null);
  
  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75, 
      mountRef.current.clientWidth / mountRef.current.clientHeight, 
      0.1, 
      1000
    );
    camera.position.z = 5;
    camera.position.y = 1;
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Robot parts
    const robotParts = {};
    const materials = {
      body: new THREE.MeshPhongMaterial({ color: 0x6f42c1 }),
      joint: new THREE.MeshPhongMaterial({ color: 0x444444 }),
      limb: new THREE.MeshPhongMaterial({ color: 0x888888 })
    };
    
    // Create robot body
    robotParts.torso = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1.5, 0.5),
      materials.body
    );
    scene.add(robotParts.torso);
    
    // Head
    robotParts.head = new THREE.Mesh(
      new THREE.SphereGeometry(0.3, 32, 32),
      materials.body
    );
    robotParts.head.position.y = 1.1;
    robotParts.torso.add(robotParts.head);
    
    // Arms
    // Left arm
    robotParts.leftShoulder = new THREE.Mesh(
      new THREE.SphereGeometry(0.15, 32, 32),
      materials.joint
    );
    robotParts.leftShoulder.position.set(-0.6, 0.6, 0);
    robotParts.torso.add(robotParts.leftShoulder);
    
    robotParts.leftUpperArm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.5),
      materials.limb
    );
    robotParts.leftUpperArm.position.y = -0.3;
    robotParts.leftUpperArm.rotation.x = Math.PI / 2;
    robotParts.leftShoulder.add(robotParts.leftUpperArm);
    
    robotParts.leftElbow = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 32, 32),
      materials.joint
    );
    robotParts.leftElbow.position.y = -0.6;
    robotParts.leftShoulder.add(robotParts.leftElbow);
    
    robotParts.leftForearm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.07, 0.07, 0.5),
      materials.limb
    );
    robotParts.leftForearm.position.y = -0.3;
    robotParts.leftForearm.rotation.x = Math.PI / 2;
    robotParts.leftElbow.add(robotParts.leftForearm);
    
    robotParts.leftHand = new THREE.Mesh(
      new THREE.BoxGeometry(0.15, 0.2, 0.05),
      materials.body
    );
    robotParts.leftHand.position.y = -0.6;
    robotParts.leftElbow.add(robotParts.leftHand);
    
    // Right arm
    robotParts.rightShoulder = new THREE.Mesh(
      new THREE.SphereGeometry(0.15, 32, 32),
      materials.joint
    );
    robotParts.rightShoulder.position.set(0.6, 0.6, 0);
    robotParts.torso.add(robotParts.rightShoulder);
    
    robotParts.rightUpperArm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.5),
      materials.limb
    );
    robotParts.rightUpperArm.position.y = -0.3;
    robotParts.rightUpperArm.rotation.x = Math.PI / 2;
    robotParts.rightShoulder.add(robotParts.rightUpperArm);
    
    robotParts.rightElbow = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 32, 32),
      materials.joint
    );
    robotParts.rightElbow.position.y = -0.6;
    robotParts.rightShoulder.add(robotParts.rightElbow);
    
    robotParts.rightForearm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.07, 0.07, 0.5),
      materials.limb
    );
    robotParts.rightForearm.position.y = -0.3;
    robotParts.rightForearm.rotation.x = Math.PI / 2;
    robotParts.rightElbow.add(robotParts.rightForearm);
    
    robotParts.rightHand = new THREE.Mesh(
      new THREE.BoxGeometry(0.15, 0.2, 0.05),
      materials.body
    );
    robotParts.rightHand.position.y = -0.6;
    robotParts.rightElbow.add(robotParts.rightHand);
    
    // Legs
    // Left leg
    robotParts.leftHip = new THREE.Mesh(
      new THREE.SphereGeometry(0.15, 32, 32),
      materials.joint
    );
    robotParts.leftHip.position.set(-0.3, -0.8, 0);
    robotParts.torso.add(robotParts.leftHip);
    
    robotParts.leftThigh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.1, 0.6),
      materials.limb
    );
    robotParts.leftThigh.position.y = -0.4;
    robotParts.leftHip.add(robotParts.leftThigh);
    
    robotParts.leftKnee = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 32, 32),
      materials.joint
    );
    robotParts.leftKnee.position.y = -0.8;
    robotParts.leftHip.add(robotParts.leftKnee);
    
    robotParts.leftShin = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.6),
      materials.limb
    );
    robotParts.leftShin.position.y = -0.4;
    robotParts.leftKnee.add(robotParts.leftShin);
    
    robotParts.leftFoot = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 0.1, 0.3),
      materials.body
    );
    robotParts.leftFoot.position.y = -0.8;
    robotParts.leftFoot.position.z = 0.1;
    robotParts.leftKnee.add(robotParts.leftFoot);
    
    // Right leg
    robotParts.rightHip = new THREE.Mesh(
      new THREE.SphereGeometry(0.15, 32, 32),
      materials.joint
    );
    robotParts.rightHip.position.set(0.3, -0.8, 0);
    robotParts.torso.add(robotParts.rightHip);
    
    robotParts.rightThigh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.1, 0.6),
      materials.limb
    );
    robotParts.rightThigh.position.y = -0.4;
    robotParts.rightHip.add(robotParts.rightThigh);
    
    robotParts.rightKnee = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 32, 32),
      materials.joint
    );
    robotParts.rightKnee.position.y = -0.8;
    robotParts.rightHip.add(robotParts.rightKnee);
    
    robotParts.rightShin = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.6),
      materials.limb
    );
    robotParts.rightShin.position.y = -0.4;
    robotParts.rightKnee.add(robotParts.rightShin);
    
    robotParts.rightFoot = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 0.1, 0.3),
      materials.body
    );
    robotParts.rightFoot.position.y = -0.8;
    robotParts.rightFoot.position.z = 0.1;
    robotParts.rightKnee.add(robotParts.rightFoot);
    
    // Update robot based on servo positions
    const updateRobotPose = () => {
      if (!servoPositions) return;
      
      // Convert servo values (0-180) to radians (-PI/2 to PI/2)
      const convertToRad = (value) => {
        return ((value - 90) / 180) * Math.PI;
      };
      
      // Head
      if (servoPositions.Head_Pan) {
        robotParts.head.rotation.y = convertToRad(servoPositions.Head_Pan);
      }
      if (servoPositions.Head_Tilt) {
        robotParts.head.rotation.x = convertToRad(servoPositions.Head_Tilt);
      }
      
      // Left arm
      if (servoPositions.Left_Shoulder) {
        robotParts.leftShoulder.rotation.x = convertToRad(servoPositions.Left_Shoulder);
      }
      
      // Create a separate joint for Left Shoulder Pan that moves up/down
      if (servoPositions.Left_Shoulder_Pan) {
        // First rotate the shoulder joint
        robotParts.leftShoulder.rotation.y = convertToRad(servoPositions.Left_Shoulder_Pan);
        
        // Then move the entire shoulder up/down based on pan value
        // Map from 0-180 to -0.3 to 0.3 for vertical movement
        const verticalOffset = ((servoPositions.Left_Shoulder_Pan - 90) / 180) * 0.6;
        robotParts.leftShoulder.position.y = 0.6 + verticalOffset;
      }
      
      if (servoPositions.Left_Elbow) {
        robotParts.leftElbow.rotation.x = convertToRad(servoPositions.Left_Elbow);
      }
      
      // Right arm
      if (servoPositions.Right_Shoulder) {
        robotParts.rightShoulder.rotation.x = convertToRad(servoPositions.Right_Shoulder);
      }
      
      // Create a separate joint for Right Shoulder Pan that moves up/down
      if (servoPositions.Right_Shoulder_Pan) {
        // First rotate the shoulder joint
        robotParts.rightShoulder.rotation.y = convertToRad(servoPositions.Right_Shoulder_Pan);
        
        // Then move the entire shoulder up/down based on pan value
        // Map from 0-180 to -0.3 to 0.3 for vertical movement
        const verticalOffset = ((servoPositions.Right_Shoulder_Pan - 90) / 180) * 0.6;
        robotParts.rightShoulder.position.y = 0.6 + verticalOffset;
      }
      
      if (servoPositions.Right_Elbow) {
        robotParts.rightElbow.rotation.x = convertToRad(servoPositions.Right_Elbow);
      }
      
      // Waist and torso
      if (servoPositions.Waist) {
        robotParts.torso.rotation.y = convertToRad(servoPositions.Waist);
      }
      if (servoPositions.Torso) {
        robotParts.torso.rotation.x = convertToRad(servoPositions.Torso) / 2; // Reduced range
      }
      
      // Left leg
      if (servoPositions.Left_Hip) {
        robotParts.leftHip.rotation.x = convertToRad(servoPositions.Left_Hip);
      }
      if (servoPositions.Left_Knee) {
        robotParts.leftKnee.rotation.x = convertToRad(servoPositions.Left_Knee);
      }
      if (servoPositions.Left_Ankle) {
        robotParts.leftFoot.rotation.x = convertToRad(servoPositions.Left_Ankle);
      }
      
      // Right leg
      if (servoPositions.Right_Hip) {
        robotParts.rightHip.rotation.x = convertToRad(servoPositions.Right_Hip);
      }
      if (servoPositions.Right_Knee) {
        robotParts.rightKnee.rotation.x = convertToRad(servoPositions.Right_Knee);
      }
      if (servoPositions.Right_Ankle) {
        robotParts.rightFoot.rotation.x = convertToRad(servoPositions.Right_Ankle);
      }
      
      // Hand servos (simplified visualization)
      if (servoPositions.Left_Wrist) {
        robotParts.leftHand.rotation.z = convertToRad(servoPositions.Left_Wrist);
      }
      if (servoPositions.Right_Wrist) {
        robotParts.rightHand.rotation.z = convertToRad(servoPositions.Right_Wrist);
      }
    };
    
    // Initial update
    updateRobotPose();
    
    // Animation loop
    let frameId;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      
      // Rotate the scene slightly for better viewing
      scene.rotation.y = Math.sin(Date.now() * 0.001) * 0.1;
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Update robot when servo positions change
    const watchServoChanges = () => {
      updateRobotPose();
    };
    
    // Watch for servo position changes
    const watchInterval = setInterval(watchServoChanges, 100);
    
    // Cleanup
    return () => {
      clearInterval(watchInterval);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [servoPositions]);
  
  return <div ref={mountRef} style={{ width: '100%', height: '400px' }} />;
};

export default RobotVisualization;
