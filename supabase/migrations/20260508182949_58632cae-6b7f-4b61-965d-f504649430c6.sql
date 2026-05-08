
-- Fix function search_path on set_updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- Revoke broad EXECUTE on grant_super_admin (still callable by trigger as definer)
REVOKE EXECUTE ON FUNCTION public.grant_super_admin() FROM anon, authenticated, public;
