import './style.css'

import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {FontLoader} from 'three/examples/jsm/loaders/FontLoader';
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry';
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setY(5);

renderer.render(scene, camera);

const fontLoader = new FontLoader();
fontLoader.load('fonts/Arial_Regular.json',
  (arialFont) => {
      const textGeometry = new TextGeometry('Yukio was an impostor', {
        height: 0.3, 
        size: 2, 
        font: arialFont,
      });
      const textMaterial = new THREE.MeshBasicMaterial();
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      textMesh.position.setX(-15);
      textMesh.position.setY(5);
      scene.add(textMesh);
  });
  
let amongus; 
const fbxLoader = new FBXLoader();
fbxLoader.setPath('/models/among-us-character-fbx/');
fbxLoader.load('/source/1.fbx', (fbx) => {
  fbx.rotateY(Math.PI);
  fbx.position.set(-100,0,0);
  fbx.scale.setScalar(0.05);

  fbx.traverse(trav => {
    if (trav.isMesh){
      const textureLoader = new THREE.TextureLoader();  
      let material = new THREE.MeshNormalMaterial();  

      material.albedo = textureLoader.load('textures/DefaultMaterial_albedo');
      material.metallic = textureLoader.load('textures/DefaultMaterial_metallic');
      material.normal = textureLoader.load('textures/DefaultMaterial_normal');
      material.roughness = textureLoader.load('textures/DefaultMaterial_roughness');

      trav.material = material;
      trav.material.needsUpdate = true;
    }
  });

  amongus = fbx;
  scene.add(fbx);
})

const pointLight = new THREE.PointLight(0xffffff)
const ambientLight = new THREE.AmbientLight(0xffffff)
pointLight.position.set(5,5,5)

scene.add(pointLight, ambientLight)

const controls = new OrbitControls(camera, renderer.domElement);

function AddStar(){
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({color: 0xffffff})
  const star = new THREE.Mesh(geometry, material);

  const [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100))

  star.position.set(x,y,z);
  scene.add(star);
}
Array(200).fill().forEach(AddStar);

function animate(){
  requestAnimationFrame(animate);

  controls.update();
  
  amongus.rotation.x += 0.01;
  amongus.rotation.z += 0.01;

  if (amongus.position.x <= 100){
    amongus.position.x += 0.1;
  }else {
    amongus.position.x = -100;
  }

  renderer.render(scene, camera);
}
animate()