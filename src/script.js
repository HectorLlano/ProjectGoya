import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

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
const gltfLoader = new GLTFLoader();

gltfLoader.load(
    '/models/2301_ES-MAD_GOYA49_ARQ_F0_V00.gltf',
    (gltf) => {
        console.log('success');

        console.log(gltf);
        // Update import material
        gltf.scene.traverse(
            (ele) => {
                if(ele.isMesh) {
                    ele.material = material;
                }
            }
        )

        scene.add(gltf.scene)
    },
    () => {
        console.log('progress');
    },
    () => {
        console.log('error');
    }
)

/**
 * Textures
 */

/**
 * Test mesh
 */
// Geometry
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const sphereGeometry = new THREE.SphereGeometry(1, 32, 16);

// Material
const material = new THREE.MeshNormalMaterial();
material.wireframe = false

// Mesh
const mesh1 = new THREE.Mesh(boxGeometry, material);
mesh1.position.set(1, 0, 0)
const mesh2 = new THREE.Mesh(sphereGeometry, material);
mesh2.position.set(-1, 0, 0)
scene.add(mesh1, mesh2);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 2,4);
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8)
directionalLight.position.set(40, 40, 40)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 50
directionalLight.shadow.camera.left = -25
directionalLight.shadow.camera.top = 25
directionalLight.shadow.camera.right = 25
directionalLight.shadow.camera.bottom = -25
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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(26, 25, 27);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

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

