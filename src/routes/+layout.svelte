<script lang="ts">
  import Navbar from "../components/Navbar.svelte";
  import Footer from "../components/Footer.svelte";
  import ToastContainer from "../components/ToastContainer.svelte";
  import AmbientBackground from "../components/AmbientBackground.svelte";
  import { page } from "$app/state";
  import "../app.css";

  let { children } = $props();

  let scrollY = $state(0);
  const scrolled = $derived(scrollY > 50);
</script>

<svelte:window bind:scrollY />

<div class="relative bg-[#071322] dark:bg-[#08090D] min-h-screen overflow-x-hidden">
  <!-- Whole-Page Ambient Background -->
  <AmbientBackground />

  <!-- Sticky Navbar -->
  <Navbar {scrolled} />

  <div
    class="relative mx-auto w-full max-w-4xl min-h-screen z-10 bg-[var(--bg-card)] text-[var(--text-primary)] backdrop-blur-xl border-x border-sky-300/40 dark:border-amber-400/20 shadow-2xl shadow-sky-950/20 dark:shadow-amber-500/10"
  >
    <main class="px-4 md:px-8 pt-20 pb-10">
      {#key page.url.pathname}
        <div class="animate-page-fade-slide">
          {@render children()}
        </div>
      {/key}
    </main>

    <Footer />
    <ToastContainer />
  </div>
</div>
