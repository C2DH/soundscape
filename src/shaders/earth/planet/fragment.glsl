precision mediump float;
varying vec2 vUv;
varying vec3 vNormal;

uniform sampler2D maskTex;
uniform vec3 landColor;
uniform vec3 waterColor;
uniform bool invertMask;
uniform float shininess;


// fake directional light in view-space
const vec3 lightDir = normalize(vec3(-5.0, 2.0, 3.0));

void main() {
    float mask = texture2D(maskTex, vUv).r;
    if (invertMask) mask = 1.0 - mask;

    // basic lambert lighting
    float NdotL = max(dot(normalize(vNormal), lightDir), 0.0);
    float ambient = 0.1;
    float diff = ambient + 2.0 * NdotL;

    vec3 base = mix(waterColor, landColor, mask);

    // specular calculations
    float spec = pow(
        max(dot(reflect(-lightDir, normalize(vNormal)), normalize(vec3(0.0, 0.0, 0.0))), 0.0),
        shininess
    );

    float waterMask = 1.0 - mask; // water areas
    float landMask = mask;        // land areas

    vec3 waterSpec = vec3(1.0) * spec * waterMask * 0.6; // softer water highlight
    vec3 landSpec  = vec3(1.0) * spec * landMask * 0.1;  // very subtle land highlight

    vec3 specular = waterSpec + landSpec;

    vec3 color = base * diff + specular;
    gl_FragColor = vec4(color, 1.0);
}