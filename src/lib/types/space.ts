import type * as THREE from 'three';

export interface SpaceEngineOptions {
  canvas: HTMLCanvasElement;
  container: HTMLElement;
  isDark?: boolean;
  mouseX?: number;
  mouseY?: number;
}

export interface SpaceSceneHandles {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  sunGroup: THREE.Group;
  sunMesh: THREE.Mesh;
  sunMaterial: THREE.ShaderMaterial;
  coronaMesh: THREE.Mesh;
  coronaMaterial: THREE.ShaderMaterial;
  innerGlowSprite: THREE.Sprite;
  outerGlowSprite: THREE.Sprite;
  prominencesGroup: THREE.Group;
  sunRaysGroup: THREE.Group;
  sunParticles: THREE.Points;
  sunDirs: Float32Array;
  sunSpeeds: Float32Array;
  astronautGroup: THREE.Group;
  planetLeft: THREE.Mesh;
  planetRight: THREE.Mesh;
  planetTopLeft: THREE.Mesh;
  starParticles: THREE.Points;
  emberParticles: THREE.Points;
}

export interface SpaceEngineInstance {
  updateParams: (isDark: boolean, mouseX: number, mouseY: number) => void;
  resize: () => void;
  destroy: () => void;
}
