varying vec3 vWorldPosition;
varying vec3 vNormal;

uniform float uReverse;

void main() {
    // Compute a smooth reversal along Z axis
    // When uReverse = 0 → normal view
    // When uReverse = 1 → fully reversed geometry
    vec3 pos = position;
    pos.z = mix(pos.z, -pos.z, uReverse);

    // Transform normal into world space
    vNormal = normalize(normalMatrix * normal);

    // Compute world position (for lighting, gradients, etc.)
    vec4 worldPosition = modelMatrix * vec4(pos, 1.0);
    vWorldPosition = worldPosition.xyz;

    // Final position
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
