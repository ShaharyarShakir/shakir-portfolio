import * as THREE from 'three';

// Circular texture generator for soft glowing star particles
export function createCircleParticleTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
  grad.addColorStop(0.3, 'rgba(255, 210, 120, 0.8)');
  grad.addColorStop(1.0, 'rgba(255, 210, 120, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);

  return new THREE.CanvasTexture(canvas);
}

// Soft Glowing Cold Snowflake Particle Texture
export function createSnowflakeParticleTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
  grad.addColorStop(0.35, 'rgba(220, 240, 255, 0.9)');
  grad.addColorStop(0.7, 'rgba(140, 200, 255, 0.4)');
  grad.addColorStop(1.0, 'rgba(140, 200, 255, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);

  return new THREE.CanvasTexture(canvas);
}

// 1. Soft Gradient Texture for Volumetric Sun Rays (Sunbeams)
export function createSunRayTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const grad = ctx.createLinearGradient(64, 0, 64, 512);
  grad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
  grad.addColorStop(0.12, 'rgba(255, 230, 120, 0.85)');
  grad.addColorStop(0.35, 'rgba(255, 160, 40, 0.5)');
  grad.addColorStop(0.65, 'rgba(255, 90, 10, 0.2)');
  grad.addColorStop(1, 'rgba(255, 40, 0, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 512);

  const edgeGrad = ctx.createLinearGradient(0, 0, 128, 0);
  edgeGrad.addColorStop(0, 'rgba(0, 0, 0, 1)');
  edgeGrad.addColorStop(0.3, 'rgba(0, 0, 0, 0)');
  edgeGrad.addColorStop(0.7, 'rgba(0, 0, 0, 0)');
  edgeGrad.addColorStop(1, 'rgba(0, 0, 0, 1)');

  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillStyle = edgeGrad;
  ctx.fillRect(0, 0, 128, 512);

  return new THREE.CanvasTexture(canvas);
}

// 2. Soft Gradient Texture for Volumetric Moonlight Rays
export function createMoonRayTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const grad = ctx.createLinearGradient(64, 0, 64, 512);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
  grad.addColorStop(0.15, 'rgba(220, 245, 255, 0.9)');
  grad.addColorStop(0.4, 'rgba(150, 210, 255, 0.6)');
  grad.addColorStop(0.7, 'rgba(80, 150, 250, 0.25)');
  grad.addColorStop(1, 'rgba(20, 60, 140, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 512);

  const edgeGrad = ctx.createLinearGradient(0, 0, 128, 0);
  edgeGrad.addColorStop(0, 'rgba(0, 0, 0, 1)');
  edgeGrad.addColorStop(0.3, 'rgba(0, 0, 0, 0)');
  edgeGrad.addColorStop(0.7, 'rgba(0, 0, 0, 0)');
  edgeGrad.addColorStop(1, 'rgba(0, 0, 0, 1)');

  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillStyle = edgeGrad;
  ctx.fillRect(0, 0, 128, 512);

  return new THREE.CanvasTexture(canvas);
}

// 3. Radial Glow Flare Texture for Sun/Moon Halos
export function createSunGlowTexture(innerColor: string, outerColor: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const grad = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
  grad.addColorStop(0.18, innerColor);
  grad.addColorStop(0.5, outerColor);
  grad.addColorStop(0.82, 'rgba(0, 0, 0, 0.05)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  return new THREE.CanvasTexture(canvas);
}

// Helper to create procedural crater texture
export function createCraterTexture(colorHex1: string, colorHex2: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const grad = ctx.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, colorHex1);
  grad.addColorStop(1, colorHex2);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 256);

  for (let i = 0; i < 70; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 256;
    const r = 2 + Math.random() * 18;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.stroke();
  }

  return new THREE.CanvasTexture(canvas);
}
