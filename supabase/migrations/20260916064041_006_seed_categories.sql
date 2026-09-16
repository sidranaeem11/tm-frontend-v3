/*
# TM INDUSTRY — Seed categories from .NET API

## Purpose
Inserts the 7 existing categories from the .NET API into Supabase.
These match exactly what the production API returns and what the
frontend navbar links expect.

## Data source
GET https://tm-backend-production-5c13.up.railway.app/api/categories
Response: 7 categories with id, name, slug, imageUrl

## Categories inserted
1. Trousers (trousers)
2. Hoodies (hoodies)
3. Shorts (shorts)
4. Sports Wear (sports-wear)
5. Leather Jackets (leather-jackets)
6. Track Suits (track-suits)
7. Suits (suits)

The integer IDs from the .NET API (1-7) are NOT preserved — Supabase
uses UUIDs. A lookup table mapping is not needed because the frontend
will query Supabase directly by slug.
*/

INSERT INTO public.categories (name, slug, image_url, display_order)
VALUES
  ('Trousers', 'trousers', '', 1),
  ('Hoodies', 'hoodies', '', 2),
  ('Shorts', 'shorts', '', 3),
  ('Sports Wear', 'sports-wear', '', 4),
  ('Leather Jackets', 'leather-jackets', '', 5),
  ('Track Suits', 'track-suits', '', 6),
  ('Suits', 'suits', '', 7)
ON CONFLICT (slug) DO NOTHING;
