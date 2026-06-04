// Instanced vertex shader for neural network nodes
// Each instance has position, scale pulsing over time

attribute vec3 aColor;
varying vec3 vColor;
varying vec2 vUv;
varying float vPulse;

uniform float uTime;

void main() {
  vColor = aColor;
  vUv = uv;

  // Unique pulse per instance using instanceMatrix
  float instanceId = float(gl_InstanceID);
  float phase = instanceId * 0.37 + uTime * 0.8;
  float pulse = 0.85 + 0.15 * sin(phase);
  vPulse = pulse;

  vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(position * pulse, 1.0);
  gl_Position = projectionMatrix * mvPosition;
}
