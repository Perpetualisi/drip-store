import { useState, useEffect, useRef, useCallback } from "react"
import { useParams, Link } from "react-router-dom"
import { products } from "@/data/products"
import ModelViewer from "@/components/3d/ModelViewer"
import { useCartStore } from "@/store/cartStore"
import { useWishlistStore } from "@/store/wishlistStore"
import ReviewsSection from "@/components/reviews/ReviewsSection"
import StarRating from "@/components/reviews/StarRating"
import { getProductRating } from "@/data/reviews"
import { getProductStock, getViewerCount } from "@/data/stock"

// ─── Types ────────────────────────────────────────────────────────────────────

type TabId = "details" | "sizing" | "shipping"

interface StockInfo {
  level: "in_stock" | "low_stock" | "very_low" | "last_one" | "sold_out"
  quantity: number
  // optional fields — may not be present in all implementations
  urgent?: boolean
  label?: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const

// Each palette MUST contain the product's exact color hex so the detail page
// always opens on the matching variant. Exact-match entries are listed first.
const COLOR_VARIANTS: Record<string, { name: string; primary: string; secondary: string }[]> = {
  hoodie: [
    // exact product colors (IDs 1,2,3,4,20,33,34)
    { name: "Obsidian",   primary: "#1a1a1a", secondary: "#c8a96e" },
    { name: "Arctic",     primary: "#e8e8e8", secondary: "#888888" },
    { name: "Crimson",    primary: "#8B1A1A", secondary: "#c8a96e" },
    { name: "Forest",     primary: "#2D4A2D", secondary: "#4a7a4a" },
    { name: "Cream",      primary: "#F5F0E8", secondary: "#c8a96e" },
    { name: "Rose",       primary: "#C4788A", secondary: "#8B3A4A" },
    { name: "Sage",       primary: "#7A9B7A", secondary: "#4a6a4a" },
    // additional colorways for the picker
    { name: "Ocean",      primary: "#2563eb", secondary: "#93c5fd" },
    { name: "Slate",      primary: "#475569", secondary: "#cbd5e1" },
  ],
  tee: [
    // exact product colors (IDs 13,14,15)
    { name: "Onyx",       primary: "#111111", secondary: "#333333" },
    { name: "Bone",       primary: "#E8E0D0", secondary: "#c8b89a" },
    { name: "Rust",       primary: "#8B3A1A", secondary: "#c86030" },
    // additional colorways
    { name: "White",      primary: "#f5f5f5", secondary: "#e2e8f0" },
    { name: "Sky",        primary: "#0284c7", secondary: "#bae6fd" },
    { name: "Sage",       primary: "#4d7c0f", secondary: "#bef264" },
  ],
  jacket: [
    // exact product colors (IDs 5,6,18,27,28,40)
    { name: "Void",       primary: "#0f0f0f", secondary: "#c8a96e" },
    { name: "Cobalt",     primary: "#1B3A6B", secondary: "#4a7abf" },
    { name: "Midnight",   primary: "#1a1a2e", secondary: "#c8a96e" },
    { name: "Caramel",    primary: "#C19A6B", secondary: "#8B6914" },
    { name: "Onyx",       primary: "#1a1a1a", secondary: "#c8a96e" },
    { name: "Pearl",      primary: "#E8E0D0", secondary: "#c8a96e" },
    // additional colorways
    { name: "Burgundy",   primary: "#7f1d1d", secondary: "#fca5a5" },
    { name: "Graphite",   primary: "#374151", secondary: "#9ca3af" },
  ],
  coat: [
    // exact product colors (IDs 7,8,19,25,26,37)
    { name: "Camel",      primary: "#C19A6B", secondary: "#8B6914" },
    { name: "Charcoal",   primary: "#3a3a3a", secondary: "#666666" },
    { name: "Burgundy",   primary: "#5C1A2A", secondary: "#8B2A3A" },
    { name: "Forest",     primary: "#2D4A2D", secondary: "#4a7a4a" },
    { name: "Blush",      primary: "#D4A0A0", secondary: "#c87060" },
    { name: "Champagne",  primary: "#C8B89A", secondary: "#8B7850" },
    // additional colorways
    { name: "Navy",       primary: "#1e3a5f", secondary: "#93c5fd" },
    { name: "Plum",       primary: "#581c87", secondary: "#d8b4fe" },
  ],
  dress: [
    // exact product colors (IDs 21,22,23,24,35,36,39)
    { name: "Noir",       primary: "#0f0f0f", secondary: "#c8a96e" },
    { name: "Blush",      primary: "#E8B4A0", secondary: "#c87060" },
    { name: "Ivory",      primary: "#F5F0E8", secondary: "#c8a96e" },
    { name: "Cobalt",     primary: "#1B3A6B", secondary: "#4a7abf" },
    { name: "Lavender",   primary: "#9B8EC4", secondary: "#6a5a9a" },
    { name: "Mocha",      primary: "#6B4A3A", secondary: "#8B6050" },
    { name: "Burgundy",   primary: "#5C1A2A", secondary: "#8B2A3A" },
    // additional colorways
    { name: "Sage",       primary: "#166534", secondary: "#bbf7d0" },
  ],
  skirt: [
    // exact product colors (IDs 29,30,31,32)
    { name: "Mauve",      primary: "#9B7B8B", secondary: "#c8a0b0" },
    { name: "Cream",      primary: "#F5F0E8", secondary: "#c8a96e" },
    { name: "Onyx",       primary: "#1a1a1a", secondary: "#444444" },
    { name: "Terracotta", primary: "#C4622D", secondary: "#8B3A1A" },
    // additional colorways
    { name: "Blush",      primary: "#db2777", secondary: "#fbcfe8" },
    { name: "Lilac",      primary: "#7c3aed", secondary: "#ddd6fe" },
    { name: "Sky",        primary: "#0369a1", secondary: "#bae6fd" },
  ],
  pants: [
    // exact product colors (IDs 9,10,11,12,38)
    { name: "Phantom",    primary: "#1a1a1a", secondary: "#444444" },
    { name: "Stone",      primary: "#8C8070", secondary: "#c8b89a" },
    { name: "Indigo",     primary: "#2B3A6B", secondary: "#4a5a9a" },
    { name: "Olive",      primary: "#4A5240", secondary: "#6a7260" },
    { name: "Slate",      primary: "#4A5568", secondary: "#718096" },
    // additional colorways
    { name: "Navy",       primary: "#1e3a5f", secondary: "#93c5fd" },
    { name: "Burgundy",   primary: "#7f1d1d", secondary: "#fca5a5" },
  ],
  shorts: [
    // exact product colors (IDs 16,17)
    { name: "Slate",      primary: "#4A5568", secondary: "#718096" },
    { name: "Sand",       primary: "#C2A882", secondary: "#8B6914" },
    // additional colorways
    { name: "Midnight",   primary: "#1a1a1a", secondary: "#c8a96e" },
    { name: "Navy",       primary: "#1e3a5f", secondary: "#93c5fd" },
    { name: "Forest",     primary: "#166534", secondary: "#86efac" },
    { name: "Coral",      primary: "#be123c", secondary: "#fda4af" },
  ],
  blazer: [
    { name: "Midnight",   primary: "#1a1a1a", secondary: "#c8a96e" },
    { name: "Camel",      primary: "#92400e", secondary: "#fcd34d" },
    { name: "Navy",       primary: "#1e3a5f", secondary: "#93c5fd" },
    { name: "Ivory",      primary: "#d6c9a8", secondary: "#fef9ef" },
    { name: "Graphite",   primary: "#374151", secondary: "#9ca3af" },
    { name: "Burgundy",   primary: "#7f1d1d", secondary: "#fca5a5" },
  ],
}

function getVariants(type: string) {
  return COLOR_VARIANTS[type] ?? COLOR_VARIANTS["hoodie"]
}

// ─── Safe data helpers ────────────────────────────────────────────────────────

/** Normalises stock data — adds derived `urgent` and `label` fields if missing */
function normaliseStock(raw: unknown): StockInfo & { urgent: boolean; label: string } {
  const s = (raw ?? { level: "in_stock", quantity: 99 }) as StockInfo
  const urgent = s.urgent ?? (s.level === "last_one" || s.level === "very_low")
  const label = s.label ?? (
    s.level === "sold_out"  ? "Sold Out" :
    s.level === "last_one"  ? "Last 1 left!" :
    s.level === "very_low"  ? `Only ${s.quantity} left` :
    s.level === "low_stock" ? `${s.quantity} remaining` :
    "In Stock"
  )
  return { ...s, urgent, label }
}

function safeGetStock(id: number) {
  try { return normaliseStock(getProductStock(id)) }
  catch { return normaliseStock(null) }
}

function safeGetRating(id: number) {
  try { return getProductRating(id) ?? { average: 0, count: 0 } }
  catch { return { average: 0, count: 0 } }
}

function safeGetViewers(id: number): number {
  try { return getViewerCount?.(id) ?? 0 }
  catch { return 0 }
}

// ─── Component ────────────────────────────────────────────────────────────────
// ─── Colour-matching helpers ──────────────────────────────────────────────────

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "").padEnd(6, "0")
  return [
    parseInt(clean.slice(0, 2), 16),
    parseInt(clean.slice(2, 4), 16),
    parseInt(clean.slice(4, 6), 16),
  ]
}

