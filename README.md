# Shaharyar Shakir — Developer Portfolio

<p align="left">
  <a href="https://portfolio.shaharyarshakir.workers.dev/"><img src="https://img.shields.io/badge/Live_Demo-shaharyarshakir.dev-00C7B7?style=for-the-badge&logo=cloudflare&logoColor=white" alt="Live Demo" /></a>
  <a href="https://svelte.dev/"><img src="https://img.shields.io/badge/SvelteKit_3-FF3E00?style=for-the-badge&logo=svelte&logoColor=white" alt="SvelteKit 3" /></a>
  <a href="https://threejs.org/"><img src="https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white" alt="Three.js" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" /></a>
  <a href="https://bun.sh/"><img src="https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=bun&logoColor=white" alt="Bun" /></a>
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge" alt="License" />
</p>

A modern, high-performance developer portfolio built with **SvelteKit 3**, **Three.js 3D WebGL Space Atmosphere**, **Tailwind CSS v4**, **TypeScript**, and **Bun**, deployed globally on **Cloudflare Workers**.

---

## ⚡ Tech Stack

| Technology | Badge | Description |
| :--- | :--- | :--- |
| **SvelteKit 3** | <img src="https://img.shields.io/badge/SvelteKit_3-FF3E00?style=flat-square&logo=svelte&logoColor=white" alt="SvelteKit 3" /> | Modern reactive framework using Svelte Runes (`$state`, `$props`, `$derived`) |
| **Three.js** | <img src="https://img.shields.io/badge/Three.js-000000?style=flat-square&logo=three.js&logoColor=white" alt="Three.js" /> | Procedural 3D WebGL space atmosphere with floating astronaut & lava planet |
| **TypeScript** | <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" /> | Strictly typed codebase & interfaces |
| **Tailwind CSS v4** | <img src="https://img.shields.io/badge/Tailwind_v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" /> | Utility-first CSS & custom design tokens |
| **Cloudflare Workers** | <img src="https://img.shields.io/badge/Cloudflare_Workers-F38020?style=flat-square&logo=cloudflare&logoColor=white" alt="Cloudflare Workers" /> | Global edge serverless deployment |
| **Bun** | <img src="https://img.shields.io/badge/Bun-000000?style=flat-square&logo=bun&logoColor=white" alt="Bun" /> | High-speed JavaScript runtime & package manager |

---

## ✨ Features & Highlights

- 🌌 **3D Space Atmosphere**: Procedural 3D WebGL environment rendering a molten lava centerpiece planet, floating 3D astronaut, crater moons, starfield particles, and cursor parallax.
- 🎨 **Minimalist & Modern Aesthetic**: Clean typography, subtle micro-animations, theme toggle (Dark / Light mode).
- 🧩 **Modular Data & UI Architecture**: Clean separation between static content (`src/lib/data/`), reusable UI components (`src/components/`), and file-based routes (`src/routes/`).
- ⏱️ **Interactive Journey Timeline**: Responsive timeline showcasing career milestones, experience, and tech tags.
- 📁 **Project Showcase**: Rich project collection featuring tech stack badges, live app demos, and GitHub repository links.
- 📝 **Markdown Blog Engine**: Render markdown technical posts dynamically with syntax highlighting for code blocks.
- ✉️ **Contact Form Integration**: Interactive contact form powered by Formspree with status handling.
- ⚡ **Lightning Fast Load Times**: Built as an optimized bundle for Cloudflare's edge network.

---

## 📁 Project Structure

```
shakir-portfolio/
├── static/
│   ├── images/                # Static images & project screenshots
│   └── portfolio-preview.png  # Portfolio visual preview
├── src/
│   ├── components/            # Reusable UI & 3D WebGL components
│   │   ├── AmbientBackground.svelte # Background space atmosphere host
│   │   ├── ContactForm.svelte   # Contact form with state & submission logic
│   │   ├── Currently.svelte     # Current status grid (studies, focus, location)
│   │   ├── Footer.svelte        # Site footer & copyright
│   │   ├── Hero.svelte          # Homepage hero header & typing role animation
│   │   ├── Navbar.svelte        # Navigation bar & route active states
│   │   ├── ProjectCard.svelte   # Project card item
│   │   ├── ProjectGrid.svelte   # Project grid layout
│   │   ├── SEO.svelte           # Meta tags & JSON-LD structured data
│   │   ├── SocialGrid.svelte    # Interactive social links
│   │   ├── SpaceCanvas.svelte   # Three.js 3D space scene & floating astronaut
│   │   ├── TechScroll.svelte    # Animated technology stack carousel
│   │   ├── Timeline.svelte      # Experience & journey timeline
│   │   └── ThemeToggle.svelte   # Dark / Light theme switcher
│   ├── content/
│   │   └── blog/                # Markdown blog posts
│   ├── lib/
│   │   ├── data/                # Strongly-typed static content modules
│   │   │   ├── profile.ts       # Bio, timeline entries, status items
│   │   │   ├── projects.ts      # Project collection & metadata
│   │   │   └── socials.ts       # Social channels & icons
│   │   ├── stores/              # Theme store & app state
│   │   └── utils/               # Markdown parser & blog utilities
│   ├── routes/                  # SvelteKit file-based router
│   │   ├── +layout.svelte       # App layout wrapper & global styling
│   │   ├── +page.svelte         # Home page (`/`)
│   │   ├── about/               # About page (`/about`)
│   │   ├── project/             # Projects showcase page (`/project`)
│   │   ├── blog/                # Blog listing & single post pages (`/blog`)
│   │   └── contact/             # Contact page (`/contact`)
│   └── app.css                  # Global design tokens & styling
├── svelte.config.js             # Svelte configuration
├── vite.config.ts               # Vite configuration & plugin setup
└── package.json                 # Project dependencies & scripts
```

---

## 🛠️ Local Development & Scripts

```bash
# Install dependencies
bun install

# Start local dev server
bun dev

# Run Svelte & TypeScript diagnostic checks
bun run check

# Run ESLint fix
bun run lint:fix

# Build for production
bun run build
```

---

## 📄 License

MIT © [Shaharyar Shakir](https://github.com/ShaharyarShakir)
