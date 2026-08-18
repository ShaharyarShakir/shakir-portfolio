import * as THREE from 'three';
import { sunVertexShader, sunFragmentShader } from '../shaders/sunShaders';
import { coronaVertexShader, coronaFragmentShader } from '../shaders/coronaShaders';
import { createSunRayTexture, createMoonRayTexture, createSunGlowTexture } from '../textures';
import { SPACE_CONFIG } from '../config';

export function createVolumetricRays(): {
  sunRaysGroup: THREE.Group;
  sunRayTex: THREE.CanvasTexture;
  moonRayTex: THREE.CanvasTexture;
} {
  const group = new THREE.Group();
  const sunRayTex = createSunRayTexture();
  const moonRayTex = createMoonRayTexture();
  const rayCount = 48;

  for (let i = 0; i < rayCount; i++) {
    const width = 5.0 + Math.random() * 7.0;
    const length = 60 + Math.random() * 40;

    const planeGeo = new THREE.PlaneGeometry(width, length);
    planeGeo.translate(0, length / 2, 0);

    const rayMat = new THREE.MeshBasicMaterial({
      map: sunRayTex,
      transparent: true,
      opacity: 0.25 + Math.random() * 0.25,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    const rayMesh = new THREE.Mesh(planeGeo, rayMat);
    const angle = (i / rayCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.12;
    const tiltX = (Math.random() - 0.5) * 0.35;

    rayMesh.rotation.z = angle;
    rayMesh.rotation.x = tiltX;

    rayMesh.userData = {
      baseOpacity: rayMat.opacity,
      speed: 0.8 + Math.random() * 1.5,
      phase: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.002,
    };

    group.add(rayMesh);
  }
  return { sunRaysGroup: group, sunRayTex, moonRayTex };
}

export function createSunSystem() {
  const sunGroup = new THREE.Group();
  const sunRadius = SPACE_CONFIG.sun.radius;
  const sunGeo = new THREE.SphereGeometry(sunRadius, 64, 64);

  const sunMaterial = new THREE.ShaderMaterial({
    vertexShader: sunVertexShader,
    fragmentShader: sunFragmentShader,
    uniforms: {
      time: { value: 0 },
      isMoon: { value: 0.0 },
    },
  });

  const sunMesh = new THREE.Mesh(sunGeo, sunMaterial);
  sunGroup.add(sunMesh);

  // Corona
  const coronaGeo = new THREE.SphereGeometry(sunRadius * SPACE_CONFIG.sun.coronaScale, 64, 64);
  const coronaMaterial = new THREE.ShaderMaterial({
    vertexShader: coronaVertexShader,
    fragmentShader: coronaFragmentShader,
    uniforms: {
      time: { value: 0 },
      isMoon: { value: 0.0 },
    },
    transparent: true,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    depthWrite: false,
  });
  const coronaMesh = new THREE.Mesh(coronaGeo, coronaMaterial);
  sunGroup.add(coronaMesh);

  // Inner Glow Textures (Refined warm golden celestial haze)
  const innerGlowSun = createSunGlowTexture('rgba(248, 225, 150, 0.90)', 'rgba(198, 168, 92, 0.50)');
  const innerGlowMoon = createSunGlowTexture('rgba(235, 245, 255, 0.95)', 'rgba(120, 180, 255, 0.6)');

  const innerGlowMat = new THREE.SpriteMaterial({
    map: innerGlowSun,
    transparent: true,
    opacity: 0.88,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const innerGlowSprite = new THREE.Sprite(innerGlowMat);
  innerGlowSprite.scale.set(48, 48, 1);
  sunGroup.add(innerGlowSprite);

  // Outer Glow Textures (Distant soft atmospheric scattering)
  const outerGlowSun = createSunGlowTexture('rgba(160, 120, 50, 0.55)', 'rgba(58, 37, 12, 0.12)');
  const outerGlowMoon = createSunGlowTexture('rgba(100, 160, 255, 0.65)', 'rgba(40, 80, 200, 0.2)');

  const outerGlowMat = new THREE.SpriteMaterial({
    map: outerGlowSun,
    transparent: true,
    opacity: 0.65,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const outerGlowSprite = new THREE.Sprite(outerGlowMat);
  outerGlowSprite.scale.set(95, 95, 1);
  sunGroup.add(outerGlowSprite);

  // Volumetric Sun / Moon Rays
  const { sunRaysGroup, sunRayTex, moonRayTex } = createVolumetricRays();
  sunGroup.add(sunRaysGroup);

  // Solar emission flame particles
  const sunParticleCount = SPACE_CONFIG.sun.particleCount;
  const sunParticleGeo = new THREE.BufferGeometry();
  const sunPos = new Float32Array(sunParticleCount * 3);
  const sunDirs = new Float32Array(sunParticleCount * 3);
  const sunSpeeds = new Float32Array(sunParticleCount);

  for (let i = 0; i < sunParticleCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    const dx = Math.sin(phi) * Math.cos(theta);
    const dy = Math.sin(phi) * Math.sin(theta);
    const dz = Math.cos(phi);

    const r = sunRadius * 1.05 + Math.random() * 18;
    sunPos[i * 3] = dx * r;
    sunPos[i * 3 + 1] = dy * r;
    sunPos[i * 3 + 2] = dz * r;

    sunDirs[i * 3] = dx;
    sunDirs[i * 3 + 1] = dy;
    sunDirs[i * 3 + 2] = dz;

    sunSpeeds[i] = 0.02 + Math.random() * 0.04;
  }

  sunParticleGeo.setAttribute('position', new THREE.BufferAttribute(sunPos, 3));
  const sunParticleMat = new THREE.PointsMaterial({
    size: 0.28,
    color: 0xffbb22,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
  });
  const sunParticles = new THREE.Points(sunParticleGeo, sunParticleMat);
  sunGroup.add(sunParticles);

  const { x, y, z } = SPACE_CONFIG.sun.position;
  sunGroup.position.set(x, y, z);

  return {
    sunGroup,
    sunMesh,
    sunMaterial,
    coronaMesh,
    coronaMaterial,
    innerGlowSprite,
    outerGlowSprite,
    innerGlowSun,
    innerGlowMoon,
    outerGlowSun,
    outerGlowMoon,
    sunRaysGroup,
    sunRayTex,
    moonRayTex,
    sunParticles,
    sunDirs,
    sunSpeeds,
  };
}
