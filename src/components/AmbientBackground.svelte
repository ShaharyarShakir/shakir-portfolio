<script lang="ts">
  import { onMount } from "svelte";

  let mouseX = $state(0);
  let mouseY = $state(0);
  let isHovered = $state(false);
  let canvasEl: HTMLCanvasElement | undefined = $state();
  let isDark = $state(false);

  function handleMouseMove(e: MouseEvent) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    isHovered = true;
  }

  onMount(() => {
    const updateTheme = () => {
      isDark = document.documentElement.classList.contains("dark");
    };
    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    if (!canvasEl) return;
    const ctx = canvasEl.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvasEl.width = window.innerWidth);
    let height = (canvasEl.height = window.innerHeight);

    const handleResize = () => {
      if (!canvasEl) return;
      width = canvasEl.width = window.innerWidth;
      height = canvasEl.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const numParticles = 30;
    const particles = Array.from({ length: numParticles }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 1.5 + 1
    }));

    function render() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      // Only render constellation particle animation in dark mode to keep light mode clean & pristine
      if (isDark) {
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
          ctx.fill();

          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 120) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `rgba(255, 255, 255, ${0.12 * (1 - dist / 120)})`;
              ctx.lineWidth = 0.8;
              ctx.stroke();
            }
          }

          if (isHovered) {
            const dx = p.x - mouseX;
            const dy = p.y - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 150) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(mouseX, mouseY);
              ctx.strokeStyle = `rgba(99, 102, 241, ${0.25 * (1 - dist / 150)})`;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          }
        }
      }

      animId = requestAnimationFrame(render);
    }

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
      cancelAnimationFrame(animId);
    };
  });
</script>

<svelte:window onmousemove={handleMouseMove} />

