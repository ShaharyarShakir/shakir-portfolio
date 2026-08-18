<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { isWebGLAvailable } from '$lib/3d/webglCheck';
  import { createSpaceEngine } from '$lib/3d/engine';
  import type { SpaceEngineInstance } from '$lib/types/space';

  let { isDark = true, mouseX = 0, mouseY = 0 } = $props();

  let canvasEl: HTMLCanvasElement | undefined = $state();
  let containerEl: HTMLDivElement | undefined = $state();
  let engine: SpaceEngineInstance | undefined;
  let webglSupported = $state(true);

  onMount(() => {
    webglSupported = isWebGLAvailable();
    if (!webglSupported || !containerEl || !canvasEl) return;

    try {
      engine = createSpaceEngine({
        canvas: canvasEl,
        container: containerEl,
        isDark,
        mouseX,
        mouseY
      });

      const handleResize = () => engine?.resize();
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        engine?.destroy();
      };
    } catch (e) {
      console.warn('WebGL engine initialization failed, using fallback:', e);
      webglSupported = false;
    }
  });

  $effect(() => {
    engine?.updateParams(isDark, mouseX, mouseY);
  });

  onDestroy(() => {
    engine?.destroy();
  });
</script>

<div bind:this={containerEl} class="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
  {#if webglSupported}
    <canvas bind:this={canvasEl} class="block w-full h-full"></canvas>
  {:else}
    <div
      class={`absolute inset-0 transition-opacity duration-500 ${
        isDark
          ? "bg-[radial-gradient(circle_at_50%_20%,rgba(255,170,0,0.22),transparent_70%),radial-gradient(circle_at_80%_80%,rgba(139,92,246,0.15),transparent_60%)]"
          : "bg-[radial-gradient(circle_at_50%_20%,rgba(255,170,0,0.15),transparent_70%),radial-gradient(circle_at_80%_80%,rgba(99,102,241,0.1),transparent_60%)]"
      }`}
    >
      <div
        class="absolute top-[5%] left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(255,170,0,0.25)_0%,rgba(255,69,0,0.08)_50%,transparent_70%)] blur-2xl animate-pulse"
      ></div>
    </div>
  {/if}
</div>
