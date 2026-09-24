CREATE TABLE public.lm_documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'Untitled Lead Magnet',
  slug text not null unique,
  type text not null default 'ebook',
  content jsonb not null default '{}'::jsonb,
  theme jsonb not null default '{}'::jsonb,
  status text not null default 'draft',
  pdf_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lm_documents TO authenticated;
GRANT SELECT ON public.lm_documents TO anon;
GRANT ALL ON public.lm_documents TO service_role;
ALTER TABLE public.lm_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lm_documents: select own" ON public.lm_documents FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "lm_documents: insert own" ON public.lm_documents FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "lm_documents: update own" ON public.lm_documents FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "lm_documents: delete own" ON public.lm_documents FOR DELETE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "lm_documents: public read published" ON public.lm_documents FOR SELECT TO anon USING (status = 'published');

CREATE TABLE public.lm_campaigns (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  document_id uuid references public.lm_documents(id) on delete set null,
  name text not null default 'Untitled Campaign',
  slug text not null unique,
  headline text not null default 'Get the free guide',
  subheadline text,
  cta_label text not null default 'Download now',
  fields jsonb not null default '[]'::jsonb,
  require_email_confirm boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lm_campaigns TO authenticated;
GRANT SELECT ON public.lm_campaigns TO anon;
GRANT ALL ON public.lm_campaigns TO service_role;
ALTER TABLE public.lm_campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lm_campaigns: select own" ON public.lm_campaigns FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "lm_campaigns: insert own" ON public.lm_campaigns FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "lm_campaigns: update own" ON public.lm_campaigns FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "lm_campaigns: delete own" ON public.lm_campaigns FOR DELETE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "lm_campaigns: public read active" ON public.lm_campaigns FOR SELECT TO anon USING (active = true);

CREATE TABLE public.lm_leads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  campaign_id uuid not null references public.lm_campaigns(id) on delete cascade,
  email text not null,
  name text,
  custom_fields jsonb not null default '{}'::jsonb,
  source text,
  utm jsonb not null default '{}'::jsonb,
  confirmed boolean not null default false,
  downloaded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (campaign_id, email)
);
GRANT SELECT, UPDATE, DELETE ON public.lm_leads TO authenticated;
GRANT INSERT ON public.lm_leads TO anon, authenticated;
GRANT ALL ON public.lm_leads TO service_role;
ALTER TABLE public.lm_leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lm_leads: owner select" ON public.lm_leads FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.lm_campaigns c WHERE c.id = lm_leads.campaign_id AND c.user_id = auth.uid()));
CREATE POLICY "lm_leads: owner update" ON public.lm_leads FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.lm_campaigns c WHERE c.id = lm_leads.campaign_id AND c.user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM public.lm_campaigns c WHERE c.id = lm_leads.campaign_id AND c.user_id = auth.uid()));
CREATE POLICY "lm_leads: owner delete" ON public.lm_leads FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM public.lm_campaigns c WHERE c.id = lm_leads.campaign_id AND c.user_id = auth.uid()));
CREATE POLICY "lm_leads: public insert active campaign" ON public.lm_leads FOR INSERT TO anon, authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.lm_campaigns c WHERE c.id = lm_leads.campaign_id AND c.active = true));

CREATE TABLE public.lm_events (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.lm_campaigns(id) on delete cascade,
  event_type text not null,
  session_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
GRANT SELECT ON public.lm_events TO authenticated;
GRANT INSERT ON public.lm_events TO anon, authenticated;
GRANT ALL ON public.lm_events TO service_role;
ALTER TABLE public.lm_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lm_events: owner select" ON public.lm_events FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.lm_campaigns c WHERE c.id = lm_events.campaign_id AND c.user_id = auth.uid()));
CREATE POLICY "lm_events: public insert active campaign" ON public.lm_events FOR INSERT TO anon, authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.lm_campaigns c WHERE c.id = lm_events.campaign_id AND c.active = true));

CREATE INDEX lm_documents_user_id_idx ON public.lm_documents (user_id);
CREATE INDEX lm_campaigns_user_id_idx ON public.lm_campaigns (user_id);
CREATE INDEX lm_campaigns_document_id_idx ON public.lm_campaigns (document_id);
CREATE INDEX lm_leads_campaign_id_idx ON public.lm_leads (campaign_id);
CREATE INDEX lm_leads_email_idx ON public.lm_leads (email);
CREATE INDEX lm_events_campaign_id_idx ON public.lm_events (campaign_id);

CREATE TRIGGER lm_documents_set_updated_at BEFORE UPDATE ON public.lm_documents FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER lm_campaigns_set_updated_at BEFORE UPDATE ON public.lm_campaigns FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER lm_leads_set_updated_at BEFORE UPDATE ON public.lm_leads FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER lm_events_set_updated_at BEFORE UPDATE ON public.lm_events FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
