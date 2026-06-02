import * as THREE from 'three';

export const mazeSize = 11; // Must be an odd number for a clear path
export const wallHeight = 2;
export const cellSize = 2; // Size of each cell in the maze grid

// Maze layout (1 = wall, 0 = path)
export const mazeLayout = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

// Player state
export const player = {
    height: wallHeight / 2, // Player's eye level
    radius: 0.4, // Added player radius
    speed: 3.0,
    turnSpeed: 0.002,
    canJump: false,
    velocity: new THREE.Vector3(),
    moveForward: false,
    moveBackward: false,
    moveLeft: false,
    moveRight: false,
    jump: false
};

export const gravity = 9.8; // m/s^2
export const jumpStrength = 5; // Initial vertical velocity for jump
