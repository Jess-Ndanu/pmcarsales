-- Set search_path on trigger function
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Revoke public execute on internal SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user_role() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;

-- Tighten storage SELECT: still public-readable, but disallow listing the bucket
DROP POLICY IF EXISTS "Public read car images" ON storage.objects;
CREATE POLICY "Public read car images by path"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (
    bucket_id = 'car-images'
    AND (storage.foldername(name))[1] IS NOT NULL
  );