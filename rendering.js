import * as THREE from 'three';
import {
    player,
    gravity,
    mazeSize,
    cellSize,
    mazeLayout
} from './config.js';

let scene, camera, renderer;
const clock = new THREE.Clock();

export function initRendering(sceneInstance, cameraInstance, rendererInstance) {
    scene = sceneInstance;
    camera = cameraInstance;
    renderer = rendererInstance;
}

export function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();

    // Apply friction and gravity
    player.velocity.x -= player.velocity.x * 10.0 * delta;
    player.velocity.z -= player.velocity.z * 10.0 * delta;
    player.velocity.y -= gravity * delta;

    // Get camera's forward and right vectors
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(forward, new THREE.Vector3(0, 1, 0));

    // Apply movement
    if (player.moveForward) player.velocity.addScaledVector(forward, player.speed);
    if (player.moveBackward) player.velocity.addScaledVector(forward, -player.speed);
    if (player.moveRight) player.velocity.addScaledVector(right, player.speed);
    if (player.moveLeft) player.velocity.addScaledVector(right, -player.speed);

    // Wall Collision and Movement
    const oldCamPos = camera.position.clone();

    // Move on X axis
    camera.position.x += player.velocity.x * delta;
    // Check for collision on X axis, using old Z position
    if (isColliding(new THREE.Vector3(camera.position.x, 0, oldCamPos.z))) {
        camera.position.x = oldCamPos.x;
        player.velocity.x = 0;
    }

    // Move on Z axis
    camera.position.z += player.velocity.z * delta;
    // Check for collision on Z axis, using new (and possibly corrected) X position
    if (isColliding(camera.position)) {
        camera.position.z = oldCamPos.z;
        player.velocity.z = 0;
    }

    // Vertical movement
    camera.position.y += player.velocity.y * delta;
    if (camera.position.y < player.height) {
        player.velocity.y = 0;
        camera.position.y = player.height;
        player.canJump = true;
    }

    renderer.render(scene, camera);
}

function isColliding(position) {
    const minX = position.x - player.radius;
    const maxX = position.x + player.radius;
    const minZ = position.z - player.radius;
    const maxZ = position.z + player.radius;

    const minCellX = Math.floor(minX / cellSize);
    const maxCellX = Math.floor(maxX / cellSize);
    const minCellZ = Math.floor(minZ / cellSize);
    const maxCellZ = Math.floor(maxZ / cellSize);

    for (let i = minCellZ; i <= maxCellZ; i++) {
        for (let j = minCellX; j <= maxCellX; j++) {
            if (j < 0 || j >= mazeSize || i < 0 || i >= mazeSize || mazeLayout[i][j] === 1) {
                return true; // Collision
            }
        }
    }
    return false; // No collision
}

export function onWindowResize(camera, renderer, renderTargets) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (renderTargets) {
        renderTargets.renderTarget1.setSize(window.innerWidth, window.innerHeight);
        renderTargets.renderTarget2.setSize(window.innerWidth, window.innerHeight);
    }
}