import { supabase } from "./supabase.js";

/*
 * Supabase data layer for TM INDUSTRY.
 *
 * Returns data in the SAME camelCase shape the frontend already
 * consumes from the .NET API (api.js), so components don't need
 * to change.  Supabase stores columns in snake_case; this module
 * translates between the two.
 */

function mapProduct(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    price: parseFloat(row.price) || 0,
    oldPrice: row.old_price != null ? parseFloat(row.old_price) : null,
    imageUrl: row.image_url || "",
    galleryImages: row.gallery_images || [],
    size: row.size || "",
    color: row.color || "",
    stock: row.stock ?? 0,
    categoryId: row.category_id,
    category: row.category
      ? {
          id: row.category.id,
          name: row.category.name,
          slug: row.category.slug,
          imageUrl: row.category.image_url || "",
        }
      : null,
    isNewArrival: row.is_new_arrival ?? false,
    isBestSeller: row.is_best_seller ?? false,
    isB2B: row.is_b2b ?? false,
    isB2C: row.is_b2c ?? true,
    bulkPrice: row.bulk_price != null ? parseFloat(row.bulk_price) : null,
    minOrderQuantity: row.min_order_quantity ?? 1,
    wholesalePrice:
      row.wholesale_price != null ? parseFloat(row.wholesale_price) : null,
  };
}

function mapCategory(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    imageUrl: row.image_url || "",
  };
}

export const db = {
  getCategories: async () => {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("display_order", { ascending: true });
    if (error) {
      console.warn("Supabase getCategories error:", error);
      return [];
    }
    return (data || []).map(mapCategory);
  },

  getProducts: async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*, category:categories(*)")
      .order("created_at", { ascending: false });
    if (error) {
      console.warn("Supabase getProducts error:", error);
      return [];
    }
    return (data || []).map(mapProduct);
  },

  getProduct: async (id) => {
    const { data, error } = await supabase
      .from("products")
      .select("*, category:categories(*)")
      .eq("id", id)
      .maybeSingle();
    if (error) {
      console.warn("Supabase getProduct error:", error);
      return null;
    }
    return mapProduct(data);
  },

  getProductsByCategorySlug: async (slug) => {
    const { data: catData } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (!catData) return [];

    const { data, error } = await supabase
      .from("products")
      .select("*, category:categories(*)")
      .eq("category_id", catData.id)
      .order("created_at", { ascending: false });
    if (error) {
      console.warn("Supabase getProductsByCategorySlug error:", error);
      return [];
    }
    return (data || []).map(mapProduct);
  },
};
