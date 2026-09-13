import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import { api } from "../api.js";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const data = await api.getProducts();
        // Show only first 4 products on home page
        setProducts(data.slice(0, 4));
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="section center">
        <h2>Loading...</h2>
      </section>
    );
  }

  return (
    <>
      <section className="section">
        <div className="section-head">
          <h2>Featured Products</h2>
          <Link to="/shop" className="section-link">
            View All →
          </Link>
        </div>

        {products.length === 0 ? (
          <p className="muted">No products available.</p>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
