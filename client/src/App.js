// App.js
import React from "react";
import AuthProvider from "./hooks/AuthProvider";
import GuestGuard from "./hooks/GuestGuard";

import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserProfile from "./pages/user-profile";
import Checkout from "./pages/checkout";
import SupportPage from "./pages/support-page";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./routes/route";
import ProductItem from "./components/products/ProductItem";


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route element={<GuestGuard />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>
            <Route path="/products" element={<ProductItem />} />
            <Route element={<PrivateRoute />}>
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/checkout" element={<Checkout />} />
            </Route>
            <Route path="*" element={<div class="flex-1"></div>} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
