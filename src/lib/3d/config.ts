export const SPACE_CONFIG = {
  camera: {
    fov: 45,
    near: 0.1,
    far: 1000,
    initialPos: { x: 0, y: 0, z: 18 }
  },
  sun: {
    radius: 7.5,
    position: { x: -5.5, y: 5.8, z: -8.0 },
    particleCount: 350,
    coronaScale: 1.45
  },
  moons: {
    topLeftPos: { x: -13.5, y: 7.0, z: -10 },
    topRightPos: { x: 13.5, y: 6.8, z: -11 },
    leftPos: { x: -12.5, y: -1.0, z: -4 }
  },
  astronaut: {
    position: { x: 7.5, y: 0.2, z: 2.8 },
    rotation: { y: -Math.PI * 0.25, z: Math.PI * 0.05 },
    scale: 0.9
  },
  particles: {
    distantStars: 700,
    midgroundDust: 350,
    foregroundEmbers: 140
  }
};
