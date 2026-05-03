-- Usuarios autenticados (no anónimos de Auth) insertan con user_id = auth.uid() desde el cliente
-- para que SELECT tras INSERT cumpla RLS (antes solo se permitía user_id null y .select("id") fallaba).
-- Además: claim_onboarding_submission devuelve true si la fila ya pertenece al usuario (idempotente).

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

  if exists (
    select 1
    from public.onboarding_submissions
    where id = p_submission
      and user_id = auth.uid()
  ) then
    return true;
  end if;

  update public.onboarding_submissions
  set
    user_id = auth.uid()
  where
    id = p_submission
    and user_id is null;

  get diagnostics n = row_count;
  return n > 0;
end;
$$;

drop policy if exists "onboarding_submissions_auth_insert_open" on public.onboarding_submissions;

create policy "onboarding_submissions_auth_insert_open" on public.onboarding_submissions for insert to authenticated with check (
  user_id is null
  or user_id = auth.uid()
);
