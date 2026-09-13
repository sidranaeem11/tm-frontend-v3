import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Products from "./pages/Products.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Admin from "./pages/Admin.jsx";
import Login from "./pages/Login.jsx"; // ✅ Add
import Signup from "./pages/Signup.jsx"; // ✅ Add
import Checkout from "./pages/Checkout.jsx"; // ✅ Add

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Products />} />
          <Route path="/shop/:categorySlug" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/login" element={<Login />} /> {/* ✅ Add */}
          <Route path="/signup" element={<Signup />} /> {/* ✅ Add */}
          <Route path="/checkout" element={<Checkout />} /> {/* ✅ Add */}
        </Routes>
      </main>
      <Footer />
    </>
  );
}
