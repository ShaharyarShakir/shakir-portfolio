import * as THREE from 'three';
import type { SpaceEngineOptions, SpaceEngineInstance } from '$lib/types/space';
import { SPACE_CONFIG } from './config';
import { createSunSystem } from './objects/sun';
import { createParticleSystems } from './objects/particles';

export function createSpaceEngine(options: SpaceEngineOptions): SpaceEngineInstance {
  const { canvas, container } = options;
  let isDark = options.isDark ?? true;
  let mouseX = options.mouseX ?? 0;
  let mouseY = options.mouseY ?? 0;

  let animationFrameId: number;
  let isDestroyed = false;

  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || window.innerHeight;

  // 1. Scene & Camera
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    SPACE_CONFIG.camera.fov,
    width / height,
    SPACE_CONFIG.camera.near,
    SPACE_CONFIG.camera.far
  );
  const { x: cx, y: cy, z: cz } = SPACE_CONFIG.camera.initialPos;
  camera.position.set(cx, cy, cz);

  // 2. Renderer
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;

  // 3. Lighting (Upper-left directional celestial light)
  const ambientLight = new THREE.AmbientLight(0xfaf5e8, 0.65);
  scene.add(ambientLight);

  const sunCoreLight = new THREE.PointLight(0xc6a85c, 10, 80);
  const { x: sx, y: sy, z: sz } = SPACE_CONFIG.sun.position;
  sunCoreLight.position.set(sx, sy, sz);
  scene.add(sunCoreLight);

  const sunLight = new THREE.DirectionalLight(0xd8c28a, 3.2);
  sunLight.position.set(-8.0, 8.0, 5.0);
  scene.add(sunLight);

  const rimLight = new THREE.DirectionalLight(0x80602a, 2.5);
  rimLight.position.set(12, -8, -10);
  scene.add(rimLight);

  // 4. Sun & Particles Construction (Only the Sun & Celestial Glow)
  const sunObjects = createSunSystem();
  scene.add(sunObjects.sunGroup);

  const { starParticles, emberParticles } = createParticleSystems();
  scene.add(starParticles);
  scene.add(emberParticles);

  // Target mouse offsets & theme duality lerp
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;

  let targetIsMoon = isDark ? 0.0 : 1.0;
  let currentIsMoon = targetIsMoon;

  function applyThemeState() {
    targetIsMoon = isDark ? 0.0 : 1.0;

    // Lights
    if (isDark) {
      sunCoreLight.color.setHex(0xc6a85c);
      sunLight.color.setHex(0xd8c28a);
    } else {
      sunCoreLight.color.setHex(0x7dd3fc);
      sunLight.color.setHex(0xbae6fd);
    }

    // Flare Maps
    if (sunObjects.innerGlowSprite) {
      sunObjects.innerGlowSprite.material.map = isDark
        ? sunObjects.innerGlowSun
        : sunObjects.innerGlowMoon;
    }
    if (sunObjects.outerGlowSprite) {
      sunObjects.outerGlowSprite.material.map = isDark
        ? sunObjects.outerGlowSun
        : sunObjects.outerGlowMoon;
    }

    // Volumetric Rays Textures
    if (sunObjects.sunRaysGroup) {
      sunObjects.sunRaysGroup.children.forEach((child) => {
        const ray = child as THREE.Mesh;
        const mat = ray.material as THREE.MeshBasicMaterial;
        mat.map = isDark ? sunObjects.sunRayTex : sunObjects.moonRayTex;
        mat.needsUpdate = true;
      });
    }

    // Particles
    if (sunObjects.sunParticles) {
      (sunObjects.sunParticles.material as THREE.PointsMaterial).color.setHex(
        isDark ? 0xc6a85c : 0xbae6fd
      );
    }
    if (starParticles) {
      (starParticles.material as THREE.PointsMaterial).opacity = isDark ? 0.65 : 0.75;
    }
    if (emberParticles) {
      const mat = emberParticles.material as THREE.PointsMaterial;
      mat.size = isDark ? 0.28 : 0.36;
      mat.opacity = isDark ? 0.8 : 0.85;
    }
  }

  applyThemeState();

  function animate() {
    if (isDestroyed) return;
    animationFrameId = requestAnimationFrame(animate);

    const time = Date.now() * 0.001;

    // Smooth Mouse Lerp
    targetX = (mouseX / (window.innerWidth || 1) - 0.5) * 2;
    targetY = (mouseY / (window.innerHeight || 1) - 0.5) * 2;

    currentX += (targetX - currentX) * 0.03;
    currentY += (targetY - currentY) * 0.03;

    // Smooth isMoon theme transition lerp
    currentIsMoon += (targetIsMoon - currentIsMoon) * 0.05;

    // Camera micro movement
    camera.position.x = currentX * 1.1;
    camera.position.y = -currentY * 0.8;
    camera.lookAt(0, 1.0, 0);

    // 1. Sun surface plasma animation & uniforms
    if (sunObjects.sunMaterial) {
      sunObjects.sunMaterial.uniforms.time.value = time;
      sunObjects.sunMaterial.uniforms.isMoon.value = currentIsMoon;
    }
    if (sunObjects.coronaMaterial) {
      sunObjects.coronaMaterial.uniforms.time.value = time;
      sunObjects.coronaMaterial.uniforms.isMoon.value = currentIsMoon;
    }

    if (sunObjects.sunMesh) {
      sunObjects.sunMesh.rotation.y = time * 0.02;
    }

    // Flare Sprites pulsing
    if (sunObjects.innerGlowSprite) {
      const pulse = 48 + Math.sin(time * 0.25) * 2.5;
      sunObjects.innerGlowSprite.scale.set(pulse, pulse, 1);
    }
    if (sunObjects.outerGlowSprite) {
      const pulse = 95 + Math.cos(time * 0.18) * 4.0;
      sunObjects.outerGlowSprite.scale.set(pulse, pulse, 1);
    }

    // Volumetric Rays rotation & subtle opacity pulse
    if (sunObjects.sunRaysGroup) {
      sunObjects.sunRaysGroup.children.forEach((child) => {
        const ray = child as THREE.Mesh;
        const data = ray.userData;
        if (data) {
          ray.rotation.z += data.rotSpeed * 0.5;
          const mat = ray.material as THREE.MeshBasicMaterial;
          mat.opacity = data.baseOpacity * (0.65 + 0.35 * Math.sin(time * data.speed * 0.4 + data.phase));
        }
      });
    }

    // Solar particles outward stream
    if (sunObjects.sunParticles) {
      const posAttr = sunObjects.sunParticles.geometry.attributes.position as THREE.BufferAttribute;
      const positions = posAttr.array as Float32Array;
      const count = SPACE_CONFIG.sun.particleCount;
      const sunR = SPACE_CONFIG.sun.radius;

      for (let i = 0; i < count; i++) {
        positions[i * 3] += sunObjects.sunDirs[i * 3] * sunObjects.sunSpeeds[i] * 0.5;
        positions[i * 3 + 1] += sunObjects.sunDirs[i * 3 + 1] * sunObjects.sunSpeeds[i] * 0.5;
        positions[i * 3 + 2] += sunObjects.sunDirs[i * 3 + 2] * sunObjects.sunSpeeds[i] * 0.5;

        const distSq =
          positions[i * 3] ** 2 + positions[i * 3 + 1] ** 2 + positions[i * 3 + 2] ** 2;

        if (distSq > 240) {
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(Math.random() * 2 - 1);
          const dx = Math.sin(phi) * Math.cos(theta);
          const dy = Math.sin(phi) * Math.sin(theta);
          const dz = Math.cos(phi);
          const r = sunR * 1.05;

          positions[i * 3] = dx * r;
          positions[i * 3 + 1] = dy * r;
          positions[i * 3 + 2] = dz * r;
        }
      }
      posAttr.needsUpdate = true;
    }

    // 2. Starfield gentle rotation
    if (starParticles) {
      starParticles.rotation.y = time * 0.004;
      starParticles.rotation.x = Math.sin(time * 0.003) * 0.01;
    }

    // 3. Floating cosmic dust particles
    if (emberParticles) {
      const posAttr = emberParticles.geometry.attributes.position as THREE.BufferAttribute;
      const positions = posAttr.array as Float32Array;
      const count = SPACE_CONFIG.particles.midgroundDust + SPACE_CONFIG.particles.foregroundEmbers;

      for (let i = 0; i < count; i++) {
        if (isDark) {
          positions[i * 3 + 1] += Math.sin(time * 0.5 + i * 0.3) * 0.0025;
          positions[i * 3] += Math.cos(time * 0.4 + i * 0.7) * 0.002;
        } else {
          positions[i * 3 + 1] -= 0.012;
          positions[i * 3] += Math.sin(time * 1.2 + i * 2.1) * 0.006;
          if (positions[i * 3 + 1] < -8) {
            positions[i * 3 + 1] = 8;
            positions[i * 3] = (Math.random() - 0.5) * 30;
          }
        }
      }
      posAttr.needsUpdate = true;
    }

    renderer.render(scene, camera);
  }

  animate();

  function resize() {
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }

  function disposeObject(obj: THREE.Object3D) {
    if (!obj) return;
    obj.children.forEach((child) => disposeObject(child));

    const mesh = obj as THREE.Mesh;
    if (mesh.geometry) {
      mesh.geometry.dispose();
    }
    if (mesh.material) {
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach((m) => m.dispose());
      } else {
        mesh.material.dispose();
      }
    }
  }

  function destroy() {
    isDestroyed = true;
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    disposeObject(scene);
    renderer.dispose();
  }

  return {
    updateParams(newIsDark: boolean, newMouseX: number, newMouseY: number) {
      isDark = newIsDark;
      mouseX = newMouseX;
      mouseY = newMouseY;
      applyThemeState();
    },
    resize,
    destroy,
  };
}
