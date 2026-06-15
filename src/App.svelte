<script lang="ts">
  import { Router } from "sv-router";
  import Navbar from "./components/Navbar.svelte";
  import Footer from "./components/Footer.svelte";

  let scrollY = $state(0);
  const scrolled = $derived(scrollY > 50);
</script>

<svelte:window bind:scrollY />

<div style="background-color: var(--bg-outer); min-height: 100vh;">
  <div
    class="relative mx-auto w-full max-w-4xl min-h-screen"
    style="background-color: var(--bg-card); color: var(--text-primary);"
  >
    <Navbar {scrolled} />

    <main class="px-4 md:px-8 pt-20 pb-10">
      <Router />
    </main>
    <Footer />
  </div>
</div>
