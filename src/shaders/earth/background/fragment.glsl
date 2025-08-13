uniform vec2 u_resolution;
uniform float u_time;
varying vec2 vUv;

void main() {
    vec2 uv = vUv - 0.5;
    uv.x *= u_resolution.x / u_resolution.y;
    float dist = length(uv);

    float gap = 0.03;
    float thickness = 0.02;

    float modDist = mod(dist, gap);
    float band = step(modDist, thickness); // hard edges
    float fade = 1.0 - smoothstep(0.0, 0.7, dist + 0.2);

    vec3 color = vec3(1.0, 1.0, 1.0);
    gl_FragColor = vec4(color, band * fade);
}
