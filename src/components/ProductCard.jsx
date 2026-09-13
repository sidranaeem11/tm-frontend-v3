import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <div className="product-card-image">
        <img src={product.imageUrl} alt={product.name} />
        {product.isNewArrival && <span className="tag tag-new">New</span>}
        {product.isBestSeller && (
          <span className="tag tag-sale">Best Seller</span>
        )}
      </div>
      <div className="product-card-body">
        <p className="product-card-category">{product.category?.name}</p>
        <p className="product-card-name">{product.name}</p>
        <div className="product-card-price">
          <span>${product.price}</span>
          {product.oldPrice && (
            <span className="price-old">${product.oldPrice}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
