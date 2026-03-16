import { useState, useEffect, useRef } from "react"
import { useParams, Link } from "react-router-dom"
import { products } from "@/data/products"
import ModelViewer from "@/components/3d/ModelViewer"
import { useCartStore } from "@/store/cartStore"
import { useWishlistStore } from "@/store/wishlistStore"
import ReviewsSection from "@/components/reviews/ReviewsSection"
import StarRating from "@/components/reviews/StarRating"
import { getProductRating } from "@/data/reviews"
import { getProductStock, getViewerCount } from "@/data/stock"

const sizes = ["XS", "S", "M", "L", "XL", "XXL"]

const COLOR_VARIANTS: Record<string, { name: string; primary: string; secondary: string }[]> = {
  hoodie: [
    { name: "Midnight",   primary: "#1a1a1a", secondary: "#c8a96e" },
    { name: "Ocean",      primary: "#2563eb", secondary: "#93c5fd" },
    { name: "Forest",     primary: "#166534", secondary: "#86efac" },
    { name: "Blush",      primary: "#be185d", secondary: "#f9a8d4" },
    { name: "Slate",      primary: "#475569", secondary: "#cbd5e1" },
    { name: "Cream",      primary: "#d4a96a", secondary: "#fef3c7" },
  ],
  tee: [
    { name: "Midnight",   primary: "#1a1a1a", secondary: "#c8a96e" },
    { name: "White",      primary: "#f5f5f5", secondary: "#e2e8f0" },
    { name: "Sky",        primary: "#0284c7", secondary: "#bae6fd" },
    { name: "Sage",       primary: "#4d7c0f", secondary: "#bef264" },
    { name: "Dusty Rose", primary: "#9f1239", secondary: "#fda4af" },
    { name: "Sand",       primary: "#b45309", secondary: "#fde68a" },
  ],
  jacket: [
    { name: "Onyx",      primary: "#0f172a", secondary: "#334155" },
    { name: "Camel",     primary: "#92400e", secondary: "#fcd34d" },
    { name: "Cobalt",    primary: "#1d4ed8", secondary: "#93c5fd" },
    { name: "Burgundy",  primary: "#7f1d1d", secondary: "#fca5a5" },
    { name: "Olive",     primary: "#3f6212", secondary: "#a3e635" },
    { name: "Graphite",  primary: "#374151", secondary: "#9ca3af" },
  ],
  coat: [
    { name: "Charcoal",  primary: "#1c1917", secondary: "#a8a29e" },
    { name: "Camel",     primary: "#a16207", secondary: "#fde68a" },
    { name: "Ivory",     primary: "#d6c9a8", secondary: "#fef9ef" },
    { name: "Navy",      primary: "#1e3a5f", secondary: "#93c5fd" },
    { name: "Moss",      primary: "#365314", secondary: "#a3e635" },
    { name: "Plum",      primary: "#581c87", secondary: "#d8b4fe" },
  ],
  dress: [
    { name: "Midnight",   primary: "#1a1a1a", secondary: "#c8a96e" },
    { name: "Blush",      primary: "#db2777", secondary: "#fbcfe8" },
    { name: "Sage",       primary: "#166534", secondary: "#bbf7d0" },
    { name: "Lilac",      primary: "#7c3aed", secondary: "#ddd6fe" },
    { name: "Terracotta", primary: "#b45309", secondary: "#fed7aa" },
    { name: "Cobalt",     primary: "#1d4ed8", secondary: "#bfdbfe" },
  ],
  skirt: [
    { name: "Midnight",  primary: "#1a1a1a", secondary: "#c8a96e" },
    { name: "Blush",     primary: "#db2777", secondary: "#fbcfe8" },
    { name: "Lilac",     primary: "#7c3aed", secondary: "#ddd6fe" },
    { name: "Sage",      primary: "#166534", secondary: "#bbf7d0" },
    { name: "Caramel",   primary: "#92400e", secondary: "#fde68a" },
    { name: "Sky",       primary: "#0369a1", secondary: "#bae6fd" },
  ],
  pants: [
    { name: "Midnight",  primary: "#1a1a1a", secondary: "#c8a96e" },
    { name: "Navy",      primary: "#1e3a5f", secondary: "#93c5fd" },
    { name: "Olive",     primary: "#3f6212", secondary: "#a3e635" },
    { name: "Stone",     primary: "#78716c", secondary: "#d6d3d1" },
    { name: "Burgundy",  primary: "#7f1d1d", secondary: "#fca5a5" },
    { name: "Camel",     primary: "#92400e", secondary: "#fcd34d" },
  ],
  shorts: [
    { name: "Midnight",  primary: "#1a1a1a", secondary: "#c8a96e" },
    { name: "Navy",      primary: "#1e3a5f", secondary: "#93c5fd" },
    { name: "Khaki",     primary: "#713f12", secondary: "#fde68a" },
    { name: "Coral",     primary: "#be123c", secondary: "#fda4af" },
    { name: "Forest",    primary: "#166534", secondary: "#86efac" },
    { name: "Sky",       primary: "#0369a1", secondary: "#bae6fd" },
  ],
}

