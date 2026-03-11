-- Run in Supabase SQL Editor to add technologies column (comma-separated or simple text).
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS technologies text;
