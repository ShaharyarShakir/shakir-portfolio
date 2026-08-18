import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type Theme = 'light' | 'dark';

const stored = browser ? (localStorage.getItem('theme') as Theme | null) : null;
const prefersDark = browser ? window.matchMedia('(prefers-color-scheme: dark)').matches : false;
const initial: Theme = stored ?? (prefersDark ? 'dark' : 'light');

export const theme = writable<Theme>(initial);

theme.subscribe((val) => {
  if (browser) {
    localStorage.setItem('theme', val);
    document.documentElement.classList.toggle('dark', val === 'dark');
  }
});