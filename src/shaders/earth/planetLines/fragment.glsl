uniform sampler2D mask;
uniform vec3 lineColor;   // color of lines
uniform float lineOpacity; // opacity multiplier
varying vec2 vUv;

void main() {
    // Invert mask if needed
    float continent = 1.0 - texture2D(mask, vUv).r;

    // Horizontal stripes
    float stripeFrequency = 350.0; // adjust for spacing
    float stripe = step(0.8, fract(vUv.y * stripeFrequency));

    // Mask stripes with continents
    float alpha = stripe * continent * lineOpacity;

    // Final color and transparency
    gl_FragColor = vec4(lineColor, alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}