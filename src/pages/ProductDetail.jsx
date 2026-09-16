import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { db } from "../lib/db.js";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const data = await db.getProduct(id);
        if (data) {
          setProduct(data);
          // Set default size if available
          if (data.size) {
            const sizes = data.size.split(",");
            if (sizes.length > 0) {
              setSelectedSize(sizes[0].trim());
            }
          }
        } else {
          setError("Product not found");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const addToCart = () => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }
    alert(
      `Added ${quantity} x ${product?.name} (Size: ${selectedSize}) to cart!`,
    );
  };

  const buyNow = () => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }
    const items = [
      {
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        size: selectedSize,
        quantity: quantity,
      },
    ];
    sessionStorage.setItem("checkoutItems", JSON.stringify(items));
    navigate("/checkout", { state: { items } });
  };

  if (loading) {
    return (
      <section className="section center">
        <h2>Loading...</h2>
      </section>
    );
  }

  if (error || !product) {
    return (
      <section className="section center">
        <h2>Product Not Found</h2>
        <p className="muted">The product you're looking for doesn't exist.</p>
        <Link to="/shop" className="btn-primary" style={{ marginTop: 20 }}>
          Back to Shop
        </Link>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="product-detail">
        <div className="pd-image-main">
          <img src={product.imageUrl} alt={product.name} />
        </div>

        <div className="pd-info">
          <p className="pd-category">{product.category?.name || "Category"}</p>
          <h1 className="pd-name">{product.name}</h1>

          <div className="pd-price">
            <span>${product.price}</span>
            {product.oldPrice && (
              <span className="price-old">${product.oldPrice}</span>
            )}
          </div>

          <p className="pd-desc">{product.description}</p>

          {product.size && (
            <div className="pd-attr">
              <p className="pd-attr-label">Select Size</p>
              <div className="pd-sizes">
                {product.size.split(",").map((size) => (
                  <button
                    key={size.trim()}
                    className={`pd-size ${selectedSize === size.trim() ? "active" : ""}`}
                    onClick={() => setSelectedSize(size.trim())}
                  >
                    {size.trim()}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.color && (
            <div className="pd-attr">
              <p className="pd-attr-label">Color</p>
              <p className="pd-attr-value">{product.color}</p>
            </div>
          )}

          <p className="pd-stock">
            {product.stock > 0
              ? `In Stock (${product.stock} available)`
              : "Out of Stock"}
          </p>

          <div className="pd-attr">
            <p className="pd-attr-label">Quantity</p>
            <div className="pd-sizes">
              <button
                className="pd-size"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </button>
              <span style={{ padding: "0 16px", fontSize: "18px" }}>
                {quantity}
              </span>
              <button
                className="pd-size"
                onClick={() =>
                  setQuantity(Math.min(product.stock, quantity + 1))
                }
              >
                +
              </button>
            </div>
          </div>

          <button
            className="btn-primary"
            style={{ marginTop: 20, width: "100%" }}
            onClick={addToCart}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>

          <button
            className="btn-primary"
            style={{
              marginTop: 12,
              width: "100%",
              background: "#b3261e",
              borderColor: "#b3261e",
            }}
            onClick={buyNow}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? "Out of Stock" : "Buy Now"}
          </button>

          <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
            {product.isB2B && <span className="b2b-tag">B2B</span>}
            {product.isB2C && <span className="b2c-tag">B2C</span>}
          </div>

          {product.isB2B && (
            <div
              style={{
                marginTop: 16,
                padding: 16,
                background: "#f5f5f5",
                borderRadius: 8,
              }}
            >
              <p style={{ fontSize: 14, fontWeight: 600 }}>B2B Pricing</p>
              {product.bulkPrice && (
                <p style={{ fontSize: 13 }}>Bulk Price: ${product.bulkPrice}</p>
              )}
              {product.wholesalePrice && (
                <p style={{ fontSize: 13 }}>
                  Wholesale Price: ${product.wholesalePrice}
                </p>
              )}
              {product.minOrderQuantity && (
                <p style={{ fontSize: 13 }}>
                  Min Order: {product.minOrderQuantity} units
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
