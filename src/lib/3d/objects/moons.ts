import * as THREE from 'three';
import { createCraterTexture } from '../textures';
import { SPACE_CONFIG } from '../config';

export function createMoons() {
  // Top Left Moon - Soft luminous lunar sphere
  const planetTLGeo = new THREE.SphereGeometry(1.5, 32, 32);
  const planetTLMat = new THREE.MeshStandardMaterial({
    map: createCraterTexture('#c2a278', '#5c3a21'),
    roughness: 0.7,
    emissive: new THREE.Color(0xd4af37),
    emissiveIntensity: 0.15,
  });
  const planetTopLeft = new THREE.Mesh(planetTLGeo, planetTLMat);
  const tl = SPACE_CONFIG.moons.topLeftPos;
  planetTopLeft.position.set(tl.x, tl.y, tl.z);

  // Top Right Moon - Warm glowing accent planet
  const planetTRGeo = new THREE.SphereGeometry(1.8, 32, 32);
  const planetTRMat = new THREE.MeshStandardMaterial({
    map: createCraterTexture('#e67e22', '#8e44ad'),
    roughness: 0.5,
    emissive: new THREE.Color(0xe67e22),
    emissiveIntensity: 0.25,
  });
  const planetRight = new THREE.Mesh(planetTRGeo, planetTRMat);
  const tr = SPACE_CONFIG.moons.topRightPos;
  planetRight.position.set(tr.x, tr.y, tr.z);

  return { planetTopLeft, planetRight, planetLeft: null };
}
