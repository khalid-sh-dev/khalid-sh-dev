
-- App role enum may already exist; ensure 'admin' is sufficient
-- Create portfolio_items table
CREATE TABLE IF NOT EXISTS public.portfolio_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_ar text NOT NULL,
  title_en text,
  description_ar text NOT NULL,
  description_en text,
  short_description_ar text,
  short_description_en text,
  thumbnail_url text,
  images text[] NOT NULL DEFAULT '{}',
  external_url text,
  category text,
  display_order integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;

-- Public read of published items
CREATE POLICY "public can read published portfolio"
ON public.portfolio_items FOR SELECT
TO anon, authenticated
USING (is_published = true OR public.has_role(auth.uid(), 'admin'));

-- Admin full access
CREATE POLICY "admins insert portfolio"
ON public.portfolio_items FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins update portfolio"
ON public.portfolio_items FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins delete portfolio"
ON public.portfolio_items FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS trg_portfolio_updated_at ON public.portfolio_items;
CREATE TRIGGER trg_portfolio_updated_at
BEFORE UPDATE ON public.portfolio_items
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Auto-grant admin role to admin@khalid.com on signup
CREATE OR REPLACE FUNCTION public.grant_super_admin()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.email = 'admin@khalid.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin'::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_grant_super_admin ON auth.users;
CREATE TRIGGER trg_grant_super_admin
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.grant_super_admin();

-- Backfill: if admin@khalid.com already exists, grant role
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role FROM auth.users WHERE email = 'admin@khalid.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Storage bucket for portfolio images
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio', 'portfolio', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "public read portfolio images"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio');

CREATE POLICY "admins upload portfolio images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'portfolio' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins update portfolio images"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'portfolio' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins delete portfolio images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'portfolio' AND public.has_role(auth.uid(), 'admin'));
