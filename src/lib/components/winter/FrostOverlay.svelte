<script lang="ts">
  import { T, useTask } from '@threlte/core';
  import * as THREE from 'three';
  import { onMount } from 'svelte';

  let mistTexture = $state<THREE.CanvasTexture | undefined>();
  let mistMesh = $state<THREE.Mesh | undefined>();

  function createMistTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = 'rgba(7, 19, 34, 0)';
    ctx.fillRect(0, 0, 512, 512);

    // Subtle edge crystalline frost texture
    for (let i = 0; i < 40; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const r = 70 + Math.random() * 140;
      const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
      grad.addColorStop(0, 'rgba(220, 234, 245, 0.08)');
      grad.addColorStop(0.5, 'rgba(157, 222, 255, 0.04)');
      grad.addColorStop(1, 'rgba(7, 19, 34, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    mistTexture = new THREE.CanvasTexture(canvas);
  }

  onMount(() => {
    createMistTexture();
    return () => {
      mistTexture?.dispose();
    };
  });

  useTask((delta: number) => {
    if (mistMesh) {
      mistMesh.rotation.z += delta * 0.008;
    }
  });
</script>

{#if mistTexture}
  <T.Mesh bind:ref={mistMesh} position={[0, -1, -6]}>
    <T.PlaneGeometry args={[44, 32]} />
    <T.MeshBasicMaterial
      map={mistTexture}
      transparent={true}
      opacity={0.35}
      blending={THREE.AdditiveBlending}
      depthWrite={false}
    />
  </T.Mesh>
{/if}
