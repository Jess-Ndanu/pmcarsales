-- Testimonials
CREATE TABLE public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name text NOT NULL,
  author_role text,
  quote text NOT NULL,
  rating int NOT NULL DEFAULT 5,
  avatar_url text,
  featured boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view testimonials" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Admins insert testimonials" ON public.testimonials FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update testimonials" ON public.testimonials FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete testimonials" ON public.testimonials FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));

CREATE TRIGGER set_testimonials_updated_at BEFORE UPDATE ON public.testimonials
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Sold gallery
CREATE TABLE public.sold_gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  caption text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.sold_gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view sold gallery" ON public.sold_gallery FOR SELECT USING (true);
CREATE POLICY "Admins insert sold gallery" ON public.sold_gallery FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update sold gallery" ON public.sold_gallery FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete sold gallery" ON public.sold_gallery FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));

CREATE TRIGGER set_sold_gallery_updated_at BEFORE UPDATE ON public.sold_gallery
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Storage bucket for gallery
INSERT INTO storage.buckets (id, name, public) VALUES ('sold-gallery', 'sold-gallery', true)
  ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read sold-gallery" ON storage.objects FOR SELECT USING (bucket_id = 'sold-gallery');
CREATE POLICY "Admins upload sold-gallery" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'sold-gallery' AND has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update sold-gallery" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'sold-gallery' AND has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete sold-gallery" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'sold-gallery' AND has_role(auth.uid(), 'admin'));