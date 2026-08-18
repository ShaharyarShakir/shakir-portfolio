<script lang="ts">
  import { T, useTask } from '@threlte/core';
  import * as THREE from 'three';
  import { onMount } from 'svelte';

  let { quality = 'high' } = $props();

  let particleTexture = $state<THREE.CanvasTexture | undefined>();

  let fgPoints = $state<THREE.Points | undefined>();
  let mgPoints = $state<THREE.Points | undefined>();
  let bgPoints = $state<THREE.Points | undefined>();

  // Particle counts per layer
  const counts = $derived({
    fg: quality === 'high' ? 180 : quality === 'medium' ? 90 : 40,
    mg: quality === 'high' ? 750 : quality === 'medium' ? 380 : 140,
    bg: quality === 'high' ? 1500 : quality === 'medium' ? 700 : 250,
  });

  let fgData: { positions: Float32Array; speeds: Float32Array; phases: Float32Array };
  let mgData: { positions: Float32Array; speeds: Float32Array; phases: Float32Array };
  let bgData: { positions: Float32Array; speeds: Float32Array; phases: Float32Array };

  let fgGeo = $state<THREE.BufferGeometry | undefined>();
  let mgGeo = $state<THREE.BufferGeometry | undefined>();
  let bgGeo = $state<THREE.BufferGeometry | undefined>();

  function createSoftSnowflakeTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(245, 251, 255, 1)');
    grad.addColorStop(0.3, 'rgba(220, 234, 245, 0.85)');
    grad.addColorStop(0.65, 'rgba(157, 222, 255, 0.35)');
    grad.addColorStop(1, 'rgba(157, 222, 255, 0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);

    particleTexture = new THREE.CanvasTexture(canvas);
  }

  function initLayerData(count: number, zRange: [number, number], speedMult: number) {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const phases = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 38;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 2] = zRange[0] + Math.random() * (zRange[1] - zRange[0]);

      speeds[i] = (0.014 + Math.random() * 0.022) * speedMult;
      phases[i] = Math.random() * Math.PI * 2;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    return { geo, data: { positions, speeds, phases } };
  }

  onMount(() => {
    createSoftSnowflakeTexture();

    const fg = initLayerData(counts.fg, [2, 6], 1.2);
    fgGeo = fg.geo;
    fgData = fg.data;

    const mg = initLayerData(counts.mg, [-4, 1], 0.95);
    mgGeo = mg.geo;
    mgData = mg.data;

    const bg = initLayerData(counts.bg, [-12, -5], 0.55);
    bgGeo = bg.geo;
    bgData = bg.data;

    return () => {
      particleTexture?.dispose();
      fgGeo?.dispose();
      mgGeo?.dispose();
      bgGeo?.dispose();
    };
  });


  function updateLayer(
    points: THREE.Points | undefined,
    data: { positions: Float32Array; speeds: Float32Array; phases: Float32Array },
    count: number,
    time: number
  ) {
    if (!points || !data) return;
    const posAttr = points.geometry.attributes.position as THREE.BufferAttribute;
    if (!posAttr) return;

    const pos = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      // Downward fall
      pos[i * 3 + 1] -= data.speeds[i];

      // Subtle rightward wind sway (\ direction)
      pos[i * 3] += 0.003 + Math.sin(time * 1.1 + data.phases[i]) * 0.005;
      pos[i * 3 + 2] += Math.cos(time * 0.85 + data.phases[i]) * 0.002;

      // Recirculate on bottom bound
      if (pos[i * 3 + 1] < -15) {
        pos[i * 3 + 1] = 15;
        pos[i * 3] = (Math.random() - 0.5) * 38;
      }
    }

    posAttr.needsUpdate = true;
  }

  useTask((_delta: number) => {
    const time = Date.now() * 0.001;

    updateLayer(fgPoints, fgData, counts.fg, time);
    updateLayer(mgPoints, mgData, counts.mg, time);
    updateLayer(bgPoints, bgData, counts.bg, time);
  });
</script>

{#if particleTexture}
  <!-- Foreground Snow (Larger, Soft, Slow relative drift) -->
  {#if fgGeo}
    <T.Points bind:ref={fgPoints} geometry={fgGeo}>
      <T.PointsMaterial
        map={particleTexture}
        size={0.72}
        transparent={true}
        opacity={0.82}
        color="#f5fbff"
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </T.Points>
  {/if}

  <!-- Midground Snow (Medium size, Moonlit glowing) -->
  {#if mgGeo}
    <T.Points bind:ref={mgPoints} geometry={mgGeo}>
      <T.PointsMaterial
        map={particleTexture}
        size={0.45}
        transparent={true}
        opacity={0.75}
        color="#c8eaff"
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </T.Points>
  {/if}

  <!-- Background Snow (Tiny, Dim, Numerous) -->
  {#if bgGeo}
    <T.Points bind:ref={bgPoints} geometry={bgGeo}>
      <T.PointsMaterial
        map={particleTexture}
        size={0.25}
        transparent={true}
        opacity={0.52}
        color="#9ddeff"
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </T.Points>
  {/if}
{/if}
