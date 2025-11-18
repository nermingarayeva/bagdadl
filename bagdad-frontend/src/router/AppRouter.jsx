import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import HomePage from "../pages/HomePage";
import ProductPage from "../pages/ProductsPage";
import CategoryPage from "../pages/CategoryPage";
import CartPage from "../pages/CartPage";
import CheckoutPage from "../pages/CheckoutPage";
import CustomisedGifts from "../pages/CustomisedGifts";
import Customise from "../pages/Customise";
import ProductsPage from "../pages/ProductsPage";
import Blogs from "../pages/Blogs";
import AdminLogin from "../pages/AdminLogin";
import AdminPanel from "../pages/AdminPanel";
import AdminOrders from "../pages/AdminOrders";
import AdminRoute from "./AdminRoute";
import Campaigns from "../pages/Campaigns";
import ProductDetailsPage from "../pages/ProductDetailsPage";
import BasketPage from "../components/BasketPage";

const AppRouter = () => {
  return (
    <Routes>
      {/* ========== ANA SƏHİFƏ - 3 DİL ========== */}
      <Route path="/" element={<HomePage />} />
      <Route path="/en" element={<HomePage />} />
      <Route path="/ru" element={<HomePage />} />

      {/* ========== MƏHSULLAR SƏHİFƏSİ - 3 DİL ========== */}
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/en/products" element={<ProductsPage />} />
      <Route path="/ru/products" element={<ProductsPage />} />

      {/* ========== MƏHSUL DETALLARI - 3 DİL ========== */}
      <Route path="/product/:id" element={<ProductDetailsPage />} />
      <Route path="/en/product/:id" element={<ProductDetailsPage />} />
      <Route path="/ru/product/:id" element={<ProductDetailsPage />} />

      {/* ========== KATEQORİYA - 3 DİL ========== */}
      <Route path="/category/:category" element={<CategoryPage />} />
      <Route path="/en/category/:category" element={<CategoryPage />} />
      <Route path="/ru/category/:category" element={<CategoryPage />} />

      {/* ========== SƏBƏT - 3 DİL ========== */}
      <Route path="/cart" element={<CartPage />} />
      <Route path="/en/cart" element={<CartPage />} />
      <Route path="/ru/cart" element={<CartPage />} />
      
      <Route path="/basket" element={<BasketPage />} />
      <Route path="/en/basket" element={<BasketPage />} />
      <Route path="/ru/basket" element={<BasketPage />} />

      {/* ========== SİFARİŞ - 3 DİL ========== */}
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/en/checkout" element={<CheckoutPage />} />
      <Route path="/ru/checkout" element={<CheckoutPage />} />

      {/* ========== FƏRƏQLI HƏDİYYƏLƏR - 3 DİL ========== */}
      <Route path="/customisedgifts" element={<CustomisedGifts />} />
      <Route path="/en/customisedgifts" element={<CustomisedGifts />} />
      <Route path="/ru/customisedgifts" element={<CustomisedGifts />} />

      <Route path="/customise" element={<Customise />} />
      <Route path="/en/customise" element={<Customise />} />
      <Route path="/ru/customise" element={<Customise />} />

      {/* ========== BLOQLAR - 3 DİL ========== */}
      <Route path="/blogs" element={<Blogs />} />
      <Route path="/en/blogs" element={<Blogs />} />
      <Route path="/ru/blogs" element={<Blogs />} />

      {/* ========== KAMPANİYALAR - 3 DİL ========== */}
      <Route path="/campaigns" element={<Campaigns />} />
      <Route path="/en/campaigns" element={<Campaigns />} />
      <Route path="/ru/campaigns" element={<Campaigns />} />

      {/* ========== ADMİN PANEL (DİLSİZ) ========== */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
      
      <Route
        path="/admin/dashboard"
        element={
          <AdminRoute>
            <AdminPanel />
          </AdminRoute>
        }
      >
        <Route path="orders" element={<AdminOrders />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;