<script lang="ts">
  import Navbar from "../components/Navbar.svelte";
  import Footer from "../components/Footer.svelte";
  import ToastContainer from "../components/ToastContainer.svelte";
  import AmbientBackground from "../components/AmbientBackground.svelte";
  import { page } from "$app/state";
  import "../../app.css";

  let { children } = $props();

  let scrollY = $state(0);
  const scrolled = $derived(scrollY > 50);
</script>

<svelte:window bind:scrollY />

<div class="app-viewport-wrapper">
  <!-- Modular Whole-Page Ambient Background (Grid, Glow Orbs, Side Wings) -->
  <AmbientBackground />

  <div
    class="relative mx-auto w-full max-w-4xl min-h-screen app-card-container"
    style="background-color: var(--bg-card); color: var(--text-primary);"
  >
    <Navbar {scrolled} />

    <main class="px-4 md:px-8 pt-20 pb-10">
      {#key page.url.pathname}
        <div class="page-transition">
          {@render children()}
        </div>
      {/key}
    </main>

    <Footer />
    <ToastContainer />
  </div>
</div>

<style>
  .app-viewport-wrapper {
    position: relative;
    background-color: var(--bg-outer);
    min-height: 100vh;
    overflow-x: hidden;
  }

  .app-card-container {
    box-shadow: 0 0 50px rgba(0, 0, 0, 0.06);
    z-index: 10;
  }

  :global(.dark) .app-card-container {
    box-shadow: 0 0 60px rgba(0, 0, 0, 0.5);
  }

  .page-transition {
    animation: page-fade-slide 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  @keyframes page-fade-slide {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>



