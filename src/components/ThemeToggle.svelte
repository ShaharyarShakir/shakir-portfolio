<script lang="ts">
  import { theme } from "../lib/stores/theme";
  import gsap from "gsap";

  let buttonEl: HTMLButtonElement | null = $state(null);
  let iconWrapEl: HTMLDivElement | null = $state(null);

  function toggle() {
    if (buttonEl && iconWrapEl) {
      const tl = gsap.timeline();
      tl.to(iconWrapEl, { rotate: 360, scale: 0.75, duration: 0.35, ease: "power2.in" })
        .to(iconWrapEl, { scale: 1, duration: 0.45, ease: "back.out(1.8)" });

      gsap.fromTo(
        buttonEl,
        { scale: 0.9 },
        { scale: 1, duration: 0.4, ease: "elastic.out(1, 0.4)" }
      );

      gsap.to(".ambient-space-wrapper", {
        opacity: 0.85,
        duration: 0.4,
        yoyo: true,
        repeat: 1,
        ease: "sine.inOut",
      });
    }
    theme.update((t) => (t === "light" ? "dark" : "light"));
  }
</script>

<button
  bind:this={buttonEl}
  class="btn btn-ghost btn-circle btn-sm relative text-slate-700 dark:text-slate-200 border border-slate-300/60 dark:border-amber-400/20 hover:scale-110 active:scale-95 transition-all duration-300 group overflow-hidden"
  onclick={toggle}
  aria-label="Toggle celestial day night theme"
  title={`Switch to ${$theme === 'dark' ? 'Day (Light)' : 'Night (Dark)'} mode`}
>
  <div
    class="absolute -inset-1 rounded-full bg-radial from-amber-400/40 dark:from-indigo-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
  ></div>
  <div bind:this={iconWrapEl} class="relative z-10 flex items-center justify-center transition-transform duration-450">
    {#if $theme === "dark"}
      <!-- Sun icon for Dark Mode -->
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="text-amber-400"
      >
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
    {:else}
      <!-- Moon icon for Light Mode -->
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="text-sky-700"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    {/if}
  </div>
</button>
