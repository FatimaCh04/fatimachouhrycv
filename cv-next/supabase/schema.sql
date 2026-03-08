-- Run this in Supabase SQL Editor to create tables for your portfolio.

-- Profile (single row; use id = 1)
create table if not exists public.profile (
  id int primary key default 1,
  name text,
  title text,
  tagline text,
  photo text,
  resume_url text,
  updated_at timestamptz default now()
);

alter table public.profile enable row level security;

create policy "Public can read profile"
  on public.profile for select
  using (true);

create policy "Authenticated can update profile"
  on public.profile for update
  using (auth.role() = 'authenticated');

insert into public.profile (id, name, title, tagline, photo, resume_url)
values (1, 'Fatima Choudhry', 'Software Engineering Student', 'Building scalable automation and custom software solutions.', 'assets/images/profile.jpg', '')
on conflict (id) do nothing;

-- Projects
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  technologies text[] default '{}',
  category text,
  github_link text,
  demo_link text,
  image text,
  sort_order int default 0,
  created_at timestamptz default now()
);

alter table public.projects enable row level security;

create policy "Public can read projects"
  on public.projects for select using (true);

create policy "Authenticated can manage projects"
  on public.projects for all using (auth.role() = 'authenticated');

-- Services
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text,
  name text,
  description text,
  sort_order int default 0,
  created_at timestamptz default now()
);

alter table public.services enable row level security;

create policy "Public can read services"
  on public.services for select using (true);

create policy "Authenticated can manage services"
  on public.services for all using (auth.role() = 'authenticated');

-- Blog posts
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date text,
  category text default 'general',
  description text,
  content text,
  created_at timestamptz default now()
);

alter table public.posts enable row level security;

create policy "Public can read posts"
  on public.posts for select using (true);

create policy "Authenticated can manage posts"
  on public.posts for all using (auth.role() = 'authenticated');

-- Contact messages (anyone can submit; only authenticated can read)
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz default now()
);

alter table public.contact_messages enable row level security;

create policy "Anyone can insert contact messages"
  on public.contact_messages for insert
  with check (true);

create policy "Authenticated can read contact messages"
  on public.contact_messages for select
  using (auth.role() = 'authenticated');
