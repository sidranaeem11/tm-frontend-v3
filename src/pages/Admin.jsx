import { useEffect, useState } from "react";
import { api } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

const ADMIN_KEY = "nokia3310";

const emptyProduct = {
  name: "",
  description: "",
  price: "",
  oldPrice: "",
  imageUrl: "",
  size: "",
  color: "",
  categoryId: "",
  isNewArrival: false,
  isBestSeller: false,
  stock: "",
  // B2B/B2C fields
  isB2B: false,
  isB2C: true,
  bulkPrice: "",
  minOrderQuantity: "",
  wholesalePrice: "",
};

// Hardcoded categories for the dropdown
const CATEGORIES = [
  { id: 1, name: "Trousers" },
  { id: 2, name: "Hoodies" },
  { id: 3, name: "Shorts" },
  { id: 4, name: "Sports Wear" },
  { id: 5, name: "Leather Jackets" },
  { id: 6, name: "Track Suits" },
  { id: 7, name: "Suits" },
];

export default function Admin() {
  const { profile } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(CATEGORIES);
  const [form, setForm] = useState(emptyProduct);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState("");
  const [fileName, setFileName] = useState("");

  function loadData() {
    api.getProducts().then(setProducts);
    setCategories(CATEGORIES);
  }

  useEffect(() => {
    loadData();
  }, []);

  function startEdit(product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      oldPrice: product.oldPrice ?? "",
      imageUrl: product.imageUrl,
      size: product.size,
      color: product.color,
      categoryId: product.categoryId,
      isNewArrival: product.isNewArrival,
      isBestSeller: product.isBestSeller,
      stock: product.stock,
      // B2B/B2C fields
      isB2B: product.isB2B || false,
      isB2C: product.isB2C || true,
      bulkPrice: product.bulkPrice ?? "",
      minOrderQuantity: product.minOrderQuantity ?? "",
      wholesalePrice: product.wholesalePrice ?? "",
    });
    setFileName("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setForm(emptyProduct);
    setEditingId(null);
    setFileName("");
  }

  async function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    setStatus("Uploading image...");
    try {
      const { url } = await api.uploadImage(file, ADMIN_KEY);
      setForm((f) => ({ ...f, imageUrl: url }));
      setStatus("Image uploaded successfully!");
    } catch (err) {
      const localUrl = URL.createObjectURL(file);
      setForm((f) => ({ ...f, imageUrl: localUrl }));
      setStatus("Image preview ready (local)");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("Saving...");
    const payload = {
      name: form.name || "",
      description: form.description || "",
      price: parseFloat(form.price) || 0,
      oldPrice: form.oldPrice ? parseFloat(form.oldPrice) : null,
      imageUrl: form.imageUrl || "",
      size: form.size || "",
      color: form.color || "",
      categoryId: parseInt(form.categoryId) || 1,
      isNewArrival: form.isNewArrival || false,
      isBestSeller: form.isBestSeller || false,
      stock: parseInt(form.stock) || 0,
      galleryImages: [],
      // B2B/B2C fields
      isB2B: form.isB2B || false,
      isB2C: form.isB2C || true,
      bulkPrice: form.bulkPrice ? parseFloat(form.bulkPrice) : null,
      minOrderQuantity: form.minOrderQuantity
        ? parseInt(form.minOrderQuantity)
        : 1,
      wholesalePrice: form.wholesalePrice
        ? parseFloat(form.wholesalePrice)
        : null,
    };

    console.log("Submitting product:", payload);

    try {
      if (editingId) {
        await api.updateProduct(
          editingId,
          { ...payload, id: editingId },
          ADMIN_KEY,
        );
        setStatus("Product updated.");
      } else {
        await api.createProduct(payload, ADMIN_KEY);
        setStatus("Product added.");
      }
      resetForm();
      loadData();
    } catch (err) {
      console.error("Submit error:", err);
      setStatus("Error: " + err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this product?")) return;
    await api.deleteProduct(id, ADMIN_KEY);
    loadData();
  }

  return (
    <section className="section admin-page">
      <p className="muted" style={{ marginBottom: 16 }}>
        Logged in as: {profile?.email}
      </p>
      <h2>{editingId ? "Edit product" : "Add a new product"}</h2>

      <form onSubmit={handleSubmit} className="admin-form">
        <input
          placeholder="Product name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />

        <div className="admin-row">
          <input
            type="number"
            step="0.01"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />
          <input
            type="number"
            step="0.01"
            placeholder="Old price (optional)"
            value={form.oldPrice}
            onChange={(e) => setForm({ ...form, oldPrice: e.target.value })}
          />
        </div>

        {/* Upload with Icon */}
        <div className="admin-upload-block">
          <label className="upload-label">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <span>Click to upload image</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="upload-input-hidden"
            />
          </label>
          {fileName && <span className="upload-filename">📎 {fileName}</span>}
        </div>

        {form.imageUrl && (
          <div className="image-preview-container">
            <img src={form.imageUrl} alt="Preview" className="admin-preview" />
            <button
              type="button"
              className="remove-image-btn"
              onClick={() => {
                setForm({ ...form, imageUrl: "" });
                setFileName("");
              }}
            >
              ✕
            </button>
          </div>
        )}

        <div className="admin-row">
          <input
            placeholder="Sizes (S,M,L,XL)"
            value={form.size}
            onChange={(e) => setForm({ ...form, size: e.target.value })}
          />
          <input
            placeholder="Color"
            value={form.color}
            onChange={(e) => setForm({ ...form, color: e.target.value })}
          />
        </div>

        <div className="admin-row">
          <select
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            required
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Stock"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            required
          />
        </div>

        <div className="admin-row admin-checks">
          <label>
            <input
              type="checkbox"
              checked={form.isNewArrival}
              onChange={(e) =>
                setForm({ ...form, isNewArrival: e.target.checked })
              }
            />{" "}
            New Arrival
          </label>
          <label>
            <input
              type="checkbox"
              checked={form.isBestSeller}
              onChange={(e) =>
                setForm({ ...form, isBestSeller: e.target.checked })
              }
            />{" "}
            Best Seller
          </label>
        </div>

        {/* B2B / B2C Options */}
        <div className="admin-row admin-checks">
          <label>
            <input
              type="checkbox"
              checked={form.isB2B}
              onChange={(e) => setForm({ ...form, isB2B: e.target.checked })}
            />{" "}
            B2B (Business to Business)
          </label>
          <label>
            <input
              type="checkbox"
              checked={form.isB2C}
              onChange={(e) => setForm({ ...form, isB2C: e.target.checked })}
            />{" "}
            B2C (Business to Consumer)
          </label>
        </div>

        <div className="admin-row">
          <input
            type="number"
            step="0.01"
            placeholder="Bulk Price (B2B)"
            value={form.bulkPrice}
            onChange={(e) => setForm({ ...form, bulkPrice: e.target.value })}
          />
          <input
            type="number"
            placeholder="Min Order Quantity"
            value={form.minOrderQuantity}
            onChange={(e) =>
              setForm({ ...form, minOrderQuantity: e.target.value })
            }
          />
        </div>

        <div className="admin-row">
          <input
            type="number"
            step="0.01"
            placeholder="Wholesale Price"
            value={form.wholesalePrice}
            onChange={(e) =>
              setForm({ ...form, wholesalePrice: e.target.value })
            }
          />
        </div>

        <div className="admin-row">
          <button type="submit" className="btn-primary">
            {editingId ? "Update" : "Add product"}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="filter">
              Cancel
            </button>
          )}
        </div>
        {status && <p className="muted">{status}</p>}
      </form>

      <h2 style={{ marginTop: 48 }}>All Products ({products.length})</h2>
      <div className="admin-list">
        {products.map((p) => (
          <div className="admin-list-item" key={p.id}>
            <img src={p.imageUrl} alt={p.name} />
            <div className="admin-list-info">
              <p className="cart-item-name">{p.name}</p>
              <p className="muted">
                ${p.price} · {p.category?.name} · Stock: {p.stock}
                {p.isB2B && <span className="b2b-tag"> B2B</span>}
                {p.isB2C && <span className="b2c-tag"> B2C</span>}
              </p>
            </div>
            <button className="filter" onClick={() => startEdit(p)}>
              Edit
            </button>
            <button
              className="cart-item-remove"
              onClick={() => handleDelete(p.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
