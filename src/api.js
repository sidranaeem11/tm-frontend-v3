const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5224/api";

export const api = {
  getProducts: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`);
      if (!response.ok) throw new Error("Failed to fetch products");
      return await response.json();
    } catch (error) {
      console.warn("Error fetching products:", error);
      return [];
    }
  },

  getProduct: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`);
      if (!response.ok) throw new Error("Product not found");
      return await response.json();
    } catch (error) {
      console.warn("Error fetching product:", error);
      return null;
    }
  },

  uploadImage: async (file, adminKey) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: "POST",
        headers: { "X-Admin-Key": adminKey },
        body: formData,
      });
      if (!response.ok) throw new Error("Upload failed");
      return await response.json();
    } catch (error) {
      console.warn("Upload failed, using local preview:", error);
      const localUrl = URL.createObjectURL(file);
      return { url: localUrl };
    }
  },

  createProduct: async (product, adminKey) => {
    try {
      const productData = {
        name: product.name || "",
        description: product.description || "",
        price: parseFloat(product.price) || 0,
        oldPrice: product.oldPrice ? parseFloat(product.oldPrice) : null,
        imageUrl: product.imageUrl || "",
        size: product.size || "",
        color: product.color || "",
        categoryId: parseInt(product.categoryId) || 1,
        isNewArrival: product.isNewArrival || false,
        isBestSeller: product.isBestSeller || false,
        stock: parseInt(product.stock) || 0,
        galleryImages: product.galleryImages || [],
        isB2B: product.isB2B || false,
        isB2C: product.isB2C || true,
        bulkPrice: product.bulkPrice ? parseFloat(product.bulkPrice) : null,
        minOrderQuantity: product.minOrderQuantity
          ? parseInt(product.minOrderQuantity)
          : 1,
        wholesalePrice: product.wholesalePrice
          ? parseFloat(product.wholesalePrice)
          : null,
      };

      const response = await fetch(`${API_BASE_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Key": adminKey,
        },
        body: JSON.stringify(productData),
      });

      const responseText = await response.text();
      if (!response.ok) {
        throw new Error(`Server error (${response.status}): ${responseText}`);
      }
      return JSON.parse(responseText);
    } catch (error) {
      console.error("Create product error:", error);
      throw error;
    }
  },

  // ✅ FIXED: backend returns 204 No Content on success, so we don't call .json()
  updateProduct: async (id, product, adminKey) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Key": adminKey,
        },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to update product: ${errorText || response.status}`,
        );
      }

      // Success (204 No Content) — nothing to parse
      return true;
    } catch (error) {
      console.warn("Update product failed:", error);
      throw error;
    }
  },

  // ✅ FIXED: backend returns 204 No Content on success, so we don't call .json()
  deleteProduct: async (id, adminKey) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: "DELETE",
        headers: { "X-Admin-Key": adminKey },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to delete product: ${errorText || response.status}`,
        );
      }

      // Success (204 No Content) — nothing to parse
      return true;
    } catch (error) {
      console.warn("Delete product failed:", error);
      throw error;
    }
  },

  getCategories: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      if (!response.ok) throw new Error("Failed to fetch categories");
      return await response.json();
    } catch (error) {
      console.warn("Error fetching categories:", error);
      return [
        { id: 1, name: "Trousers" },
        { id: 2, name: "Hoodies" },
        { id: 3, name: "Shorts" },
        { id: 4, name: "Sports Wear" },
        { id: 5, name: "Leather Jackets" },
        { id: 6, name: "Track Suits" },
        { id: 7, name: "Suits" },
      ];
    }
  },
};
