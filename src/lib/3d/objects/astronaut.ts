import * as THREE from 'three';
import { SPACE_CONFIG } from '../config';

export function create3DAstronaut(): THREE.Group {
  const group = new THREE.Group();

  const suitMat = new THREE.MeshStandardMaterial({
    color: 0xeeeff4,
    roughness: 0.3,
    metalness: 0.1,
  });
  const darkMat = new THREE.MeshStandardMaterial({
    color: 0x1e2029,
    roughness: 0.5,
  });
  const visorMat = new THREE.MeshStandardMaterial({
    color: 0xffb703,
    metalness: 0.95,
    roughness: 0.05,
  });
  const chestPadMat = new THREE.MeshStandardMaterial({
    color: 0xe63946,
    roughness: 0.4,
  });
  const bluePadMat = new THREE.MeshStandardMaterial({
    color: 0x1d3557,
    roughness: 0.4,
  });

  // Helmet
  const helmetGeo = new THREE.SphereGeometry(0.7, 32, 32);
  const helmet = new THREE.Mesh(helmetGeo, suitMat);
  group.add(helmet);

  // Visor
  const visorGeo = new THREE.SphereGeometry(0.55, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.55);
  const visor = new THREE.Mesh(visorGeo, visorMat);
  visor.rotation.x = Math.PI * 0.1;
  visor.position.set(0, 0.05, 0.2);
  group.add(visor);

  // Helmet ring connector
  const ringGeo = new THREE.TorusGeometry(0.68, 0.06, 16, 32);
  const ring = new THREE.Mesh(ringGeo, darkMat);
  ring.rotation.x = Math.PI / 2;
  ring.position.y = -0.45;
  group.add(ring);

  // Torso Body
  const torsoGeo = new THREE.CylinderGeometry(0.65, 0.55, 1.4, 32);
  const torso = new THREE.Mesh(torsoGeo, suitMat);
  torso.position.y = -1.2;
  group.add(torso);

  // Life Support Control Pack (Chest)
  const chestGeo = new THREE.BoxGeometry(0.6, 0.5, 0.3);
  const chest = new THREE.Mesh(chestGeo, suitMat);
  chest.position.set(0, -1.1, 0.45);
  group.add(chest);

  // Control buttons
  const btn1Geo = new THREE.CylinderGeometry(0.06, 0.06, 0.05, 16);
  const btn1 = new THREE.Mesh(btn1Geo, chestPadMat);
  btn1.rotation.x = Math.PI / 2;
  btn1.position.set(-0.15, -1.0, 0.6);
  group.add(btn1);

  const btn2 = new THREE.Mesh(btn1Geo, bluePadMat);
  btn2.rotation.x = Math.PI / 2;
  btn2.position.set(0.15, -1.0, 0.6);
  group.add(btn2);

  // Backpack / Jetpack
  const packGeo = new THREE.BoxGeometry(1.0, 1.3, 0.5);
  const pack = new THREE.Mesh(packGeo, suitMat);
  pack.position.set(0, -1.2, -0.45);
  group.add(pack);

  // Backpack Thrusters
  const thrusterGeo = new THREE.CylinderGeometry(0.12, 0.18, 0.3, 16);
  const tLeft = new THREE.Mesh(thrusterGeo, darkMat);
  tLeft.position.set(-0.35, -1.9, -0.45);
  group.add(tLeft);
  const tRight = new THREE.Mesh(thrusterGeo, darkMat);
  tRight.position.set(0.35, -1.9, -0.45);
  group.add(tRight);

  // Shoulders & Arms
  const armGeo = new THREE.CylinderGeometry(0.22, 0.18, 0.9, 16);

  // Left Arm
  const leftArm = new THREE.Mesh(armGeo, suitMat);
  leftArm.position.set(-0.75, -1.1, 0.1);
  leftArm.rotation.z = Math.PI * 0.15;
  leftArm.rotation.x = -Math.PI * 0.1;
  group.add(leftArm);

  // Right Arm
  const rightArm = new THREE.Mesh(armGeo, suitMat);
  rightArm.position.set(0.75, -1.0, 0.1);
  rightArm.rotation.z = -Math.PI * 0.25;
  rightArm.rotation.x = Math.PI * 0.1;
  group.add(rightArm);

  // Gloves
  const gloveGeo = new THREE.SphereGeometry(0.2, 16, 16);
  const gLeft = new THREE.Mesh(gloveGeo, darkMat);
  gLeft.position.set(-0.9, -1.5, 0.2);
  group.add(gLeft);

  const gRight = new THREE.Mesh(gloveGeo, darkMat);
  gRight.position.set(0.95, -1.4, 0.25);
  group.add(gRight);

  // Legs
  const legGeo = new THREE.CylinderGeometry(0.24, 0.2, 1.0, 16);
  const legLeft = new THREE.Mesh(legGeo, suitMat);
  legLeft.position.set(-0.35, -2.3, 0);
  legLeft.rotation.z = Math.PI * 0.05;
  group.add(legLeft);

  const legRight = new THREE.Mesh(legGeo, suitMat);
  legRight.position.set(0.35, -2.3, -0.1);
  legRight.rotation.z = -Math.PI * 0.08;
  group.add(legRight);

  // Boots
  const bootGeo = new THREE.BoxGeometry(0.26, 0.25, 0.45);
  const bootLeft = new THREE.Mesh(bootGeo, darkMat);
  bootLeft.position.set(-0.38, -2.85, 0.08);
  group.add(bootLeft);

  const bootRight = new THREE.Mesh(bootGeo, darkMat);
  bootRight.position.set(0.38, -2.85, 0.02);
  group.add(bootRight);

  const s = SPACE_CONFIG.astronaut.scale;
  group.scale.set(s, s, s);

  const { x, y, z } = SPACE_CONFIG.astronaut.position;
  group.position.set(x, y, z);
  group.rotation.y = SPACE_CONFIG.astronaut.rotation.y;
  group.rotation.z = SPACE_CONFIG.astronaut.rotation.z;

  return group;
}
