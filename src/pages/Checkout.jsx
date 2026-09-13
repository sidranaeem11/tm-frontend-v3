import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();

  // Prefer fresh navigation state; fall back to sessionStorage (e.g. after a refresh)
  let items = location.state?.items;
  if (!items) {
    try {
      const saved = sessionStorage.getItem("checkoutItems");
      items = saved ? JSON.parse(saved) : [];
    } catch {
      items = [];
    }
  }

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(false);

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handlePlaceOrder(e) {
    e.preventDefault();
    setPlacing(true);

    // ⚠️ PLACEHOLDER: real payment gateway (e.g. Safepay) will be
    // integrated here once the merchant account is ready.
    // For now we just simulate a short delay and mark the order placed.
    await new Promise((resolve) => setTimeout(resolve, 1200));

    setPlacing(false);
    setPlaced(true);
  }

  if (items.length === 0 && !placed) {
    return (
      <section className="section center">
        <h2>No items to checkout</h2>
        <p className="muted">Please choose a product first.</p>
        <Link to="/shop" className="btn-primary" style={{ marginTop: 20 }}>
          Browse Products
        </Link>
      </section>
    );
  }

  if (placed) {
    return (
      <section className="section center">
        <h2>Order Received 🎉</h2>
        <p className="muted">
          Thank you, {form.fullName || "customer"}! Your order is being
          processed. (Payment gateway integration coming soon — this is a test
          checkout.)
        </p>
        <Link to="/shop" className="btn-primary" style={{ marginTop: 20 }}>
          Continue Shopping
        </Link>
      </section>
    );
  }

  return (
    <section className="section">
      <h1 style={{ marginBottom: 32, fontFamily: "var(--font-display)" }}>
        Checkout
      </h1>

      <div
        className="checkout-layout"
        style={{ display: "flex", gap: 40, flexWrap: "wrap" }}
      >
        {/* Order Summary */}
        <div style={{ flex: "1 1 300px" }}>
          <h2 style={{ marginBottom: 16 }}>Order Summary</h2>
          {items.map((item, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                gap: 12,
                marginBottom: 16,
                paddingBottom: 16,
                borderBottom: "1px solid #eee",
              }}
            >
              <img
                src={item.imageUrl}
                alt={item.name}
                style={{
                  width: 64,
                  height: 64,
                  objectFit: "cover",
                  borderRadius: 6,
                }}
              />
              <div>
                <p className="cart-item-name">{item.name}</p>
                <p className="muted">
                  Size: {item.size} · Qty: {item.quantity}
                </p>
                <p>${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          ))}
          <div style={{ fontWeight: 700, fontSize: 18, marginTop: 12 }}>
            Total: ${total.toFixed(2)}
          </div>
        </div>

        {/* Checkout Form */}
        <form
          onSubmit={handlePlaceOrder}
          style={{ flex: "1 1 360px" }}
          className="admin-form"
        >
          <h2 style={{ marginBottom: 16 }}>Shipping Details</h2>
          <input
            name="fullName"
            placeholder="Full name"
            value={form.fullName}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            name="phone"
            placeholder="Phone number"
            value={form.phone}
            onChange={handleChange}
            required
          />
          <input
            name="address"
            placeholder="Street address"
            value={form.address}
            onChange={handleChange}
            required
          />
          <div className="admin-row">
            <input
              name="city"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
              required
            />
            <input
              name="country"
              placeholder="Country"
              value={form.country}
              onChange={handleChange}
              required
            />
          </div>

          <h2 style={{ marginTop: 24, marginBottom: 16 }}>Card Details</h2>
          <p className="muted" style={{ marginBottom: 12 }}>
            🔒 Test mode — no real payment will be charged yet.
          </p>
          <input
            name="cardNumber"
            placeholder="Card number"
            value={form.cardNumber}
            onChange={handleChange}
            maxLength={19}
            required
          />
          <div className="admin-row">
            <input
              name="expiry"
              placeholder="MM/YY"
              value={form.expiry}
              onChange={handleChange}
              maxLength={5}
              required
            />
            <input
              name="cvv"
              placeholder="CVV"
              value={form.cvv}
              onChange={handleChange}
              maxLength={4}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ marginTop: 24, width: "100%" }}
            disabled={placing}
          >
            {placing ? "Placing order..." : `Pay $${total.toFixed(2)}`}
          </button>
        </form>
      </div>
    </section>
  );
}
