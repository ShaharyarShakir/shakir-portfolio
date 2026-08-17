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

<!-- Navbar -->

<div
  class="top-0 right-0 left-0 z-50 fixed flex justify-center pointer-events-none"
>
  <div class="px-4 pt-2 w-full max-w-4xl pointer-events-auto">
    <nav class={`navbar-base ${scrolled ? "navbar-glass" : "navbar-expanded"}`}>
      <!-- Logo / Avatar with Animated Aura -->
      <a href="/" aria-label="Home" class="nav-logo group">
        <div class={`avatar-wrapper ${scrolled ? "scrolled" : ""}`}>
          <div class="avatar-aura"></div>
          <img
            src="/images/avatar.jpg"
            alt="Shaharyar Shakir"
            class="nav-avatar"
          />
          <span class="status-indicator" title="Available for work"></span>
        </div>
      </a>

      <!-- Desktop links -->
      <div class="hidden md:flex gap-6 items-center" style="color: var(--text-secondary)">
        <a href="/about" class="nav-link">About</a>
        <a href="/project" class="nav-link">Projects</a>
        <a href="/blog" class="nav-link">Blog</a>
        <a href="/contact" class="nav-link">Contact</a>
        <ThemeToggle />
      </div>

      <!-- Mobile hamburger -->
      <div class="md:hidden flex items-center gap-2">
        <ThemeToggle />
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
      </div>
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
    <a href="/about" onclick={closeDrawer}>
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
    <a href="/project" onclick={closeDrawer}>
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
    <a href="/blog" onclick={closeDrawer}>
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
    <a href="/contact" onclick={closeDrawer}>
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

<style>
  .nav-logo {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    text-decoration: none;
  }

  .avatar-wrapper {
    position: relative;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .avatar-wrapper.scrolled {
    width: 36px;
    height: 36px;
  }

  .avatar-aura {
    position: absolute;
    inset: -3px;
    border-radius: 50%;
    background: linear-gradient(135deg, #6366f1, #a855f7, #ec4899);
    opacity: 0.45;
    filter: blur(4px);
    transition: opacity 0.3s ease, filter 0.3s ease, transform 0.3s ease;
    animation: aura-spin 8s linear infinite;
  }

  .avatar-wrapper:hover .avatar-aura {
    opacity: 0.95;
    filter: blur(7px);
    transform: scale(1.18);
  }

  .nav-avatar {
    position: relative;
    z-index: 2;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid var(--bg-card);
    display: block;

    /* Entrance animation */
    animation: avatar-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;

    transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
                border-color 0.3s ease,
                box-shadow 0.35s ease;
  }

  .avatar-wrapper:hover .nav-avatar {
    transform: scale(1.1) rotate(5deg);
    border-color: var(--text-primary);
    box-shadow: 0 6px 20px rgba(99, 102, 241, 0.35);
  }

  .status-indicator {
    position: absolute;
    bottom: 1px;
    right: 1px;
    z-index: 3;
    width: 10px;
    height: 10px;
    background-color: #22c55e;
    border: 2px solid var(--bg-card);
    border-radius: 50%;
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.6);
    animation: status-pulse 2.2s ease-in-out infinite;
    transition: transform 0.3s ease;
  }

  .avatar-wrapper.scrolled .status-indicator {
    width: 8px;
    height: 8px;
    bottom: -1px;
    right: -1px;
  }

  .nav-link {
    position: relative;
    text-decoration: none;
    font-size: 0.925rem;
    font-weight: 500;
    color: var(--text-secondary);
    transition: color 0.25s ease;
  }

  .nav-link:hover {
    color: var(--text-primary);
  }

  .nav-link::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -3px;
    width: 0%;
    height: 2px;
    background: linear-gradient(90deg, #6366f1, #a855f7);
    border-radius: 2px;
    transition: width 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .nav-link:hover::after {
    width: 100%;
  }

  @keyframes aura-spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes status-pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.6);
    }
    70% {
      box-shadow: 0 0 0 6px rgba(34, 197, 94, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
    }
  }

  @keyframes avatar-in {
    from {
      opacity: 0;
      transform: scale(0.6) rotate(-10deg);
    }
    to {
      opacity: 1;
      transform: scale(1) rotate(0deg);
    }
  }
</style>
