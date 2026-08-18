<script lang="ts">
  import { T, useTask } from '@threlte/core';
  import * as THREE from 'three';
  import { onMount } from 'svelte';

  let { mouseX = 0, mouseY = 0, quality = 'high' } = $props();

  let moonMesh = $state<THREE.Mesh | undefined>();
  let moonTexture = $state<THREE.CanvasTexture | undefined>();
  let bumpTexture = $state<THREE.CanvasTexture | undefined>();

  // Procedural Lunar Surface Texture Generation
  function generateLunarTextures() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Bright moonlit silver-white base color
    ctx.fillStyle = '#f2f7fc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle Maria (darker lunar plains)
    ctx.fillStyle = '#c5d8eb';
    for (let i = 0; i < 16; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const rx = 50 + Math.random() * 110;
      const ry = 40 + Math.random() * 85;
      ctx.beginPath();
      ctx.ellipse(x, y, rx, ry, Math.random() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }

    // Crater texture with subtle relief
    for (let i = 0; i < 220; i++) {
      const cx = Math.random() * canvas.width;
      const cy = Math.random() * canvas.height;
      const r = 2 + Math.random() * 26;

      ctx.fillStyle = 'rgba(160, 185, 210, 0.35)';
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(cx - 1, cy - 1, r * 0.88, 0, Math.PI * 2);
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;

    const bumpCanvas = document.createElement('canvas');
    bumpCanvas.width = 1024;
    bumpCanvas.height = 512;
    const bCtx = bumpCanvas.getContext('2d');
    if (bCtx) {
      bCtx.fillStyle = '#808080';
      bCtx.fillRect(0, 0, bumpCanvas.width, bumpCanvas.height);
      bCtx.drawImage(canvas, 0, 0);
      bumpTexture = new THREE.CanvasTexture(bumpCanvas);
    }

    moonTexture = tex;
  }

  onMount(() => {
    generateLunarTextures();
    return () => {
      moonTexture?.dispose();
      bumpTexture?.dispose();
    };
  });

  // Slow rotation & subtle micro parallax
  useTask((delta: number) => {
    if (moonMesh) {
      moonMesh.rotation.y += delta * 0.02;

      const targetX = 2.8 + (mouseX - 0.5) * 0.5;
      const targetY = 4.2 - (mouseY - 0.5) * 0.4;
      moonMesh.position.x += (targetX - moonMesh.position.x) * 0.02;
      moonMesh.position.y += (targetY - moonMesh.position.y) * 0.02;
    }
  });

  const detailSegments = $derived(quality === 'high' ? 64 : quality === 'medium' ? 32 : 16);
  const moonRadius = $derived(quality === 'low' ? 3.5 : 4.4);
</script>

<!-- Moon Hero Group placed Upper-Right behind main UI -->
<T.Group position={[2.8, 4.2, -7]}>
  <!-- Primary Moon Lights -->
  <T.DirectionalLight
    position={[-4, 6, 12]}
    color="#f5fbff"
    intensity={3.8}
  />
  <T.PointLight
    position={[0, 0, 3]}
    color="#c8eaff"
    intensity={5.5}
    distance={35}
    decay={1.6}
  />
  <T.AmbientLight
    color="#10263d"
    intensity={1.1}
  />

  <!-- 3D Full Moon Sphere Mesh -->
  <T.Mesh bind:ref={moonMesh}>
    <T.SphereGeometry args={[moonRadius, detailSegments, detailSegments]} />
    {#if moonTexture}
      <T.MeshStandardMaterial
        map={moonTexture}
        bumpMap={bumpTexture}
        bumpScale={0.07}
        roughness={0.72}
        metalness={0.02}
        emissive="#dceaf5"
        emissiveIntensity={0.35}
      />
    {:else}
      <T.MeshStandardMaterial
        color="#f5fbff"
        roughness={0.65}
        emissive="#c8eaff"
        emissiveIntensity={0.4}
      />
    {/if}
  </T.Mesh>

  <!-- Core Luminous Halo (Bright White-Blue) -->
  <T.Mesh scale={1.1}>
    <T.SphereGeometry args={[moonRadius, 32, 32]} />
    <T.MeshBasicMaterial
      color="#f5fbff"
      transparent={true}
      opacity={0.32}
      side={THREE.BackSide}
      blending={THREE.AdditiveBlending}
    />
  </T.Mesh>

  <!-- Inner Halo (Soft Icy Blue) -->
  <T.Mesh scale={1.28}>
    <T.SphereGeometry args={[moonRadius, 32, 32]} />
    <T.MeshBasicMaterial
      color="#c8eaff"
      transparent={true}
      opacity={0.22}
      side={THREE.BackSide}
      blending={THREE.AdditiveBlending}
    />
  </T.Mesh>
</T.Group>
