import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import api from "../services/api";
import Loader from "../components/Loader";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { FaHeart, FaStar } from "react-icons/fa";
import { formatINR } from "../utils/formatCurrency";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useContext(WishlistContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get("/products");
        const foundProduct = res.data.find((p) => String(p.id) === String(id));
        setProduct(foundProduct || null);
      } catch (error) {
        console.error(error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <Loader />;
  if (!product) return <h2>Product not found</h2>;

  const originalPrice = product.originalPrice ?? Math.round(product.price * 1.18);
  const discount = product.discount ?? (10 + (product.id % 4) * 5);
  const rating = product.rating ?? Math.min(5, 3 + (product.id % 3));
  const reviews = product.reviews ?? 10 + (product.id % 200);
  const stock = product.stock ?? (product.id % 5 === 0 ? 0 : (product.id % 3 === 0 ? 2 : 12));

  const handleWishlist = () => {
    if (isInWishlist(product.id)) removeFromWishlist(product.id);
    else addToWishlist(product);
  };

  const handleAddToCart = () => {
    if (stock === 0) {
      alert("Sorry, this product is out of stock.");
      return;
    }
    addToCart(product);
    alert(`${product.title} added to cart`);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
      <div style={{ maxWidth: 1000, width: '100%', display: 'flex', gap: 28, padding: 24 }}>
        <div style={{ flex: '0 0 420px', background: 'white', borderRadius: 12, padding: 18, border: '1px solid #eef6ff' }}>
          <img src={product.image} alt={product.title} className="product-image" style={{ height: 360 }} />
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <FaStar key={i} style={{ color: i < rating ? '#ffbf00' : '#e6e6e6' }} />
              ))}
              <span style={{ color: '#666', fontSize: 13 }}>({reviews})</span>
            </div>

            <div className="product-discount">{discount}% OFF</div>
            <div className={`stock-badge ${stock === 0 ? 'out' : stock < 5 ? 'low' : 'in'}`}>{stock === 0 ? 'Out of stock' : stock < 5 ? `Only ${stock} left` : 'In stock'}</div>
          </div>

          <div style={{ marginTop: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="product-price">{formatINR(product.price)}</div>
              <div className="product-original-price">{formatINR(originalPrice)}</div>
            </div>
          </div>

          <div style={{ marginTop: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="product-price">${product.price}</div>
              <div className="product-original-price">${originalPrice}</div>
            </div>

            <p style={{ color: '#333', marginTop: 14 }}>{product.description}</p>

            <div style={{ display: 'flex', gap: 12, marginTop: 18 }}>
              <button onClick={handleAddToCart} className="add-to-cart-btn" style={{ padding: '10px 18px' }}>
                Add to Cart
              </button>
              <button onClick={handleWishlist} className="category-btn" style={{ padding: '10px 14px' }}>
                {isInWishlist(product.id) ? 'Remove Wishlist' : 'Add to Wishlist'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
