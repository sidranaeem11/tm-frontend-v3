/*
# TM INDUSTRY — Core Tables: profiles, categories, products

## Purpose
Creates the foundational schema for the TM INDUSTRY e-commerce platform.
This migration sets up user profiles, product categories, and products
with full Row Level Security.

## New Tables

### 1. profiles
- `id` (uuid, PK, references auth.users) — one row per registered user
- `full_name` (text) — user's display name
- `email` (text, unique) — user's email (mirrored from auth.users)
- `role` (text, default 'customer') — 'customer' or 'admin'
- `phone` (text) — contact phone number
- `created_at` (timestamptz) — record creation time

### 2. categories
- `id` (uuid, PK) — auto-generated
- `name` (text, not null) — category display name (e.g. "Hoodies")
- `slug` (text, unique, not null) — URL-safe identifier (e.g. "hoodies")
- `image_url` (text) — category image URL
- `display_order` (int, default 0) — sort order for display
- `created_at` (timestamptz) — record creation time

### 3. products
- `id` (uuid, PK) — auto-generated
- `name` (text, not null) — product name
- `slug` (text, unique, not null) — URL-safe identifier
- `description` (text) — product description
- `price` (numeric, not null, default 0) — current selling price
- `old_price` (numeric) — previous price for sale display (nullable)
- `image_url` (text) — primary product image URL
- `gallery_images` (text[]) — array of additional image URLs
- `size` (text) — comma-separated sizes (e.g. "S,M,L,XL")
- `color` (text) — product color
- `stock` (int, default 0) — inventory count
- `category_id` (uuid, FK → categories.id) — product category
- `is_new_arrival` (bool, default false) — show "New" badge
- `is_best_seller` (bool, default false) — show "Best Seller" badge
- `is_b2b` (bool, default false) — available for B2B/wholesale
- `is_b2c` (bool, default true) — available for B2C/retail
- `bulk_price` (numeric) — B2B bulk pricing (nullable)
- `min_order_quantity` (int, default 1) — minimum B2B order qty
- `wholesale_price` (numeric) — wholesale pricing (nullable)
- `created_at` (timestamptz) — record creation time
- `updated_at` (timestamptz) — last modification time

## Security (RLS)
- `profiles`: users can read/update only their own profile; admins can read all
- `categories`: public read (anon + authenticated); admin-only write
- `products`: public read (anon + authenticated); admin-only write

## Helper Function
- `is_admin()`: checks if the current authenticated user has role='admin'
  in their profiles row. Used by all admin-scoped RLS policies.

## Trigger
- `handle_new_user()`: automatically creates a profiles row when a new user
  signs up via Supabase Auth.

## Indexes
- categories: slug, display_order
- products: category_id, is_new_arrival, is_best_seller
*/

-- ===== 1. profiles table (must exist before is_admin function) =====
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  email text UNIQUE,
  role text NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  phone text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ===== Helper function: is_admin() (must exist before policies) =====
DROP FUNCTION IF EXISTS public.is_admin();
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- ===== Now enable RLS and create policies on profiles =====
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own_or_admin" ON public.profiles;
CREATE POLICY "profiles_select_own_or_admin"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- ===== Auto-create profile on signup =====
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    NEW.email
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ===== 2. categories =====
CREATE TABLE IF NOT EXISTS public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  image_url text,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "categories_public_select" ON public.categories;
CREATE POLICY "categories_public_select"
  ON public.categories FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "categories_admin_insert" ON public.categories;
CREATE POLICY "categories_admin_insert"
  ON public.categories FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "categories_admin_update" ON public.categories;
CREATE POLICY "categories_admin_update"
  ON public.categories FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "categories_admin_delete" ON public.categories;
CREATE POLICY "categories_admin_delete"
  ON public.categories FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ===== 3. products =====
CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  price numeric(10, 2) NOT NULL DEFAULT 0,
  old_price numeric(10, 2),
  image_url text,
  gallery_images text[] DEFAULT '{}',
  size text,
  color text,
  stock int NOT NULL DEFAULT 0,
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  is_new_arrival boolean NOT NULL DEFAULT false,
  is_best_seller boolean NOT NULL DEFAULT false,
  is_b2b boolean NOT NULL DEFAULT false,
  is_b2c boolean NOT NULL DEFAULT true,
  bulk_price numeric(10, 2),
  min_order_quantity int NOT NULL DEFAULT 1,
  wholesale_price numeric(10, 2),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "products_public_select" ON public.products;
CREATE POLICY "products_public_select"
  ON public.products FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "products_admin_insert" ON public.products;
CREATE POLICY "products_admin_insert"
  ON public.products FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "products_admin_update" ON public.products;
CREATE POLICY "products_admin_update"
  ON public.products FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "products_admin_delete" ON public.products;
CREATE POLICY "products_admin_delete"
  ON public.products FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ===== updated_at trigger for products =====
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS products_updated_at ON public.products;
CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ===== Indexes =====
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_new_arrival ON public.products(is_new_arrival) WHERE is_new_arrival = true;
CREATE INDEX IF NOT EXISTS idx_products_is_best_seller ON public.products(is_best_seller) WHERE is_best_seller = true;
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_display_order ON public.categories(display_order);
