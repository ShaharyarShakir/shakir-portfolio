<script lang="ts">
  import { p } from "sv-router/generated";

  let { scrolled = false } = $props<{ scrolled?: boolean }>();

  let drawerOpen = $state(false);

  function toggleDrawer() {
    drawerOpen = !drawerOpen;
  }
  function closeDrawer() {
    drawerOpen = false;
  }
</script>

<!-- Navbar -->
<div
  class="top-0 right-0 left-0 z-50 fixed flex justify-center pointer-events-none"
>
  <div class="px-4 pt-2 w-full max-w-4xl pointer-events-auto">
    <nav class={`navbar-base ${scrolled ? "navbar-glass" : "navbar-expanded"}`}>
      <!-- Logo -->
      <a href="/" aria-label="Pixel avatar">
        <canvas
          class="rounded-full"
          role="img"
          width="53"
          height="53"
          style="width:40px;height:40px"
        ></canvas>
      </a>

      <!-- Desktop links -->
      <div class="hidden md:flex gap-6" style="color: var(--text-secondary)">
        <a href={p("/about")}>About</a>
        <a href={p("/project")}>Projects</a>
        <a href={p("/blog")}>Blog</a>
        <a href={p("/contact")}>Contact</a>
      </div>

      <!-- Mobile hamburger -->
      <button
        class="nav-menu-btn"
        onclick={toggleDrawer}
        aria-label="Open navigation"
      >
        <svg width="22" height="18" viewBox="0 0 22 18" fill="none">
          <line
            x1="1"
            y1="3"
            x2="21"
            y2="3"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
          <line
            x1="1"
            y1="9"
            x2="21"
            y2="9"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
          <line
            x1="1"
            y1="15"
            x2="21"
            y2="15"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </button>
    </nav>
  </div>
</div>

<!-- Backdrop -->
<button
  class={`drawer-overlay ${drawerOpen ? "drawer-open" : ""}`}
  onclick={closeDrawer}
  aria-label="Close navigation"
></button>

<!-- Drawer -->
<div class={`drawer-panel ${drawerOpen ? "drawer-open" : ""}`}>
  <!-- X close button -->
  <button
    class="drawer-close-btn"
    onclick={closeDrawer}
    aria-label="Close navigation"
  >
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <line
        x1="2"
        y1="2"
        x2="18"
        y2="18"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      />
      <line
        x1="18"
        y1="2"
        x2="2"
        y2="18"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      />
    </svg>
  </button>

  <!-- Drawer links -->
  <nav class="drawer-links">
    <a href={p("/about")} onclick={closeDrawer}>
      About
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path
          d="M3 7h8M7 3l4 4-4 4"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </a>
    <a href={p("/project")} onclick={closeDrawer}>
      Projects
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path
          d="M3 7h8M7 3l4 4-4 4"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </a>
    <a href={p("/blog")} onclick={closeDrawer}>
      Blog
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path
          d="M3 7h8M7 3l4 4-4 4"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </a>
    <a href={p("/contact")} onclick={closeDrawer}>
      Contact
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path
          d="M3 7h8M7 3l4 4-4 4"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </a>
  </nav>
</div>
