
CREATE TABLE public.page_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  path text,
  label text,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.page_events TO anon, authenticated;
GRANT SELECT ON public.page_events TO authenticated;
GRANT ALL ON public.page_events TO service_role;
ALTER TABLE public.page_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can insert page events" ON public.page_events
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admins read page events" ON public.page_events
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE INDEX idx_page_events_type_time ON public.page_events (event_type, created_at DESC);

-- Promote known admin emails if their auth account already exists
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role FROM auth.users
WHERE email IN ('admin@khalid.com','khalid.sh.dev@gmail.com')
ON CONFLICT (user_id, role) DO NOTHING;
