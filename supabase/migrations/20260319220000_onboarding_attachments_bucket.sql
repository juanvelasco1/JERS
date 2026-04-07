-- Public bucket for optional onboarding file uploads (paths include submission id).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'onboarding-attachments',
  'onboarding-attachments',
  true,
  10485760,
  null
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit;

drop policy if exists "onboarding_attachments_anon_select" on storage.objects;
create policy "onboarding_attachments_anon_select"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'onboarding-attachments');

drop policy if exists "onboarding_attachments_anon_insert" on storage.objects;
create policy "onboarding_attachments_anon_insert"
on storage.objects for insert
to anon, authenticated
with check (bucket_id = 'onboarding-attachments');
