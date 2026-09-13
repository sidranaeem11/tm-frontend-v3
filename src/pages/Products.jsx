import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api.js";

export default function Products() {
  const { categorySlug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const data = await api.getProducts();
        console.log("All products:", data);
        console.log("Category slug from URL:", categorySlug);

        if (categorySlug) {
          const filtered = data.filter((p) => {
            // ✅ Category name aur slug dono se match karo
            const productCategoryName = (p.category?.name || "")
              .toLowerCase()
              .trim();
            const productCategorySlug = (p.category?.slug || "")
              .toLowerCase()
              .trim();
            const searchSlug = categorySlug.toLowerCase().trim();

            console.log("Comparing:", {
              productCategoryName,
              productCategorySlug,
              searchSlug,
            });

            // Multiple matching options
            return (
              productCategorySlug === searchSlug ||
              productCategoryName === searchSlug ||
              productCategoryName === searchSlug.replace(/-/g, " ") ||
              productCategoryName.replace(/\s+/g, "-") === searchSlug
            );
          });
          console.log("Filtered products:", filtered);
          setProducts(filtered);
        } else {
          setProducts(data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [categorySlug]);

  const getCategoryName = () => {
    if (!categorySlug) return "All Products";
    return categorySlug
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  if (loading) {
    return (
      <section className="section center">
        <h2>Loading products...</h2>
      </section>
    );
  }

  return (
    <section className="section">
      <h1 style={{ marginBottom: 32, fontFamily: "var(--font-display)" }}>
        {getCategoryName()}
      </h1>

      {products.length === 0 ? (
        <div>
          <p className="muted">No products found in this category.</p>
          <Link
            to="/shop"
            className="btn-primary"
            style={{ marginTop: 20, display: "inline-block" }}
          >
            Browse All Products
          </Link>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <Link
              to={`/product/${product.id}`}
              className="product-card"
              key={product.id}
            >
              <div className="product-card-image">
                <img src={product.imageUrl} alt={product.name} />
                {product.isNewArrival && (
                  <span className="tag tag-new">New</span>
                )}
                {product.isBestSeller && (
                  <span className="tag tag-sale">Best Seller</span>
                )}
              </div>
              <div className="product-card-body">
                <p className="product-card-category">
                  {product.category?.name}
                </p>
                <p className="product-card-name">{product.name}</p>
                <div className="product-card-price">
                  <span>${product.price}</span>
                  {product.oldPrice && (
                    <span className="price-old">${product.oldPrice}</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
