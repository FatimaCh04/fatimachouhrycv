export type Profile = {
  id: number;
  name: string | null;
  title: string | null;
  tagline: string | null;
  photo: string | null;
  resume_url: string | null;
  updated_at?: string;
};

export type Project = {
  id: string;
  title: string;
  description: string | null;
  technologies: string[];
  category: string | null;
  github_link: string | null;
  demo_link: string | null;
  image: string | null;
  sort_order: number;
  created_at?: string;
};

export type Service = {
  id: string;
  title: string | null;
  name: string | null;
  description: string | null;
  sort_order: number;
  created_at?: string;
};

export type Post = {
  id: string;
  title: string;
  date: string | null;
  category: string | null;
  description: string | null;
  content: string | null;
  created_at?: string;
};
