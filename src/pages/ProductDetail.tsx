import { useState } from "react"
import { useParams, Link } from "react-router-dom"
import { products } from "@/data/products"
import ModelViewer from "@/components/3d/ModelViewer"
import { useCartStore } from "@/store/cartStore"
import { useWishlistStore } from "@/store/wishlistStore"
import ReviewsSection from "@/components/reviews/ReviewsSection"
import StarRating from "@/components/reviews/StarRating"
import { getProductRating } from "@/data/reviews"

const sizes = ["XS", "S", "M", "L", "XL", "XXL"]

const COLOR_VARIANTS: Record<string, { name: string; primary: string; secondary: string }[]> = {
  hoodie: [
    { name: "Midnight",    primary: "#1a1a1a",  secondary: "#c8a96e" },
    { name: "Ocean",       primary: "#2563eb",  secondary: "#93c5fd" },
    { name: "Forest",      primary: "#166534",  secondary: "#86efac" },
    { name: "Blush",       primary: "#be185d",  secondary: "#f9a8d4" },
    { name: "Slate",       primary: "#475569",  secondary: "#cbd5e1" },
    { name: "Cream",       primary: "#d4a96a",  secondary: "#fef3c7" },
  ],
  tee: [
    { name: "Midnight",    primary: "#1a1a1a",  secondary: "#c8a96e" },
    { name: "White",       primary: "#f5f5f5",  secondary: "#e2e8f0" },
    { name: "Sky",         primary: "#0284c7",  secondary: "#bae6fd" },
    { name: "Sage",        primary: "#4d7c0f",  secondary: "#bef264" },
    { name: "Dusty Rose",  primary: "#9f1239",  secondary: "#fda4af" },
    { name: "Sand",        primary: "#b45309",  secondary: "#fde68a" },
  ],
  jacket: [
    { name: "Onyx",        primary: "#0f172a",  secondary: "#334155" },
    { name: "Camel",       primary: "#92400e",  secondary: "#fcd34d" },
    { name: "Cobalt",      primary: "#1d4ed8",  secondary: "#93c5fd" },
    { name: "Burgundy",    primary: "#7f1d1d",  secondary: "#fca5a5" },
    { name: "Olive",       primary: "#3f6212",  secondary: "#a3e635" },
    { name: "Graphite",    primary: "#374151",  secondary: "#9ca3af" },
  ],
  coat: [
    { name: "Charcoal",    primary: "#1c1917",  secondary: "#a8a29e" },
    { name: "Camel",       primary: "#a16207",  secondary: "#fde68a" },
    { name: "Ivory",       primary: "#d6c9a8",  secondary: "#fef9ef" },
    { name: "Navy",        primary: "#1e3a5f",  secondary: "#93c5fd" },
    { name: "Moss",        primary: "#365314",  secondary: "#a3e635" },
    { name: "Plum",        primary: "#581c87",  secondary: "#d8b4fe" },
  ],
  dress: [
    { name: "Midnight",    primary: "#1a1a1a",  secondary: "#c8a96e" },
    { name: "Blush",       primary: "#db2777",  secondary: "#fbcfe8" },
    { name: "Sage",        primary: "#166534",  secondary: "#bbf7d0" },
    { name: "Lilac",       primary: "#7c3aed",  secondary: "#ddd6fe" },
    { name: "Terracotta",  primary: "#b45309",  secondary: "#fed7aa" },
    { name: "Cobalt",      primary: "#1d4ed8",  secondary: "#bfdbfe" },
  ],
  skirt: [
    { name: "Midnight",    primary: "#1a1a1a",  secondary: "#c8a96e" },
    { name: "Blush",       primary: "#db2777",  secondary: "#fbcfe8" },
    { name: "Lilac",       primary: "#7c3aed",  secondary: "#ddd6fe" },
    { name: "Sage",        primary: "#166534",  secondary: "#bbf7d0" },
    { name: "Caramel",     primary: "#92400e",  secondary: "#fde68a" },
    { name: "Sky",         primary: "#0369a1",  secondary: "#bae6fd" },
  ],
  pants: [
    { name: "Midnight",    primary: "#1a1a1a",  secondary: "#c8a96e" },
    { name: "Navy",        primary: "#1e3a5f",  secondary: "#93c5fd" },
    { name: "Olive",       primary: "#3f6212",  secondary: "#a3e635" },
    { name: "Stone",       primary: "#78716c",  secondary: "#d6d3d1" },
    { name: "Burgundy",    primary: "#7f1d1d",  secondary: "#fca5a5" },
    { name: "Camel",       primary: "#92400e",  secondary: "#fcd34d" },
  ],
  shorts: [
    { name: "Midnight",    primary: "#1a1a1a",  secondary: "#c8a96e" },
    { name: "Navy",        primary: "#1e3a5f",  secondary: "#93c5fd" },
    { name: "Khaki",       primary: "#713f12",  secondary: "#fde68a" },
    { name: "Coral",       primary: "#be123c",  secondary: "#fda4af" },
    { name: "Forest",      primary: "#166534",  secondary: "#86efac" },
    { name: "Sky",         primary: "#0369a1",  secondary: "#bae6fd" },
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
  const [activeTab, setActiveTab] = useState<"details" | "sizing" | "shipping">("details")
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0)

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

  const handleAddToCart = () => {
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

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  return (
    <div className="min-h-screen bg-[#FAF5EF] text-[#333333]">

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

          {/* Background glow — reacts to selected color */}
          <div
            className="absolute inset-0 opacity-8 pointer-events-none transition-all duration-700"
            style={{ background: `radial-gradient(circle at center, ${selectedVariant.primary}, transparent 70%)` }}
          />

          {/* Model — uses selected variant colors */}
          <div className="relative z-10 w-full h-full max-w-sm mx-auto p-6 md:p-10 lg:p-12">
            <ModelViewer
              type={product.type}
              color={selectedVariant.primary}
              secondaryColor={selectedVariant.secondary}
              animate={true}
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

          {/* Color name label on viewer */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
            <span className="text-[9px] tracking-widest uppercase text-[#AAAAAA] bg-white/90 border border-[#E0E0E0] px-3 py-1.5">
              {selectedVariant.name}
            </span>
          </div>
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
            {product.tag === "Limited" && (
              <span className="text-[9px] tracking-widest text-[#FF6B6B] border border-[#FF6B6B]/30 bg-[#FF6B6B]/5 px-2 py-1 uppercase">
                Low Stock
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
          <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-[#E0E0E0]">
            <span className="text-3xl font-bold text-[#333333]">${product.price}</span>
            <span className="text-[#CCCCCC] text-sm line-through">${Math.round(product.price * 1.2)}</span>
            <span className="text-[10px] tracking-widest text-[#A8E6CF] uppercase font-medium bg-[#A8E6CF]/10 px-2 py-0.5">
              Save 20%
            </span>
          </div>

          {/* ── COLOR VARIANTS ── */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] tracking-widest uppercase text-[#AAAAAA]">
                Color — <span className="text-[#333333] font-medium">{selectedVariant.name}</span>
              </p>
              <span className="text-[9px] tracking-widest uppercase text-[#AAAAAA]">
                {variants.length} colorways
              </span>
            </div>

            {/* Swatch grid */}
            <div className="flex flex-wrap gap-2.5">
              {variants.map((variant, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedVariantIdx(idx)}
                  title={variant.name}
                  className="relative group"
                >
                  {/* Outer ring when selected */}
                  <div className={`w-9 h-9 rounded-full transition-all duration-200 flex items-center justify-center ${
                    selectedVariantIdx === idx
                      ? "ring-2 ring-offset-2 ring-[#7EC8E3] ring-offset-[#FAF5EF]"
                      : "hover:ring-2 hover:ring-offset-2 hover:ring-[#CCCCCC] hover:ring-offset-[#FAF5EF]"
                  }`}>
                    {/* Split swatch — primary on left, secondary on right */}
                    <div className="w-7 h-7 rounded-full overflow-hidden border border-[#E0E0E0] flex">
                      <div className="w-1/2 h-full" style={{ background: variant.primary }}/>
                      <div className="w-1/2 h-full" style={{ background: variant.secondary }}/>
                    </div>
                  </div>
                  {/* Checkmark when selected */}
                  {selectedVariantIdx === idx && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
                        <path d="M20 6L9 17l-5-5"/>
                      </svg>
                    </div>
                  )}
                  {/* Tooltip */}
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] tracking-wide text-[#888888] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {variant.name}
                  </div>
                </button>
              ))}
            </div>

            {/* Color preview bar */}
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
                  onClick={() => setSelectedSize(s)}
                  className={`py-2.5 md:py-3 text-xs tracking-wider uppercase border transition-all duration-200 ${
                    selectedSize === s
                      ? "bg-[#333333] text-white border-[#333333] font-medium"
                      : "bg-white text-[#888888] border-[#E0E0E0] hover:border-[#333333] hover:text-[#333333]"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex gap-2 md:gap-3 mb-6">
            <button
              onClick={handleAddToCart}
              className={`flex-1 py-4 text-xs md:text-sm tracking-widest uppercase font-medium transition-all duration-300 ${
                added ? "bg-[#A8E6CF] text-[#333333]" : "bg-[#333333] text-white hover:bg-[#7EC8E3]"
              }`}
            >
              {added ? "Added to Cart" : `Add to Cart — $${product.price}`}
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
            {related.map((p) => (
              <Link to={`/product/${p.id}`} key={p.id} className="group">
                <div className="aspect-[3/4] bg-[#FAF5EF] mb-3 border border-[#E0E0E0] group-hover:border-[#7EC8E3] transition-all duration-500 overflow-hidden relative">
                  <div className="w-full h-full group-hover:scale-105 transition-transform duration-700">
                    <ModelViewer type={p.type} color={p.color} secondaryColor={p.secondaryColor} animate={false}/>
                  </div>
                  <span className="absolute top-2 left-2 text-[8px] tracking-widest bg-[#7EC8E3] text-white px-1.5 py-0.5">
                    {p.tag}
                  </span>
                </div>
                <p className="text-xs tracking-wide group-hover:text-[#7EC8E3] transition-colors mb-1 text-[#333333] font-medium">{p.name}</p>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-[#888888]">${p.price}</p>
                  <div className="w-3 h-3 rounded-full border border-[#E0E0E0]" style={{ background: p.color }}/>
                </div>
                {(() => {
                  const { average: avg, count: cnt } = getProductRating(p.id)
                  return cnt > 0 ? (
                    <div className="flex items-center gap-1 mt-0.5">
                      <StarRating rating={avg} size={9}/>
                      <span className="text-[9px] text-[#AAAAAA]">({cnt})</span>
                    </div>
                  ) : null
                })()}
              </Link>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}