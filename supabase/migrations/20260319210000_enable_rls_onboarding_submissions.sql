alter table public.onboarding_submissions enable row level security;

drop policy if exists "onboarding_submissions_anon_insert" on public.onboarding_submissions;
create policy "onboarding_submissions_anon_insert"
on public.onboarding_submissions
for insert
to anon
with check (true);

drop policy if exists "onboarding_submissions_anon_select" on public.onboarding_submissions;
create policy "onboarding_submissions_anon_select"
on public.onboarding_submissions
for select
to anon
using (true);

drop policy if exists "onboarding_submissions_anon_update" on public.onboarding_submissions;
create policy "onboarding_submissions_anon_update"
on public.onboarding_submissions
for update
to anon
using (true)
with check (true);
