varying vec3 vWorldPosition;
varying vec3 vNormal;

void main() {
    // Transform normal into world space
    vNormal = normalize(normalMatrix * normal);

    // World position (needed for gradient + viewDir)
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;

    // Standard projection
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
