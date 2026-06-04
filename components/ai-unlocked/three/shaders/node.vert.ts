export const nodeVert = /* glsl */ `
uniform float uTime;
uniform float uBuild;

varying vec2 vUv;
varying float vPulse;
varying float vInstance;

void main() {
  vUv = uv;
  vInstance = float(gl_InstanceID);

  // Each node builds in with a delay based on instance id
  float delay = fract(vInstance * 0.137);
  float appear = smoothstep(delay, delay + 0.15, uBuild);

  // Pulse
  float phase = vInstance * 0.41 + uTime * 0.9;
  float pulse = 0.82 + 0.18 * sin(phase);
  vPulse = pulse * appear;

  vec4 mvPos = modelViewMatrix * instanceMatrix * vec4(position * pulse * appear, 1.0);
  gl_Position = projectionMatrix * mvPos;
}
`
