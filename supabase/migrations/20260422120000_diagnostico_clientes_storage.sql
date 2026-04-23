-- Archivos del diagnóstico: agrupados por el id de la fila que los sube (`onboarding_submissions.id`).
-- Convención de ruta: `{onboarding_submissions.id}/uploads/{nombre-unico.ext}`
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'diagnostico-clientes',
  'diagnostico-clientes',
  true,
  10485760,
  null
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit;

drop policy if exists "diagnostico_clientes_anon_select" on storage.objects;
create policy "diagnostico_clientes_anon_select"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'diagnostico-clientes');

-- Solo permitir subidas bajo una carpeta cuyo nombre coincide con un id real de diagnóstico.
drop policy if exists "diagnostico_clientes_anon_insert" on storage.objects;
create policy "diagnostico_clientes_anon_insert"
on storage.objects for insert
to anon, authenticated
with check (
  bucket_id = 'diagnostico-clientes'
  and exists (
    select 1
    from public.onboarding_submissions s
    where s.id::text = (storage.foldername(name))[1]
  )
);
