import { parseMarkdown } from './parseMarkdown';

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  html: string;
  readingTime: number;
};

const files = import.meta.glob('/src/content/blog/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

console.log('glob files:', files); // add this

function parseFrontmatter(raw: string): { meta: Record<string, any>; body: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw };

  const meta: Record<string, any> = {};
  match[1].split('\n').forEach(line => {
    const [key, ...rest] = line.split(':');
    if (!key?.trim()) return;
    const val = rest.join(':').trim();
    if (val.startsWith('[') && val.endsWith(']')) {
      meta[key.trim()] = val.slice(1, -1).split(',').map(s => s.trim());
    } else {
      meta[key.trim()] = val;
    }
  });

  return { meta, body: match[2] };
}

function readingTime(text: string): number {
  return Math.ceil(text.trim().split(/\s+/).length / 200);
}

export function getAllPosts(): Omit<BlogPost, 'html'>[] {
  return Object.entries(files)
    .map(([path, raw]) => {
      const slug = path.split('/').pop()!.replace('.md', '');
      const { meta, body } = parseFrontmatter(raw as string);
      return {
        slug,
        title: meta.title ?? slug,
        date: meta.date ?? '',
        description: meta.description ?? '',
        tags: meta.tags ?? [],
        readingTime: readingTime(body),
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPost(slug: string): BlogPost | null {
  const entry = Object.entries(files).find(([p]) => p.endsWith(`/${slug}.md`));
  if (!entry) return null;

  const { meta, body } = parseFrontmatter(entry[1] as string);
  return {
    slug,
    title: meta.title ?? slug,
    date: meta.date ?? '',
    description: meta.description ?? '',
    tags: meta.tags ?? [],
    readingTime: readingTime(body),
    html: parseMarkdown(body),
  };
}