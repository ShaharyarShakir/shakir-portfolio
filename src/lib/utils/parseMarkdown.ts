import { marked } from 'marked';
import hljs from 'highlight.js';

const renderer = new marked.Renderer();

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