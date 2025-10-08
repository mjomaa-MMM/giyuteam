-- Ensure pgcrypto is available for bcrypt hashing
create extension if not exists pgcrypto;

-- Re-hash the admin password to a proper bcrypt hash for the demo credentials
update public.user_passwords up
set password_hash = crypt('ADMIN', gen_salt('bf', 12))
from public.profiles p
where p.user_id = up.user_id
  and p.username = 'admin';