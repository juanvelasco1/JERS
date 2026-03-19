create extension if not exists pgcrypto;

create table if not exists public.onboarding_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz null,

  current_step smallint not null default 1,

  empresa text null,
  industria text null,
  industria_otro text null,
  tamano text null,
  problema text null,
  presupuesto text null,

  answers_raw jsonb not null default '{}'::jsonb
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_onboarding_submissions_updated_at on public.onboarding_submissions;

create trigger trg_onboarding_submissions_updated_at
before update on public.onboarding_submissions
for each row execute function public.set_updated_at();
