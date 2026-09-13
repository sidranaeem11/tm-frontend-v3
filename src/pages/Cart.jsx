import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

export default function Cart() {
  const { items, removeItem, updateQty, total } = useCart()

  if (items.length === 0) {
    return (
      <section className="section center">
        <h2>Your cart is empty</h2>
        <Link to="/shop" className="btn-primary">Continue shopping</Link>
      </section>
    )
  }

  return (
    <section className="section cart-page">
      <h2>Your cart</h2>
      <div className="cart-list">
        {items.map((item) => (
          <div className="cart-item" key={item.key}>
            <img src={item.product.imageUrl} alt={item.product.name} />
            <div className="cart-item-info">
              <p className="cart-item-name">{item.product.name}</p>
              <p className="muted">{item.size} · {item.color}</p>
              <div className="cart-item-qty">
                <button onClick={() => updateQty(item.key, item.qty - 1)}>-</button>
                <span>{item.qty}</span>
                <button onClick={() => updateQty(item.key, item.qty + 1)}>+</button>
              </div>
            </div>
            <div className="cart-item-price">${(item.product.price * item.qty).toFixed(2)}</div>
            <button className="cart-item-remove" onClick={() => removeItem(item.key)}>Remove</button>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <div className="cart-total">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <button className="btn-primary btn-full">Checkout</button>
      </div>
    </section>
  )
}
