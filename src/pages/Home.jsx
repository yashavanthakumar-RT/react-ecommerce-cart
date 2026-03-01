import { useEffect, useState, useMemo, useContext } from "react";
import api from "../services/api";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";
import { WishlistContext } from "../context/WishlistContext";
import { FaStar, FaHeart } from "react-icons/fa";
import { formatINR } from "../utils/formatCurrency";

const Home = ({ search = "" }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const { addToWishlist, removeFromWishlist, isInWishlist } = useContext(WishlistContext);

  useEffect(() => {
    setLoading(true);
    api
      .get("/products")
      .then((res) => setProducts(res.data || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const enhancedProducts = useMemo(() => {
    return products.map((p) => {
      const originalPrice = p.originalPrice ?? Math.round(p.price * 1.18);
      const discount = p.discount ?? (10 + (p.id % 4) * 5);
      const rating = p.rating ?? Math.min(5, 3 + (p.id % 3));
      const reviews = p.reviews ?? 10 + (p.id % 200);
      const stock = p.stock ?? (p.id % 5 === 0 ? 0 : (p.id % 3 === 0 ? 2 : 12));
      return { ...p, originalPrice, discount, rating, reviews, stock };
    });
  }, [products]);

  const categories = useMemo(() => {
    const set = new Set(enhancedProducts.map((p) => p.category || "Uncategorized"));
    return ["All", ...Array.from(set)];
  }, [enhancedProducts]);

  const filteredProducts = enhancedProducts.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All" || (p.category || "Uncategorized") === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar key={i} style={{ marginRight: 2, color: i <= rating ? "#ffbf00" : "#e6e6e6" }} />
      );
    }
    return stars;
  };

  const toggleWishlist = (product) => {
    if (isInWishlist(product.id)) removeFromWishlist(product.id);
    else addToWishlist(product);
  };

  if (loading) return <Loader />;

  return (
    <div className="home-container">
      <div className="home-header">

        <div className="category-filter">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-btn ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="products-grid">
        {filteredProducts.map((product) => (
          <div key={product.id} className="product-card">
            <button
              className={`wishlist-btn ${isInWishlist(product.id) ? "wish-active" : ""}`}
              onClick={() => toggleWishlist(product)}
              aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
            >
              <FaHeart />
            </button>

            <Link to={`/product/${product.id}`}>
              <img src={product.image} alt={product.title} className="product-image" />
            </Link>

            <div className="product-category">{product.category}</div>
            <h3 className="product-title">{product.title}</h3>

            <div className="product-info">
              <div className="product-rating">{renderStars(product.rating)} <span style={{ color: '#666', fontSize: 12, marginLeft: 6 }}>({product.reviews})</span></div>

              <div className="product-pricing">
                <span className="product-price">{formatINR(product.price)}</span>
                <span className="product-original-price">{formatINR(product.originalPrice)}</span>
                <span className="product-discount">{product.discount}% OFF</span>
              </div>

              <div className={`stock-badge ${product.stock === 0 ? 'out' : product.stock < 5 ? 'low' : 'in'}`}>
                {product.stock === 0 ? 'Out of stock' : product.stock < 5 ? `Only ${product.stock} left` : 'In stock'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
