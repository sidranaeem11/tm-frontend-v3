import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <p className="hero-eyebrow">TM INDUSTRY</p>
        <h1 className="hero-title">
          Tailored pieces, built to outlast the season.
        </h1>
        <p className="hero-sub">
          Premium craftsmanship meets modern design. Discover our collection of
          timeless essentials.
        </p>
        <Link to="/shop" className="btn-primary">
          Explore Collection
        </Link>
      </div>
      <div className="hero-visual">
        <div className="hero-layer hero-layer-back"></div>
        <img
          src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=800&fit=crop"
          alt="TM Industry Collection"
          className="hero-layer-image"
        />
        <div className="hero-layer hero-layer-frame"></div>
      </div>
    </section>
  );
}