function colourDistance(a: string, b: string): number {
  const [r1, g1, b1] = hexToRgb(a)
  const [r2, g2, b2] = hexToRgb(b)
  return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2)
}

/**
 * Returns the index of the variant whose primary colour best matches
 * the product's stored color (exact hex first, then closest RGB distance).
 * This ensures the detail page opens on the same colour shown in the shop.
 */
function findMatchingVariantIdx(
  variants: { primary: string; secondary: string }[],
  productColor: string,
  productSecondary: string
): number {
  const exact = variants.findIndex(
    (v) => v.primary.toLowerCase() === productColor.toLowerCase()
  )
  if (exact !== -1) return exact

  const exactSec = variants.findIndex(
    (v) => v.secondary.toLowerCase() === productSecondary.toLowerCase()
  )
  if (exactSec !== -1) return exactSec

  let bestIdx = 0
  let bestDist = Infinity
  variants.forEach((v, i) => {
    const dist = colourDistance(v.primary, productColor)
    if (dist < bestDist) { bestDist = dist; bestIdx = i }
  })
  return bestIdx
}


export default function ProductDetail() {
  const { id } = useParams()
  const product = products.find((p) => p.id === Number(id))
  const addItem = useCartStore((state) => state.addItem)
  const { toggleItem, isWishlisted } = useWishlistStore()

  const [selectedSize, setSelectedSize]       = useState<string>("M")
  const [added, setAdded]                     = useState(false)
  const [stickyAdded, setStickyAdded]         = useState(false)
  const [activeTab, setActiveTab]             = useState<TabId>("details")
  const [selectedVariantIdx, setSelectedVariantIdx] = useState<number>(() => {
    if (!product) return 0
    const vs = getVariants(product.type)
    return findMatchingVariantIdx(vs, product.color, product.secondaryColor)
  })
  const [showSticky, setShowSticky]           = useState(false)
  const [wishlistToast, setWishlistToast]     = useState(false)

  const ctaRef     = useRef<HTMLDivElement>(null)
  const tabsRef    = useRef<HTMLDivElement>(null)
  const reviewsRef = useRef<HTMLDivElement>(null)

  // Show sticky bar when main CTA scrolls out of view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setShowSticky(!entry.isIntersecting),
      { threshold: 0 }
    )
    if (ctaRef.current) observer.observe(ctaRef.current)
    return () => observer.disconnect()
  }, [])

  // Re-sync variant to match product color when navigating between product pages
  useEffect(() => {
    if (!product) return
    const vs = getVariants(product.type)
    setSelectedVariantIdx(findMatchingVariantIdx(vs, product.color, product.secondaryColor))
  }, [product?.id]) // eslint-disable-line react-hooks/exhaustive-deps


  // Auto-dismiss wishlist toast
  useEffect(() => {
    if (!wishlistToast) return
    const t = setTimeout(() => setWishlistToast(false), 3000)
    return () => clearTimeout(t)
  }, [wishlistToast])

  // ── Not found ──────────────────────────────────────────────────────────────

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
        <Link
          to="/shop"
          className="mt-2 text-xs tracking-widest uppercase border border-[#DDD5C7] px-6 py-3 hover:border-[#333333] hover:text-[#333333] transition-colors text-[#888888]"
        >
          Back to Shop
        </Link>
      </div>
    )
  }

  // ── Derived data ───────────────────────────────────────────────────────────

  const variants        = getVariants(product.type)
  const selectedVariant = variants[selectedVariantIdx] ?? variants[0]
  const wishlisted      = isWishlisted(product.id)
  const { average, count } = safeGetRating(product.id)
  const stock           = safeGetStock(product.id)
  const viewers         = safeGetViewers(product.id)
  const soldOut         = stock.level === "sold_out"

  // ── Handlers ──────────────────────────────────────────────────────────────

  /** Single shared add-to-cart logic — avoids duplication between main & sticky */
  const addToCart = useCallback((onSuccess: () => void) => {
    if (soldOut) return
    addItem({
      id:             product.id,
      name:           product.name,
      price:          product.price,
      color:          selectedVariant.primary,
      secondaryColor: selectedVariant.secondary,
      type:           product.type,
      gender:         product.gender,
      quantity:       1,
      size:           selectedSize,
    })
    onSuccess()
  }, [soldOut, addItem, product, selectedVariant, selectedSize])

  const handleAddToCart = useCallback(() => {
    addToCart(() => {
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    })
  }, [addToCart])

  const handleStickyAddToCart = useCallback(() => {
    addToCart(() => {
      setStickyAdded(true)
      setTimeout(() => setStickyAdded(false), 2000)
    })
  }, [addToCart])

  const handleToggleWishlist = useCallback(() => {
    toggleItem(product.id)
    setWishlistToast(true)
  }, [toggleItem, product.id])

  /** Opens the sizing tab AND scrolls the tabs section into view */
  const openSizeGuide = useCallback(() => {
    setActiveTab("sizing")
    tabsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [])

  /** Scrolls to the reviews section */
  const scrollToReviews = useCallback(() => {
    reviewsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [])

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#FAF5EF] text-[#333333]">

      {/* ── STICKY ADD TO CART BAR ── */}
      <div
        aria-hidden={!showSticky || soldOut}
        className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 ${
          showSticky && !soldOut
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-0 pointer-events-none"
        }`}
      >
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
              <p className="text-xs font-semibold text-[#333333] truncate max-w-[120px] md:max-w-none">
                {product.name}
              </p>
              <p className="text-[9px] text-[#AAAAAA] tracking-wide">
                {selectedVariant.name} · {selectedSize}
              </p>
            </div>

            {/* Color swatches */}
            <div className="shrink-0 hidden md:flex items-center gap-1.5">
              {variants.slice(0, 4).map((v, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedVariantIdx(idx)}
                  aria-label={`Select colour ${v.name}`}
                  aria-pressed={selectedVariantIdx === idx}
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

            <div className="w-px h-8 bg-[#E0E0E0] shrink-0 hidden md:block"/>

            {/* Size selector */}
            <div className="hidden md:flex gap-1 shrink-0">
              {SIZES.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  aria-pressed={selectedSize === s}
                  aria-label={`Size ${s}`}
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

            <div className="flex-1"/>

            {/* Mobile size — compact */}
            <div className="flex gap-1 md:hidden">
              {(["S","M","L","XL"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  aria-pressed={selectedSize === s}
                  aria-label={`Size ${s}`}
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

            {/* Add to Cart */}
            <button
              onClick={handleStickyAddToCart}
              aria-label={`Add ${product.name} to cart`}
              className={`shrink-0 px-5 md:px-8 py-3 text-[10px] md:text-xs tracking-widest uppercase font-medium transition-all duration-300 whitespace-nowrap ${
                stickyAdded
                  ? "bg-[#A8E6CF] text-[#333333]"
                  : "bg-[#333333] text-white hover:bg-[#7EC8E3]"
              }`}
            >
              {stickyAdded ? "✓ Added!" : `Add to Cart — $${product.price}`}
            </button>

            {/* Wishlist */}
            <button
              onClick={handleToggleWishlist}
              aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
              aria-pressed={wishlisted}
              className={`shrink-0 w-10 h-10 border flex items-center justify-center transition-all duration-300 ${
                wishlisted
                  ? "border-[#FF6B6B] bg-[#FFF0F0]"
                  : "border-[#E0E0E0] hover:border-[#FF6B6B] hover:bg-[#FFF0F0]"
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

      {/* ── BREADCRUMB ── */}
      <div className="px-4 md:px-8 py-4 border-b border-[#E0E0E0] bg-white flex items-center gap-2 text-[10px] tracking-widest uppercase text-[#AAAAAA] overflow-x-auto">
        <Link to="/" className="hover:text-[#7EC8E3] transition-colors shrink-0">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-[#7EC8E3] transition-colors shrink-0">Shop</Link>
        <span>/</span>
        <span className="text-[#333333] truncate">{product.name}</span>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[90vh]">

        {/* LEFT — Viewer */}
        <div className="relative bg-white border-b lg:border-b-0 lg:border-r border-[#E0E0E0] flex items-center justify-center min-h-[70vw] md:min-h-[50vw] lg:min-h-0 lg:sticky lg:top-24 lg:h-[calc(100vh-6rem)]">

          {/* Background colour glow */}
          <div
            className="absolute inset-0 opacity-[0.08] pointer-events-none transition-all duration-700"
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
            onClick={handleToggleWishlist}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={wishlisted}
            className={`absolute top-4 right-4 w-10 h-10 border flex items-center justify-center transition-all duration-300 z-10 ${
              wishlisted
                ? "border-[#FF6B6B] bg-[#FFF0F0]"
                : "border-[#E0E0E0] bg-white/90 hover:border-[#FF6B6B] hover:bg-[#FFF0F0]"
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24"
              fill={wishlisted ? "#FF6B6B" : "none"}
              stroke={wishlisted ? "#FF6B6B" : "#888888"}
              strokeWidth="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>

          {/* Wishlist toast — auto-dismisses after 3s */}
          <div className={`absolute bottom-12 left-1/2 -translate-x-1/2 z-10 transition-all duration-300 ${
            wishlistToast && wishlisted
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 translate-y-2 pointer-events-none"
          }`}>
            <Link
              to="/wishlist"
              className="flex items-center gap-2 bg-white border border-[#FF6B6B]/30 px-3 py-2 text-[9px] tracking-widest uppercase text-[#FF6B6B] hover:bg-[#FFF0F0] transition-colors whitespace-nowrap"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="#FF6B6B" stroke="#FF6B6B" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              Saved — View Wishlist
            </Link>
          </div>

          {/* Colour name label */}
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
              <button
                onClick={scrollToReviews}
                className="text-[9px] tracking-widest uppercase text-[#7EC8E3] hover:underline underline-offset-2"
              >
                Read reviews
              </button>
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
            {!soldOut && viewers > 0 && (
              <div className="flex items-center gap-2 mb-3">
                <div className="flex -space-x-1">
                  {Array.from({ length: Math.min(viewers, 5) }).map((_, i) => (
                    <div
                      key={i}
                      className="w-4 h-4 rounded-full border border-white flex items-center justify-center text-[6px] font-bold text-white"
                      style={{ background: ["#7EC8E3","#A8E6CF","#C5A3FF","#FF6B6B","#F59E0B"][i] }}
                      aria-hidden="true"
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <p className="text-[9px] tracking-wide text-[#888888]">
                  <span className="font-semibold text-[#333333]">{viewers} people</span> viewing this right now
                </p>
                <div className="w-1.5 h-1.5 rounded-full bg-[#A8E6CF] animate-pulse ml-auto shrink-0" aria-hidden="true"/>
              </div>
            )}

            {stock.level !== "in_stock" && (
              <div className={`border px-4 py-3 ${
                soldOut
                  ? "border-[#E0E0E0] bg-[#F4F4F4]"
                  : stock.level === "last_one"
                  ? "border-[#FF6B6B]/40 bg-[#FF6B6B]/5"
                  : stock.level === "very_low"
                  ? "border-[#FF6B6B]/30 bg-[#FFF8F8]"
                  : "border-[#F59E0B]/30 bg-[#FFFBF0]"
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {!soldOut && (
                      <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${stock.urgent ? "bg-[#FF6B6B]" : "bg-[#F59E0B]"}`} aria-hidden="true"/>
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
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
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
                    aria-label={`Select colour ${variant.name}`}
                    aria-pressed={selectedVariantIdx === idx}
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
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
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
              {/* Colour progress strip */}
              <div className="mt-5 h-1.5 rounded-full overflow-hidden flex gap-0.5">
                {variants.map((v, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedVariantIdx(idx)}
                    aria-label={`Select colour ${v.name}`}
                    aria-pressed={selectedVariantIdx === idx}
                    className={`flex-1 h-full transition-all duration-300 ${
                      selectedVariantIdx === idx ? "opacity-100 scale-y-150" : "opacity-40 hover:opacity-70"
                    }`}
                    style={{ background: v.primary }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ── SIZE SELECTOR ── */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] tracking-widest uppercase text-[#AAAAAA]">
                Size — <span className="text-[#333333] font-medium">{selectedSize}</span>
              </p>
              <button
                onClick={openSizeGuide}
                className="text-[10px] tracking-widest uppercase text-[#7EC8E3] hover:underline underline-offset-2 transition-colors"
              >
                Size Guide
              </button>
            </div>
            <div className="grid grid-cols-6 gap-1.5 md:gap-2">
              {SIZES.map((s) => (
                <button
                  key={s}
                  onClick={() => !soldOut && setSelectedSize(s)}
                  disabled={soldOut}
                  aria-pressed={!soldOut && selectedSize === s}
                  aria-label={`Size ${s}`}
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

          {/* ── MAIN CTA ── */}
          <div ref={ctaRef} className="flex gap-2 md:gap-3 mb-6">
            <button
              onClick={handleAddToCart}
              disabled={soldOut}
              aria-label={soldOut ? "Sold out" : `Add ${product.name} to cart`}
              className={`flex-1 py-4 text-xs md:text-sm tracking-widest uppercase font-medium transition-all duration-300 ${
                soldOut
                  ? "bg-[#F4F4F4] text-[#AAAAAA] cursor-not-allowed"
                  : added
                  ? "bg-[#A8E6CF] text-[#333333]"
                  : "bg-[#333333] text-white hover:bg-[#7EC8E3]"
              }`}
            >
              {soldOut ? "Sold Out" : added ? "✓ Added to Cart" : `Add to Cart — $${product.price}`}
            </button>
            <button
              onClick={handleToggleWishlist}
              aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
              aria-pressed={wishlisted}
              className={`w-12 md:w-14 border flex items-center justify-center transition-all duration-300 ${
                wishlisted
                  ? "border-[#FF6B6B] bg-[#FF6B6B]/10"
                  : "border-[#E0E0E0] hover:border-[#FF6B6B] hover:bg-[#FFF0F0]"
              }`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24"
                fill={wishlisted ? "#FF6B6B" : "none"}
                stroke={wishlisted ? "#FF6B6B" : "#888888"}
                strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
          </div>

          {/* Sold out — waitlist */}
          {soldOut && (
            <div className="mb-6 border border-[#E0E0E0] bg-white p-4">
              <p className="text-[10px] tracking-widest uppercase text-[#333333] font-medium mb-1">Join the Waitlist</p>
              <p className="text-[9px] text-[#AAAAAA] mb-3">Be the first to know when this item restocks.</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  aria-label="Email address for restock notification"
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
            <Link
              to="/wishlist"
              className="flex items-center gap-2 text-[10px] tracking-widest uppercase text-[#FF6B6B] mb-4 hover:underline underline-offset-2"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="#FF6B6B" stroke="#FF6B6B" strokeWidth="1.5" aria-hidden="true">
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
                <span className="text-base md:text-lg" aria-hidden="true">{b.icon}</span>
                <p className="text-[8px] md:text-[9px] tracking-widest uppercase text-[#333333] font-medium">{b.label}</p>
                <p className="text-[8px] md:text-[9px] text-[#AAAAAA]">{b.sub}</p>
              </div>
            ))}
          </div>

          {/* ── TABS ── */}
          <div ref={tabsRef} className="mb-6">
            <div className="flex border-b border-[#E0E0E0] mb-5 overflow-x-auto" role="tablist">
              {(["details", "sizing", "shipping"] as const).map((tab) => (
                <button
                  key={tab}
                  role="tab"
                  aria-selected={activeTab === tab}
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
              <div className="space-y-3 text-sm text-[#888888] leading-relaxed" role="tabpanel">
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
                      <span className="w-1.5 h-1.5 rounded-full bg-[#7EC8E3] shrink-0" aria-hidden="true"/>
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
              <div className="text-xs text-[#888888] overflow-x-auto" role="tabpanel">
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
                      <tr
                        key={size}
                        className={`border-b border-[#E0E0E0] transition-colors ${
                          selectedSize === size ? "bg-[#E8F8FC] text-[#7EC8E3]" : "hover:bg-[#FAF5EF]"
                        }`}
                      >
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
              <div className="space-y-3 text-xs text-[#888888]" role="tabpanel">
                {[
                  { method: "Standard",  time: "5–7 business days", price: "Free over $100" },
                  { method: "Express",   time: "2–3 business days", price: "$12.99" },
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
              <button
                key={s}
                aria-label={`Share on ${s}`}
                className="text-[10px] tracking-widest uppercase text-[#888888] hover:text-[#333333] transition-colors border border-[#E0E0E0] px-3 py-1.5 hover:border-[#333333] bg-white"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Reviews */}
          <div ref={reviewsRef} id="reviews">
            <ReviewsSection productId={product.id}/>
          </div>

        </div>
      </div>

      {/* ── RELATED PRODUCTS ── */}
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
              const { average: avg, count: cnt } = safeGetRating(p.id)
              const pStock = safeGetStock(p.id)
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
                  <p className="text-xs tracking-wide group-hover:text-[#7EC8E3] transition-colors mb-1 text-[#333333] font-medium">
                    {p.name}
                  </p>
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