<div class="ambient-bg-wrapper" aria-hidden="true">
  <canvas bind:this={canvasEl} class="interactive-canvas"></canvas>

  <!-- Clean Architectural Diagonal Stripe Pattern -->
  <div class="diagonal-stripe-pattern"></div>

  {#if isHovered}
    <div
      class="soft-spotlight"
      style="transform: translate3d({mouseX - 250}px, {mouseY - 250}px, 0);"
    ></div>
  {/if}

  <div class="ambient-orb orb-1"></div>
  <div class="ambient-orb orb-2"></div>

  <!-- Left Side Wing -->
  <div class="side-wing wing-left">
    <div class="guide-rail">
      <div class="pulse-line"></div>
    </div>

    <div class="wing-content">
      <!-- Tech Ruler Widget -->
      <div class="ruler-widget">
        {#each Array(16) as _, i}
          <div class="ruler-tick" class:tick-major={i % 4 === 0}>
            {#if i % 4 === 0}
              <span class="tick-label">0{i}</span>
            {/if}
          </div>
        {/each}
      </div>

      <!-- Status Badge -->
      <div class="glass-badge">
        <span class="status-pulse-dot"></span>
        <span class="badge-label">SYS // ONLINE</span>
      </div>

      <!-- Rotating Wireframe Diamond -->
      <div class="wireframe-square"></div>

      <!-- Dot Matrix Panel -->
      <div class="dot-matrix-widget"></div>
    </div>
  </div>

  <!-- Right Side Wing -->
  <div class="side-wing wing-right">
    <div class="guide-rail">
      <div class="pulse-line reverse"></div>
    </div>

    <div class="wing-content align-right">
      <!-- Badge -->
      <div class="glass-badge">
        <span class="badge-label">SHAKIR.DEV</span>
      </div>

      <!-- Stack Pills Column -->
      <div class="stack-column">
        <span class="stack-pill">SVELTE 5</span>
        <span class="stack-pill">TYPESCRIPT</span>
        <span class="stack-pill">TAILWIND</span>
      </div>

      <!-- Target Crosshair -->
      <div class="target-widget">
        <div class="target-ring"></div>
        <div class="target-center"></div>
      </div>

      <!-- Equalizer Bar Widget -->
      <div class="equalizer-widget">
        <div class="eq-bar bar-1"></div>
        <div class="eq-bar bar-2"></div>
        <div class="eq-bar bar-3"></div>
        <div class="eq-bar bar-4"></div>
      </div>
    </div>
  </div>
</div>

<style>
  .ambient-bg-wrapper {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    overflow: hidden;
  }

  .interactive-canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }

  /* ── 1. Clean Crisp Diagonal Stripe Hatch Pattern ── */
  .diagonal-stripe-pattern {
    position: absolute;
    inset: 0;
    background-image: repeating-linear-gradient(
      -45deg,
      rgba(0, 0, 0, 0.035) 0px,
      rgba(0, 0, 0, 0.035) 1.5px,
      transparent 1.5px,
      transparent 12px
    );
    opacity: 0.85;
  }

  :global(.dark) .diagonal-stripe-pattern {
    background-image: repeating-linear-gradient(
      -45deg,
      rgba(255, 255, 255, 0.03) 0px,
      rgba(255, 255, 255, 0.03) 1.5px,
      transparent 1.5px,
      transparent 12px
    );
    opacity: 0.65;
  }

  /* ── Soft Cursor Spotlight ── */
  .soft-spotlight {
    position: absolute;
    top: 0;
    left: 0;
    width: 500px;
    height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(99, 102, 241, 0.06) 0%, rgba(244, 114, 182, 0.02) 40%, transparent 70%);
    filter: blur(40px);
    transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  }

  :global(.dark) .soft-spotlight {
    background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(236, 72, 153, 0.05) 45%, transparent 70%);
  }

  /* ── Ambient Glow Orbs ── */
  .ambient-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(110px);
    opacity: 0.35;
    pointer-events: none;
  }

  .orb-1 {
    top: -10%;
    left: -5%;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%);
  }

  .orb-2 {
    top: 50%;
    right: -5%;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(52, 211, 153, 0.08) 0%, transparent 70%);
  }

  :global(.dark) .ambient-orb { opacity: 0.3; }
  :global(.dark) .orb-1 { background: radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%); }
  :global(.dark) .orb-2 { background: radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, transparent 70%); }

  /* ── Side Pattern Wings ── */
  .side-wing {
    position: absolute;
    top: 0;
    bottom: 0;
    width: clamp(140px, 15vw, 220px);
    z-index: 2;
    display: none;
    color: var(--text-muted);
  }

  @media (min-width: 1100px) {
    .side-wing {
      display: block;
    }
  }

  .wing-left { left: 0; }
  .wing-right { right: 0; }

  /* ── Minimal Guide Rail ── */
  .guide-rail {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 1px;
    background: var(--border);
    opacity: 0.5;
  }

  .wing-left .guide-rail { right: 12px; }
  .wing-right .guide-rail { left: 12px; }

  .pulse-line {
    position: absolute;
    left: -1px;
    width: 3px;
    height: 120px;
    background: linear-gradient(180deg, transparent, rgba(0,0,0,0.15), transparent);
    animation: rail-sweep 18s ease-in-out infinite;
  }

  :global(.dark) .pulse-line {
    background: linear-gradient(180deg, transparent, var(--text-primary), transparent);
    opacity: 0.35;
  }

  .pulse-line.reverse { animation-delay: -9s; }

  @keyframes rail-sweep {
    0% { top: -120px; }
    100% { top: 100%; }
  }

  .wing-content {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    padding: 70px 24px;
    align-items: flex-start;
  }

  .wing-content.align-right { align-items: flex-end; }

  /* ── Minimalist Ruler ── */
  .ruler-widget {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding-left: 6px;
  }

  .ruler-tick {
    position: relative;
    width: 8px;
    height: 1px;
    background-color: var(--text-muted);
    opacity: 0.35;
  }

  .ruler-tick.tick-major {
    width: 14px;
    opacity: 0.65;
    background-color: var(--text-primary);
  }

  .tick-label {
    position: absolute;
    left: 20px;
    top: -6px;
    font-family: monospace;
    font-size: 9px;
    color: var(--text-muted);
    letter-spacing: 0.05em;
  }

  /* ── Glass Badge ── */
  .glass-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 11px;
    border-radius: 9999px;
    background: rgba(255, 255, 255, 0.7);
    border: 1px solid var(--border);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    font-family: monospace;
    font-size: 10px;
    letter-spacing: 0.08em;
    color: var(--text-secondary);
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.03);
  }

  :global(.dark) .glass-badge {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.08);
    color: var(--text-muted);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  }

  .status-pulse-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #10B981;
    box-shadow: 0 0 6px #10B981;
    animation: dot-pulse 2s infinite;
  }

  @keyframes dot-pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(0.75); opacity: 0.4; }
  }

  .wireframe-square {
    width: 20px;
    height: 20px;
    border: 1px solid var(--text-muted);
    opacity: 0.35;
    transform: rotate(45deg);
    animation: rotate-square 16s linear infinite;
  }

  @keyframes rotate-square {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .dot-matrix-widget {
    width: 65px;
    height: 40px;
    background-image: radial-gradient(circle, var(--text-muted) 1px, transparent 1px);
    background-size: 8px 8px;
    opacity: 0.25;
    border-radius: 4px;
    mask-image: linear-gradient(135deg, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%);
    -webkit-mask-image: linear-gradient(135deg, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%);
  }

  .stack-column {
    display: flex;
    flex-direction: column;
    gap: 6px;
    align-items: flex-end;
  }

  .stack-pill {
    font-family: monospace;
    font-size: 9px;
    letter-spacing: 0.08em;
    padding: 3px 8px;
    border-radius: 4px;
    background: rgba(0, 0, 0, 0.03);
    border: 1px solid var(--border);
    color: var(--text-secondary);
  }

  :global(.dark) .stack-pill {
    background: rgba(255, 255, 255, 0.04);
    border-color: rgba(255, 255, 255, 0.08);
    color: var(--text-muted);
  }

  .target-widget {
    position: relative;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .target-ring {
    position: absolute;
    inset: 0;
    border: 1px stroke var(--border);
    border-top-color: var(--text-primary);
    border-radius: 50%;
    opacity: 0.4;
    animation: rotate-square 14s linear infinite;
  }

  .target-center {
    width: 4px;
    height: 4px;
    background-color: var(--text-primary);
    border-radius: 50%;
    opacity: 0.5;
  }

  .equalizer-widget {
    display: flex;
    align-items: flex-end;
    gap: 3px;
    height: 15px;
    padding: 3px 6px;
    border-radius: 4px;
    background: rgba(0, 0, 0, 0.02);
    border: 1px solid var(--border);
  }

  :global(.dark) .equalizer-widget {
    background: rgba(255, 255, 255, 0.03);
  }

  .eq-bar {
    width: 2px;
    background-color: var(--text-muted);
    border-radius: 1px;
    animation: eq-pulse 1.4s ease-in-out infinite alternate;
  }

  .bar-1 { height: 40%; animation-delay: 0.1s; }
  .bar-2 { height: 80%; animation-delay: 0.35s; }
  .bar-3 { height: 100%; animation-delay: 0.2s; }
  .bar-4 { height: 60%; animation-delay: 0.45s; }

  @keyframes eq-pulse {
    0% { height: 25%; }
    100% { height: 100%; }
  }
</style>
