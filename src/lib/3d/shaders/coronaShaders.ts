export const coronaVertexShader = `
  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const coronaFragmentShader = `
  uniform float time;
  uniform float isMoon;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  void main() {
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    float intensity = pow(0.65 - dot(vNormal, viewDir), 2.2);
    float pulse = 0.85 + 0.15 * sin(time * 2.5);

    vec3 sunGlow = mix(vec3(1.0, 0.8, 0.2), vec3(1.0, 0.35, 0.0), intensity);
    vec3 moonGlow = mix(vec3(0.7, 0.9, 1.0), vec3(0.3, 0.65, 0.95), intensity);
    vec3 glowColor = mix(sunGlow, moonGlow, isMoon);

    gl_FragColor = vec4(glowColor, intensity * pulse * 0.85);
  }
`;
