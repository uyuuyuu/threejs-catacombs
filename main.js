import * as THREE from 'three';
import { player } from './config.js';
import { createMaze } from './maze.js';
import { initControls } from './player.js';
import { initTeleport, resetIdleTimer, getRenderTargets } from './teleport.js';
import { initRendering, animate, onWindowResize } from './rendering.js';

let scene, camera, renderer;

function init() {
    // Scene
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x87ceeb, 0.1, 50);

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(3, player.height, 3);
    camera.rotation.order = 'YXZ';
    scene.add(camera);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);

    // Texture Loader
    const textureLoader = new THREE.TextureLoader();
    textureLoader.crossOrigin = '';
    textureLoader.load('seed.png', (mazeTexture) => {
        mazeTexture.wrapS = THREE.RepeatWrapping;
        mazeTexture.wrapT = THREE.RepeatWrapping;
        mazeTexture.minFilter = THREE.NearestFilter;
        mazeTexture.magFilter = THREE.NearestFilter;

        // Create scene content
        createMaze(scene, mazeTexture, new THREE.Vector2(window.innerWidth, window.innerHeight));

        // Initialize modules
        initTeleport(renderer, scene, camera);
        initControls(camera, resetIdleTimer); // Pass the reset timer function to the controls
        initRendering(scene, camera, renderer);

        // Event Listeners
        window.addEventListener('resize', () => onWindowResize(camera, renderer, getRenderTargets()));
        
        // Add key listeners for downloading images (optional)
        document.addEventListener('keydown', (e) => {
            if (e.code === 'KeyP') downloadCurrentScreen();
        });

        // Start animation
        animate();
    });
}

function downloadCurrentScreen(filename = 'screenshot_' + Date.now() + '.png') {
    if (!renderer) return;
    const link = document.createElement('a');
    link.download = filename;
    link.href = renderer.domElement.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

init();