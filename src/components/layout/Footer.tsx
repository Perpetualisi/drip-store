import { Link } from "react-router-dom"

export default function Footer() {
  return (
    <footer className="border-t border-[#E0E0E0] bg-white px-8 py-16">
      <div className="flex flex-col md:flex-row justify-between gap-10">
        <div>
          <p className="text-xl font-bold tracking-[0.3em] uppercase mb-2 text-[#333333]">
            Drip<span className="text-[#7EC8E3]">.</span>
          </p>
          <p className="text-xs text-[#888888] max-w-xs leading-relaxed">
            Premium streetwear. Explore every piece in 3D before you buy.
          </p>
        </div>
        <div className="flex flex-wrap gap-12 text-sm text-[#888888]">
          <div className="space-y-3">
            <p className="text-[#333333] text-xs tracking-widest uppercase mb-4">Shop</p>
            <Link to="/new-arrivals" className="block hover:text-[#7EC8E3] transition-colors">New Arrivals</Link>
            <Link to="/shop" className="block hover:text-[#7EC8E3] transition-colors">Bestsellers</Link>
            <Link to="/collections" className="block hover:text-[#7EC8E3] transition-colors">Collections</Link>
            <Link to="/sale" className="block hover:text-[#FF6B6B] transition-colors text-[#FF6B6B]">Sale</Link>
          </div>
          <div className="space-y-3">
            <p className="text-[#333333] text-xs tracking-widest uppercase mb-4">Help</p>
            <Link to="/shipping" className="block hover:text-[#7EC8E3] transition-colors">Shipping</Link>
            <Link to="/returns" className="block hover:text-[#7EC8E3] transition-colors">Returns</Link>
            <Link to="/contact" className="block hover:text-[#7EC8E3] transition-colors">Contact</Link>
          </div>
          <div className="space-y-3">
            <p className="text-[#333333] text-xs tracking-widest uppercase mb-4">Follow</p>
            <p className="hover:text-[#7EC8E3] cursor-pointer transition-colors">Instagram</p>
            <p className="hover:text-[#7EC8E3] cursor-pointer transition-colors">Twitter</p>
            <p className="hover:text-[#7EC8E3] cursor-pointer transition-colors">TikTok</p>
          </div>
        </div>
      </div>
      <p className="text-xs text-[#BBBBBB] mt-12">© 2026 Drip Store. All rights reserved.</p>
    </footer>
  )
}