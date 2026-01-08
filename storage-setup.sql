-- ============================================
-- Storage Bucket Setup for Team Logos
-- Run this in Supabase SQL Editor
-- ============================================

-- Create the team-logos bucket (if not already created via UI)
INSERT INTO storage.buckets (id, name, public)
VALUES ('team-logos', 'team-logos', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STORAGE POLICIES FOR TEAM-LOGOS
-- ============================================

-- Allow public to view/download team logos
CREATE POLICY "Public can view team logos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'team-logos');

-- Allow authenticated users to upload team logos
CREATE POLICY "Authenticated users can upload team logos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'team-logos');

-- Allow authenticated users to update team logos
CREATE POLICY "Authenticated users can update team logos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'team-logos');

-- Allow authenticated users to delete team logos
CREATE POLICY "Authenticated users can delete team logos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'team-logos');

-- ============================================
-- VERIFICATION
-- ============================================

-- Check if bucket was created
-- SELECT * FROM storage.buckets WHERE id = 'team-logos';

-- Check if policies were created
-- SELECT * FROM pg_policies WHERE tablename = 'objects' AND policyname LIKE '%team logos%';
