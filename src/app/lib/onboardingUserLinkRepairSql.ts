/**
 * Mismo SQL que `supabase/migrations/20260503120000_onboarding_submissions_user_link.sql`.
 * Se usa en Mi proyecto → copiar al portapapeles si falta `user_id` en Supabase.
 */
export const ONBOARDING_USER_LINK_REPAIR_SQL = `alter table public.onboarding_submissions
  add column if not exists user_id uuid references auth.users (id) on delete set null;

create index if not exists idx_onboarding_submissions_user_id
  on public.onboarding_submissions (user_id);

create or replace function public.claim_onboarding_submission(p_submission uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  n int;
begin
  if auth.uid() is null then
    raise exception 'not_authenticated';
  end if;

  update public.onboarding_submissions
  set
    user_id = auth.uid()
  where
    id = p_submission
    and user_id is null;

  GET DIAGNOSTICS n = ROW_COUNT;
  return n > 0;
end;
$$;

revoke all on function public.claim_onboarding_submission(uuid) from public;
grant execute on function public.claim_onboarding_submission(uuid) to authenticated;

drop policy if exists "onboarding_submissions_anon_update" on public.onboarding_submissions;

create policy "onboarding_submissions_anon_update" on public.onboarding_submissions for update to anon using (user_id is null) with check (
  user_id is null
);

drop policy if exists "onboarding_submissions_auth_select_own" on public.onboarding_submissions;

create policy "onboarding_submissions_auth_select_own" on public.onboarding_submissions for select to authenticated using (user_id = auth.uid());

drop policy if exists "onboarding_submissions_auth_update_own" on public.onboarding_submissions;

create policy "onboarding_submissions_auth_update_own" on public.onboarding_submissions for update to authenticated using (user_id = auth.uid()) with check (
  user_id = auth.uid()
);

drop policy if exists "onboarding_submissions_auth_insert_open" on public.onboarding_submissions;

create policy "onboarding_submissions_auth_insert_open" on public.onboarding_submissions for insert to authenticated with check (
  user_id is null
);

drop policy if exists "onboarding_submissions_auth_update_unclaimed" on public.onboarding_submissions;

create policy "onboarding_submissions_auth_update_unclaimed" on public.onboarding_submissions for update to authenticated using (user_id is null) with check (
  user_id is null
);
`;
