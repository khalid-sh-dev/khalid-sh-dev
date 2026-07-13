
-- ============ QUALIFICATIONS ============
CREATE TABLE IF NOT EXISTS public.qualifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_ar text NOT NULL,
  title_en text,
  institution_ar text,
  institution_en text,
  year text,
  type text DEFAULT 'certificate',
  url text,
  display_order int NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.qualifications TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.qualifications TO authenticated;
GRANT ALL ON public.qualifications TO service_role;
ALTER TABLE public.qualifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read published qualifications" ON public.qualifications FOR SELECT
  USING (is_published = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins insert qualifications" ON public.qualifications FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins update qualifications" ON public.qualifications FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins delete qualifications" ON public.qualifications FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_qualifications_updated BEFORE UPDATE ON public.qualifications
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ SITE LINKS (dynamic footer/social/contact) ============
CREATE TABLE IF NOT EXISTS public.site_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label_ar text NOT NULL,
  label_en text,
  url text NOT NULL,
  icon text DEFAULT 'link',
  category text NOT NULL DEFAULT 'social',
  display_order int NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_links TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_links TO authenticated;
GRANT ALL ON public.site_links TO service_role;
ALTER TABLE public.site_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read published site_links" ON public.site_links FOR SELECT
  USING (is_published = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins insert site_links" ON public.site_links FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins update site_links" ON public.site_links FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins delete site_links" ON public.site_links FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_site_links_updated BEFORE UPDATE ON public.site_links
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ CHAT AUTH-BASED ============
ALTER TABLE public.conversations ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON public.conversations(user_id);

-- Drop legacy visitor-header policies
DROP POLICY IF EXISTS "anon read own conversation by session var" ON public.conversations;
DROP POLICY IF EXISTS "anon read own messages by session var" ON public.messages;

-- New auth-scoped policies for conversations
CREATE POLICY "users read own conversations" ON public.conversations FOR SELECT
  USING (auth.uid() IS NOT NULL AND user_id = auth.uid());
CREATE POLICY "users insert own conversations" ON public.conversations FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());
CREATE POLICY "users update own conversations" ON public.conversations FOR UPDATE
  USING (auth.uid() IS NOT NULL AND user_id = auth.uid())
  WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- Messages: users can read/write in their own conversations
CREATE POLICY "users read own messages" ON public.messages FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.conversations c
    WHERE c.id = messages.conversation_id AND c.user_id = auth.uid()));
CREATE POLICY "users insert own messages" ON public.messages FOR INSERT
  WITH CHECK (
    sender = 'user' AND EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = messages.conversation_id AND c.user_id = auth.uid()
    )
  );

-- Admins can delete conversations/messages
CREATE POLICY "admins delete conversations" ON public.conversations FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins delete messages" ON public.messages FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- ============ SUPER ADMIN: khalid.sh.dev@gmail.com ============
CREATE OR REPLACE FUNCTION public.grant_super_admin()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.email IN ('admin@khalid.com','khalid.sh.dev@gmail.com') THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin'::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_grant_admin ON auth.users;
CREATE TRIGGER on_auth_user_created_grant_admin
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.grant_super_admin();

-- Create super admin user if it doesn't exist
DO $$
DECLARE
  v_uid uuid;
BEGIN
  SELECT id INTO v_uid FROM auth.users WHERE email = 'khalid.sh.dev@gmail.com';
  IF v_uid IS NULL THEN
    v_uid := gen_random_uuid();
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data, is_super_admin
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_uid, 'authenticated', 'authenticated',
      'khalid.sh.dev@gmail.com', crypt('A106a831a', gen_salt('bf')),
      now(), now(), now(),
      '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, false
    );
    INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    VALUES (gen_random_uuid(), v_uid, v_uid::text, jsonb_build_object('sub', v_uid::text, 'email', 'khalid.sh.dev@gmail.com', 'email_verified', true), 'email', now(), now(), now());
  END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (v_uid, 'admin'::app_role)
  ON CONFLICT (user_id, role) DO NOTHING;
END $$;

-- Seed a few qualifications and social links as placeholders
INSERT INTO public.qualifications (title_ar, title_en, institution_ar, institution_en, year, type, display_order) VALUES
  ('بكالوريوس هندسة البرمجيات', 'B.Sc. Software Engineering', 'جامعة الملك سعود', 'King Saud University', '2020', 'degree', 1),
  ('شهادة Google Ads', 'Google Ads Certification', 'Google', 'Google', '2023', 'certificate', 2),
  ('شهادة Meta Blueprint', 'Meta Blueprint Certified', 'Meta', 'Meta', '2024', 'certificate', 3)
ON CONFLICT DO NOTHING;

INSERT INTO public.site_links (label_ar, label_en, url, icon, category, display_order) VALUES
  ('واتساب', 'WhatsApp', 'https://wa.me/966500000000', 'whatsapp', 'contact', 1),
  ('البريد', 'Email', 'mailto:khalid.sh.dev@gmail.com', 'mail', 'contact', 2),
  ('لينكدإن', 'LinkedIn', 'https://linkedin.com/', 'linkedin', 'social', 3),
  ('تويتر / X', 'X (Twitter)', 'https://x.com/', 'twitter', 'social', 4),
  ('إنستقرام', 'Instagram', 'https://instagram.com/', 'instagram', 'social', 5)
ON CONFLICT DO NOTHING;
