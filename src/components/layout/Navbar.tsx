import { useState, useEffect, useRef } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useCartStore } from "@/store/cartStore"
import { useWishlistStore } from "@/store/wishlistStore"
import { useThemeStore } from "@/store/themeStore"
import { products } from "@/data/products"
import ModelViewer from "@/components/3d/ModelViewer"

export default function Navbar() {
  const { count, openCart } = useCartStore()
  const { count: wishlistCount } = useWishlistStore()
  const { isDark, toggle } = useThemeStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const location = useLocation()
  const navigate = useNavigate()
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const searchResults = searchQuery.trim().length > 1
    ? products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.gender.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : []

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    setSearchOpen(false)
    setSearchQuery("")
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [menuOpen])

  useEffect(() => {
    if (searchOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [searchOpen])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false)
        setSearchQuery("")
      }
    }
    if (searchOpen) document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [searchOpen])

  const handleSearchSelect = (id: number) => {
    setSearchOpen(false)
    setSearchQuery("")
    navigate(`/product/${id}`)
  }

  const handleSearchSubmit = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && searchResults.length > 0) {
      handleSearchSelect(searchResults[0].id)
    }
    if (e.key === "Escape") {
      setSearchOpen(false)
      setSearchQuery("")
    }
  }

  const isActive = (path: string) => location.pathname === path

  const wCount = wishlistCount()
  const cCount = count()

  const navBg = isDark ? "#1a1a1a" : "white"
  const navBorder = isDark ? "#2a2a2a" : "#E0E0E0"
  const textPrimary = isDark ? "#f0f0f0" : "#333333"
  const textMuted = isDark ? "#666666" : "#888888"
  const textFaint = isDark ? "#444444" : "#AAAAAA"
  const bgPrimary = isDark ? "#0f0f0f" : "#FAF5EF"
  const bgTertiary = isDark ? "#222222" : "#F4F4F4"
  const announcementBg = isDark ? "#111111" : "#333333"

  return (
    <>
      {/* Announcement bar */}
      <div
        className="fixed top-0 left-0 right-0 z-50 text-white text-center py-2 px-4"
        style={{ backgroundColor: announcementBg }}
      >
        <p className="text-[9px] tracking-[0.25em] uppercase">
          Free shipping over $100 &nbsp;·&nbsp; New drops weekly &nbsp;·&nbsp;
          <Link to="/sale" className="text-[#7EC8E3] hover:underline ml-1">Shop Sale</Link>
        </p>
      </div>

      {/* Main Navbar */}
      <nav
        className={`fixed top-8 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "shadow-md" : ""
        }`}
        style={{
          backgroundColor: navBg,
          borderBottom: `1px solid ${navBorder}`,
        }}
      >
        <div className="flex items-center h-16 px-4 md:px-8 gap-4">

          {/* LEFT — Logo */}
          <div className="flex items-center shrink-0">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="relative w-9 h-9 shrink-0">
                <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <defs>
                    <linearGradient id="lf" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a8dff0"/>
                      <stop offset="100%" stopColor="#7EC8E3"/>
                    </linearGradient>
                    <linearGradient id="lt" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#7EC8E3"/>
                      <stop offset="100%" stopColor="#5ab8d8"/>
                    </linearGradient>
                    <linearGradient id="ls" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#3a9abf"/>
                      <stop offset="100%" stopColor="#2d7a99"/>
                    </linearGradient>
                  </defs>
                  <path d="M8 12 L8 26 L20 30 L20 16 Z" fill="url(#lf)"/>
                  <path d="M8 12 L20 16 L28 10 L16 6 Z" fill="url(#lt)"/>
                  <path d="M20 16 L28 10 L28 24 L20 30 Z" fill="url(#ls)"/>
                  <text x="10" y="24" fontSize="11" fontWeight="700" fill="white" fontFamily="system-ui" opacity="0.9">D</text>
                </svg>
              </div>
              <div className="flex flex-col leading-none">
                <span
                  className="text-lg font-bold tracking-[0.15em] uppercase group-hover:text-[#7EC8E3] transition-colors duration-300"
                  style={{ color: textPrimary }}
                >
                  Drip
                </span>
                <span className="text-[8px] tracking-[0.3em] uppercase" style={{ color: textFaint }}>Premium</span>
              </div>
            </Link>
          </div>

          {/* CENTER — Desktop nav links */}
          <div className="hidden md:flex items-center gap-6 mx-auto text-[11px] tracking-widest">
            {[
              { to: "/",             label: "Home" },
              { to: "/shop",         label: "Shop" },
              { to: "/collections",  label: "Collections" },
              { to: "/new-arrivals", label: "New Arrivals" },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`uppercase transition-all duration-200 relative group pb-0.5 ${
                  isActive(link.to) ? "text-[#7EC8E3]" : ""
                }`}
                style={{ color: isActive(link.to) ? "#7EC8E3" : textMuted }}
              >
                {link.label}
                <span className={`absolute bottom-0 left-0 h-px bg-[#7EC8E3] transition-all duration-300 ${
                  isActive(link.to) ? "w-full" : "w-0 group-hover:w-full"
                }`}/>
              </Link>
            ))}
            <Link to="/sale" className="uppercase text-[#FF6B6B] hover:opacity-70 transition-opacity relative">
              Sale
              <span className="absolute -top-1.5 -right-2 w-1.5 h-1.5 rounded-full bg-[#FF6B6B] animate-pulse"/>
            </Link>
          </div>

          {/* RIGHT — Actions */}
          <div className="flex items-center gap-1 md:gap-2 ml-auto">

            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="w-8 h-8 flex items-center justify-center rounded-full transition-colors"
              style={{
                backgroundColor: searchOpen ? "#E8F8FC" : "transparent",
                color: searchOpen ? "#7EC8E3" : textMuted,
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </button>

            {/* Contact — desktop */}
            <Link
              to="/contact"
              className="hidden md:block text-[11px] tracking-widest uppercase transition-colors px-1 hover:text-[#7EC8E3]"
              style={{ color: textMuted }}
            >
              Contact
            </Link>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-[#FFF0F0]"
              style={{ color: wCount > 0 ? "#FF6B6B" : textMuted }}
              title="Wishlist"
            >
              <svg
                width="15" height="15" viewBox="0 0 24 24"
                fill={wCount > 0 ? "#FF6B6B" : "none"}
                stroke={wCount > 0 ? "#FF6B6B" : "currentColor"}
                strokeWidth="1.8"
                className="transition-all duration-300"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              {wCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#FF6B6B] text-white text-[8px] flex items-center justify-center font-bold leading-none">
                  {wCount}
                </span>
              )}
            </Link>

            {/* Dark mode toggle */}
            <button
              onClick={toggle}
              className="relative w-8 h-8 flex items-center justify-center transition-all duration-300 border"
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              style={{
                backgroundColor: isDark ? "#222222" : "white",
                borderColor: navBorder,
              }}
            >
              {/* Sun */}
              <svg
                width="13" height="13" viewBox="0 0 24 24"
                fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"
                style={{
                  position: "absolute",
                  transition: "all 0.3s ease",
                  opacity: isDark ? 0 : 1,
                  transform: isDark ? "rotate(90deg) scale(0.5)" : "rotate(0deg) scale(1)",
                }}
              >
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
              {/* Moon */}
              <svg
                width="13" height="13" viewBox="0 0 24 24"
                fill="none" stroke="#7EC8E3" strokeWidth="2" strokeLinecap="round"
                style={{
                  position: "absolute",
                  transition: "all 0.3s ease",
                  opacity: isDark ? 1 : 0,
                  transform: isDark ? "rotate(0deg) scale(1)" : "rotate(-90deg) scale(0.5)",
                }}
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            </button>

            {/* Cart */}
            <button
              onClick={openCart}
              className="relative flex items-center gap-1.5 h-8 px-2 md:px-3 text-white text-[10px] tracking-widest uppercase transition-colors duration-300 hover:bg-[#7EC8E3]"
              style={{ backgroundColor: isDark ? "#2a2a2a" : "#333333" }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              <span className="hidden md:inline">Cart</span>
              {cCount > 0 && (
                <span className="bg-[#7EC8E3] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cCount}
                </span>
              )}
            </button>

            {/* Hamburger — mobile */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden w-8 h-8 flex flex-col items-center justify-center gap-[5px] ml-1"
            >
              <span className={`block w-5 h-px transition-all duration-300 origin-center ${menuOpen ? "rotate-45 translate-y-[3px]" : ""}`} style={{ backgroundColor: textPrimary }}/>
              <span className={`block h-px transition-all duration-300 ${menuOpen ? "opacity-0 w-0" : "w-5"}`} style={{ backgroundColor: textPrimary }}/>
              <span className={`block w-5 h-px transition-all duration-300 origin-center ${menuOpen ? "-rotate-45 -translate-y-[3px]" : ""}`} style={{ backgroundColor: textPrimary }}/>
            </button>
          </div>
        </div>

        {/* Search Dropdown */}
        {searchOpen && (
          <div
            ref={searchRef}
            style={{ backgroundColor: navBg, borderTop: `1px solid ${navBorder}` }}
          >
            <div
              className="flex items-center gap-3 px-4 md:px-8 py-3"
              style={{ borderBottom: `1px solid ${navBorder}` }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={textFaint} strokeWidth="1.5">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchSubmit}
                placeholder="Search products, categories, styles..."
                className="flex-1 bg-transparent text-sm outline-none"
                style={{ color: textPrimary }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-[10px] tracking-widest uppercase px-2 hover:text-[#7EC8E3] transition-colors"
                  style={{ color: textMuted }}
                >
                  Clear
                </button>
              )}
              <button
                onClick={() => { setSearchOpen(false); setSearchQuery("") }}
                className="text-[10px] tracking-widest uppercase pl-3 hover:text-[#7EC8E3] transition-colors"
                style={{ color: textMuted, borderLeft: `1px solid ${navBorder}` }}
              >
                ✕
              </button>
            </div>

            {searchQuery.trim().length > 1 && (
              <div className="max-h-[60vh] overflow-y-auto">
                {searchResults.length > 0 ? (
                  <>
                    <div
                      className="px-4 md:px-8 py-2"
                      style={{ backgroundColor: bgPrimary, borderBottom: `1px solid ${navBorder}` }}
                    >
                      <p className="text-[9px] tracking-widest uppercase" style={{ color: textFaint }}>
                        {searchResults.length} result{searchResults.length !== 1 ? "s" : ""} for "{searchQuery}"
                      </p>
                    </div>
                    <div style={{ borderTop: `1px solid ${navBorder}` }}>
                      {searchResults.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => handleSearchSelect(product.id)}
                          className="w-full flex items-center gap-4 px-4 md:px-8 py-3 transition-colors text-left group"
                          style={{ borderBottom: `1px solid ${navBorder}` }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = bgPrimary)}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                        >
                          <div
                            className="w-12 h-14 shrink-0 overflow-hidden border"
                            style={{ backgroundColor: navBg, borderColor: navBorder }}
                          >
                            <ModelViewer
                              type={product.type}
                              color={product.color}
                              secondaryColor={product.secondaryColor}
                              animate={false}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium group-hover:text-[#7EC8E3] transition-colors truncate" style={{ color: textPrimary }}>
                              {product.name}
                            </p>
                            <p className="text-[10px] tracking-wide mt-0.5" style={{ color: textFaint }}>
                              {product.category} · {product.gender} · ${product.price}
                            </p>
                            <p className="text-[10px] truncate hidden md:block" style={{ color: textMuted }}>
                              {product.description}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-1.5 shrink-0">
                            <div className="w-4 h-4 rounded-full border" style={{ background: product.color, borderColor: navBorder }}/>
                            <span className="text-[8px] tracking-widest uppercase bg-[#7EC8E3] text-white px-1.5 py-0.5">
                              {product.tag}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                    <div
                      className="px-4 md:px-8 py-3"
                      style={{ borderTop: `1px solid ${navBorder}`, backgroundColor: bgPrimary }}
                    >
                      <Link
                        to="/shop"
                        onClick={() => { setSearchOpen(false); setSearchQuery("") }}
                        className="text-[10px] tracking-widest uppercase text-[#7EC8E3] hover:underline"
                      >
                        View all {searchResults.length} results in Shop
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="px-4 md:px-8 py-8 text-center">
                    <p className="text-sm mb-1" style={{ color: textMuted }}>No results for "{searchQuery}"</p>
                    <p className="text-xs" style={{ color: textMuted }}>Try searching for hoodies, jackets, dresses...</p>
                    <Link
                      to="/shop"
                      onClick={() => { setSearchOpen(false); setSearchQuery("") }}
                      className="inline-block mt-4 text-[10px] tracking-widest uppercase text-[#7EC8E3] hover:underline"
                    >
                      Browse all products
                    </Link>
                  </div>
                )}
              </div>
            )}

            {searchQuery.trim().length <= 1 && (
              <div className="px-4 md:px-8 py-4">
                <p className="text-[9px] tracking-widest uppercase mb-3" style={{ color: textFaint }}>Popular searches</p>
                <div className="flex gap-2 flex-wrap">
                  {["Hoodie", "Jacket", "Dress", "Coat", "Pants", "Sale"].map((term) => (
                    <button
                      key={term}
                      onClick={() => setSearchQuery(term)}
                      className="px-3 py-1.5 border text-[10px] tracking-widest uppercase hover:border-[#7EC8E3] hover:text-[#7EC8E3] transition-colors"
                      style={{ backgroundColor: bgPrimary, borderColor: navBorder, color: textMuted }}
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-40 transition-all duration-300 md:hidden ${
        menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}>
        <div
          className="absolute inset-0 backdrop-blur-sm"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setMenuOpen(false)}
        />
        <div
          className={`absolute top-0 left-0 bottom-0 w-[80%] max-w-xs flex flex-col transition-transform duration-300 ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          style={{ backgroundColor: navBg }}
        >

          {/* Drawer header */}
          <div
            className="flex items-center justify-between px-5 py-5"
            style={{ borderBottom: `1px solid ${navBorder}` }}
          >
            <Link to="/" className="flex items-center gap-2">
              <div className="w-7 h-7">
                <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <path d="M8 12 L8 26 L20 30 L20 16 Z" fill="#a8dff0"/>
                  <path d="M8 12 L20 16 L28 10 L16 6 Z" fill="#7EC8E3"/>
                  <path d="M20 16 L28 10 L28 24 L20 30 Z" fill="#3a9abf"/>
                  <text x="10" y="24" fontSize="11" fontWeight="700" fill="white" fontFamily="system-ui" opacity="0.9">D</text>
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold tracking-[0.15em] uppercase" style={{ color: textPrimary }}>Drip</p>
                <p className="text-[8px] tracking-[0.3em] uppercase" style={{ color: textFaint }}>Premium</p>
              </div>
            </Link>
            <button
              onClick={() => setMenuOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full transition-colors text-lg hover:bg-[#F4F4F4]"
              style={{ color: textMuted }}
            >
              ✕
            </button>
          </div>

          {/* Nav links */}
          <div className="flex-1 overflow-y-auto px-5 py-4">
            <p className="text-[9px] tracking-[0.3em] uppercase mb-3" style={{ color: textFaint }}>Navigate</p>
            <div className="space-y-1">
              {[
                { to: "/",             label: "Home",         icon: "🏠" },
                { to: "/shop",         label: "Shop",         icon: "🛍" },
                { to: "/collections",  label: "Collections",  icon: "✨" },
                { to: "/new-arrivals", label: "New Arrivals", icon: "🆕" },
                { to: "/wishlist",     label: "Wishlist",     icon: "❤️", badge: wCount > 0 ? `${wCount}` : undefined },
                { to: "/contact",      label: "Contact",      icon: "✉️" },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="flex items-center justify-between px-3 py-3.5 rounded-lg text-sm tracking-widest uppercase transition-all"
                  style={{
                    backgroundColor: isActive(link.to) ? "#E8F8FC" : "transparent",
                    color: isActive(link.to) ? "#7EC8E3" : textPrimary,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base">{link.icon}</span>
                    <span>{link.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {link.badge && (
                      <span className="w-5 h-5 rounded-full bg-[#FF6B6B] text-white text-[9px] flex items-center justify-center font-bold">
                        {link.badge}
                      </span>
                    )}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-30">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </div>
                </Link>
              ))}
              <Link
                to="/sale"
                className="flex items-center justify-between px-3 py-3.5 rounded-lg text-sm tracking-widest uppercase text-[#FF6B6B] hover:bg-[#FFF0F0] transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">🔥</span>
                  <span>Sale</span>
                </div>
                <span className="text-[9px] bg-[#FF6B6B] text-white px-1.5 py-0.5 tracking-widest">Hot</span>
              </Link>
            </div>

            <div className="mt-6">
              <p className="text-[9px] tracking-[0.3em] uppercase mb-3" style={{ color: textFaint }}>Help</p>
              <div className="space-y-1">
                {[
                  { to: "/shipping", label: "Shipping" },
                  { to: "/returns",  label: "Returns" },
                  { to: "/contact",  label: "Contact Us" },
                ].map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="flex items-center justify-between px-3 py-2.5 text-xs tracking-widest uppercase rounded-lg transition-all hover:text-[#333333]"
                    style={{ color: textMuted }}
                  >
                    {link.label}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-30">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </Link>
                ))}
              </div>
            </div>

            {/* Dark mode toggle in mobile menu */}
            <div className="mt-6 pt-4" style={{ borderTop: `1px solid ${navBorder}` }}>
              <p className="text-[9px] tracking-[0.3em] uppercase mb-3" style={{ color: textFaint }}>Appearance</p>
              <button
                onClick={toggle}
                className="w-full flex items-center justify-between px-3 py-3.5 rounded-lg text-sm tracking-widest uppercase transition-all"
                style={{ color: textPrimary }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = bgTertiary)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">{isDark ? "☀️" : "🌙"}</span>
                  <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
                </div>
                <div
                  className="w-10 h-5 rounded-full relative transition-all duration-300"
                  style={{ backgroundColor: isDark ? "#7EC8E3" : "#E0E0E0" }}
                >
                  <div
                    className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow-sm"
                    style={{ left: isDark ? "calc(100% - 18px)" : "2px" }}
                  />
                </div>
              </button>
            </div>
          </div>

          {/* Drawer footer */}
          <div
            className="px-5 py-5 space-y-3"
            style={{ borderTop: `1px solid ${navBorder}`, backgroundColor: bgPrimary }}
          >
            <button
              onClick={() => { openCart(); setMenuOpen(false) }}
              className="w-full flex items-center justify-between px-4 py-3.5 text-white text-xs tracking-widest uppercase hover:bg-[#7EC8E3] transition-colors duration-300"
              style={{ backgroundColor: isDark ? "#2a2a2a" : "#333333" }}
            >
              <span>View Cart</span>
              <div className="flex items-center gap-2">
                {cCount > 0 && (
                  <span className="bg-[#7EC8E3] text-white text-[9px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {cCount}
                  </span>
                )}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 01-8 0"/>
                </svg>
              </div>
            </button>
            <div className="flex items-center justify-center gap-4 text-[10px] tracking-widest uppercase" style={{ color: textFaint }}>
              <span>Instagram</span>
              <span>·</span>
              <span>Twitter</span>
              <span>·</span>
              <span>TikTok</span>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className="h-24"/>
    </>
  )
}