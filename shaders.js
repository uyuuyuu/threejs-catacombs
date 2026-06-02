export const customVertexShader = `
    varying vec2 vUv;
    varying vec4 vWorldPosition;

    void main() {
        // Pass the vertex's world position to the fragment shader
        vWorldPosition = modelMatrix * vec4(position, 1.0);
        
        // Standard position calculation
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        
        // Pass standard UVs for the initial state
        vUv = uv;
    }
`;

export const customFragmentShader = `
    uniform sampler2D u_texture;
    uniform float uUseProjection;
    uniform mat4 uCaptureProjectionMatrix;
    uniform mat4 uCaptureViewMatrix;
    varying vec2 vUv;
    varying vec4 vWorldPosition;

    void main() {
        vec2 finalUv;
        if (uUseProjection > 0.5) {
            // --- WORLD-SPACE PROJECTIVE TEXTURING ---
            // Project the world position using the capture camera's matrices
            vec4 projectiveCoord = uCaptureProjectionMatrix * uCaptureViewMatrix * vWorldPosition;

            // Perform perspective divide and map to UV space [0, 1]
            finalUv = projectiveCoord.xy / projectiveCoord.w * 0.5 + 0.5;

        } else {
            // --- STANDARD TEXTURING ---
            finalUv = vUv;
        }

        // Use fract() to make the texture repeat/tile
        finalUv = fract(finalUv);

        gl_FragColor = texture2D(u_texture, finalUv);
    }
`;
