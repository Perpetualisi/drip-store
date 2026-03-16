import { useState, useMemo, useEffect, useCallback, useRef } from "react"
import { Link } from "react-router-dom"
import { products } from "@/data/products"
import ModelViewer from "@/components/3d/ModelViewer"
import { useCartStore } from "@/store/cartStore"
import { useWishlistStore } from "@/store/wishlistStore"
import StarRating from "@/components/reviews/StarRating"
import { getProductRating } from "@/data/reviews"
import { getProductStock } from "@/data/stock"

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = ["All", "Tops", "Bottoms", "Outerwear", "Dresses"] as const
const GENDERS = ["All", "Male", "Female"] as const
const SORT_OPTIONS = [
  "Featured",
  "Price: Low to High",
  "Price: High to Low",
  "New Arrivals",
  "Top Rated",
] as const
const SIZES = ["XS", "S", "M", "L", "XL"] as const
const ITEMS_PER_PAGE = 12

type Category = (typeof CATEGORIES)[number]
type Gender = (typeof GENDERS)[number]
type SortOption = (typeof SORT_OPTIONS)[number]
type ViewMode = "grid" | "list"

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Safe wrapper — returns zeros if a product has no reviews yet. */
function safeRating(id: number) {
  try {
    return getProductRating(id) ?? { average: 0, count: 0 }
  } catch {
    return { average: 0, count: 0 }
  }
}

