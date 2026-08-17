<script lang="ts">
  import BlogSidebar from './BlogSidebar.svelte';
  import type { TocItem } from '$lib/utils/parseMarkdown';

  interface Props {
    toc: TocItem[];
  }

  let { toc }: Props = $props();
</script>

<BlogSidebar {toc} />
