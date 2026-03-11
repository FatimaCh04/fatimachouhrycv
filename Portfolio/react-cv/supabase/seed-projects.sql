-- Run this in Supabase Dashboard → SQL Editor.
-- 1. Creates the projects table if it doesn't exist.
-- 2. Inserts the 12 portfolio projects.

CREATE TABLE IF NOT EXISTS public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text,
  github_link text,
  live_link text,
  image text,
  created_at timestamptz DEFAULT now()
);

-- Allow public read
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Projects are viewable by everyone" ON public.projects;
CREATE POLICY "Projects are viewable by everyone"
  ON public.projects FOR SELECT
  USING (true);

-- Allow authenticated users to manage projects (admin)
DROP POLICY IF EXISTS "Authenticated users can manage projects" ON public.projects;
CREATE POLICY "Authenticated users can manage projects"
  ON public.projects FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Ensure category column exists (if table was created by an older version of this script)
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS category text;

-- Insert the 12 projects (only if table is empty)
INSERT INTO public.projects (title, description, category, github_link, live_link, image)
SELECT * FROM (VALUES
  (
    'Teacher Assistant App in React Desktop'::text,
    'This is a Desktop application which is created in React Desktop Electron Library.'::text,
    'react-development'::text,
    'https://github.com/FatimaCh04/FA23-BSE-123-6B-Fatima-Ch-AWT/tree/main/CUI%20Teacher%20Portal'::text,
    ''::text,
    ''::text
  ),
  (
    'Smart Clinic & Patient Management System'::text,
    'QuiCare is a modern healthcare management system designed to simplify clinic operations, including patient records, appointments, and doctor management. It helps healthcare providers manage their workflow efficiently while improving patient care and communication.'::text,
    'mobile-app-development'::text,
    ''::text,
    ''::text,
    ''::text
  ),
  (
    'Online Pizza Ordering Website'::text,
    'Delicious Pizza is an online pizza ordering website where customers can explore different pizza flavors and place orders easily. This website provides a simple and user-friendly interface for browsing the menu and ordering pizza quickly.'::text,
    'web-development'::text,
    ''::text,
    ''::text,
    ''::text
  ),
  (
    'Smart Task Manager Mobile Application'::text,
    'This mobile app is designed to provide users with a simple and interactive platform to perform tasks easily on their smartphones. It focuses on user-friendly design, smooth performance, and useful features to improve the mobile experience.'::text,
    'mobile-app-development'::text,
    ''::text,
    ''::text,
    ''::text
  ),
  (
    'Smart Web Application for Cafe Operations'::text,
    'Cafe Management System is a web application designed to manage cafe operations such as orders, menu items, and billing. It helps staff handle customer orders efficiently and keeps records organized for smooth cafe management.'::text,
    'web-development'::text,
    ''::text,
    ''::text,
    ''::text
  ),
  (
    'Online Clinic & Healthcare Management System'::text,
    'QuiCare is a web-based healthcare management system designed to manage patients, doctors, appointments, and medical records in one platform. It helps clinics and hospitals organize their operations efficiently and provide better healthcare services online.'::text,
    'web-development'::text,
    ''::text,
    ''::text,
    ''::text
  ),
  (
    'Secure Online Voting Platform'::text,
    'Blockchain voting system is a secure digital voting platform that uses blockchain technology to ensure transparent and tamper-proof elections. It allows users to cast votes safely while maintaining accuracy, security, and trust in the voting process.'::text,
    'desktop'::text,
    ''::text,
    ''::text,
    ''::text
  ),
  (
    'Smart Academic Management Platform'::text,
    'University Management System is a Python-based application designed to manage student records, courses, and faculty information efficiently. It helps universities organize academic data and simplifies administration tasks through a user-friendly system.'::text,
    'desktop'::text,
    ''::text,
    ''::text,
    ''::text
  ),
  (
    'Smart Point of Sale System'::text,
    'POS Mobile App is a mobile application designed to manage sales, billing, and inventory in retail stores and small businesses. It helps business owners process transactions quickly and keep track of daily sales easily.'::text,
    'mobile-app-development'::text,
    ''::text,
    ''::text,
    ''::text
  ),
  (
    'Car Racing Game'::text,
    'Car Racing Game is a simple game developed in Assembly language where the player controls a car and avoids obstacles on the road. The game focuses on basic graphics, keyboard controls, and low-level programming concepts.'::text,
    'desktop'::text,
    ''::text,
    ''::text,
    ''::text
  ),
  (
    'Digital Library Management Platform'::text,
    'Library Management System is a software application designed to manage books, members, and borrowing records in a library. It helps libraries easily issue and return books while keeping library data organized and efficient.'::text,
    'web-development'::text,
    ''::text,
    ''::text,
    ''::text
  ),
  (
    'COMSATS Student Portal'::text,
    'COMSATS Portal is a web-based Learning Management System that allows students to manage their courses, grades, and academic information. It provides features like course registration, credit tracking, and student dashboard for an organized learning experience.'::text,
    'web-development'::text,
    ''::text,
    ''::text,
    ''::text
  )
) AS v(title, description, category, github_link, live_link, image)
WHERE NOT EXISTS (SELECT 1 FROM public.projects LIMIT 1);