function getVariants(type: string) {
  return COLOR_VARIANTS[type] ?? COLOR_VARIANTS["hoodie"]
}

export default function ProductDetail() {
  const { id } = useParams()
  const product = products.find((p) => p.id === Number(id))
  const addItem = useCartStore((state) => state.addItem)
  const { toggleItem, isWishlisted } = useWishlistStore()

  const [selectedSize, setSelectedSize] = useState("M")
  const [added, setAdded] = useState(false)
  const [stickyAdded, setStickyAdded] = useState(false)
  const [activeTab, setActiveTab] = useState<"details" | "sizing" | "shipping">("details")
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0)
  const [showSticky, setShowSticky] = useState(false)

  const ctaRef = useRef<HTMLDivElement>(null)

  // Show sticky bar when main CTA scrolls out of view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setShowSticky(!entry.isIntersecting),
      { threshold: 0 }
    )
    if (ctaRef.current) observer.observe(ctaRef.current)
    return () => observer.disconnect()
  }, [])

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FAF5EF] text-[#333333] flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 border border-[#E0E0E0] flex items-center justify-center mb-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#CCCCCC" strokeWidth="1">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </div>
        <p className="text-xl tracking-widest uppercase text-[#333333]">Product Not Found</p>
        <p className="text-sm text-[#AAAAAA]">This product may no longer be available</p>
        <Link to="/shop" className="mt-2 text-xs tracking-widest uppercase border border-[#DDD5C7] px-6 py-3 hover:border-[#333333] hover:text-[#333333] transition-colors text-[#888888]">
          Back to Shop
        </Link>
      </div>
    )
  }

  const variants = getVariants(product.type)
  const selectedVariant = variants[selectedVariantIdx]
  const wishlisted = isWishlisted(product.id)
  const { average, count } = getProductRating(product.id)
  const stock = getProductStock(product.id)
  const viewers = getViewerCount(product.id)
  const soldOut = stock.level === "sold_out"

  const handleAddToCart = () => {
    if (soldOut) return
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      color: selectedVariant.primary,
      secondaryColor: selectedVariant.secondary,
      type: product.type,
      gender: product.gender,
      quantity: 1,
      size: selectedSize,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleStickyAddToCart = () => {
    if (soldOut) return
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      color: selectedVariant.primary,
      secondaryColor: selectedVariant.secondary,
      type: product.type,
      gender: product.gender,
      quantity: 1,
      size: selectedSize,
    })
    setStickyAdded(true)
    setTimeout(() => setStickyAdded(false), 2000)
  }

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  return (
    <div className="min-h-screen bg-[#FAF5EF] text-[#333333]">

      {/* ── STICKY ADD TO CART BAR ── */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 ${
        showSticky && !soldOut ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
      }`}>
        {/* Blur backdrop */}
        <div className="bg-white/95 border-t border-[#E0E0E0]" style={{ backdropFilter: "blur(12px)" }}>
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center gap-3 md:gap-5">

            {/* Mini model thumbnail */}
            <div className="w-10 h-12 shrink-0 bg-[#FAF5EF] border border-[#E0E0E0] overflow-hidden hidden sm:block">
              <ModelViewer
                type={product.type}
                color={selectedVariant.primary}
                secondaryColor={selectedVariant.secondary}
                animate={false}
              />
            </div>

            {/* Product info */}
            <div className="flex flex-col min-w-0 shrink-0">
              <p className="text-xs font-semibold text-[#333333] truncate max-w-[120px] md:max-w-none">{product.name}</p>
              <p className="text-[9px] text-[#AAAAAA] tracking-wide">{selectedVariant.name} · {selectedSize}</p>
            </div>

            {/* Color swatch */}
            <div className="shrink-0 hidden md:flex items-center gap-1.5">
              {variants.slice(0, 4).map((v, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedVariantIdx(idx)}
                  className={`w-5 h-5 rounded-full border transition-all duration-150 ${
                    selectedVariantIdx === idx
                      ? "ring-2 ring-[#7EC8E3] ring-offset-1 border-transparent"
                      : "border-[#E0E0E0] hover:border-[#AAAAAA]"
                  }`}
                  style={{ background: v.primary }}
                  title={v.name}
                />
              ))}
            </div>

            {/* Divider */}
            <div className="w-px h-8 bg-[#E0E0E0] shrink-0 hidden md:block"/>

            {/* Size selector */}
            <div className="flex gap-1 shrink-0 hidden md:flex">
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`w-8 h-8 text-[9px] tracking-wider uppercase border transition-all duration-150 ${
                    selectedSize === s
                      ? "bg-[#333333] text-white border-[#333333]"
                      : "bg-white text-[#888888] border-[#E0E0E0] hover:border-[#333333] hover:text-[#333333]"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="w-px h-8 bg-[#E0E0E0] shrink-0 hidden md:block"/>

            {/* Price */}
            <div className="shrink-0 hidden md:block">
              <p className="text-sm font-bold text-[#333333]">${product.price}</p>
              <p className="text-[9px] text-[#AAAAAA] line-through">${Math.round(product.price * 1.2)}</p>
            </div>

            {/* Stock urgency */}
            {stock.urgent && (
              <div className="shrink-0 hidden lg:flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B6B] animate-pulse"/>
                <span className="text-[9px] tracking-widest uppercase text-[#FF6B6B] font-medium whitespace-nowrap">
                  {stock.label}
                </span>
              </div>
            )}

            {/* Spacer */}
            <div className="flex-1"/>

            {/* Mobile size — compact */}
            <div className="flex gap-1 md:hidden">
              {["S","M","L","XL"].map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`w-7 h-7 text-[8px] tracking-wider uppercase border transition-all duration-150 ${
                    selectedSize === s
                      ? "bg-[#333333] text-white border-[#333333]"
                      : "bg-white text-[#888888] border-[#E0E0E0]"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Add to Cart button */}
            <button
              onClick={handleStickyAddToCart}
              className={`shrink-0 px-5 md:px-8 py-3 text-[10px] md:text-xs tracking-widest uppercase font-medium transition-all duration-300 whitespace-nowrap ${
                stickyAdded
                  ? "bg-[#A8E6CF] text-[#333333]"
                  : "bg-[#333333] text-white hover:bg-[#7EC8E3]"
              }`}
            >
              {stickyAdded ? "✓ Added!" : `Add to Cart — $${product.price}`}
            </button>

            {/* Wishlist button */}
            <button
              onClick={() => toggleItem(product.id)}
              className={`shrink-0 w-10 h-10 border flex items-center justify-center transition-all duration-300 ${
                wishlisted ? "border-[#FF6B6B] bg-[#FFF0F0]" : "border-[#E0E0E0] hover:border-[#FF6B6B] hover:bg-[#FFF0F0]"
              }`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24"
                fill={wishlisted ? "#FF6B6B" : "none"}
                stroke={wishlisted ? "#FF6B6B" : "#888888"}
                strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="px-4 md:px-8 py-4 border-b border-[#E0E0E0] bg-white flex items-center gap-2 text-[10px] tracking-widest uppercase text-[#AAAAAA] overflow-x-auto">
        <Link to="/" className="hover:text-[#7EC8E3] transition-colors shrink-0">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-[#7EC8E3] transition-colors shrink-0">Shop</Link>
        <span>/</span>
        <span className="text-[#333333] truncate">{product.name}</span>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[90vh]">

        {/* LEFT — 3D Viewer */}
        <div className="relative bg-white border-b lg:border-b-0 lg:border-r border-[#E0E0E0] flex items-center justify-center min-h-[70vw] md:min-h-[50vw] lg:min-h-0 lg:sticky lg:top-24 lg:h-[calc(100vh-6rem)]">

          {/* Background glow */}
          <div
            className="absolute inset-0 opacity-8 pointer-events-none transition-all duration-700"
            style={{ background: `radial-gradient(circle at center, ${selectedVariant.primary}, transparent 70%)` }}
          />

          {/* Sold out overlay */}
          {soldOut && (
            <div className="absolute inset-0 bg-white/60 z-20 flex items-center justify-center pointer-events-none">
              <div className="border border-[#E0E0E0] bg-white px-6 py-3">
                <p className="text-[10px] tracking-[0.4em] uppercase text-[#AAAAAA] text-center">Sold Out</p>
              </div>
            </div>
          )}

          {/* Model */}
          <div className={`relative z-10 w-full h-full max-w-sm mx-auto p-6 md:p-10 lg:p-12 ${soldOut ? "opacity-40" : ""}`}>
            <ModelViewer
              type={product.type}
              color={selectedVariant.primary}
              secondaryColor={selectedVariant.secondary}
              animate={!soldOut}
            />
          </div>

          {/* Gender badge */}
          <div className="absolute top-4 left-4 text-[9px] tracking-widest uppercase border border-[#E0E0E0] text-[#888888] px-3 py-1.5 bg-white/90 z-10">
            {product.gender}
          </div>

          {/* Wishlist button */}
          <button
            onClick={() => toggleItem(product.id)}
            className={`absolute top-4 right-4 w-10 h-10 border flex items-center justify-center transition-all duration-300 z-10 ${
              wishlisted ? "border-[#FF6B6B] bg-[#FFF0F0]" : "border-[#E0E0E0] bg-white/90 hover:border-[#FF6B6B] hover:bg-[#FFF0F0]"
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24"
              fill={wishlisted ? "#FF6B6B" : "none"}
              stroke={wishlisted ? "#FF6B6B" : "#888888"}
              strokeWidth="1.5" className="transition-all duration-300">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>

          {/* Wishlist toast */}
          {wishlisted && (
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10">
              <Link to="/wishlist" className="flex items-center gap-2 bg-white border border-[#FF6B6B]/30 px-3 py-2 text-[9px] tracking-widest uppercase text-[#FF6B6B] hover:bg-[#FFF0F0] transition-colors whitespace-nowrap">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="#FF6B6B" stroke="#FF6B6B" strokeWidth="1.5">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                Saved — View Wishlist
              </Link>
            </div>
          )}

          {/* Color name label */}
          {!soldOut && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
              <span className="text-[9px] tracking-widest uppercase text-[#AAAAAA] bg-white/90 border border-[#E0E0E0] px-3 py-1.5">
                {selectedVariant.name}
              </span>
            </div>
          )}
        </div>

        {/* RIGHT — Product Info */}
        <div className="px-5 md:px-10 lg:px-12 py-8 lg:py-14 flex flex-col bg-[#FAF5EF]">

          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap mb-4">
            <span className="text-[9px] tracking-widest bg-[#7EC8E3] text-white px-2 py-1 font-medium uppercase">
              {product.tag}
            </span>
            <span className="text-[9px] tracking-widest text-[#AAAAAA] uppercase border border-[#E0E0E0] px-2 py-1">
              {product.category}
            </span>
            {stock.urgent && !soldOut && (
              <span className="text-[9px] tracking-widest text-[#FF6B6B] border border-[#FF6B6B]/30 bg-[#FF6B6B]/5 px-2 py-1 uppercase animate-pulse">
                {stock.label}
              </span>
            )}
            {soldOut && (
              <span className="text-[9px] tracking-widest text-[#AAAAAA] border border-[#E0E0E0] bg-[#F4F4F4] px-2 py-1 uppercase">
                Sold Out
              </span>
            )}
          </div>

          {/* Name */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter mb-2 leading-tight text-[#333333]">
            {product.name}
          </h1>

          {/* Rating summary */}
          {count > 0 && (
            <div className="flex items-center gap-2 mb-3">
              <StarRating rating={average} size={13} showNumber={true} count={count}/>
              <span className="text-[9px] tracking-widest uppercase text-[#7EC8E3] cursor-pointer hover:underline underline-offset-2">
                Read reviews
              </span>
            </div>
          )}

          {/* Description */}
          <p className="text-[#888888] text-sm mb-5 leading-relaxed max-w-md">
            {product.description}
          </p>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-4 pb-4 border-b border-[#E0E0E0]">
            <span className={`text-3xl font-bold ${soldOut ? "text-[#AAAAAA]" : "text-[#333333]"}`}>
              ${product.price}
            </span>
            <span className="text-[#CCCCCC] text-sm line-through">${Math.round(product.price * 1.2)}</span>
            {!soldOut && (
              <span className="text-[10px] tracking-widest text-[#A8E6CF] uppercase font-medium bg-[#A8E6CF]/10 px-2 py-0.5">
                Save 20%
              </span>
            )}
          </div>

          {/* ── STOCK + URGENCY ── */}
          <div className="mb-5">
            {!soldOut && (
              <div className="flex items-center gap-2 mb-3">
                <div className="flex -space-x-1">
                  {Array.from({ length: Math.min(viewers, 5) }).map((_, i) => (
                    <div
                      key={i}
                      className="w-4 h-4 rounded-full border border-white flex items-center justify-center text-[6px] font-bold text-white"
                      style={{ background: ["#7EC8E3","#A8E6CF","#C5A3FF","#FF6B6B","#F59E0B"][i] }}
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <p className="text-[9px] tracking-wide text-[#888888]">
                  <span className="font-semibold text-[#333333]">{viewers} people</span> viewing this right now
                </p>
                <div className="w-1.5 h-1.5 rounded-full bg-[#A8E6CF] animate-pulse ml-auto shrink-0"/>
              </div>
            )}

            {stock.level !== "in_stock" && (
              <div className={`border px-4 py-3 ${
                soldOut ? "border-[#E0E0E0] bg-[#F4F4F4]" :
                stock.level === "last_one" ? "border-[#FF6B6B]/40 bg-[#FF6B6B]/5" :
                stock.level === "very_low" ? "border-[#FF6B6B]/30 bg-[#FFF8F8]" :
                "border-[#F59E0B]/30 bg-[#FFFBF0]"
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {!soldOut && (
                      <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${stock.urgent ? "bg-[#FF6B6B]" : "bg-[#F59E0B]"}`}/>
                    )}
                    <p className={`text-[10px] tracking-widest uppercase font-semibold ${
                      soldOut ? "text-[#AAAAAA]" : stock.urgent ? "text-[#FF6B6B]" : "text-[#F59E0B]"
                    }`}>
                      {stock.label}
                    </p>
                  </div>
                  {!soldOut && (
                    <p className="text-[9px] text-[#AAAAAA]">{stock.quantity} of 50 remaining</p>
                  )}
                </div>
                {!soldOut && (
                  <div className="w-full h-1.5 bg-[#E0E0E0] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${stock.urgent ? "bg-[#FF6B6B]" : "bg-[#F59E0B]"}`}
                      style={{ width: `${Math.max((stock.quantity / 50) * 100, 4)}%` }}
                    />
                  </div>
                )}
                {soldOut && (
                  <p className="text-[9px] text-[#AAAAAA]">
                    Join the waitlist to be notified when this restocks.
                  </p>
                )}
              </div>
            )}

            {(stock.level === "last_one" || stock.level === "very_low") && (
              <p className="text-[9px] text-[#FF6B6B] mt-2 flex items-center gap-1.5">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                High demand — this item sells out frequently
              </p>
            )}
          </div>

          {/* ── COLOR VARIANTS ── */}
          {!soldOut && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] tracking-widest uppercase text-[#AAAAAA]">
                  Color — <span className="text-[#333333] font-medium">{selectedVariant.name}</span>
                </p>
                <span className="text-[9px] tracking-widest uppercase text-[#AAAAAA]">
                  {variants.length} colorways
                </span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {variants.map((variant, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedVariantIdx(idx)}
                    title={variant.name}
                    className="relative group"
                  >
                    <div className={`w-9 h-9 rounded-full transition-all duration-200 flex items-center justify-center ${
                      selectedVariantIdx === idx
                        ? "ring-2 ring-offset-2 ring-[#7EC8E3] ring-offset-[#FAF5EF]"
                        : "hover:ring-2 hover:ring-offset-2 hover:ring-[#CCCCCC] hover:ring-offset-[#FAF5EF]"
                    }`}>
                      <div className="w-7 h-7 rounded-full overflow-hidden border border-[#E0E0E0] flex">
                        <div className="w-1/2 h-full" style={{ background: variant.primary }}/>
                        <div className="w-1/2 h-full" style={{ background: variant.secondary }}/>
                      </div>
                    </div>
                    {selectedVariantIdx === idx && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
                          <path d="M20 6L9 17l-5-5"/>
                        </svg>
                      </div>
                    )}
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] tracking-wide text-[#888888] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      {variant.name}
                    </div>
                  </button>
                ))}
              </div>
              <div className="mt-5 h-1.5 rounded-full overflow-hidden flex gap-0.5">
                {variants.map((v, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedVariantIdx(idx)}
                    className={`flex-1 h-full transition-all duration-300 ${
                      selectedVariantIdx === idx ? "opacity-100 scale-y-150" : "opacity-40 hover:opacity-70"
                    }`}
                    style={{ background: v.primary }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size selector */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] tracking-widest uppercase text-[#AAAAAA]">
                Size — <span className="text-[#333333] font-medium">{selectedSize}</span>
              </p>
              <button
                onClick={() => setActiveTab("sizing")}
                className="text-[10px] tracking-widest uppercase text-[#7EC8E3] hover:underline underline-offset-2 transition-colors"
              >
                Size Guide
              </button>
            </div>
            <div className="grid grid-cols-6 gap-1.5 md:gap-2">
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => !soldOut && setSelectedSize(s)}
                  disabled={soldOut}
                  className={`py-2.5 md:py-3 text-xs tracking-wider uppercase border transition-all duration-200 ${
                    soldOut
                      ? "bg-[#F4F4F4] text-[#CCCCCC] border-[#E0E0E0] cursor-not-allowed"
                      : selectedSize === s
                      ? "bg-[#333333] text-white border-[#333333] font-medium"
                      : "bg-white text-[#888888] border-[#E0E0E0] hover:border-[#333333] hover:text-[#333333]"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* ── MAIN CTA — observed by IntersectionObserver ── */}
          <div ref={ctaRef} className="flex gap-2 md:gap-3 mb-6">
            <button
              onClick={handleAddToCart}
              disabled={soldOut}
              className={`flex-1 py-4 text-xs md:text-sm tracking-widest uppercase font-medium transition-all duration-300 ${
                soldOut
                  ? "bg-[#F4F4F4] text-[#AAAAAA] cursor-not-allowed"
                  : added
                  ? "bg-[#A8E6CF] text-[#333333]"
                  : "bg-[#333333] text-white hover:bg-[#7EC8E3]"
              }`}
            >
              {soldOut ? "Sold Out" : added ? "Added to Cart" : `Add to Cart — $${product.price}`}
            </button>
            <button
              onClick={() => toggleItem(product.id)}
              className={`w-12 md:w-14 border flex items-center justify-center transition-all duration-300 ${
                wishlisted ? "border-[#FF6B6B] bg-[#FF6B6B]/10" : "border-[#E0E0E0] hover:border-[#FF6B6B] hover:bg-[#FFF0F0]"
              }`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24"
                fill={wishlisted ? "#FF6B6B" : "none"}
                stroke={wishlisted ? "#FF6B6B" : "#888888"}
                strokeWidth="1.5" className="transition-all duration-300">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
          </div>

          {/* Sold out waitlist */}
          {soldOut && (
            <div className="mb-6 border border-[#E0E0E0] bg-white p-4">
              <p className="text-[10px] tracking-widest uppercase text-[#333333] font-medium mb-1">Join the Waitlist</p>
              <p className="text-[9px] text-[#AAAAAA] mb-3">Be the first to know when this item restocks.</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 border border-[#E0E0E0] px-3 py-2 text-xs text-[#333333] outline-none focus:border-[#7EC8E3] transition-colors placeholder-[#CCCCCC]"
                />
                <button className="px-4 py-2 bg-[#333333] text-white text-[9px] tracking-widest uppercase hover:bg-[#7EC8E3] transition-colors">
                  Notify Me
                </button>
              </div>
            </div>
          )}

          {/* Wishlist link */}
          {wishlisted && (
            <Link to="/wishlist" className="flex items-center gap-2 text-[10px] tracking-widest uppercase text-[#FF6B6B] mb-4 hover:underline underline-offset-2">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="#FF6B6B" stroke="#FF6B6B" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              Saved to wishlist — View all saved items
            </Link>
          )}

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-2 md:gap-3 mb-6 py-5 border-y border-[#E0E0E0]">
            {[
              { icon: "🚚", label: "Free Shipping", sub: "Over $100" },
              { icon: "↩",  label: "Free Returns",  sub: "30 days" },
              { icon: "🔒", label: "Secure Pay",     sub: "SSL encrypted" },
            ].map((b) => (
              <div key={b.label} className="flex flex-col items-center text-center gap-1 p-2">
                <span className="text-base md:text-lg">{b.icon}</span>
                <p className="text-[8px] md:text-[9px] tracking-widest uppercase text-[#333333] font-medium">{b.label}</p>
                <p className="text-[8px] md:text-[9px] text-[#AAAAAA]">{b.sub}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="flex border-b border-[#E0E0E0] mb-5 overflow-x-auto">
              {(["details", "sizing", "shipping"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`shrink-0 px-4 py-2.5 text-[10px] tracking-widest uppercase transition-colors ${
                    activeTab === tab
                      ? "border-b-2 border-[#7EC8E3] text-[#7EC8E3] -mb-px font-medium"
                      : "text-[#AAAAAA] hover:text-[#333333]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === "details" && (
              <div className="space-y-3 text-sm text-[#888888] leading-relaxed">
                <p>{product.description}. Crafted with premium materials for everyday wear.</p>
                <ul className="space-y-2 mt-4">
                  {[
                    "Premium heavyweight fabric blend",
                    "Relaxed oversized silhouette",
                    "Reinforced stitching throughout",
                    "Pre-washed for softness",
                    "Ribbed cuffs and hem",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-xs text-[#888888]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#7EC8E3] shrink-0"/>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {[
                    { label: "Material", value: "100% Cotton" },
                    { label: "Weight",   value: "380 GSM" },
                    { label: "Fit",      value: "Oversized" },
                    { label: "Gender",   value: product.gender },
                  ].map((spec) => (
                    <div key={spec.label} className="border border-[#E0E0E0] bg-white p-3">
                      <p className="text-[9px] tracking-widest uppercase text-[#AAAAAA] mb-1">{spec.label}</p>
                      <p className="text-xs text-[#333333] font-medium">{spec.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "sizing" && (
              <div className="text-xs text-[#888888] overflow-x-auto">
                <table className="w-full border-collapse min-w-[280px]">
                  <thead>
                    <tr className="border-b border-[#E0E0E0]">
                      {["Size", "Chest", "Length", "Sleeve"].map((h) => (
                        <th key={h} className="text-[9px] tracking-widest uppercase text-[#AAAAAA] text-left py-2 pr-4 font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["XS",  "86cm",  "64cm", "58cm"],
                      ["S",   "92cm",  "67cm", "60cm"],
                      ["M",   "98cm",  "70cm", "62cm"],
                      ["L",   "104cm", "73cm", "64cm"],
                      ["XL",  "110cm", "76cm", "66cm"],
                      ["XXL", "116cm", "79cm", "68cm"],
                    ].map(([size, ...vals]) => (
                      <tr key={size} className={`border-b border-[#E0E0E0] transition-colors ${
                        selectedSize === size ? "bg-[#E8F8FC] text-[#7EC8E3]" : "hover:bg-[#FAF5EF]"
                      }`}>
                        <td className="py-2.5 pr-4 font-medium">{size}</td>
                        {vals.map((v, i) => <td key={i} className="py-2.5 pr-4">{v}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-[10px] text-[#CCCCCC] mt-4">Model is 6'1" wearing size M.</p>
              </div>
            )}

            {activeTab === "shipping" && (
              <div className="space-y-3 text-xs text-[#888888]">
                {[
                  { method: "Standard",  time: "5-7 business days", price: "Free over $100" },
                  { method: "Express",   time: "2-3 business days", price: "$12.99" },
                  { method: "Overnight", time: "Next business day",  price: "$24.99" },
                ].map((s) => (
                  <div key={s.method} className="flex justify-between items-center border border-[#E0E0E0] bg-white px-4 py-3">
                    <div>
                      <p className="text-[#333333] text-xs tracking-wide mb-0.5 font-medium">{s.method}</p>
                      <p className="text-[#AAAAAA] text-[10px]">{s.time}</p>
                    </div>
                    <p className="text-[#7EC8E3] text-xs font-medium">{s.price}</p>
                  </div>
                ))}
                <p className="text-[10px] text-[#CCCCCC] pt-2">
                  Free returns within 30 days. Items must be unworn with original tags attached.
                </p>
              </div>
            )}
          </div>

          {/* Share */}
          <div className="flex items-center gap-3 pt-4 border-t border-[#E0E0E0]">
            <span className="text-[10px] tracking-widest uppercase text-[#AAAAAA]">Share</span>
            {["Twitter", "Instagram", "Copy Link"].map((s) => (
              <button key={s} className="text-[10px] tracking-widest uppercase text-[#888888] hover:text-[#333333] transition-colors border border-[#E0E0E0] px-3 py-1.5 hover:border-[#333333] bg-white">
                {s}
              </button>
            ))}
          </div>

          {/* Reviews */}
          <div id="reviews">
            <ReviewsSection productId={product.id}/>
          </div>

        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="border-t border-[#E0E0E0] px-4 md:px-8 py-12 md:py-16 bg-white">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-[10px] tracking-widest uppercase text-[#AAAAAA] mb-1">More like this</p>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tighter text-[#333333]">You May Also Like</h2>
            </div>
            <Link to="/shop" className="text-[10px] tracking-widest uppercase text-[#AAAAAA] hover:text-[#7EC8E3] transition-colors">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {related.map((p) => {
              const { average: avg, count: cnt } = getProductRating(p.id)
              const pStock = getProductStock(p.id)
              return (
                <Link to={`/product/${p.id}`} key={p.id} className="group">
                  <div className="aspect-[3/4] bg-[#FAF5EF] mb-3 border border-[#E0E0E0] group-hover:border-[#7EC8E3] transition-all duration-500 overflow-hidden relative">
                    <div className={`w-full h-full group-hover:scale-105 transition-transform duration-700 ${pStock.level === "sold_out" ? "opacity-40" : ""}`}>
                      <ModelViewer type={p.type} color={p.color} secondaryColor={p.secondaryColor} animate={false}/>
                    </div>
                    <span className="absolute top-2 left-2 text-[8px] tracking-widest bg-[#7EC8E3] text-white px-1.5 py-0.5">
                      {p.tag}
                    </span>
                    {pStock.urgent && (
                      <div className="absolute bottom-2 left-2 z-10">
                        <span className={`text-[7px] tracking-widest uppercase px-1.5 py-0.5 font-semibold border ${
                          pStock.level === "sold_out"
                            ? "bg-[#F4F4F4] text-[#AAAAAA] border-[#E0E0E0]"
                            : pStock.level === "last_one"
                            ? "bg-[#FF6B6B] text-white border-[#FF6B6B]"
                            : "bg-white text-[#FF6B6B] border-[#FF6B6B]/40"
                        }`}>
                          {pStock.label}
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs tracking-wide group-hover:text-[#7EC8E3] transition-colors mb-1 text-[#333333] font-medium">{p.name}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-[#888888]">${p.price}</p>
                    <div className="w-3 h-3 rounded-full border border-[#E0E0E0]" style={{ background: p.color }}/>
                  </div>
                  {cnt > 0 && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <StarRating rating={avg} size={9}/>
                      <span className="text-[9px] text-[#AAAAAA]">({cnt})</span>
                    </div>
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Bottom padding for sticky bar */}
      <div className="h-20"/>

    </div>
  )
}