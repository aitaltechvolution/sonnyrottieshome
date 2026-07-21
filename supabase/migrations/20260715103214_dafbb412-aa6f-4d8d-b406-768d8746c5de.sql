
CREATE POLICY "puppies read all" ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'puppies');
CREATE POLICY "admin upload puppies" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'puppies' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin update puppies obj" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'puppies' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin delete puppies obj" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'puppies' AND public.has_role(auth.uid(),'admin'));
