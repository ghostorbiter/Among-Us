import './style.css'

import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {FontLoader} from 'three/examples/jsm/loaders/FontLoader';
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

renderer.render(scene, camera);

// const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
// const material = new THREE.MeshBasicMaterial({color: 0xff6347, wireframe: true});
// const torus = new THREE.Mesh(geometry, material);

// scene.add(torus);

const fontLoader = new FontLoader();
fontLoader.load('node_modules/three/examples/fonts/droid/droid_serif_regular.typeface.json',
  (droidFont) => {
      const textGeometry = new TextGeometry('Yukio was an impostor', {
        height: 2, 
        size: 2, 
        font: droidFont,
      });
      const textMaterial = new THREE.MeshNormalMaterial();
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      textMesh.position.setX(-15);
      textMesh.position.setY(5);
      scene.add(textMesh);
  });

//To run code below change the Mesh of material from Basic to Standart
const pointLight = new THREE.PointLight(0xffffff)
const ambientLight = new THREE.AmbientLight(0xffffff)
pointLight.position.set(5,5,5)

scene.add(pointLight, ambientLight)

const gridHelper = new THREE.GridHelper(200, 100);
scene.add(gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);

function animate(){
  requestAnimationFrame(animate);

  // torus.rotation.x += 0.01;
  // torus.rotation.y += 0.005;
  // torus.rotation.z += 0.01;

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