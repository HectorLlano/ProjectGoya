import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

THREE.ColorManagement.enabled = false;

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene();

/**
 * GLTF Loader
 */
// const gltfLoader = new GLTFLoader();

// gltfLoader.load(
//     '/models/2301_ES-MAD_GOYA49_ARQ_F0_V00.glb',
//     (gltf) => {
//         console.log('success');

//         console.log(gltf);
//         // Update import material
//         gltf.scene.traverse(
//             (ele) => {
//                 if(ele.isMesh) {
//                     ele.material = material;
//                     ele.castShadow = true;
//                     ele.receiveShadow = true;
//                 }
//             }
//         )

//         scene.add(gltf.scene)
//     },
//     () => {
//         console.log('progress');
//     },
//     () => {
//         console.log('error');
//     }
// )

/**
 * Textures
 */

/**
 * Test Building
 */
// Sizes
const buildingSize = {
    width: 10,
    height: 4,
    thickness: 0.2
}

// gui.add(buildingSize, 'width').min(1).max(20).step(0.1).onChange(() => {buildingSize.width = buildingSize.width})
// gui.add(buildingSize, 'height').min(1).max(10).step(0.1)
// gui.add(buildingSize, 'thickness').min(0.1).max(0.5).step(0.1)

// Geometries
const floorGeometry = new THREE.BoxGeometry(buildingSize.width, buildingSize.thickness, buildingSize.width)
const wallGeometry = new THREE.BoxGeometry(buildingSize.thickness, buildingSize.height, buildingSize.width)

// Material
const generalMaterial = new THREE.MeshStandardMaterial();
// generalMaterial.wireframe = true

// Mesh
const floorMesh = new THREE.Mesh(floorGeometry, generalMaterial)
floorMesh.position.y = -(buildingSize.thickness / 2)

const roofMesh = new THREE.Mesh(floorGeometry, generalMaterial)
roofMesh.position.y = (buildingSize.thickness / 2) + buildingSize.height

const wallPositionXY = (buildingSize.width / 2) - (buildingSize.thickness / 2)

const wallMesh1 = new THREE.Mesh(wallGeometry, generalMaterial)
wallMesh1.position.set(-wallPositionXY, buildingSize.height / 2, 0)

const wallMesh2 = new THREE.Mesh(wallGeometry, generalMaterial)
wallMesh2.rotation.y = Math.PI / 2
wallMesh2.position.set(0, buildingSize.height / 2, -wallPositionXY)

const wallMesh3 = new THREE.Mesh(wallGeometry, generalMaterial)
wallMesh3.position.set(wallPositionXY, buildingSize.height / 2, 0)

const wallMesh4 = new THREE.Mesh(wallGeometry, generalMaterial)
wallMesh4.rotation.y = Math.PI / 2
wallMesh4.position.set(0, buildingSize.height / 2, wallPositionXY)

const buildingGroup = new THREE.Group()
buildingGroup.add(floorMesh, roofMesh, wallMesh1, wallMesh2, wallMesh3, wallMesh4)
buildingGroup.castShadow = true
buildingGroup.receiveShadow = true

scene.add(buildingGroup)

/**
 * Test mesh
 */
// Geometry
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const sphereGeometry = new THREE.SphereGeometry(1, 32, 16);

// Material
const testMaterial = new THREE.MeshStandardMaterial();

// Mesh
const boxMesh = new THREE.Mesh(boxGeometry, testMaterial);
boxMesh.position.set(1, 0.7, 0)
boxMesh.castShadow = true
boxMesh.receiveShadow = true
const sphereMesh = new THREE.Mesh(sphereGeometry, testMaterial);
sphereMesh.position.set(-1, 1.2, 0)
sphereMesh.castShadow = true
sphereMesh.receiveShadow = true
scene.add(boxMesh, sphereMesh);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
// gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8)
directionalLight.position.set(40, 40, 40)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
// directionalLight.shadow.camera.far = 500
// directionalLight.shadow.camera.left = -250
// directionalLight.shadow.camera.top = 250
// directionalLight.shadow.camera.right = 250
// directionalLight.shadow.camera.bottom = -250

directionalLight.castShadow = true

// const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5)
// scene.add(directionalLightHelper)

scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener("resize", () => {

    // Update sizes parameter
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
camera.position.set(15, 9, 14);
camera.lookAt(buildingGroup.position)
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;


/**
 * Helpers
 */
const gridSize = 20;
const gridDivisions = 20;

const gridHelper = new THREE.GridHelper(gridSize, gridDivisions,0x1c1c1c ,0x494949);

scene.add(gridHelper)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Activa shadows
renderer.shadowMap.enabled = true

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Update controls
    controls.update()
    
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

