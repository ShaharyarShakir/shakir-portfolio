<script lang="ts">
  import { onMount, onDestroy } from "svelte";

  const roles = [
    "DevOps Engineer",
    "MLOps Engineer",
    "React Native Dev",
    "Full Stack Dev",
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
  });
  onDestroy(() => clearTimeout(timer));
</script>

<section class="hero">
  <h1 class="hero-name">Shaharyar Shakir</h1>

  <div class="hero-role-line">
    <span class="hero-role-prefix">I'm a</span>
    <span class="hero-role-badge">
      <span>{displayed}</span>
      <span class="cursor" aria-hidden="true"></span>
    </span>
  </div>

  <p class="hero-desc">
    I build <strong>scalable infrastructure</strong>,
    <strong>ML pipelines</strong>, and <strong>production apps</strong> — from cloud
    deployments to mobile. Clean code. Fast delivery.
  </p>
</section>

<style>
  .hero {
    padding: 3rem 0 2rem;
  }

  .hero-name {
    font-size: clamp(2.4rem, 6vw, 3.6rem);
    font-weight: 700;
    color: var(--text-primary);
    line-height: 1.1;
    letter-spacing: -0.02em;
    margin: 0 0 0.6rem;
  }

  .hero-role-line {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 1.6rem;
    min-height: 40px;
  }

  .hero-role-prefix {
    font-size: 1.1rem;
    color: var(--text-muted);
    font-weight: 400;
    white-space: nowrap;
  }

  .hero-role-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 5px 16px;
    border-radius: 100px;
    border: 1.5px solid var(--border);
    background: var(--bg-outer);
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--text-primary);
    min-width: 190px;
  }

  .cursor {
    display: inline-block;
    width: 2px;
    height: 1em;
    background: var(--text-primary);
    margin-left: 1px;
    vertical-align: middle;
    animation: blink 0.8s step-end infinite;
    flex-shrink: 0;
  }

  @keyframes blink {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
  }

  .hero-desc {
    font-size: 1.05rem;
    line-height: 1.75;
    color: var(--text-secondary);
    max-width: 520px;
    margin: 0;
  }

  .hero-desc strong {
    color: var(--text-primary);
    font-weight: 600;
  }
</style>
