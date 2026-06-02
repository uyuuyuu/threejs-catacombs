import * as THREE from 'three';
import { player } from './config.js';
import { validTeleportPositions, mazeMaterials } from './maze.js';

const idleTimeoutDuration = 2000; // 2 seconds
let idleTimer;

let renderTarget1, renderTarget2, currentRenderTarget, previousRenderTarget;
let teleportCallback;

export function initTeleport(renderer, scene, camera) {
    const rtOptions = {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        wrapS: THREE.RepeatWrapping,
        wrapT: THREE.RepeatWrapping
    };
    renderTarget1 = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, rtOptions);
    renderTarget2 = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, rtOptions);
    currentRenderTarget = renderTarget1;
    previousRenderTarget = renderTarget2;

    // Create a bound function for the teleport logic
    teleportCallback = () => teleportPlayer(renderer, scene, camera);
    
    resetIdleTimer();
}

export function resetIdleTimer() {
    clearTimeout(idleTimer);
    if (teleportCallback) {
        idleTimer = setTimeout(teleportCallback, idleTimeoutDuration);
    }
}

function teleportPlayer(renderer, scene, camera) {
    if (validTeleportPositions.length === 0) return;

    renderer.setRenderTarget(currentRenderTarget);
    renderer.render(scene, camera);
    renderer.setRenderTarget(null);

    const randomIndex = Math.floor(Math.random() * validTeleportPositions.length);
    const newPos = validTeleportPositions[randomIndex];
    
    camera.position.set(newPos.x, player.height, newPos.z);
    player.velocity.set(0, 0, 0);
    player.canJump = true;

    camera.updateMatrixWorld(true);
    const captureProjectionMatrix = camera.projectionMatrix.clone();
    const captureViewMatrix = camera.matrixWorldInverse.clone();

    mazeMaterials.forEach(material => {
        material.uniforms.u_texture.value = currentRenderTarget.texture;
        material.uniforms.uCaptureProjectionMatrix.value.copy(captureProjectionMatrix);
        material.uniforms.uCaptureViewMatrix.value.copy(captureViewMatrix);
        material.uniforms.uUseProjection.value = 1.0;
    });

    const temp = currentRenderTarget;
    currentRenderTarget = previousRenderTarget;
    previousRenderTarget = temp;

    resetIdleTimer();
}

export function getRenderTargets() {
    return { renderTarget1, renderTarget2 };
}