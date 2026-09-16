/*
# TM INDUSTRY — Fix security advisor warnings

## Purpose
Addresses security linter findings:
1. Revoke direct EXECUTE on SECURITY DEFINER functions from anon/authenticated
   roles so they cannot be called via the REST API.
2. Set an explicit search_path on handle_updated_at to prevent
   search_path manipulation attacks.

## Changes
- REVOKE EXECUTE on is_admin(), handle_new_user(), generate_order_number()
- Recreate handle_updated_at() with search_path = public, re-attaching triggers
*/

-- Revoke EXECUTE on internal SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.generate_order_number() FROM anon, authenticated;

-- Fix mutable search_path on handle_updated_at
-- Must drop with CASCADE since triggers depend on it, then recreate + reattach
DROP TRIGGER IF EXISTS products_updated_at ON public.products;
DROP TRIGGER IF EXISTS carts_updated_at ON public.carts;
DROP TRIGGER IF EXISTS orders_updated_at ON public.orders;
DROP FUNCTION IF EXISTS public.handle_updated_at() CASCADE;

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER carts_updated_at
  BEFORE UPDATE ON public.carts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