/** Safe wrapper — returns "in_stock" sentinel if stock data is missing. */
function safeStock(id: number) {
  try {
    return getProductStock(id) ?? { level: "in_stock" as const, quantity: 99 }
  } catch {
    return { level: "in_stock" as const, quantity: 99 }
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StockBadge({ level, quantity }: { level: string; quantity?: number }) {
  if (level === "sold_out")
    return (
      <span className="text-[8px] md:text-[9px] tracking-widest bg-[#888888] text-white px-2 py-0.5 font-medium">
        Sold Out
      </span>
    )
  if (level === "last_one")
    return (
      <span className="text-[8px] tracking-widest bg-[#FF6B6B] text-white px-2 py-0.5 font-semibold animate-pulse">
        Last 1!
      </span>
    )
  if (level === "very_low")
    return (
      <span className="text-[8px] tracking-widest bg-white text-[#FF6B6B] border border-[#FF6B6B]/40 px-2 py-0.5">
        Only {quantity} left
      </span>
    )
  if (level === "low_stock")
    return (
      <span className="text-[8px] tracking-widest bg-white text-[#F59E0B] border border-[#F59E0B]/40 px-2 py-0.5">
        {quantity} left
      </span>
    )
  return null
}

function SizeButton({
  size,
  selected,
  onClick,
}: {
  size: string
  selected: boolean
  onClick: (e: React.MouseEvent) => void
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={selected}
      aria-label={`Size ${size}`}
      className={`w-8 h-8 text-[9px] tracking-wider transition-all duration-150 border ${
        selected
          ? "bg-[#333333] text-white border-[#333333]"
          : "bg-white text-[#888888] border-[#E0E0E0] hover:border-[#333333] hover:text-[#333333]"
      }`}
    >
      {size}
    </button>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Shop() {
  // Filter / sort state
  const [activeCategory, setActiveCategory] = useState<Category>("All")
  const [activeGender, setActiveGender] = useState<Gender>("All")
  const [activeSort, setActiveSort] = useState<SortOption>("Featured")
  const [searchQuery, setSearchQuery] = useState("")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500])
  const [inStockOnly, setInStockOnly] = useState(false)

  // UI state
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [showPriceFilter, setShowPriceFilter] = useState(false)
  const [selectedSizes, setSelectedSizes] = useState<Record<number, string>>({})
  const [addedId, setAddedId] = useState<number | null>(null)
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)
  const [showBackToTop, setShowBackToTop] = useState(false)

  const addItem = useCartStore((s) => s.addItem)
  const { toggleItem, isWishlisted } = useWishlistStore()
  const gridRef = useRef<HTMLDivElement>(null)

  // ── Derived price bounds from product data ──
  const [minPrice, maxPrice] = useMemo(() => {
    const prices = products.map((p) => p.price)
    return [Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))]
  }, [])

  // Initialise price range once we know the bounds
  useEffect(() => {
    setPriceRange([minPrice, maxPrice])
  }, [minPrice, maxPrice])

  // ── Scroll-to-top button visibility ──
  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 600)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // ── Reset pagination when any filter/sort/search changes ──
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE)
  }, [activeCategory, activeGender, activeSort, searchQuery, priceRange, inStockOnly])

  // ── Filtered + sorted products ──
  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()

    return products
      .filter((p) => {
        if (activeCategory !== "All" && p.category !== activeCategory) return false
        if (activeGender !== "All" && p.gender !== activeGender) return false
        if (p.price < priceRange[0] || p.price > priceRange[1]) return false
        if (inStockOnly && safeStock(p.id).level === "sold_out") return false
        if (q && !p.name.toLowerCase().includes(q) && !p.category.toLowerCase().includes(q))
          return false
        return true
      })
      .sort((a, b) => {
        switch (activeSort) {
          case "Price: Low to High":
            return a.price - b.price
          case "Price: High to Low":
            return b.price - a.price
          case "Top Rated":
            return safeRating(b.id).average - safeRating(a.id).average
          default:
            return 0
        }
      })
  }, [activeCategory, activeGender, activeSort, searchQuery, priceRange, inStockOnly])

  const visible = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length

  const activeFilterCount = [
    activeCategory !== "All",
    activeGender !== "All",
    searchQuery.trim() !== "",
    priceRange[0] !== minPrice || priceRange[1] !== maxPrice,
    inStockOnly,
  ].filter(Boolean).length

  // ── Handlers ──

  const handleAddToCart = useCallback(
    (product: (typeof products)[0]) => {
      const stock = safeStock(product.id)
      if (stock.level === "sold_out") return
      const size = selectedSizes[product.id] || "M"
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        color: product.color,
        secondaryColor: product.secondaryColor,
        type: product.type,
        gender: product.gender,
        quantity: 1,
        size,
      })
      setAddedId(product.id)
      setTimeout(() => setAddedId(null), 1500)
    },
    [addItem, selectedSizes]
  )

  const handleClearFilters = useCallback(() => {
    setActiveCategory("All")
    setActiveGender("All")
    setActiveSort("Featured")
    setSearchQuery("")
    setPriceRange([minPrice, maxPrice])
    setInStockOnly(false)
  }, [minPrice, maxPrice])

  const handleSizeSelect = useCallback(
    (productId: number, size: string) =>
      (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setSelectedSizes((prev) => ({ ...prev, [productId]: size }))
      },
    []
  )

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" })

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#FAF5EF] text-[#333333]">

      {/* ── Page Header ── */}
      <div className="border-b border-[#E0E0E0] bg-white px-4 md:px-8 py-10 md:py-16">
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-[10px] md:text-xs tracking-[0.4em] text-[#AAAAAA] uppercase mb-2">
              {filtered.length} Product{filtered.length !== 1 ? "s" : ""}
            </p>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-[#333333]">Shop</h1>
          </div>

          {/* View-mode toggle (now functional) */}
          <div className="hidden md:flex gap-2 mb-2">
            <button
              onClick={() => setViewMode("grid")}
              aria-label="Grid view"
              aria-pressed={viewMode === "grid"}
              className={`border p-2 transition-colors ${
                viewMode === "grid"
                  ? "border-[#7EC8E3] text-[#7EC8E3] bg-[#E8F8FC]"
                  : "border-[#E0E0E0] text-[#888888] hover:text-[#7EC8E3] hover:border-[#7EC8E3]"
              }`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("list")}
              aria-label="List view"
              aria-pressed={viewMode === "list"}
              className={`border p-2 transition-colors ${
                viewMode === "list"
                  ? "border-[#7EC8E3] text-[#7EC8E3] bg-[#E8F8FC]"
                  : "border-[#E0E0E0] text-[#888888] hover:text-[#7EC8E3] hover:border-[#7EC8E3]"
              }`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div className="relative mb-4">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#AAAAAA] pointer-events-none"
            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            placeholder="Search products…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:max-w-sm bg-[#FAF5EF] border border-[#E0E0E0] text-sm text-[#333333] placeholder-[#BBBBBB] pl-9 pr-4 py-2 outline-none focus:border-[#7EC8E3] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#AAAAAA] hover:text-[#333333] transition-colors"
            >
              ✕
            </button>
          )}
        </div>

        {/* Gender Tabs */}
        <div className="flex gap-1 mb-4 md:mb-6 overflow-x-auto pb-1">
          {GENDERS.map((g) => (
            <button
              key={g}
              onClick={() => setActiveGender(g)}
              aria-pressed={activeGender === g}
              className={`shrink-0 px-5 md:px-7 py-2.5 text-[10px] md:text-xs tracking-widest uppercase transition-all duration-200 ${
                activeGender === g
                  ? "bg-[#333333] text-white font-medium"
                  : "text-[#888888] hover:text-[#333333] border border-[#E0E0E0] hover:border-[#333333]"
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Category + Sort + Extras row */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Mobile filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            aria-expanded={showFilters}
            className="md:hidden flex items-center gap-2 text-[10px] tracking-widest uppercase border border-[#E0E0E0] px-4 py-2 text-[#888888] hover:border-[#333333] hover:text-[#333333] transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="8" y1="12" x2="16" y2="12" />
              <line x1="11" y1="18" x2="13" y2="18" />
            </svg>
            Filters
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#7EC8E3] text-white text-[8px] flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Desktop category pills */}
          <div className="hidden md:flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                aria-pressed={activeCategory === cat}
                className={`px-4 py-1.5 text-xs tracking-widest uppercase border transition-all duration-200 ${
                  activeCategory === cat
                    ? "border-[#7EC8E3] text-[#7EC8E3] bg-[#E8F8FC]"
                    : "border-[#E0E0E0] text-[#888888] hover:border-[#333333] hover:text-[#333333]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Price filter toggle (desktop) */}
          <button
            onClick={() => setShowPriceFilter(!showPriceFilter)}
            className="hidden md:flex items-center gap-1.5 text-xs tracking-widest uppercase border border-[#E0E0E0] px-3 py-1.5 text-[#888888] hover:border-[#333333] hover:text-[#333333] transition-colors"
          >
            Price
            {(priceRange[0] !== minPrice || priceRange[1] !== maxPrice) && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#7EC8E3]" />
            )}
            <svg
              width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              className={`transition-transform ${showPriceFilter ? "rotate-180" : ""}`}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {/* In-stock toggle */}
          <label className="hidden md:flex items-center gap-2 cursor-pointer select-none">
            <button
              role="switch"
              aria-checked={inStockOnly}
              onClick={() => setInStockOnly((v) => !v)}
              className={`relative w-8 h-4 rounded-full transition-colors ${
                inStockOnly ? "bg-[#7EC8E3]" : "bg-[#E0E0E0]"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform ${
                  inStockOnly ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
            <span className="text-[10px] tracking-widest uppercase text-[#888888]">In Stock Only</span>
          </label>

          {/* Sort */}
          <select
            value={activeSort}
            onChange={(e) => setActiveSort(e.target.value as SortOption)}
            aria-label="Sort products"
            className="bg-white border border-[#E0E0E0] text-[#888888] text-[10px] md:text-xs tracking-widest uppercase px-3 md:px-4 py-1.5 outline-none hover:border-[#333333] cursor-pointer ml-auto"
          >
            {SORT_OPTIONS.map((s) => (
              <option key={s} value={s} className="bg-white text-[#333333]">
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Desktop price range panel */}
        <div
          className={`hidden md:block overflow-hidden transition-all duration-300 ${
            showPriceFilter ? "max-h-24 mt-4" : "max-h-0"
          }`}
        >
          <div className="flex items-center gap-4 py-3 px-1">
            <span className="text-[10px] tracking-widest uppercase text-[#AAAAAA] shrink-0">Price</span>
            <input
              type="range"
              min={minPrice}
              max={maxPrice}
              value={priceRange[0]}
              onChange={(e) =>
                setPriceRange(([, hi]) => [Math.min(Number(e.target.value), hi - 1), hi])
              }
              className="w-32 accent-[#7EC8E3]"
            />
            <input
              type="range"
              min={minPrice}
              max={maxPrice}
              value={priceRange[1]}
              onChange={(e) =>
                setPriceRange(([lo]) => [lo, Math.max(Number(e.target.value), lo + 1)])
              }
              className="w-32 accent-[#7EC8E3]"
            />
            <span className="text-xs text-[#888888] shrink-0">
              ${priceRange[0]} – ${priceRange[1]}
            </span>
            {(priceRange[0] !== minPrice || priceRange[1] !== maxPrice) && (
              <button
                onClick={() => setPriceRange([minPrice, maxPrice])}
                className="text-[10px] tracking-widest uppercase text-[#7EC8E3] hover:underline shrink-0"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Mobile filter drawer */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            showFilters ? "max-h-80 mt-4" : "max-h-0"
          }`}
        >
          <p className="text-[10px] tracking-widest uppercase text-[#AAAAAA] mb-2">Category</p>
          <div className="flex gap-2 flex-wrap mb-4">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setShowFilters(false) }}
                aria-pressed={activeCategory === cat}
                className={`px-4 py-1.5 text-[10px] tracking-widest uppercase border transition-all duration-200 ${
                  activeCategory === cat
                    ? "border-[#7EC8E3] text-[#7EC8E3] bg-[#E8F8FC]"
                    : "border-[#E0E0E0] text-[#888888]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <p className="text-[10px] tracking-widest uppercase text-[#AAAAAA] mb-2">Price</p>
          <div className="flex items-center gap-3 mb-4">
            <input
              type="range" min={minPrice} max={maxPrice} value={priceRange[0]}
              onChange={(e) => setPriceRange(([, hi]) => [Math.min(Number(e.target.value), hi - 1), hi])}
              className="flex-1 accent-[#7EC8E3]"
            />
            <input
              type="range" min={minPrice} max={maxPrice} value={priceRange[1]}
              onChange={(e) => setPriceRange(([lo]) => [lo, Math.max(Number(e.target.value), lo + 1)])}
              className="flex-1 accent-[#7EC8E3]"
            />
            <span className="text-[10px] text-[#888888] shrink-0">${priceRange[0]}–${priceRange[1]}</span>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <button
              role="switch"
              aria-checked={inStockOnly}
              onClick={() => setInStockOnly((v) => !v)}
              className={`relative w-8 h-4 rounded-full transition-colors ${
                inStockOnly ? "bg-[#7EC8E3]" : "bg-[#E0E0E0]"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform ${
                  inStockOnly ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
            <span className="text-[10px] tracking-widest uppercase text-[#888888]">In Stock Only</span>
          </label>
        </div>
      </div>

      {/* ── Active filter chips ── */}
      {activeFilterCount > 0 && (
        <div className="flex items-center gap-3 px-4 md:px-8 py-3 border-b border-[#E0E0E0] bg-[#F4F4F4] overflow-x-auto">
          <span className="text-[10px] tracking-widest text-[#AAAAAA] uppercase shrink-0">Active:</span>

          {activeCategory !== "All" && (
            <button
              onClick={() => setActiveCategory("All")}
              className="shrink-0 flex items-center gap-1.5 text-[10px] tracking-widest uppercase text-[#7EC8E3] border border-[#7EC8E3]/40 px-2 py-1 hover:border-[#7EC8E3] transition-colors"
            >
              {activeCategory} <span aria-hidden>✕</span>
            </button>
          )}
          {activeGender !== "All" && (
            <button
              onClick={() => setActiveGender("All")}
              className="shrink-0 flex items-center gap-1.5 text-[10px] tracking-widest uppercase text-[#7EC8E3] border border-[#7EC8E3]/40 px-2 py-1 hover:border-[#7EC8E3] transition-colors"
            >
              {activeGender} <span aria-hidden>✕</span>
            </button>
          )}
          {searchQuery.trim() && (
            <button
              onClick={() => setSearchQuery("")}
              className="shrink-0 flex items-center gap-1.5 text-[10px] tracking-widest uppercase text-[#7EC8E3] border border-[#7EC8E3]/40 px-2 py-1 hover:border-[#7EC8E3] transition-colors"
            >
              "{searchQuery}" <span aria-hidden>✕</span>
            </button>
          )}
          {(priceRange[0] !== minPrice || priceRange[1] !== maxPrice) && (
            <button
              onClick={() => setPriceRange([minPrice, maxPrice])}
              className="shrink-0 flex items-center gap-1.5 text-[10px] tracking-widest uppercase text-[#7EC8E3] border border-[#7EC8E3]/40 px-2 py-1 hover:border-[#7EC8E3] transition-colors"
            >
              ${priceRange[0]}–${priceRange[1]} <span aria-hidden>✕</span>
            </button>
          )}
          {inStockOnly && (
            <button
              onClick={() => setInStockOnly(false)}
              className="shrink-0 flex items-center gap-1.5 text-[10px] tracking-widest uppercase text-[#7EC8E3] border border-[#7EC8E3]/40 px-2 py-1 hover:border-[#7EC8E3] transition-colors"
            >
              In Stock <span aria-hidden>✕</span>
            </button>
          )}

          <button
            onClick={handleClearFilters}
            className="shrink-0 text-[10px] tracking-widest uppercase text-[#AAAAAA] hover:text-[#333333] transition-colors ml-auto"
          >
            Clear All
          </button>
        </div>
      )}

      {/* ── Empty State ── */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-40 text-[#AAAAAA] px-6 text-center">
          <div className="w-16 h-16 border border-[#E0E0E0] flex items-center justify-center mb-6">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <p className="text-xl tracking-widest uppercase mb-3 text-[#333333]">No products found</p>
          <p className="text-sm text-[#AAAAAA] mb-8">Try adjusting your search or filters</p>
          <button
            onClick={handleClearFilters}
            className="text-xs tracking-widest uppercase border border-[#DDD5C7] px-8 py-3 text-[#888888] hover:text-[#333333] hover:border-[#333333] transition-colors bg-white"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* ── Product Grid / List ── */}
      <div
        ref={gridRef}
        className={
          viewMode === "grid"
            ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-3 md:px-8 py-6 md:py-12 gap-4 md:gap-6"
            : "flex flex-col px-4 md:px-8 py-6 md:py-12 gap-4"
        }
      >
        {visible.map((product) => {
          const { average, count } = safeRating(product.id)
          const stock = safeStock(product.id)
          const soldOut = stock.level === "sold_out"

          return viewMode === "grid" ? (
            // ── Grid Card ──────────────────────────────────────────────────────
            <div
              key={product.id}
              className="group"
              onMouseEnter={() => setHoveredId(product.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div
                className={`aspect-[3/4] bg-white mb-3 overflow-hidden relative border transition-all duration-500 ${
                  soldOut
                    ? "border-[#E0E0E0] opacity-75"
                    : "border-[#E0E0E0] group-hover:border-[#7EC8E3]"
                }`}
              >
                <Link to={`/product/${product.id}`} className="block w-full h-full">
                  <div
                    className={`w-full h-full transition-all duration-700 ${
                      soldOut
                        ? "opacity-50"
                        : hoveredId === product.id
                        ? "scale-105"
                        : "scale-100"
                    }`}
                  >
                    <ModelViewer
                      type={product.type}
                      color={product.color}
                      secondaryColor={product.secondaryColor}
                      animate={hoveredId === product.id && !soldOut}
                    />
                  </div>
                </Link>

                {/* Badges: top left */}
                <div className="absolute top-2 left-2 z-10 pointer-events-none flex flex-col gap-1">
                  {soldOut ? (
                    <span className="text-[8px] md:text-[9px] tracking-widest bg-[#888888] text-white px-2 py-0.5 font-medium">
                      Sold Out
                    </span>
                  ) : (
                    <span className="text-[8px] md:text-[9px] tracking-widest bg-[#7EC8E3] text-white px-2 py-0.5 font-medium">
                      {product.tag}
                    </span>
                  )}
                  <StockBadge level={stock.level} quantity={stock.quantity} />
                </div>

                {/* Top right: gender + wishlist */}
                <div className="absolute top-2 right-2 z-10 flex flex-col gap-1 items-end">
                  <span className="text-[8px] md:text-[9px] tracking-widest border border-[#E0E0E0] text-[#888888] px-2 py-0.5 bg-white/80">
                    {product.gender}
                  </span>
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleItem(product.id) }}
                    aria-label={isWishlisted(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                    className={`w-7 h-7 flex items-center justify-center bg-white/90 border transition-all duration-200 ${
                      isWishlisted(product.id)
                        ? "border-[#FF6B6B] bg-[#FFF0F0]"
                        : "border-[#E0E0E0] hover:border-[#FF6B6B] hover:bg-[#FFF0F0]"
                    }`}
                  >
                    <svg
                      width="12" height="12" viewBox="0 0 24 24"
                      fill={isWishlisted(product.id) ? "#FF6B6B" : "none"}
                      stroke={isWishlisted(product.id) ? "#FF6B6B" : "#888888"}
                      strokeWidth="1.5"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </button>
                </div>

                {/* Rating badge — bottom left */}
                {count > 0 && !soldOut && (
                  <div className="absolute bottom-14 left-2 z-10 pointer-events-none">
                    <div className="flex items-center gap-1 bg-white/95 border border-[#E0E0E0] px-1.5 py-1">
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" strokeWidth="1.5">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      <span className="text-[8px] font-semibold text-[#333333]">{average.toFixed(1)}</span>
                      <span className="text-[8px] text-[#AAAAAA]">({count})</span>
                    </div>
                  </div>
                )}

                {/* Size selector on hover (desktop, not sold out) */}
                {!soldOut && (
                  <div
                    className={`hidden md:flex absolute bottom-12 left-0 right-0 justify-center gap-1 px-2 transition-all duration-300 z-10 ${
                      hoveredId === product.id ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                    }`}
                  >
                    {SIZES.map((s) => (
                      <SizeButton
                        key={s}
                        size={s}
                        selected={(selectedSizes[product.id] || "M") === s}
                        onClick={handleSizeSelect(product.id, s)}
                      />
                    ))}
                  </div>
                )}

                {/* Quick Add / Sold Out — desktop */}
                <div
                  className={`hidden md:block absolute bottom-0 left-0 right-0 z-10 transition-all duration-300 ${
                    soldOut
                      ? "opacity-100 translate-y-0"
                      : hoveredId === product.id
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  }`}
                >
                  {soldOut ? (
                    <div className="bg-[#F4F4F4] text-[#AAAAAA] text-[10px] tracking-widest uppercase py-3 text-center">
                      Sold Out
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAddToCart(product)}
                      className={`w-full text-[10px] tracking-widest uppercase py-3 text-center transition-all duration-300 ${
                        addedId === product.id
                          ? "bg-[#A8E6CF] text-[#333333]"
                          : "bg-[#333333] text-white hover:bg-[#7EC8E3]"
                      }`}
                    >
                      {addedId === product.id
                        ? "✓ Added to Cart"
                        : `Add to Cart — ${selectedSizes[product.id] || "M"}`}
                    </button>
                  )}
                </div>
              </div>

              {/* Info */}
              <Link to={`/product/${product.id}`} className="block mb-2">
                <div className="flex justify-between items-start mb-1">
                  <p
                    className={`text-xs md:text-sm tracking-wide leading-tight pr-2 font-medium transition-colors duration-200 ${
                      soldOut ? "text-[#AAAAAA]" : "text-[#333333] group-hover:text-[#7EC8E3]"
                    }`}
                  >
                    {product.name}
                  </p>
                  <p className={`text-xs md:text-sm shrink-0 font-medium ${soldOut ? "text-[#AAAAAA] line-through" : "text-[#444444]"}`}>
                    ${product.price}
                  </p>
                </div>
                <p className="text-[10px] md:text-xs text-[#AAAAAA] mb-1">
                  {product.category} · {product.gender}
                </p>
                {count > 0 && (
                  <div className="flex items-center gap-1.5 mb-1">
                    <StarRating rating={average} size={10} />
                    <span className="text-[9px] text-[#AAAAAA]">({count})</span>
                  </div>
                )}
                <p className="text-[10px] text-[#BBBBBB] leading-relaxed hidden md:block">
                  {product.description}
                </p>
              </Link>

              {/* Colour swatches */}
              <div className="flex gap-1.5 items-center mb-2">
                <div
                  className={`w-4 h-4 rounded-full border border-[#E0E0E0] ${
                    soldOut ? "opacity-30" : "ring-2 ring-[#7EC8E3] ring-offset-1 ring-offset-[#FAF5EF]"
                  }`}
                  style={{ background: product.color }}
                />
                <div
                  className={`w-4 h-4 rounded-full border border-[#E0E0E0] ${
                    soldOut
                      ? "opacity-30"
                      : "opacity-60 hover:opacity-100 hover:ring-1 hover:ring-[#7EC8E3] cursor-pointer transition-all"
                  }`}
                  style={{ background: product.secondaryColor }}
                />
                <span className="text-[9px] text-[#BBBBBB] ml-1 tracking-widest uppercase">
                  {soldOut ? "Sold Out" : "2 colors"}
                </span>
              </div>

              {/* Mobile size + add */}
              <div className="md:hidden space-y-2">
                {!soldOut && (
                  <div className="flex gap-1">
                    {SIZES.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSizes((prev) => ({ ...prev, [product.id]: s }))}
                        aria-pressed={(selectedSizes[product.id] || "M") === s}
                        aria-label={`Size ${s}`}
                        className={`flex-1 py-1.5 text-[9px] tracking-wider transition-all duration-150 border ${
                          (selectedSizes[product.id] || "M") === s
                            ? "bg-[#333333] text-white border-[#333333]"
                            : "bg-white text-[#888888] border-[#E0E0E0]"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={(e) => { e.preventDefault(); toggleItem(product.id) }}
                    aria-label={isWishlisted(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                    className={`w-10 border flex items-center justify-center py-2.5 transition-all ${
                      isWishlisted(product.id)
                        ? "border-[#FF6B6B] bg-[#FFF0F0]"
                        : "border-[#E0E0E0] bg-white hover:border-[#FF6B6B]"
                    }`}
                  >
                    <svg
                      width="12" height="12" viewBox="0 0 24 24"
                      fill={isWishlisted(product.id) ? "#FF6B6B" : "none"}
                      stroke={isWishlisted(product.id) ? "#FF6B6B" : "#888888"}
                      strokeWidth="1.5"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={soldOut}
                    className={`flex-1 text-[10px] tracking-widest uppercase py-2.5 transition-all duration-300 font-medium border ${
                      soldOut
                        ? "bg-[#F4F4F4] text-[#AAAAAA] border-[#E0E0E0] cursor-not-allowed"
                        : addedId === product.id
                        ? "bg-[#A8E6CF] text-[#333333] border-[#A8E6CF]"
                        : "bg-white text-[#888888] border-[#E0E0E0] hover:border-[#333333] hover:text-[#333333] active:bg-[#333333] active:text-white"
                    }`}
                  >
                    {soldOut ? "Sold Out" : addedId === product.id ? "✓ Added!" : "Add to Cart"}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // ── List Row ───────────────────────────────────────────────────────
            <div
              key={product.id}
              className={`group flex gap-4 bg-white border transition-all duration-300 p-4 ${
                soldOut ? "border-[#E0E0E0] opacity-75" : "border-[#E0E0E0] hover:border-[#7EC8E3]"
              }`}
              onMouseEnter={() => setHoveredId(product.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Thumbnail */}
              <Link
                to={`/product/${product.id}`}
                className="shrink-0 w-24 h-32 md:w-36 md:h-48 bg-[#FAF5EF] overflow-hidden relative"
              >
                <div
                  className={`w-full h-full transition-transform duration-500 ${
                    hoveredId === product.id && !soldOut ? "scale-105" : "scale-100"
                  }`}
                >
                  <ModelViewer
                    type={product.type}
                    color={product.color}
                    secondaryColor={product.secondaryColor}
                    animate={hoveredId === product.id && !soldOut}
                  />
                </div>
                {soldOut && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/60">
                    <span className="text-[9px] tracking-widest uppercase text-[#888888] bg-white border border-[#E0E0E0] px-2 py-1">
                      Sold Out
                    </span>
                  </div>
                )}
              </Link>

              {/* Details */}
              <div className="flex flex-col flex-1 min-w-0 justify-between py-1">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <Link to={`/product/${product.id}`}>
                      <p
                        className={`text-sm md:text-base font-medium tracking-wide transition-colors ${
                          soldOut ? "text-[#AAAAAA]" : "text-[#333333] hover:text-[#7EC8E3]"
                        }`}
                      >
                        {product.name}
                      </p>
                    </Link>
                    <p
                      className={`text-sm md:text-base font-semibold shrink-0 ${
                        soldOut ? "text-[#AAAAAA] line-through" : "text-[#333333]"
                      }`}
                    >
                      ${product.price}
                    </p>
                  </div>

                  <p className="text-[10px] md:text-xs text-[#AAAAAA] tracking-widest uppercase mb-2">
                    {product.category} · {product.gender}
                  </p>

                  {count > 0 && (
                    <div className="flex items-center gap-1.5 mb-2">
                      <StarRating rating={average} size={10} />
                      <span className="text-[9px] text-[#AAAAAA]">({count})</span>
                    </div>
                  )}

                  <p className="text-xs text-[#888888] leading-relaxed mb-3 hidden md:block line-clamp-2">
                    {product.description}
                  </p>

                  {/* Tag + stock */}
                  <div className="flex items-center gap-2 mb-3">
                    {!soldOut && (
                      <span className="text-[8px] tracking-widest bg-[#7EC8E3] text-white px-2 py-0.5 font-medium">
                        {product.tag}
                      </span>
                    )}
                    <StockBadge level={stock.level} quantity={stock.quantity} />
                  </div>
                </div>

                {/* Bottom row: sizes + actions */}
                <div className="flex flex-wrap items-center gap-3">
                  {!soldOut && (
                    <div className="flex gap-1">
                      {SIZES.map((s) => (
                        <SizeButton
                          key={s}
                          size={s}
                          selected={(selectedSizes[product.id] || "M") === s}
                          onClick={handleSizeSelect(product.id, s)}
                        />
                      ))}
                    </div>
                  )}

                  {/* Colour swatches */}
                  <div className="flex gap-1.5 items-center">
                    <div
                      className="w-4 h-4 rounded-full border border-[#E0E0E0] ring-2 ring-[#7EC8E3] ring-offset-1"
                      style={{ background: product.color }}
                    />
                    <div
                      className="w-4 h-4 rounded-full border border-[#E0E0E0] opacity-60 hover:opacity-100 cursor-pointer transition-opacity"
                      style={{ background: product.secondaryColor }}
                    />
                  </div>

                  <div className="flex gap-2 ml-auto">
                    <button
                      onClick={(e) => { e.preventDefault(); toggleItem(product.id) }}
                      aria-label={isWishlisted(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                      className={`w-9 h-9 border flex items-center justify-center transition-all ${
                        isWishlisted(product.id)
                          ? "border-[#FF6B6B] bg-[#FFF0F0]"
                          : "border-[#E0E0E0] hover:border-[#FF6B6B] hover:bg-[#FFF0F0]"
                      }`}
                    >
                      <svg
                        width="14" height="14" viewBox="0 0 24 24"
                        fill={isWishlisted(product.id) ? "#FF6B6B" : "none"}
                        stroke={isWishlisted(product.id) ? "#FF6B6B" : "#888888"}
                        strokeWidth="1.5"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </button>

                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={soldOut}
                      className={`px-5 h-9 text-[10px] tracking-widest uppercase transition-all duration-300 border font-medium ${
                        soldOut
                          ? "bg-[#F4F4F4] text-[#AAAAAA] border-[#E0E0E0] cursor-not-allowed"
                          : addedId === product.id
                          ? "bg-[#A8E6CF] text-[#333333] border-[#A8E6CF]"
                          : "bg-[#333333] text-white border-[#333333] hover:bg-[#7EC8E3] hover:border-[#7EC8E3]"
                      }`}
                    >
                      {soldOut
                        ? "Sold Out"
                        : addedId === product.id
                        ? "✓ Added!"
                        : `Add to Cart — ${selectedSizes[product.id] || "M"}`}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Progress + Load More ── */}
      {filtered.length > 0 && (
        <div className="flex flex-col items-center gap-4 py-12 border-t border-[#E0E0E0] px-4">
          <div className="w-full max-w-xs">
            <div className="flex justify-between text-[10px] tracking-widest uppercase text-[#AAAAAA] mb-2">
              <span>Showing {Math.min(visibleCount, filtered.length)} of {filtered.length}</span>
              <span>{Math.round((Math.min(visibleCount, filtered.length) / filtered.length) * 100)}%</span>
            </div>
            <div className="w-full h-px bg-[#E0E0E0]">
              <div
                className="h-px bg-[#7EC8E3] transition-all duration-500"
                style={{ width: `${(Math.min(visibleCount, filtered.length) / filtered.length) * 100}%` }}
              />
            </div>
          </div>

          {hasMore ? (
            <button
              onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
              className="px-12 py-4 border border-[#DDD5C7] text-xs tracking-widest uppercase text-[#888888] hover:border-[#333333] hover:text-[#333333] transition-all duration-300 bg-white"
            >
              Load More — {filtered.length - visibleCount} remaining
            </button>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <p className="text-[10px] tracking-widest uppercase text-[#AAAAAA]">
                You've seen all {filtered.length} products
              </p>
              <Link to="/new-arrivals" className="text-xs tracking-widest uppercase text-[#7EC8E3] hover:underline">
                View New Arrivals
              </Link>
            </div>
          )}
        </div>
      )}

      {/* ── Back to Top ── */}
      <button
        onClick={scrollToTop}
        aria-label="Back to top"
        className={`fixed bottom-6 right-6 z-50 w-10 h-10 bg-[#333333] text-white border border-[#333333] flex items-center justify-center shadow-lg transition-all duration-300 hover:bg-[#7EC8E3] hover:border-[#7EC8E3] ${
          showBackToTop ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>
    </div>
  )
}