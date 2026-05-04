-- Fix LinkedIn URL on the Contact page when links are loaded from `contact_links`.
-- Run in Supabase → SQL Editor after deploying the app default (or edit the row in Admin → Contact links).

update public.contact_links
set url = 'https://www.linkedin.com/in/fatima-choudhry/'
where url ilike '%linkedin.com/in/fatima-choudhry-714423358%';
