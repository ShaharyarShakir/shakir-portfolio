import type { ProfileData } from '$lib/types';

export const profileData: ProfileData = {
  name: "Shaharyar Shakir",
  role: "CS Student & Hands-on Builder",
  location: "Pakistan 🇵🇰",
  lead: "I'm Shaharyar — a CS student and hands-on builder based in Pakistan. I work across DevOps, MLOps, Full-Stack Web, and React Native. I care about shipping real things, not collecting certificates.",
  github: "https://github.com/ShaharyarShakir",
  linkedin: "https://linkedin.com/in/shaharyar-shakir-3674a027b",
  timeline: [
    {
      year: '2026 — now',
      title: 'building in public',
      body: 'actively working across devops, mlops, full-stack, and react native. shipping the 200 projects repo, applying to remote roles, and sharpening skills daily.',
      tags: ['devops', 'mlops', 'react native', 'full stack'],
    },
    {
      year: '2025',
      title: 'went deep on cloud & infra',
      body: 'built vprofile — an end-to-end devops pipeline with jenkins, docker, kubernetes on aws eks, rds, and route 53. this is where infra clicked for me.',
      tags: ['aws', 'kubernetes', 'jenkins', 'docker'],
    },
    {
      year: '2026',
      title: 'discovered mlops',
      body: 'built a youtube sentiment analysis pipeline using dvc, mlflow, and lightgbm. shipped a chrome extension that surfaces scores on any video.',
      tags: ['dvc', 'mlflow', 'lightgbm', 'fastapi'],
    },
    {
      year: '2024',
      title: 'started CS',
      body: 'enrolled in bs computer science. started with the fundamentals and immediately started building things on the side.',
      tags: ['university', 'bs cs'],
    },
    {
      year: '2023',
      title: 'wrote my first line of code',
      body: 'started with webdev. realized quickly that building things was more interesting than studying theory. never looked back.',
      tags: ['js', 'svelte', 'react', 'beginnings'],
    },
  ],
  currently: [
    { key: 'Studying', val: 'BS CS — 2028' },
    { key: 'Building', val: 'SaaS product' },
    { key: 'Targeting', val: 'Remote roles & Internships' },
    { key: 'Location', val: 'Pakistan 🇵🇰' },
  ],
};
