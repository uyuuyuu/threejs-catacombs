import * as THREE from 'three';
import { mazeSize, wallHeight, cellSize, mazeLayout } from './config.js';
import { customVertexShader, customFragmentShader } from './shaders.js';

export let mazeMaterials = [];
export let mazeMeshes = [];
export let validTeleportPositions = [];

export function createMaze(scene, mazeTexture, screenResolution) {
    const wallGeometry = new THREE.BoxGeometry(cellSize, wallHeight, cellSize);
    const wallMaterial = new THREE.ShaderMaterial({
        uniforms: {
            u_texture: { value: mazeTexture },
            screenResolution: { value: screenResolution },
            uCaptureProjectionMatrix: { value: new THREE.Matrix4() },
            uCaptureViewMatrix: { value: new THREE.Matrix4() },
            uUseProjection: { value: 0.0 }
        },
        vertexShader: customVertexShader,
        fragmentShader: customFragmentShader
    });
    mazeMaterials.push(wallMaterial);

    const floorGeometry = new THREE.PlaneGeometry(mazeSize * cellSize, mazeSize * cellSize);
    const floorMaterial = new THREE.ShaderMaterial({
        uniforms: {
            u_texture: { value: mazeTexture },
            screenResolution: { value: screenResolution },
            uCaptureProjectionMatrix: { value: new THREE.Matrix4() },
            uCaptureViewMatrix: { value: new THREE.Matrix4() },
            uUseProjection: { value: 0.0 }
        },
        vertexShader: customVertexShader,
        fragmentShader: customFragmentShader
    });
    mazeMaterials.push(floorMaterial);

    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set((mazeSize * cellSize) / 2 - cellSize / 2, 0, (mazeSize * cellSize) / 2 - cellSize / 2);
    scene.add(floor);
    mazeMeshes.push(floor);

    const ceiling = new THREE.Mesh(floorGeometry, floorMaterial); // Use floorMaterial for ceiling
    ceiling.rotation.x = Math.PI / 2; // Rotate to face downwards
    ceiling.position.set((mazeSize * cellSize) / 2 - cellSize / 2, wallHeight, (mazeSize * cellSize) / 2 - cellSize / 2); // Position at top of walls
    scene.add(ceiling);
    mazeMeshes.push(ceiling);

    for (let i = 0; i < mazeSize; i++) {
        for (let j = 0; j < mazeSize; j++) {
            if (mazeLayout[i][j] === 1) {
                const wall = new THREE.Mesh(wallGeometry, wallMaterial);
                wall.position.set(j * cellSize + cellSize / 2, wallHeight / 2, i * cellSize + cellSize / 2);
                scene.add(wall);
                mazeMeshes.push(wall);
            } else {
                validTeleportPositions.push(new THREE.Vector3(j * cellSize + cellSize / 2, 0, i * cellSize + cellSize / 2));
            }
        }
    }
}
