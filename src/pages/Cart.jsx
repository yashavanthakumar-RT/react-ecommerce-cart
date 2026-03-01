import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { FaTrash, FaPlus, FaMinus, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import { formatINR } from "../utils/formatCurrency";

const Cart = () => {
  const { cart, increaseQty, decreaseQty, removeFromCart, total } = useContext(CartContext);

  return (
    <div className="page-wrapper" style={{ padding: 32 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ marginBottom: 18 }}>My Cart</h2>

        {cart.length === 0 && <p>Your cart is empty</p>}

        {cart.map((item) => (
          <div key={item.id} className="cart-item">
            <img src={item.image} alt={item.title} className="cart-item-image" />

            <div>
              <Link to={`/product/${item.id}`} style={{ textDecoration: 'none' }}>
                <h3 className="product-title">{item.title}</h3>
              </Link>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', margin: '8px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FaStar key={i} style={{ color: i < (item.rating ?? 4) ? '#ffbf00' : '#e6e6e6' }} />
                  ))}
                  <span style={{ color: '#666', fontSize: 13, marginLeft: 8 }}>({item.reviews ?? 12})</span>
                </div>

                {item.discount && <span className="product-discount">{item.discount}% OFF</span>}
                <div className={`stock-badge ${item.stock === 0 ? 'out' : item.stock < 5 ? 'low' : 'in'}`}>
                  {item.stock === 0 ? 'Out of stock' : item.stock < 5 ? `Only ${item.stock} left` : 'In stock'}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button className="qty-btn" onClick={() => decreaseQty(item.id)}><FaMinus /></button>
                  <div style={{ minWidth: 28, textAlign: 'center', fontWeight: 700 }}>{item.quantity}</div>
                  <button className="qty-btn" onClick={() => increaseQty(item.id)}><FaPlus /></button>
                </div>

                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, color: '#2874f0', fontSize: 18 }}>{formatINR(item.price * item.quantity)}</div>
                  {item.originalPrice && <div className="product-original-price">{formatINR(item.originalPrice)}</div>}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button className="cart-delete" onClick={() => removeFromCart(item.id)} aria-label="Remove item"><FaTrash /></button>
            </div>
          </div>
        ))}

        {cart.length > 0 && (
          <div style={{ marginTop: 24, textAlign: 'right' }}>
            <h3>Total: {formatINR(total || 0)}</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
