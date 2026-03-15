import { Routes, Route } from "react-router-dom"
import Layout from "@/components/layout/Layout"
import Home from "@/pages/Home"
import Shop from "@/pages/Shop"
import ProductDetail from "@/pages/ProductDetail"
import Cart from "@/pages/Cart"
import Collections from "@/pages/Collections"
import NewArrivals from "@/pages/NewArrivals"
import Checkout from "@/pages/Checkout"
import Contact from "@/pages/Contact"
import Shipping from "@/pages/Shipping"
import Returns from "@/pages/Returns"
import Sale from "@/pages/Sale"
import Wishlist from "@/pages/Wishlist"

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/new-arrivals" element={<NewArrivals />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/returns" element={<Returns />} />
        <Route path="/sale" element={<Sale />} />
        <Route path="/wishlist" element={<Wishlist />} />
      </Route>
    </Routes>
  )
}