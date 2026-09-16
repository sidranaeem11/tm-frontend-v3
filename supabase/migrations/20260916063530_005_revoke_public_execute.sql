/*
# TM INDUSTRY — Revoke PUBLIC execute on internal functions

## Purpose
The previous REVOKE from anon/authenticated didn't clear the warnings
because PostgreSQL grants EXECUTE to PUBLIC by default when functions
are created. This migration revokes EXECUTE from PUBLIC on all internal
SECURITY DEFINER functions, then grants back only to the table owner
(postgres) so triggers can still invoke them.

## Changes
- REVOKE EXECUTE ON ALL internal SECURITY DEFINER functions FROM PUBLIC
- Functions affected: is_admin(), handle_new_user(), generate_order_number()
*/

REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.generate_order_number() FROM PUBLIC;
