varying vec3 vNormal;
varying vec3 vViewDir;
uniform vec3 uViewDir;

void main() {
  vNormal = normalize(normalMatrix * normal);

  // Use custom view direction, normalized
  vViewDir = normalize(uViewDir);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}