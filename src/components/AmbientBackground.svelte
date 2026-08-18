<script lang="ts">
  import { browser } from "$app/environment";
  import { theme } from "$lib/stores/theme";
  import SpaceCanvas from "./SpaceCanvas.svelte";
  import SnowScene from "$lib/components/winter/SnowScene.svelte";

  let mouseX = $state(0);
  let mouseY = $state(0);

  const isDark = $derived($theme === "dark");

  function handleMouseMove(e: MouseEvent) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }
</script>

<svelte:window onmousemove={handleMouseMove} />

<div class="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#071322] dark:bg-[#08090D] transition-colors duration-600" aria-hidden="true">
  {#if browser}
    {#if !isDark}
      <SnowScene {mouseX} {mouseY} />
    {:else}
      <SpaceCanvas {isDark} {mouseX} {mouseY} />
    {/if}
  {/if}

  <!-- Ambient directional atmospheric overlay -->
  <div
    class="absolute inset-0 pointer-events-none transition-all duration-800 bg-[radial-gradient(circle_at_75%_15%,rgba(245,251,255,0.48)_0%,rgba(200,234,255,0.28)_35%,rgba(157,222,255,0.12)_60%,transparent_80%),radial-gradient(circle_at_20%_85%,rgba(7,19,34,0.65)_0%,transparent_70%)] dark:bg-[radial-gradient(circle_at_25%_18%,rgba(198,168,92,0.28)_0%,rgba(128,96,42,0.20)_25%,rgba(58,37,12,0.14)_50%,transparent_75%),radial-gradient(circle_at_80%_85%,rgba(8,9,13,0.85)_0%,transparent_60%)]"
  ></div>
</div>
