<script lang="ts">
  const techs = [
    { icon: 'https://cdn.simpleicons.org/docker', label: 'Docker' },
    { icon: 'https://cdn.simpleicons.org/kubernetes', label: 'Kubernetes' },
    { icon: 'https://cdn.simpleicons.org/cloudflareworkers', label: 'Cloudflare' },
    { icon: 'https://cdn.simpleicons.org/jenkins', label: 'Jenkins' },
    { icon: 'https://cdn.simpleicons.org/terraform', label: 'Terraform' },
    { icon: 'https://cdn.simpleicons.org/python', label: 'Python' },
    { icon: 'https://cdn.simpleicons.org/mlflow', label: 'MLflow' },
    { icon: 'https://cdn.simpleicons.org/dvc', label: 'DVC' },
    { icon: 'https://cdn.simpleicons.org/fastapi', label: 'FastAPI' },
    { icon: 'https://cdn.simpleicons.org/react', label: 'React' },
    { icon: 'https://cdn.simpleicons.org/typescript', label: 'TypeScript' },
    { icon: 'https://cdn.simpleicons.org/nextdotjs', label: 'Next.js' },
    { icon: 'https://cdn.simpleicons.org/postgresql', label: 'PostgreSQL' },
    { icon: 'https://cdn.simpleicons.org/mongodb', label: 'MongoDB' },
    { icon: 'https://cdn.simpleicons.org/supabase', label: 'Supabase' },
    { icon: 'https://cdn.simpleicons.org/redis', label: 'Redis' },
    { icon: 'https://cdn.simpleicons.org/nginx', label: 'Nginx' },
    { icon: 'https://cdn.simpleicons.org/git', label: 'Git' },
  ];

  const track = [...techs, ...techs];
</script>

<section class="my-12">
  <p class="text-xs font-semibold tracking-widest uppercase text-slate-500 dark:text-slate-400 mb-5">
    stack
  </p>

  <div class="relative overflow-hidden">
    <!-- left + right blur gradient masks -->
    <div class="absolute top-0 bottom-0 left-0 w-28 z-10 pointer-events-none bg-gradient-to-r from-slate-100 dark:from-slate-950 to-transparent"></div>
    <div class="absolute top-0 bottom-0 right-0 w-28 z-10 pointer-events-none bg-gradient-to-l from-slate-100 dark:from-slate-950 to-transparent"></div>

    <div class="flex gap-2.5 w-max py-2 animate-scroll-left hover:[animation-play-state:paused]">
      {#each track as tech}
        <div
          class="badge badge-lg gap-2 py-3 px-3.5 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-sky-300/40 dark:border-amber-400/20 text-slate-800 dark:text-slate-200 font-semibold shadow-xs hover:-translate-y-1 hover:scale-105 hover:border-indigo-400 dark:hover:border-amber-400 transition-all duration-300 group cursor-default"
        >
          <img src={tech.icon} alt={tech.label} width="18" height="18" class="rounded group-hover:rotate-6 group-hover:scale-115 transition-transform" />
          <span class="text-xs tracking-wide">{tech.label}</span>
        </div>
      {/each}
    </div>
  </div>
</section>