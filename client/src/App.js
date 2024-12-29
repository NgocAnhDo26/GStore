// App.js
import React from "react";
import GuestGuard from "./hooks/GuestGuard";
import AuthProvider from "./hooks/AuthProvider";
import CartProvider from "./hooks/CartProvider";

import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import UserProfile from "./pages/user-profile";
import Checkout from "./pages/checkout";
import SupportPage from "./pages/support-page";
import Admin from "./pages/admin";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./routes/route";
import ShoppingCart from "./pages/ShoppingCart";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/admin" element={<Admin />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route element={<GuestGuard />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Route>
              <Route path="/products" element={<Products />} />
              <Route path="/cart" element={<ShoppingCart />} />
              <Route path="/customer-service" element={<SupportPage />} />
              <Route element={<PrivateRoute />}>
                <Route path="/profile/:section" element={<UserProfile />} />
                <Route path="/checkout" element={<Checkout />} />
              </Route>
              <Route path="*" element={<div class="flex-1"></div>} />
            </Route>
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
