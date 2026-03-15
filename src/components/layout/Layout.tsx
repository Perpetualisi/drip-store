import { Outlet } from "react-router-dom"
import Navbar from "./Navbar"
import Footer from "./Footer"
import CartDrawer from "@/components/cart/CartDrawer"

export default function Layout() {
  return (
    <div className="min-h-screen bg-[#FAF5EF] text-[#333333] flex flex-col">
      <Navbar />
      <CartDrawer />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}