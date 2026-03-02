
-- Create submissions table
CREATE TABLE public.submissions (
  id serial PRIMARY KEY,
  entrepreneur_id integer NOT NULL REFERENCES public.entrepreneurs(id),
  user_email text NOT NULL,
  link text,
  file_url text,
  file_name text,
  observations text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public insert submissions" ON public.submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read submissions" ON public.submissions
  FOR SELECT USING (true);

-- Create storage bucket for submissions
INSERT INTO storage.buckets (id, name, public) VALUES ('submissions', 'submissions', true);

-- Allow anyone to upload to submissions bucket
CREATE POLICY "Public upload submissions" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'submissions');

CREATE POLICY "Public read submission files" ON storage.objects
  FOR SELECT USING (bucket_id = 'submissions');
