export const cinematicFrag = /* glsl */ `
uniform float uTime;
uniform vec3 uPointLightPos;
uniform float uPointLightIntensity;
uniform vec3 uBaseColor;    // #7B3FE4 -> vec3(0.482, 0.247, 0.894)
uniform vec3 uAccentColor;  // #FF3366 -> vec3(1.0, 0.2, 0.4)

varying vec3 vNormal;
varying vec3 vWorldPos;
varying float vDistToLight;

void main() {
  // Fresnel: glancing angles glow brighter
  vec3 viewDir = normalize(cameraPosition - vWorldPos);
  float fresnel = 1.0 - max(dot(normalize(vNormal), viewDir), 0.0);
  fresnel = pow(fresnel, 1.8);

  // PointLight: inverse square falloff
  float falloff = uPointLightIntensity / (1.0 + vDistToLight * vDistToLight * 0.08);
  vec3 lightDir = normalize(uPointLightPos - vWorldPos);
  float diffuse = max(dot(normalize(vNormal), lightDir), 0.0);

  // Core glow intensified by nearby light
  vec3 core = uBaseColor * (0.2 + diffuse * falloff * 2.0);

  // Rim: shifts toward pink as light approaches
  float rimStrength = fresnel * min(falloff * 2.0, 1.0);
  vec3 rim = mix(uBaseColor, uAccentColor, rimStrength) * fresnel * 2.0;

  vec3 color = core + rim;
  float alpha = clamp(0.5 + fresnel * 0.5 + diffuse * falloff * 0.3, 0.0, 1.0);

  gl_FragColor = vec4(color, alpha);
}
`
