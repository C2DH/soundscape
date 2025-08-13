varying vec3 vNormal;
varying vec3 vViewDir;
uniform vec3 uColor;
uniform float uThickness;

void main() {
  float edge = 1.0 - abs(dot(vNormal, vViewDir));
  float fade = smoothstep(0.0, uThickness, edge);
  gl_FragColor = vec4(uColor, fade);
  if (fade < 0.01) discard;
}