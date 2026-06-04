export const nodeFrag = /* glsl */ `
varying vec3 vColor;
varying vec2 vUv;
varying float vPulse;

void main() {
  vec2 uv = vUv * 2.0 - 1.0;
  float dist = length(uv);

  if (dist > 1.0) discard;

  float core = 1.0 - smoothstep(0.0, 0.6, dist);
  float rim = smoothstep(0.5, 1.0, dist) * (1.0 - smoothstep(0.8, 1.0, dist));

  vec3 coreColor = vec3(0.518, 0.294, 0.996);
  vec3 rimColor  = vec3(0.0, 0.922, 0.757);

  vec3 color = mix(coreColor, rimColor, rim * 0.7) * vColor;
  float alpha = (core + rim * 0.5) * vPulse;

  gl_FragColor = vec4(color, alpha);
}
`
