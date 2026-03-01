import { Link } from "react-router-dom";
import { useContext, useEffect } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { FaShoppingCart, FaMoon, FaSun, FaMicrophone } from "react-icons/fa";
import SpeechRecognition, {
  useSpeechRecognition
} from "react-speech-recognition";

const Navbar = ({ search, setSearch }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  const {
    transcript,
    listening,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  // Update search when voice input changes
  useEffect(() => {
    if (transcript) {
      setSearch(transcript);
    }
  }, [transcript, setSearch]);

  return (
    <nav>
      <h3>Mini E-Commerce</h3>

      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {browserSupportsSpeechRecognition && (
          <button
            onClick={() => {
              if (!listening) {
                SpeechRecognition.startListening();
                setTimeout(() => {
                  SpeechRecognition.stopListening();
                }, 4000);
              }
            }}
          >
            <FaMicrophone />
          </button>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "18px", marginRight: "40px" }}>
        <Link to="/">Home</Link>

        <Link to="/cart">
          <FaShoppingCart />
        </Link>

        <button onClick={toggleTheme} style={{ padding: "6px 8px", cursor: "pointer" }}>
          {theme === "light" ? <FaMoon /> : <FaSun />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
