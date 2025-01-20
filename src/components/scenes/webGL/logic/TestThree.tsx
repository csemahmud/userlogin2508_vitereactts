import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as dat from 'dat.gui';
import earthTextureImage from '@/assets/earth_texture.jpg';
import stars from '@/assets/stars.jpg';
import nebula from '@/assets/nebula.jpg';
const TestThree: React.FC = () => {
 const mountRef = useRef<HTMLDivElement>(null);
 const guiRef = useRef<dat.GUI | null>(null); // Add ref for GUI instance
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
   // Add an axes helper to the scene
   const axesHelper = new THREE.AxesHelper(5);
   scene.add(axesHelper);
   // Set camera position x, y, z
   camera.position.set(-10, 30, 30);
   orbit.update();
   // Box Geometry
   const boxGeoMetry = new THREE.BoxGeometry();
   const boxMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
   const box = new THREE.Mesh(boxGeoMetry, boxMaterial);
   scene.add(box);
   box.position.set(-10, 10, -5);
   box.castShadow = true;

   // Plane Geometry
   const planeGeoMetry = new THREE.PlaneGeometry(30, 30);
   const planeMaterial = new THREE.MeshStandardMaterial({
     color: 0xffffff,
     side: THREE.DoubleSide
   });
   const plane = new THREE.Mesh(planeGeoMetry, planeMaterial);
   scene.add(plane);
   plane.rotation.x = -0.5 * Math.PI;
   plane.receiveShadow = true;
   const gridHelper = new THREE.GridHelper(30);
   scene.add(gridHelper);

   // Sphere Geometry
   const sphereGeometry = new THREE.SphereGeometry(4, 50, 50);
   const sphereMaterial = new THREE.MeshStandardMaterial({
     color: 0x0000ff,
     wireframe: true
   });
   const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
   scene.add(sphere);
   sphere.position.set(-10, 10, -5);
   sphere.castShadow = true;

   const loader = new GLTFLoader();
    let alien: THREE.Object3D; // Alien model reference
    // Load Alien Model
    loader.load(
    '/alien_head.glb', // Replace with your alien model path
    (gltf) => {
      console.log('Successfully GLTF Loaded:', gltf);
      alien = gltf.scene;
      alien.scale.set(4, 4, 4); // Adjust scale to match the sphere size
      alien.position.set(-10, 10, -5); // Initial position near the sphere
      alien.castShadow = true;
      scene.add(alien); // Add the alien to the scene
    },
    undefined,
    (error) => {
      console.error('Error loading the alien model:', error);
    }
    ); 

   // Earth Sphere
   const textureLoader = new THREE.TextureLoader();
   const earthTexture = textureLoader.load(earthTextureImage); // Replace with your Earth texture file path
   const sphereGeometry2 = new THREE.SphereGeometry(4, 50, 50);
   const sphereMaterial2 = new THREE.MeshStandardMaterial({
     color: 0x99ccFF,
     map: earthTexture // Applying texture
   });
   const sphere2 = new THREE.Mesh(sphereGeometry2, sphereMaterial2);
   scene.add(sphere2);
   // Position the sphere
   sphere2.position.set(10, -10, 5);
   sphere2.castShadow = true;

   // Sun Sphere (Optional, to visualize the Sun at 0,0)
   const sunGeometry = new THREE.SphereGeometry(2, 32, 32);
   const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 }); // Yellow Sun
   const sun = new THREE.Mesh(sunGeometry, sunMaterial);
   scene.add(sun);
   
   // Texture Box Geometry
   const box2GeoMetry = new THREE.BoxGeometry(4, 4, 4);
   const box2MultiMaterial = [
    new THREE.MeshBasicMaterial({map: textureLoader.load(stars)  }), // Applying texture
    new THREE.MeshBasicMaterial({map: textureLoader.load(nebula)  }), // Applying texture
    new THREE.MeshBasicMaterial({map: textureLoader.load(stars)  }), // Applying texture
    new THREE.MeshBasicMaterial({map: textureLoader.load(stars)  }), // Applying texture
    new THREE.MeshBasicMaterial({map: textureLoader.load(nebula)  }), // Applying texture
    new THREE.MeshBasicMaterial({map: textureLoader.load(stars)  }) // Applying texture
   ];
   const box2 = new THREE.Mesh(box2GeoMetry, box2MultiMaterial);
   scene.add(box2);
   box2.position.set(-10.5, 20, 10.5);
   box2.castShadow = true;

   // Materials
   const material = new THREE.MeshStandardMaterial({ color: 0xff6699 });
   // Create the robotic body parts
   const torso = new THREE.Mesh(new THREE.BoxGeometry(2, 3, 1), material);
   scene.add(torso);
   torso.position.set(-10.5, 3.75, 10.5);
   torso.castShadow = true;

   // Head
   const head = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
   head.position.y = 2; // Above the torso
   torso.add(head);
   head.castShadow = true;

