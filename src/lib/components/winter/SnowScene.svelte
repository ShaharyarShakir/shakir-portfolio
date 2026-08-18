<script lang="ts">
  import { Canvas } from '@threlte/core';
  import { onMount } from 'svelte';
  import { isWebGLAvailable } from '$lib/3d/webglCheck';
  import Moon from './Moon.svelte';
  import SnowParticles from './SnowParticles.svelte';
  import MoonGlow from './MoonGlow.svelte';
  import FrostOverlay from './FrostOverlay.svelte';

  let { mouseX = 0, mouseY = 0 } = $props();

  let webglSupported = $state(true);
  let quality = $state<'high' | 'medium' | 'low'>('high');
  let isTabVisible = $state(true);

  function detectQualityLevel() {
    if (typeof window === 'undefined') return 'high';
    const isMobile = window.innerWidth < 768 || /Android|iPhone|iPad/i.test(navigator.userAgent);
    const cores = navigator.hardwareConcurrency || 4;
    
    if (isMobile || cores <= 2) return 'low';
    if (cores <= 4) return 'medium';
    return 'high';
  }

  function handleVisibilityChange() {
    isTabVisible = !document.hidden;
  }

  onMount(() => {
    webglSupported = isWebGLAvailable();
    quality = detectQualityLevel();

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  });
</script>

<div class="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0">
  {#if webglSupported && isTabVisible}
    <Canvas>
      <Moon {mouseX} {mouseY} {quality} />
      <MoonGlow />
      <SnowParticles {quality} />
      <FrostOverlay />
    </Canvas>
  {:else}
    <!-- Atmospheric CSS-only fallback background -->
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,#162a45_0%,#0b1728_75%)]">
      <div class="absolute top-[10%] left-1/2 -translate-x-1/2 w-[320px] h-[320px] rounded-full bg-[radial-gradient(circle,rgba(220,238,255,0.45)_0%,rgba(158,220,255,0.15)_50%,transparent_70%)] blur-2xl"></div>
      <div class="absolute inset-0 bg-gradient-to-b from-transparent to-[#0b1728]/60"></div>
    </div>
  {/if}
</div>
