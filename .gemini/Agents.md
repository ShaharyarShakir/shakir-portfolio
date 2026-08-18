I have an existing SvelteKit portfolio project. I want you to transform the existing portfolio into a polished, premium interactive "Day ↔ Night" experience using Three.js and GSAP.

IMPORTANT:
- Do NOT rebuild the project from scratch.
- Do NOT replace the existing portfolio design/content.
- Preserve all existing routes, components, blog posts, projects, data, SEO, and functionality.
- Inspect the existing codebase first and understand how the current components work before making changes.
- Reuse and improve the existing 3D components instead of creating a completely separate architecture.
- Keep the implementation production-ready, performant, responsive, accessible, and maintainable.

CURRENT STRUCTURE:

src/
├── components/
│   ├── 3d/
│   │   ├── CelestialCanvas.svelte
│   │   ├── GalaxyScene.svelte
│   │   └── SunlightScene.svelte
│   ├── AmbientBackground.svelte
│   ├── ContactForm.svelte
│   ├── Currently.svelte
│   ├── Footer.svelte
│   ├── Hero.svelte
│   ├── Navbar.svelte
│   ├── ProjectCard.svelte
│   ├── ProjectGrid.svelte
│   ├── SEO.svelte
│   ├── SocialGrid.svelte
│   ├── TechScroll.svelte
│   ├── ThemeToggle.svelte
│   ├── Timeline.svelte
│   └── ToastContainer.svelte
│
├── content/blog/
├── lib/
│   ├── data/
│   ├── icons/
│   ├── stores/
│   │   ├── theme.ts
│   │   └── toast.ts
│   └── utils/
│
├── routes/
│   ├── about/
│   ├── blog/
│   ├── contact/
│   ├── project/
│   └── +page.svelte
│
static/
├── images/
└── portfolio-preview.png

TECHNOLOGY:
- SvelteKit
- TypeScript
- Three.js
- GSAP
- bun as a package manager
- Existing Svelte stores
- Existing CSS
- Use ScrollTrigger where appropriate
- Do not introduce unnecessary frameworks or libraries

==================================================
CORE CONCEPT
==================================================

Turn the entire portfolio into a "living day/night world".

LIGHT MODE = DAY
DARK MODE = NIGHT

The theme should affect much more than CSS.

Light mode should feel like:
- sunrise/daytime
- soft blue sky
- warm sunlight
- glowing sun
- subtle atmosphere
- tiny floating dust particles
- soft shadows
- calm movement
- bright, clean, premium UI

Dark mode should feel like:
- nighttime
- deep blue/black space
- stars
- galaxy
- nebula
- moon
- subtle cosmic particles
- occasional shooting stars
- atmospheric glow
- premium futuristic UI

The portfolio should feel like the user is moving through a real celestial environment.

Do NOT make the effect overly flashy.
The aesthetic should be:
- premium
- cinematic
- minimal
- elegant
- futuristic
- technical
- immersive

The 3D scene must support the content rather than overpower it.

