import * as THREE from 'three';
import { createCircleParticleTexture } from '../textures';
import { SPACE_CONFIG } from '../config';

export function createParticleSystems() {
  const circleTex = createCircleParticleTexture();

  // 1. Distant Cosmic Dust & Stars (Background Layer: tiny, dim, slow)
  const starCount = SPACE_CONFIG.particles.distantStars;
  const starGeo = new THREE.BufferGeometry();
  const starPositions = new Float32Array(starCount * 3);
  const starColors = new Float32Array(starCount * 3);

  // Palette definitions in RGB [0..1]
  // Warm white, muted gold, soft amber, olive gold
  const palette = [
    [0.98, 0.96, 0.91], // warm white (#FAF5E8)
    [0.85, 0.76, 0.54], // muted gold (#D8C28A)
    [0.78, 0.66, 0.36], // soft gold (#C6A85C)
    [0.50, 0.38, 0.16], // soft olive-gold (#80602A)
  ];

  for (let i = 0; i < starCount; i++) {
    // Non-uniform spatial distribution (subtle clustering)
    const cluster = Math.random() < 0.35;
    const spreadX = cluster ? 20 : 50;
    const spreadY = cluster ? 18 : 45;

    starPositions[i * 3] = (Math.random() - 0.5) * spreadX - (cluster ? 4 : 0);
    starPositions[i * 3 + 1] = (Math.random() - 0.5) * spreadY + (cluster ? 3 : 0);
    starPositions[i * 3 + 2] = (Math.random() - 0.5) * 40 - 12; // deep z

    // Pick restrained palette color with random brightness
    const c = palette[Math.floor(Math.random() * palette.length)];
    const dim = 0.5 + Math.random() * 0.5;
    starColors[i * 3] = c[0] * dim;
    starColors[i * 3 + 1] = c[1] * dim;
    starColors[i * 3 + 2] = c[2] * dim;
  }

  starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

  const starMat = new THREE.PointsMaterial({
    size: 0.16,
    map: circleTex,
    vertexColors: true,
    transparent: true,
    opacity: 0.65,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const starParticles = new THREE.Points(starGeo, starMat);

  // 2. Midground & Foreground Cosmic Dust Particles (Subtle floating, varied size, soft glow)
  const emberCount = SPACE_CONFIG.particles.midgroundDust + SPACE_CONFIG.particles.foregroundEmbers;
  const emberGeo = new THREE.BufferGeometry();
  const emberPositions = new Float32Array(emberCount * 3);
  const emberColors = new Float32Array(emberCount * 3);

  for (let i = 0; i < emberCount; i++) {
    const isForeground = i >= SPACE_CONFIG.particles.midgroundDust;
    const zOffset = isForeground ? -2 + Math.random() * 6 : -12 + Math.random() * 10;
    
    // Cluster toward upper-left celestial direction with organic scatter
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.pow(Math.random(), 1.5) * (isForeground ? 18 : 26);

    emberPositions[i * 3] = Math.cos(angle) * radius - 3.5;
    emberPositions[i * 3 + 1] = Math.sin(angle) * radius + 3.0;
    emberPositions[i * 3 + 2] = zOffset;

    const c = palette[Math.floor(Math.random() * palette.length)];
    const brightness = isForeground ? 0.8 + Math.random() * 0.2 : 0.6 + Math.random() * 0.3;
    emberColors[i * 3] = c[0] * brightness;
    emberColors[i * 3 + 1] = c[1] * brightness;
    emberColors[i * 3 + 2] = c[2] * brightness;
  }

  emberGeo.setAttribute('position', new THREE.BufferAttribute(emberPositions, 3));
  emberGeo.setAttribute('color', new THREE.BufferAttribute(emberColors, 3));

  const emberMat = new THREE.PointsMaterial({
    size: 0.28,
    map: circleTex,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const emberParticles = new THREE.Points(emberGeo, emberMat);

  return { starParticles, emberParticles };
}
