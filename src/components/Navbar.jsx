import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

export default function Navbar() {
  const { count } = useCart();
  return (
    <header className="nav-wrap">
      {/* Top Black Bar - TM INDUSTRY */}
      <div className="nav-top">
        <div className="nav-top-inner">
          <span className="nav-brand-text">TM INDUSTRY</span>
        </div>
      </div>

      {/* Second Bar - Search + Icons */}
      <div className="nav-main">
        <div className="nav-main-inner">
          {/* Search Bar */}
          <div className="nav-search">
            <input
              type="text"
              placeholder="Search for products..."
              className="search-input"
            />
            <button className="search-btn">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </div>

          {/* Right Side - Login + Social Icons */}
          <div className="nav-right">
            <Link to="/login" className="nav-icon-btn">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span>Login</span>
            </Link>

            <Link to="/signup" className="nav-icon-btn signup-btn">
              <span>Sign Up</span>
            </Link>

            {/* WhatsApp Icon */}
            <a
              href="https://wa.me/923252632690"
              className="nav-icon-btn"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              title="Chat with us on WhatsApp"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12.032 21.965c-1.821.003-3.604-.481-5.13-1.393l-5.162 1.486 1.635-4.801a10.723 10.723 0 0 1-1.685-5.747c.015-5.93 4.816-10.74 10.745-10.755h.006c2.87.002 5.567 1.122 7.594 3.153a10.766 10.766 0 0 1 3.139 7.645c-.015 5.93-4.817 10.74-10.746 10.755h-.001zm.004-19.69h-.004c-4.901.012-8.875 3.993-8.887 8.894a8.857 8.857 0 0 0 1.814 5.46l-1.194 3.505 3.672-1.057a8.857 8.857 0 0 0 4.885 1.493c4.901-.012 8.875-3.993 8.887-8.894a8.876 8.876 0 0 0-2.583-6.297 8.848 8.848 0 0 0-6.28-2.607l-.01.003z" />
                <path d="M17.456 14.734c-.12.339-.706 1.659-1.082 2.013-.455.427-1.054.529-1.727.342-.628-.175-1.263-.475-2.104-.968-1.262-.739-2.458-1.93-3.322-3.144-.448-.63-.928-1.552-.795-2.444.126-.846.728-1.264.925-1.48.204-.225.466-.263.596-.263.125-.002.298.003.47.222.209.266.818 1.086.888 1.165.075.083.131.185.056.346-.095.2-.473.617-.72.919-.116.145-.235.303-.11.514.536.935 1.66 1.933 2.746 2.434.34.158.607.256.806.326.207.087.458.058.612-.101.289-.3.696-.772.985-.974.213-.147.39-.17.612-.07.283.116 1.432.686 1.68.806.058.029.098.046.112.073.067.118.067.286-.016.626z" />
              </svg>
            </a>

            {/* Instagram Icon */}
            <a
              href="https://www.instagram.com/tmindustry66?stkn=MXBhM3ZxNmdlazJ5aw%3D%3D&utm_source=qr"
              className="nav-icon-btn"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.2.06 2.2.27 3 .58a6 6 0 0 1 2.2 1.4 6 6 0 0 1 1.4 2.2c.3.8.5 1.8.6 3 .1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 2.2-.6 3a6 6 0 0 1-1.4 2.2 6 6 0 0 1-2.2 1.4c-.8.3-1.8.5-3 .6-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-2.2-.3-3-.6a6 6 0 0 1-2.2-1.4A6 6 0 0 1 .5 20.6c-.3-.8-.5-1.8-.6-3C-.2 16.3-.2 15.9-.2 12.7s0-3.6.1-4.9c.1-1.2.3-2.2.6-3A6 6 0 0 1 1.9 2.6a6 6 0 0 1 2.2-1.4c.8-.3 1.8-.5 3-.6C8.4 2.2 8.8 2.2 12 2.2Zm0 1.8c-3.1 0-3.5 0-4.7.07-1 .05-1.6.22-2 .37a3.7 3.7 0 0 0-1.4.9 3.7 3.7 0 0 0-.9 1.4c-.15.4-.32 1-.37 2C2.5 9.7 2.5 10.1 2.5 12s0 3.5.07 4.7c.05 1 .22 1.6.37 2a3.7 3.7 0 0 0 .9 1.4 3.7 3.7 0 0 0 1.4.9c.4.15 1 .32 2 .37 1.2.07 1.6.07 4.7.07s3.5 0 4.7-.07c1-.05 1.6-.22 2-.37a3.7 3.7 0 0 0 1.4-.9 3.7 3.7 0 0 0 .9-1.4c.15-.4.32-1 .37-2 .07-1.2.07-1.6.07-4.7s0-3.5-.07-4.7c-.05-1-.22-1.6-.37-2a3.7 3.7 0 0 0-.9-1.4 3.7 3.7 0 0 0-1.4-.9c-.4-.15-1-.32-2-.37C15.5 4 15.1 4 12 4Zm0 3.4a4.6 4.6 0 1 1 0 9.2 4.6 4.6 0 0 1 0-9.2Zm0 1.8a2.8 2.8 0 1 0 0 5.6 2.8 2.8 0 0 0 0-5.6Zm4.8-2a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2Z" />
              </svg>
            </a>

            {/* Facebook Icon */}
            <a
              href="https://www.facebook.com/share/1E1JjB9k3x/?mibextid=wwXIfr"
              className="nav-icon-btn"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z" />
              </svg>
            </a>

            <Link to="/cart" className="nav-cart-btn">
              Cart <span className="nav-cart-count">{count}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Category Links */}
      <div className="nav-categories">
        <div className="nav-categories-inner">
          <Link to="/shop">Shop all</Link>
          <Link to="/shop/trousers">Trousers</Link>
          <Link to="/shop/hoodies">Hoodies</Link>
          <Link to="/shop/shorts">Shorts</Link>
          <Link to="/shop/sports-wear">Sports Wear</Link>
          <Link to="/shop/leather-jackets">Leather Jackets</Link>
          <Link to="/shop/track-suits">Track Suits</Link>
          <Link to="/shop/suits">Suits</Link>
        </div>
      </div>
    </header>
  );
}
