import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import { WishlistProvider } from "./context/WishlistContext";

const App = () => {
  const [search, setSearch] = useState("");

  return (
    <WishlistProvider>
      <BrowserRouter>
        <Navbar search={search} setSearch={setSearch} />

        <Routes>
          <Route path="/" element={<Home search={search} />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </BrowserRouter>
    </WishlistProvider>
  );
};

export default App;