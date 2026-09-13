export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <p className="footer-mark">TM.</p>
          <p className="footer-tag">
            Tailored pieces, built to outlast the season.
          </p>
        </div>
        <div className="footer-cols">
          <div>
            <p className="footer-heading">Shop</p>
            <p>Trousers</p>
            <p>Hoodies</p>
            <p>Shorts</p>
            <p>Sports Wear</p>
            <p>Leather Jackets</p>
            <p>Track Suits</p>
            <p>Suits</p>
          </div>
          <div>
            <p className="footer-heading">Support</p>
            <p>Size guide</p>
            <p>Shipping</p>
            <p>Returns</p>
          </div>
        </div>
      </div>
      <p className="footer-bottom">
        © {new Date().getFullYear()} TM. All rights reserved.
      </p>
    </footer>
  );
}