// Left Arm
const leftArmPivot = new THREE.Object3D(); // Create a pivot for the left arm
leftArmPivot.position.set(-1.25, 1.5, 0); // Position the pivot at the shoulder
torso.add(leftArmPivot); // Add the pivot to the torso
const leftArm = new THREE.Mesh(new THREE.BoxGeometry(0.5, 2, 0.5), material);
leftArm.position.set(0, -1.5, 0); // Adjust the arm geometry position so it rotates at the shoulder
leftArmPivot.add(leftArm); // Add the arm to the pivot
leftArm.castShadow = true;

// Right Arm
const rightArmPivot = new THREE.Object3D();
rightArmPivot.position.set(1.25, 1.5, 0); // Position the pivot at the shoulder
torso.add(rightArmPivot);
const rightArm = new THREE.Mesh(new THREE.BoxGeometry(0.5, 2, 0.5), material);
rightArm.position.set(0, -1.5, 0); // Adjust the arm geometry position so it rotates at the shoulder
rightArmPivot.add(rightArm);
rightArm.castShadow = true;

// Left Leg
const leftLegPivot = new THREE.Object3D();
leftLegPivot.position.set(-0.5, -2, 0); // Position the pivot at the hip
torso.add(leftLegPivot);
const leftLeg = new THREE.Mesh(new THREE.BoxGeometry(0.5, 2, 0.5), material);
leftLeg.position.set(0, -0.5, 0); // Adjust the leg geometry position so it rotates at the hip
leftLegPivot.add(leftLeg);
leftLeg.castShadow = true;

// Right Leg
const rightLegPivot = new THREE.Object3D();
rightLegPivot.position.set(0.5, -2, 0); // Position the pivot at the hip
torso.add(rightLegPivot);
const rightLeg = new THREE.Mesh(new THREE.BoxGeometry(0.5, 2, 0.5), material);
rightLeg.position.set(0, -0.5, 0); // Adjust the leg geometry position so it rotates at the hip
rightLegPivot.add(rightLeg);
rightLeg.castShadow = true;

// Lights
const ambientLight = new THREE.AmbientLight(0xeeeeff, 0.8); // Ambient light
scene.add(ambientLight);

 // Ambient light
const directionalLight = new THREE.DirectionalLight(0xffffee, 0.8); // Ambient light
scene.add(directionalLight);
directionalLight.position.set(-30, 50, 30);
directionalLight.castShadow = true;
directionalLight.shadow.camera.bottom = -50;

const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
scene.add(dLightHelper);

const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
scene.add(dLightShadowHelper);


const pointLight = new THREE.PointLight(0xffffff, 1); // Point light as the sun
pointLight.position.set(0, 0, 0); // Place the light at the sun's position
scene.add(pointLight);
pointLight.castShadow = true;

const spotLight = new THREE.SpotLight(0xff9999);
scene.add(spotLight);
spotLight.castShadow = true;
spotLight.position.set(torso.position.x, torso.position.y+3, torso.position.z+0.5);
spotLight.angle = 0.75;

const sLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(sLightHelper);

