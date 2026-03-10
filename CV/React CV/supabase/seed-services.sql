-- Run this in Supabase Dashboard → SQL Editor.
-- 1. Creates the services table if it doesn't exist.
-- 2. Inserts the 6 services.

CREATE TABLE IF NOT EXISTS public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  price text,
  icon text DEFAULT 'code'
);

-- Allow public read (so your portfolio page can load services)
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Services are viewable by everyone" ON public.services;
CREATE POLICY "Services are viewable by everyone"
  ON public.services FOR SELECT
  USING (true);

-- Allow authenticated users to manage services (admin)
DROP POLICY IF EXISTS "Authenticated users can manage services" ON public.services;
CREATE POLICY "Authenticated users can manage services"
  ON public.services FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert the 6 services (only if table is empty, so you can re-run safely)
INSERT INTO public.services (title, description, price, icon)
SELECT * FROM (VALUES
  (
    'Web Development'::text,
    'Custom websites and web apps with React, Node.js, and modern tooling. Responsive, accessible, and performant.'::text,
    '$35/hour'::text,
    'code'::text
  ),
  (
    'API Design & Backend'::text,
    'RESTful APIs, database design, and server logic with FastAPI, Express, or Node. Clean, documented, and scalable.'::text,
    '$45/hour'::text,
    'api'::text
  ),
  (
    'Dashboards & Tools'::text,
    'Internal tools, admin panels, and data dashboards. Tailwind-based UI with clear information hierarchy.'::text,
    '$40/hour'::text,
    'dashboard'::text
  ),
  (
    'DevOps & Deployment'::text,
    'Docker, CI/CD, and cloud deployment (e.g. AWS). Reliable, reproducible environments.'::text,
    '$50/hour'::text,
    'rocket_launch'::text
  ),
  (
    'React Development'::text,
    'Build dynamic and interactive web applications using React.js. Experienced in creating reusable components, managing state, and developing fast single-page applications.'::text,
    '$42/hour'::text,
    'hub'::text
  ),
  (
    'Mobile App Development'::text,
    'Develop cross-platform mobile applications using modern frameworks and tools. Focus on performance, user experience, and scalable mobile solutions.'::text,
    '$48/hour'::text,
    'smartphone'::text
  )
) AS v(title, description, price, icon)
WHERE NOT EXISTS (SELECT 1 FROM public.services LIMIT 1);
-- f:\AWT\Portfolio\react-cv\supabase\migrate-projects-add-technologies.sql
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS technologies text;