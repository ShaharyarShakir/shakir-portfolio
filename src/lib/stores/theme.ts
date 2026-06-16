import { writable } from 'svelte/store';

const stored = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const initial = stored ?? (prefersDark ? 'dark' : 'light');

export const theme = writable<'light' | 'dark'>(initial as 'light' | 'dark');

theme.subscribe(val => {
  localStorage.setItem('theme', val);
  document.documentElement.classList.toggle('dark', val === 'dark');
});