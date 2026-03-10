-- Run this in Supabase SQL Editor if you already have a projects table without category.
-- Adds category column so portfolio filters and labels work.

ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS category text;
