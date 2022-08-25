import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';
import { FontLoader } from 'FontLoader';
import { TextGeometry } from 'TextGeometry';
import { GLTFLoader } from 'GLTFLoader';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
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
const loader = new GLTFLoader()
  .setPath('./models/')
loader.load('amongus.glb',
  function onLoad(parsedJSON) {
    amongus = parsedJSON.scene;
    amongus.scale.divideScalar(25);
    amongus.position.y = 5;
    amongus.position.x = -50;
    amongus.traverse(descendantObject => {
      descendantObject.castShadow = true;
    });
    scene.add(amongus);
  },
  undefined, // onProgress
  function onFail(error) {
    var message = (error && error.message) ? error.message : 'Failed to load glTF model';
    console.warn(message);
  }
);

const pointLight = new THREE.PointLight(0xFFFFFF)
const ambientLight = new THREE.AmbientLight(0xFFFFFF)
pointLight.position.set(5, 5, 5)

scene.add(pointLight, ambientLight)

const controls = new OrbitControls(camera, renderer.domElement);

function AddStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xFFFFFF })
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100))

  star.position.set(x, y, z);
  scene.add(star);
}
Array(200).fill().forEach(AddStar);

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
}
window.addEventListener( 'resize', onWindowResize );

function animate() {
  requestAnimationFrame(animate);
  controls.update();

  if (amongus) { // gotta check if it's loaded first!
    amongus.rotation.x += 0.01;
    amongus.rotation.z += 0.01;

    if (amongus.position.x <= 100) {
      amongus.position.x += 0.1;
    } else {
      amongus.position.x = -50;
    }
  }

  renderer.render(scene, camera);
}
animate()
