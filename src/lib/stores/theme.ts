import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const stored = browser ? localStorage.getItem('theme') : null;
const prefersDark = browser ? window.matchMedia('(prefers-color-scheme: dark)').matches : false;
const initial = stored ?? (prefersDark ? 'dark' : 'light');

export const theme = writable<'light' | 'dark'>(initial as 'light' | 'dark');

theme.subscribe(val => {
  if (browser) {
    localStorage.setItem('theme', val);
    document.documentElement.classList.toggle('dark', val === 'dark');
  }
});