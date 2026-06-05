export const cinematicVert = /* glsl */ `
uniform float uTime;
uniform vec3 uPointLightPos;

varying vec3 vNormal;
varying vec3 vWorldPos;
varying float vDistToLight;

void main() {
  float instanceId = float(gl_InstanceID);

  // World-space position via instance matrix
  vec4 worldPos = instanceMatrix * vec4(position, 1.0);
  vWorldPos = worldPos.xyz;

  // Distance to moving PointLight
  vDistToLight = length(uPointLightPos - worldPos.xyz);

  // World-space normal
  mat3 normalMat = mat3(transpose(inverse(instanceMatrix)));
  vNormal = normalize(normalMat * normal);

  // Per-instance pulse (time + instance phase offset)
  float phase = instanceId * 0.41 + uTime * 0.85;
  float pulse = 0.88 + 0.12 * sin(phase);

  gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position * pulse, 1.0);
}
`
