<script lang="ts">
  import ThemeToggle from "./ThemeToggle.svelte";
  import "../lib/stores/theme";

  let { scrolled = false } = $props<{ scrolled?: boolean }>();

  let drawerOpen = $state(false);

  function toggleDrawer() {
    drawerOpen = !drawerOpen;
  }
  function closeDrawer() {
    drawerOpen = false;
  }
</script>

<!-- Navbar Floating Header -->
<div class="top-0 right-0 left-0 z-50 fixed flex justify-center pointer-events-none">
  <div class="px-4 pt-2 w-full max-w-4xl pointer-events-auto">
    <nav
      class={`flex items-center justify-between transition-all duration-500 ease-out border-none ${
        scrolled
          ? "mx-auto px-4 py-2.5 rounded-full w-full md:w-[60%] bg-white/85 dark:bg-slate-950/80 backdrop-blur-xl border border-sky-300/50 dark:border-amber-400/20 shadow-lg shadow-sky-900/10 dark:shadow-black/60"
          : "w-[92%] px-6 py-2 rounded-none"
      }`}
    >
      <!-- Logo / Avatar with Animated Aura -->
      <a href="/" aria-label="Home" class="flex items-center shrink-0 no-underline group">
        <div
          class={`relative flex items-center justify-center transition-all duration-400 ease-out ${
            scrolled ? "w-9 h-9" : "w-12 h-12"
          }`}
        >
          <div
            class="absolute -inset-1 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 dark:from-amber-600 dark:via-yellow-500 dark:to-amber-400 opacity-45 dark:opacity-40 blur-sm animate-aura-spin transition-all duration-300 group-hover:opacity-95 group-hover:blur-md group-hover:scale-110"
          ></div>
          <img
            src="/images/avatar.jpg"
            alt="Shaharyar Shakir"
            class="relative z-10 w-full h-full rounded-full object-cover border-2 border-white dark:border-slate-900 shadow-sm transition-transform duration-350 ease-out group-hover:scale-110 group-hover:rotate-6"
          />
          <span
            class={`absolute z-20 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 animate-status-pulse ${
              scrolled ? "w-2 h-2 -bottom-0.5 -right-0.5" : "w-2.5 h-2.5 bottom-0.5 right-0.5"
            }`}
            title="Available for work"
          ></span>
        </div>
      </a>

      <!-- Desktop links -->
      <div class="hidden md:flex gap-6 items-center font-medium text-slate-700 dark:text-slate-200">
        <a
          href="/about"
          class="relative text-sm transition-colors duration-200 hover:text-indigo-600 dark:hover:text-amber-400 group/link"
        >
          About
          <span class="absolute left-0 -bottom-1 w-0 h-0.5 bg-indigo-500 dark:bg-amber-400 rounded transition-all duration-300 group-hover/link:w-full"></span>
        </a>
        <a
          href="/project"
          class="relative text-sm transition-colors duration-200 hover:text-indigo-600 dark:hover:text-amber-400 group/link"
        >
          Projects
          <span class="absolute left-0 -bottom-1 w-0 h-0.5 bg-indigo-500 dark:bg-amber-400 rounded transition-all duration-300 group-hover/link:w-full"></span>
        </a>
        <a
          href="/blog"
          class="relative text-sm transition-colors duration-200 hover:text-indigo-600 dark:hover:text-amber-400 group/link"
        >
          Blog
          <span class="absolute left-0 -bottom-1 w-0 h-0.5 bg-indigo-500 dark:bg-amber-400 rounded transition-all duration-300 group-hover/link:w-full"></span>
        </a>
        <a
          href="/contact"
          class="relative text-sm transition-colors duration-200 hover:text-indigo-600 dark:hover:text-amber-400 group/link"
        >
          Contact
          <span class="absolute left-0 -bottom-1 w-0 h-0.5 bg-indigo-500 dark:bg-amber-400 rounded transition-all duration-300 group-hover/link:w-full"></span>
        </a>
        <ThemeToggle />
      </div>

      <!-- Mobile hamburger -->
      <div class="md:hidden flex items-center gap-2">
        <ThemeToggle />
        <button
          class="btn btn-ghost btn-circle btn-sm text-slate-700 dark:text-slate-200"
          onclick={toggleDrawer}
          aria-label="Open navigation"
        >
          <svg width="22" height="18" viewBox="0 0 22 18" fill="none">
            <line x1="1" y1="3" x2="21" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            <line x1="1" y1="9" x2="21" y2="9" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            <line x1="1" y1="15" x2="21" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
        </button>
      </div>
    </nav>
  </div>
</div>

<!-- Mobile Drawer Overlay & Panel (using daisyUI classes & v4 utilities) -->
{#if drawerOpen}
  <!-- Backdrop -->
  <button
    class="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity duration-300 border-none w-full h-full cursor-default"
    onclick={closeDrawer}
    aria-label="Close navigation overlay"
  ></button>
{/if}

<div
  class={`fixed top-0 right-0 z-50 w-72 h-dvh flex flex-col p-8 pt-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border-l border-slate-200 dark:border-slate-800 shadow-2xl transition-transform duration-300 ease-out ${
    drawerOpen ? "translate-x-0" : "translate-x-full"
  }`}
>
  <!-- Close Button -->
  <button
    class="btn btn-ghost btn-circle btn-sm absolute top-5 right-5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
    onclick={closeDrawer}
    aria-label="Close navigation"
  >
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <line x1="2" y1="2" x2="18" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      <line x1="18" y1="2" x2="2" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
    </svg>
  </button>

  <!-- Drawer Links -->
  <nav class="flex flex-col mt-4 divide-y divide-slate-200/60 dark:divide-slate-800">
    <a
      href="/about"
      onclick={closeDrawer}
      class="flex items-center justify-between py-4 text-xl font-medium text-slate-800 dark:text-slate-100 no-underline hover:text-indigo-600 dark:hover:text-amber-400 transition-colors"
    >
      About
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" class="opacity-40">
        <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </a>
    <a
      href="/project"
      onclick={closeDrawer}
      class="flex items-center justify-between py-4 text-xl font-medium text-slate-800 dark:text-slate-100 no-underline hover:text-indigo-600 dark:hover:text-amber-400 transition-colors"
    >
      Projects
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" class="opacity-40">
        <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </a>
    <a
      href="/blog"
      onclick={closeDrawer}
      class="flex items-center justify-between py-4 text-xl font-medium text-slate-800 dark:text-slate-100 no-underline hover:text-indigo-600 dark:hover:text-amber-400 transition-colors"
    >
      Blog
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" class="opacity-40">
        <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </a>
    <a
      href="/contact"
      onclick={closeDrawer}
      class="flex items-center justify-between py-4 text-xl font-medium text-slate-800 dark:text-slate-100 no-underline hover:text-indigo-600 dark:hover:text-amber-400 transition-colors"
    >
      Contact
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" class="opacity-40">
        <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </a>
  </nav>
</div>