scene.fog = new THREE.Fog(0xcccccc, 0.01, 200);
renderer.setClearColor(0xFFEA00);

const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
  stars,
  nebula,
  stars,
  stars,
  nebula,
  stars
]);

  const plane2Geometry = new THREE.PlaneGeometry(10, 10, 10, 10);
  const plane2Material = new THREE.MeshBasicMaterial({
    color: 0xFFFFFF,
    wireframe: true
  });
  const plane2 = new THREE.Mesh(plane2Geometry, plane2Material);
  scene.add(plane2);
  plane2.position.set(10, 10, 15);

  plane2.geometry.attributes.position.array[0] -= 10 * Math.random();
  plane2.geometry.attributes.position.array[1] -= 10 * Math.random();
  plane2.geometry.attributes.position.array[2] -= 10 * Math.random();
  const lastPointZ = plane2.geometry.attributes.position.array.length - 1;
  plane2.geometry.attributes.position.array[lastPointZ] -= 10 * Math.random();

  // Create a gradient material for the cone
const vertexShader = `
varying vec3 vColor;
void main() {
  vColor = position; // Pass position to the fragment shader
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;
const fragmentShader = `
varying vec3 vColor;
void main() {
  float gradient = smoothstep(-2.0, 2.0, vColor.y);
  vec3 color = mix(vec3(0.35, 0.16, 0.14), vec3(0.65, 0.33, 0.22), gradient);
  gl_FragColor = vec4(color, 1.0);
}
`;
const coneMaterial = new THREE.ShaderMaterial({
vertexShader,
fragmentShader,
});
// Create the cone geometry
const radiusCone = 2.5; // Radius of the circular base
const heightCone = 5; // Height of the cone
const radialSegmentsCone = 16; // Number of segments around the circular base
const coneGeometry = new THREE.ConeGeometry(radiusCone, heightCone, radialSegmentsCone);
// Create the cone mesh
const cone = new THREE.Mesh(coneGeometry, coneMaterial);
scene.add(cone);

cone.position.set(10.5, 20, 10.5);
cone.castShadow = true;

   // GUI Configuration
   // Check if GUI already exists and destroy it before creating a new one
   if (guiRef.current) {
     guiRef.current.destroy();
   }
   guiRef.current = new dat.GUI(); // Assign GUI instance to ref
   
   // Access the DOM element of the GUI container
  const guiContainer = guiRef.current.domElement;

  if (guiContainer) {
    // Add Tailwind classes to ensure it is visible above the navbar
    guiContainer.classList.add('fixed', 'bottom-12', 'right-0', 'z-1000'); // Remove 'top-0' and add 'bottom-12'
  }
   
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
   guiRef.current.addColor(options, 'boxColor').onChange((e) => {
     box.material.color.set(e);
   });
   guiRef.current.add(options, 'boxWireFrame').onChange((e) => {
     box.material.wireframe = e;
   });
   guiRef.current.addColor(options, 'sphereColor').onChange((e) => {
     sphere.material.color.set(e);
   });
   guiRef.current.add(options, 'sphereWireFrame').onChange((e) => {
     sphere.material.wireframe = e;
   });
   guiRef.current.addColor(options, 'sphere2Color').onChange((e) => {
     sphere2.material.color.set(e);
   });
   guiRef.current.add(options, 'sphere2WireFrame').onChange((e) => {
     sphere2.material.wireframe = e;
   });
   guiRef.current.addColor(options, 'bodyColor').onChange((e) => {
     torso.material.color.set(e);
   });
   guiRef.current.add(options, 'sphere1Speed', -0.01, 0.01);
   guiRef.current.add(options, 'sphere2Speed', -0.01, 0.01);
   guiRef.current.add(options, 'bodySpeed', 0, 0.01);

   guiRef.current.add(options, 'spotLightAngle', 0, 1);
   guiRef.current.add(options, 'penumbra', 0, 1);
   guiRef.current.add(options, 'intensity', 0, 1);

   // Rotation Variables
   let angle1 = 0;
   let angle2 = 0;
   let angle3 = 0;
   let step3 = 0;
   const radius = 10;

   const mousePosition = new THREE.Vector2();

   // Update mouse position on movement
    window.addEventListener('mousemove', (e) => {
      mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
      mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1; // Corrected window height
    });

   const rayCaster = new THREE.Raycaster();

   const sphereId = sphere.id;
   const texturedBox = 'texturedBox';
   box2.name = texturedBox;

   let texturedBoxClicked = false; // State to track click

   // Handle click events
    window.addEventListener('click', () => {
      rayCaster.setFromCamera(mousePosition, camera);
      const intersects = rayCaster.intersectObjects(scene.children);
      for (let i = 0; i < intersects.length; i++) {
        const intersectedObject = intersects[i].object;
        if (intersectedObject.id === sphereId && intersectedObject instanceof THREE.Mesh) {
          // Change sphere color on click
          intersectedObject.material.color.set(0xFF0000);
          intersectedObject.material.wireframe = false;
        }
        if (intersectedObject.name === texturedBox) {
          // Mark the box as clicked
          texturedBoxClicked = true;
        }
      }
    });

   function animate(time: number) {
     requestAnimationFrame(animate);
     box.rotation.x = time / 1000;
     box.rotation.y = time / 1000;
     angle1 += options.sphere1Speed;
     box.position.x = radius * Math.cos(angle1);
     box.position.z = radius * Math.sin(angle1);
     // Earth Rotation on its axis
     sphere.rotation.y += 0.01;
     sphere2.rotation.y += 0.01;
     // Earth Revolution around the Sun
     angle1 += options.sphere1Speed;
     sphere.position.x = radius * Math.cos(angle1);
     sphere.position.z = radius * Math.sin(angle1);
     angle2 += options.sphere2Speed;
     sphere2.position.x = radius * Math.cos(angle2);
     sphere2.position.z = radius * Math.sin(angle2);

      // Move the alien with the sphere
      if (alien) {
        alien.position.x = sphere.position.x + 2; // Offset the alien near the sphere
        alien.position.y = sphere.position.y + 2;
        alien.position.z = sphere.position.z + 2;
        alien.rotation.y += 0.01; // Rotate the alien on its own axis
      }

       // Animation variables
       angle3 += options.bodySpeed;

      // Rotate arms
      leftArmPivot.rotation.z = Math.sin(angle3) * 0.5;
      rightArmPivot.rotation.z = -Math.sin(angle3) * 0.5;
      // Move legs
      leftLegPivot.rotation.x = Math.sin(angle3) * 0.5;
      rightLegPivot.rotation.x = -Math.sin(angle3) * 0.5;
      // Jump
      step3 += options.bodySpeed;
      torso.position.y = (2 * Math.abs(Math.sin(step3))) + 3.5;
      
     angle3 += 0.05; // Increment animation
     spotLight.angle = options.spotLightAngle;
     spotLight.penumbra = options.penumbra;
     spotLight.intensity = options.intensity;
     sLightHelper.update();

     rayCaster.setFromCamera(mousePosition, camera);
     const intersects = rayCaster.intersectObjects(scene.children);
     console.log(intersects);

     // Rotate textured box if clicked
      if (texturedBoxClicked) {
        const box2 = scene.getObjectByName(texturedBox) as THREE.Mesh;
        if (box2) {
          box2.rotation.x += 0.02;
          box2.rotation.y += 0.02;
        }
      }

      plane2.geometry.attributes.position.array[0] = 10 * Math.random();
      plane2.geometry.attributes.position.array[1] = 10 * Math.random();
      plane2.geometry.attributes.position.array[2] = 10 * Math.random();
      plane2.geometry.attributes.position.array[lastPointZ] = 10 * Math.random();
      plane2.geometry.attributes.position.needsUpdate = true;

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
     // Destroy GUI instance when unmounting
     if (guiRef.current) {
       guiRef.current.destroy();
       guiRef.current = null;
     }
   };
 }, []);
 return <div ref={mountRef} />;
};
export default TestThree;