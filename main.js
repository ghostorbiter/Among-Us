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

const fbxLoader = new FBXLoader();
fbxLoader.setPath('/models/among-us-character-fbx/');
fbxLoader.load('/source/1.fbx', (fbx) => {
  fbx.rotateY(3.14);
  fbx.scale.setScalar(0.05);
  fbx.traverse(trav => {
    const textureLoader = new THREE.TextureLoader();
    
    const albedo = textureLoader.load('textures/DefaultMaterial_albedo');
    const metallic = textureLoader.load('textures/DefaultMaterial_metallic');
    const normal = textureLoader.load('textures/DefaultMaterial_normal');
    const roughness = textureLoader.load('textures/DefaultMaterial_roughness');
    console.error('before assignment')
    trav.material.albedo = albedo;
    trav.material.metallic = metallic;
    trav.material.normal = normal;
    trav.material.roughness = roughness;
    trav.material.needsUpdate = true;
    console.error('after assigning')    
  });

  scene.add(fbx);
})

//To run code below change the Mesh of material from Basic to Standart
const pointLight = new THREE.PointLight(0xffffff)
const ambientLight = new THREE.AmbientLight(0xffffff)
pointLight.position.set(5,5,5)

scene.add(pointLight, ambientLight)

const controls = new OrbitControls(camera, renderer.domElement);

function animate(){
  requestAnimationFrame(animate);

  controls.update();

  renderer.render(scene, camera);
}
animate()

function AddStar(){
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({color: 0xffffff})
  const star = new THREE.Mesh(geometry, material);

  const [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100))

  star.position.set(x,y,z);
  scene.add(star);
}

Array(200).fill().forEach(AddStar);