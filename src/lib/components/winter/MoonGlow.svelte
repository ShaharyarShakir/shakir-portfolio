<script lang="ts">
  import { T, useTask } from '@threlte/core';
  import * as THREE from 'three';
  import { onMount } from 'svelte';

  let coreGlowTexture = $state<THREE.CanvasTexture | undefined>();
  let outerGlowTexture = $state<THREE.CanvasTexture | undefined>();

  let coreSprite = $state<THREE.Sprite | undefined>();
  let outerSprite = $state<THREE.Sprite | undefined>();

  function createGlowTextures() {
    // Core & Inner Halo Texture
    const coreCanvas = document.createElement('canvas');
    coreCanvas.width = 256;
    coreCanvas.height = 256;
    const cCtx = coreCanvas.getContext('2d');
    if (cCtx) {
      const grad = cCtx.createRadialGradient(128, 128, 0, 128, 128, 128);
      grad.addColorStop(0, 'rgba(245, 251, 255, 0.85)');
      grad.addColorStop(0.3, 'rgba(200, 234, 255, 0.55)');
      grad.addColorStop(0.65, 'rgba(157, 222, 255, 0.22)');
      grad.addColorStop(1, 'rgba(7, 19, 34, 0)');
      cCtx.fillStyle = grad;
      cCtx.fillRect(0, 0, 256, 256);
      coreGlowTexture = new THREE.CanvasTexture(coreCanvas);
    }

    // Large Outer Atmospheric Glow Diffusion Texture
    const outerCanvas = document.createElement('canvas');
    outerCanvas.width = 512;
    outerCanvas.height = 512;
    const oCtx = outerCanvas.getContext('2d');
    if (oCtx) {
      const grad = oCtx.createRadialGradient(256, 256, 0, 256, 256, 256);
      grad.addColorStop(0, 'rgba(200, 234, 255, 0.45)');
      grad.addColorStop(0.4, 'rgba(157, 222, 255, 0.22)');
      grad.addColorStop(0.7, 'rgba(41, 71, 99, 0.1)');
      grad.addColorStop(1, 'rgba(7, 19, 34, 0)');
      oCtx.fillStyle = grad;
      oCtx.fillRect(0, 0, 512, 512);
      outerGlowTexture = new THREE.CanvasTexture(outerCanvas);
    }
  }

  onMount(() => {
    createGlowTextures();
    return () => {
      coreGlowTexture?.dispose();
      outerGlowTexture?.dispose();
    };
  });

  // Slow 10-second subtle luminance pulse cycle
  useTask((_delta: number) => {
    const time = Date.now() * 0.001;

    if (coreSprite) {
      const pulse = 24 + Math.sin(time * 0.6) * 1.2;
      coreSprite.scale.set(pulse, pulse, 1);
    }
    if (outerSprite) {
      const pulse = 48 + Math.cos(time * 0.5) * 2.5;
      outerSprite.scale.set(pulse, pulse, 1);
    }
  });
</script>

<T.Group position={[2.8, 4.2, -8]}>
  <!-- Core & Inner Moon Halo Sprite -->
  {#if coreGlowTexture}
    <T.Sprite bind:ref={coreSprite}>
      <T.SpriteMaterial
        map={coreGlowTexture}
        transparent={true}
        opacity={0.85}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </T.Sprite>
  {/if}

  <!-- Large Outer Atmospheric Diffusion Sprite -->
  {#if outerGlowTexture}
    <T.Sprite bind:ref={outerSprite}>
      <T.SpriteMaterial
        map={outerGlowTexture}
        transparent={true}
        opacity={0.55}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </T.Sprite>
  {/if}
</T.Group>
