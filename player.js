import { player, jumpStrength } from './config.js';

let camera;
let resetIdleTimerCallback = () => {};

export function initControls(cameraInstance, timerCallback) {
    camera = cameraInstance;
    resetIdleTimerCallback = timerCallback;
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('click', () => {
        document.body.requestPointerLock();
    });
}

function onKeyDown(event) {
    resetIdleTimerCallback();
    switch (event.code) {
        case 'KeyW': player.moveForward = true; break;
        case 'KeyS': player.moveBackward = true; break;
        case 'KeyA': player.moveLeft = true; break;
        case 'KeyD': player.moveRight = true; break;
        case 'Space':
            if (player.canJump) {
                player.velocity.y += jumpStrength;
                player.canJump = false;
            }
            break;
    }
}

function onKeyUp(event) {
    resetIdleTimerCallback();
    switch (event.code) {
        case 'KeyW': player.moveForward = false; break;
        case 'KeyS': player.moveBackward = false; break;
        case 'KeyA': player.moveLeft = false; break;
        case 'KeyD': player.moveRight = false; break;
    }
}

function onMouseMove(event) {
    resetIdleTimerCallback();
    if (document.pointerLockElement === document.body) {
        camera.rotation.y -= event.movementX * player.turnSpeed;
        camera.rotation.x -= event.movementY * player.turnSpeed;
        camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x));
    }
}