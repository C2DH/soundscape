precision mediump float;
varying vec3 vNormal;
uniform vec3 atmosphereColor;

void main() {
  // Fresnel effect: more intense near the edges
  float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 5.0);

  // Light blue glow
  gl_FragColor = vec4(atmosphereColor, 0.5) * intensity;
}