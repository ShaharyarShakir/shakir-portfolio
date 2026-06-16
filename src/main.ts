import { mount } from 'svelte';
import '../app.css'
import App from './App.svelte';
const stored = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const theme = stored ?? (prefersDark ? 'dark' : 'light');
document.documentElement.classList.toggle('dark', theme === 'dark');

mount(App, { target: document.querySelector('#app')! });
