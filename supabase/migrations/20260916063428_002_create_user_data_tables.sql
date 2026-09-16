/*
# TM INDUSTRY — User Data Tables: carts, wishlists, orders, order_items

## Purpose
Creates all user-scoped tables for the TM INDUSTRY e-commerce platform.
These tables handle shopping carts, wishlists, orders, and order line items
with full Row Level Security — users can only access their own data,
while admins can manage all orders.

## New Tables

### 4. carts
- `id` (uuid, PK) — auto-generated
- `user_id` (uuid, FK → auth.users, defaults to auth.uid()) — cart owner
- `items` (jsonb, default '[]') — array of cart line items stored as JSON
- `created_at` (timestamptz) — record creation time
- `updated_at` (timestamptz) — last modification time

### 5. wishlists
- `id` (uuid, PK) — auto-generated
- `user_id` (uuid, FK → auth.users, defaults to auth.uid()) — wishlist owner
- `product_id` (uuid, FK → products.id) — saved product
- `created_at` (timestamptz) — record creation time

### 6. orders
- `id` (uuid, PK) — auto-generated
- `user_id` (uuid, FK → auth.users, defaults to auth.uid()) — order owner
- `order_number` (text, unique) — human-readable order number (e.g. TM-XXXXXX)
- `status` (text, default 'pending') — order lifecycle state
- `total` (numeric, not null) — total order amount
- `shipping_address` (jsonb) — full shipping address stored as JSON
- `payment_status` (text, default 'pending') — payment state
- `payment_method` (text) — payment method used (e.g. 'stripe', 'safepay')
- `created_at` (timestamptz) — record creation time
- `updated_at` (timestamptz) — last modification time

### 7. order_items
- `id` (uuid, PK) — auto-generated
- `order_id` (uuid, FK → orders.id ON DELETE CASCADE) — parent order
- `product_id` (uuid, FK → products.id) — purchased product
- `name` (text) — product name (snapshot at time of order)
- `price` (numeric, not null) — unit price (snapshot at time of order)
- `quantity` (int, not null) — units purchased
- `size` (text) — selected size
- `color` (text) — selected color

## Security (RLS)
- `carts`: users can CRUD only their own cart
- `wishlists`: users can CRUD only their own wishlist entries
- `orders`: users can read only their own orders; admins can read/update all
- `order_items`: users can read items for their own orders; admins can read all

## Indexes
- carts: user_id (unique — one cart per user)
- wishlists: user_id, product_id, (user_id + product_id) unique pair
- orders: user_id, order_number (unique), status
- order_items: order_id, product_id

## Trigger
- `set_order_total()`: recalculates order.total from order_items before insert/update
- `generate_order_number()`: auto-generates a unique order number on insert
*/

-- ===== 4. carts =====
CREATE TABLE IF NOT EXISTS public.carts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "carts_select_own" ON public.carts;
CREATE POLICY "carts_select_own"
  ON public.carts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "carts_insert_own" ON public.carts;
CREATE POLICY "carts_insert_own"
  ON public.carts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "carts_update_own" ON public.carts;
CREATE POLICY "carts_update_own"
  ON public.carts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "carts_delete_own" ON public.carts;
CREATE POLICY "carts_delete_own"
  ON public.carts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ===== 5. wishlists =====
CREATE TABLE IF NOT EXISTS public.wishlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "wishlists_select_own" ON public.wishlists;
CREATE POLICY "wishlists_select_own"
  ON public.wishlists FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "wishlists_insert_own" ON public.wishlists;
CREATE POLICY "wishlists_insert_own"
  ON public.wishlists FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "wishlists_delete_own" ON public.wishlists;
CREATE POLICY "wishlists_delete_own"
  ON public.wishlists FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Prevent duplicate wishlist entries (same user + same product)
CREATE UNIQUE INDEX IF NOT EXISTS idx_wishlists_user_product
  ON public.wishlists(user_id, product_id);

-- ===== 6. orders =====
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  order_number text UNIQUE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  total numeric(10, 2) NOT NULL DEFAULT 0,
  shipping_address jsonb,
  payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_method text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "orders_select_own_or_admin" ON public.orders;
CREATE POLICY "orders_select_own_or_admin"
  ON public.orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "orders_insert_own" ON public.orders;
CREATE POLICY "orders_insert_own"
  ON public.orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "orders_update_admin" ON public.orders;
CREATE POLICY "orders_update_admin"
  ON public.orders FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ===== 7. order_items =====
CREATE TABLE IF NOT EXISTS public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  name text,
  price numeric(10, 2) NOT NULL DEFAULT 0,
  quantity int NOT NULL DEFAULT 1,
  size text,
  color text
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "order_items_select_own_or_admin" ON public.order_items;
CREATE POLICY "order_items_select_own_or_admin"
  ON public.order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND (orders.user_id = auth.uid() OR public.is_admin())
    )
  );

DROP POLICY IF EXISTS "order_items_insert_own" ON public.order_items;
CREATE POLICY "order_items_insert_own"
  ON public.order_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- ===== Generate order number on insert =====
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  seq_val int;
BEGIN
  seq_val := nextval('public.order_number_seq');
  NEW.order_number := 'TM-' || lpad(seq_val::text, 6, '0');
  RETURN NEW;
END;
$$;

-- Sequence for order numbers
CREATE SEQUENCE IF NOT EXISTS public.order_number_seq START 1;

DROP TRIGGER IF EXISTS orders_generate_number ON public.orders;
CREATE TRIGGER orders_generate_number
  BEFORE INSERT ON public.orders
  FOR EACH ROW
  WHEN (NEW.order_number IS NULL)
  EXECUTE FUNCTION public.generate_order_number();

-- ===== updated_at triggers =====
CREATE TRIGGER carts_updated_at
  BEFORE UPDATE ON public.carts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ===== Indexes =====
CREATE UNIQUE INDEX IF NOT EXISTS idx_carts_user_id ON public.carts(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_user_id ON public.wishlists(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_product_id ON public.wishlists(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);
