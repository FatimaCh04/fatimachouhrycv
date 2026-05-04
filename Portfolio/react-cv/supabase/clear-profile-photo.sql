-- Clears the profile picture stored IN the profile row (removes giant base64 / old URLs).
-- Run once in Supabase → SQL Editor, then upload a fresh photo from Admin → Profile.
--
-- NOTE: Orphan objects in Storage (if you used a bucket for avatars) must be deleted
-- from Dashboard → Storage manually; this script only clears the `profile.photo` column.

update public.profile
set photo = null;

-- If you have multiple profile rows, add a WHERE clause (e.g. where id = 1).
