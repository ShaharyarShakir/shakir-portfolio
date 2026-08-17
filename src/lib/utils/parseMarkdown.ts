import { marked } from 'marked';
import hljs from 'highlight.js';

const renderer = new marked.Renderer();

renderer.heading = ({ text, depth }: { text: string; depth: number }) => {
  const slug = text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
  return `<h${depth} id="${slug}">${text}</h${depth}>`;
};

renderer.code = ({ text, lang }: { text: string; lang?: string }) => {
  const language = lang && hljs.getLanguage(lang) ? lang : 'plaintext';
  const highlighted = hljs.highlight(text, { language }).value;

  return `
    <div class="code-block">
      <div class="code-header">
        <span class="code-lang">${language}</span>
        <button class="copy-btn" data-code="${encodeURIComponent(text)}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
          <span>copy</span>
        </button>
      </div>
      <pre><code class="hljs language-${language}">${highlighted}</code></pre>
    </div>
  `;
};

marked.setOptions({ renderer });

export function parseMarkdown(md: string): string {
  return marked(md) as string;
}

export type TocItem = {
  id: string;
  text: string;
  level: number;
};

export function extractToc(html: string): TocItem[] {
  const headings: TocItem[] = [];
  const regex = /<h([23])\s+id="([^"]+)">([\s\S]*?)<\/h[23]>/gi;
  let match;

  while ((match = regex.exec(html)) !== null) {
    headings.push({
      level: parseInt(match[1], 10),
      id: match[2],
      text: match[3].replace(/<[^>]+>/g, '').trim(),
    });
  }

  return headings;
}