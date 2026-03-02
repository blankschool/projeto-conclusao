
CREATE TABLE public.confidentiality_agreements (
  id serial PRIMARY KEY,
  user_email text NOT NULL,
  accepted_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT confidentiality_agreements_user_email_key UNIQUE (user_email)
);

ALTER TABLE public.confidentiality_agreements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read confidentiality_agreements" ON public.confidentiality_agreements
  FOR SELECT USING (true);

CREATE POLICY "Public insert confidentiality_agreements" ON public.confidentiality_agreements
  FOR INSERT WITH CHECK (true);
