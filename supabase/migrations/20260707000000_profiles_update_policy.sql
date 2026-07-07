-- Restore the UPDATE policy dropped (and never recreated) in
-- 20260531000000_snapingly_launch_core.sql. Without it every
-- authenticated UPDATE on public.profiles is rejected by RLS.
drop policy if exists "profiles update own safe fields" on public.profiles;
create policy "profiles update own safe fields"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- "Safe fields" via column-level grants: account_status and
-- dodo_customer_id remain server-only (service role bypasses both
-- grants and RLS).
revoke update on table public.profiles from anon, authenticated;
grant update (email, full_name, avatar_url, updated_at)
  on table public.profiles to authenticated;
