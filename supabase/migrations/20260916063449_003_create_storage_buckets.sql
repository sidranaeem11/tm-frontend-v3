/*
# TM INDUSTRY — Storage Buckets: product-images, category-images

## Purpose
Creates two public-read storage buckets for e-commerce image management.
Admin users can upload, update, and delete images. All visitors (including
unauthenticated users) can read/view images so the store catalog displays
properly without requiring login.

## Storage Buckets

### 1. product-images
- Public bucket (public-read)
- Used for: primary product images and gallery images
- Upload/update/delete: admin only (via is_admin() check)
- Read: public (anon + authenticated)

### 2. category-images
- Public bucket (public-read)
- Used for: category thumbnail/banner images
- Upload/update/delete: admin only (via is_admin() check)
- Read: public (anon + authenticated)

## Security (Storage Policies)
Each bucket gets 4 policies:
- SELECT (public read): anyone can view images
- INSERT (admin only): only admin users can upload
- UPDATE (admin only): only admin users can replace
- DELETE (admin only): only admin users can remove

The admin check uses the same is_admin() SQL function created in
migration 001, which verifies the user's profile has role='admin'.

## Notes
- Buckets are created as public (public = true) so images can be
  served directly via URL without signed URLs for the storefront.
- The policies below enforce that only admins can write, even though
  the bucket itself is public for reads.
*/

-- ===== Create product-images bucket =====
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- product-images: public read
DROP POLICY IF EXISTS "product_images_public_select" ON storage.objects;
CREATE POLICY "product_images_public_select"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'product-images');

-- product-images: admin upload
DROP POLICY IF EXISTS "product_images_admin_insert" ON storage.objects;
CREATE POLICY "product_images_admin_insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'product-images' AND public.is_admin());

-- product-images: admin update
DROP POLICY IF EXISTS "product_images_admin_update" ON storage.objects;
CREATE POLICY "product_images_admin_update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'product-images' AND public.is_admin())
  WITH CHECK (bucket_id = 'product-images' AND public.is_admin());

-- product-images: admin delete
DROP POLICY IF EXISTS "product_images_admin_delete" ON storage.objects;
CREATE POLICY "product_images_admin_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'product-images' AND public.is_admin());

-- ===== Create category-images bucket =====
INSERT INTO storage.buckets (id, name, public)
VALUES ('category-images', 'category-images', true)
ON CONFLICT (id) DO NOTHING;

-- category-images: public read
DROP POLICY IF EXISTS "category_images_public_select" ON storage.objects;
CREATE POLICY "category_images_public_select"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'category-images');

-- category-images: admin upload
DROP POLICY IF EXISTS "category_images_admin_insert" ON storage.objects;
CREATE POLICY "category_images_admin_insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'category-images' AND public.is_admin());

-- category-images: admin update
DROP POLICY IF EXISTS "category_images_admin_update" ON storage.objects;
CREATE POLICY "category_images_admin_update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'category-images' AND public.is_admin())
  WITH CHECK (bucket_id = 'category-images' AND public.is_admin());

-- category-images: admin delete
DROP POLICY IF EXISTS "category_images_admin_delete" ON storage.objects;
CREATE POLICY "category_images_admin_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'category-images' AND public.is_admin());
