import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
const Test02Three: React.FC = () => {
 const mountRef = useRef<HTMLDivElement>(null);
 useEffect(() => {
   // Set up renderer
   const renderer = new THREE.WebGLRenderer();

   renderer.shadowMap.enabled = true;

   renderer.setSize(window.innerWidth, window.innerHeight);
   mountRef.current?.appendChild(renderer.domElement);
   // Create a scene
   const scene = new THREE.Scene();
   // Create a camera
   const camera = new THREE.PerspectiveCamera(
     45,
     window.innerWidth / window.innerHeight,
     0.1,
     1000
   );
   const orbit = new OrbitControls(camera, renderer.domElement);
   // Set camera position x, y, z
   camera.position.set(-10, 30, 30);
   orbit.update();

   // Add an axes helper to the scene
   const axesHelper = new THREE.AxesHelper(5);
   scene.add(axesHelper);
   const gridHelper = new THREE.GridHelper(30);
   scene.add(gridHelper);

   const coordinates: number[][] = [
    [1, 1],
    [1, 5],
    [5, 5],
    [5, 1],
    [6, 5],
    [6, 12],
    [13, 12],
    [13, 5],
    [15, 2],
    [15, 4],
    [17, 4],
    [17, 2],
   ];

   

   for (let i = 0; i < 12; i+=4) {

    let height = coordinates[1+i][1] - coordinates[0+i][1];
   let width = coordinates[2+i][0] - coordinates[1+i][0];

   let center_x = coordinates[0+i][0] + width/2;
   let center_y = coordinates[0+i][1] + height/2;

   // Plane Geometry (for edges)
    const planeGeoMetry = new THREE.PlaneGeometry(width, height);

    // Create an EdgesGeometry from the PlaneGeometry
    const edges = new THREE.EdgesGeometry(planeGeoMetry);

    // Create LineBasicMaterial with a specific line width
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        linewidth: 10 // Adjust this value for the border width (e.g., 1, 2, 3)
    });

    // Create the LineSegments to display the edges
    const planeBorder = new THREE.LineSegments(edges, lineMaterial);

    // Position the border plane
    planeBorder.position.set(center_x, center_y, 0);

    // Add the border plane to the scene
    scene.add(planeBorder);
}

// Lights
const ambientLight = new THREE.AmbientLight(0xeeeeff, 0.8); // Ambient light
scene.add(ambientLight);

 // Ambient light
const directionalLight = new THREE.DirectionalLight(0xffffee, 0.8); // Ambient light
scene.add(directionalLight);
directionalLight.position.set(-30, 50, 30);
directionalLight.castShadow = true;
directionalLight.shadow.camera.bottom = -50;


const pointLight = new THREE.PointLight(0xffffff, 1); // Point light as the sun
pointLight.position.set(0, 0, 0); // Place the light at the sun's position
scene.add(pointLight);
pointLight.castShadow = true;

const spotLight = new THREE.SpotLight(0xff9999);
scene.add(spotLight);
spotLight.castShadow = true;
spotLight.position.set(0, 0+3, 0+0.5);
spotLight.angle = 0.75;

scene.fog = new THREE.Fog(0xcccccc, 0.01, 200);

   const options = {
     boxColor: '#ffae00',
     sphereColor: '#ffae00',
     sphere2Color: '#ffae00',
     bodyColor: '#ffae00',
     boxWireFrame: false,
     sphereWireFrame: false,
     sphere2WireFrame: false,
     sphere1Speed: 0.01,
     sphere2Speed: 0.01,
     bodySpeed: 0.01,
     spotLightAngle: 0.75,
     penumbra: 0,
     intensity: 1
   };

   const mousePosition = new THREE.Vector2();

   // Update mouse position on movement
    window.addEventListener('mousemove', (e) => {
      mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
      mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1; // Corrected window height
    });

   const rayCaster = new THREE.Raycaster();

   // Handle click events
    window.addEventListener('click', () => {
      rayCaster.setFromCamera(mousePosition, camera);
      const intersects = rayCaster.intersectObjects(scene.children);
      for (let i = 0; i < intersects.length; i++) {
        
      }
    });

    // Rotation Variables
   let angle3 = 0;

   function animate(time: number) {
     requestAnimationFrame(animate);
      
     angle3 += 0.05; // Increment animation
     spotLight.angle = options.spotLightAngle;
     spotLight.penumbra = options.penumbra;
     spotLight.intensity = options.intensity;

     rayCaster.setFromCamera(mousePosition, camera);
     //const intersects = rayCaster.intersectObjects(scene.children);
     //console.log(intersects);

     renderer.render(scene, camera);
   }
   renderer.setAnimationLoop(animate);

   window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
   })
   
   // Cleanup when the component is unmounted
   return () => {
     mountRef.current?.removeChild(renderer.domElement);
   };
 }, []);
 return <div ref={mountRef} />;
};
export default Test02Three;