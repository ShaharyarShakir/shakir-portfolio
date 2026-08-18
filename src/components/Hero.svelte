<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { animateCardEntrance } from "$lib/animations/gsap";

  const roles = [
    "DevOps Engineer",
    "MLOps Engineer",
    "React Native Engineer",
    "Full Stack Engineer",
    "Freelance Contractor",
  ];

  let displayed = $state("");
  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;
  let timer: ReturnType<typeof setTimeout>;

  const TYPE_SPEED = 70;
  const DELETE_SPEED = 40;
  const PAUSE_END = 1800;
  const PAUSE_START = 300;

  function tick() {
    const current = roles[roleIndex];

    if (!deleting) {
      charIndex++;
      displayed = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        timer = setTimeout(tick, PAUSE_END);
        return;
      }
    } else {
      charIndex--;
      displayed = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        timer = setTimeout(tick, PAUSE_START);
        return;
      }
    }

    timer = setTimeout(tick, deleting ? DELETE_SPEED : TYPE_SPEED);
  }

  onMount(() => {
    timer = setTimeout(tick, 500);
    animateCardEntrance(".hero-section");
  });
  onDestroy(() => clearTimeout(timer));
</script>

<section class="hero-section flex flex-col py-12">
  <h1 class="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[var(--text-primary)] tracking-tight leading-tight mb-3">
    Shaharyar Shakir
  </h1>

  <div class="flex items-center gap-3 mb-6 min-h-10">
    <span class="text-base text-[var(--text-muted)] font-normal whitespace-nowrap">I'm a</span>
    <span
      class="inline-flex items-center gap-1.5 py-1.5 px-4 rounded-full bg-[var(--bg-card)] backdrop-blur-md border border-[var(--border)] text-[var(--text-primary)] text-sm font-semibold shadow-sm min-w-48"
    >
      <span>{displayed}</span>
      <span class="inline-block w-0.5 h-4 bg-[var(--text-primary)] animate-pulse ml-0.5"></span>
    </span>
  </div>

  <p class="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-xl m-0">
    I build <span class="font-semibold text-[var(--text-primary)]">Scalable Infrastructure</span>,
    <span class="font-semibold text-[var(--text-primary)]">ML pipelines</span>, and
    <span class="font-semibold text-[var(--text-primary)]">Production Apps</span> — from Cloud deployments to Mobile.
    Clean code. Fast delivery.
  </p>
</section>
