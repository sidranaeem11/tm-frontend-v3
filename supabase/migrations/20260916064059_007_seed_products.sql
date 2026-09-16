/*
# TM INDUSTRY — Seed product from .NET API

## Purpose
Migrates the single existing product from the .NET production API
into Supabase. This is the only product currently in the .NET database.

## Data source
GET https://tm-backend-production-5c13.up.railway.app/api/products
Response: 1 product

## Product migrated
- Name: "white premium hodie "
- Description: (full description from API)
- Price: 45
- Old price: 40
- Image URL: http://tm-backend-production-5c13.up.railway.app/uploads/48a5799f-f351-473f-9039-1e3f938eac3d.jpeg
- Size: "s-M-L-XL"
- Color: "white and black"
- Category: Hoodies (slug: hoodies, UUID: 07b57eee-f999-400e-8341-db23a3bfec60)
- Is new arrival: true
- Is best seller: false
- Stock: 50
- Gallery images: [] (empty)
- Is B2B: true, Is B2C: true
- Bulk price: 22, Min order qty: 10, Wholesale price: 30

## Notes
- The .NET integer ID (2) is NOT preserved — Supabase generates a UUID.
- A slug is generated from the product name: "white-premium-hodie"
- The image URL points to the .NET backend's /uploads/ path. This URL
  remains valid as long as the .NET backend stays running. In a future
  phase, the image should be re-uploaded to Supabase Storage.
*/

INSERT INTO public.products (
  name,
  slug,
  description,
  price,
  old_price,
  image_url,
  gallery_images,
  size,
  color,
  stock,
  category_id,
  is_new_arrival,
  is_best_seller,
  is_b2b,
  is_b2c,
  bulk_price,
  min_order_quantity,
  wholesale_price
)
VALUES (
  'white premium hodie',
  'white-premium-hodie',
  'A modern streetwear essential featuring a bold blue lightning graphic, clean white finish, adjustable hood, kangaroo pocket, ribbed cuffs and hem. Designed for a comfortable everyday fit with a stylish, eye-catching look. Perfect for streetwear brands, fashion collections, private-label businesses, retail, and bulk orders.',
  45.00,
  40.00,
  'http://tm-backend-production-5c13.up.railway.app/uploads/48a5799f-f351-473f-9039-1e3f938eac3d.jpeg',
  ARRAY[]::text[],
  's-M-L-XL',
  'white and black',
  50,
  '07b57eee-f999-400e-8341-db23a3bfec60',
  true,
  false,
  true,
  true,
  22.00,
  10,
  30.00
)
ON CONFLICT (slug) DO NOTHING;
