export type Tech = {
  icon: string;
  label: string;
};

export type Project = {
  image: string;
  imageAlt: string;
  title: string;
  description: string;
  techs: Tech[];
  href?: string;
  github?: string;
};

export interface TimelineEntry {
  year: string;
  title: string;
  body: string;
  tags: string[];
}

export interface CurrentlyItem {
  key: string;
  val: string;
}

export interface ProfileData {
  name: string;
  role: string;
  location: string;
  lead: string;
  github: string;
  linkedin: string;
  timeline: TimelineEntry[];
  currently: CurrentlyItem[];
}

export interface SocialLink {
  label: string;
  handle: string;
  href: string;
  desc: string;
  icon: string;
}

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  html: string;
  readingTime: number;
};
