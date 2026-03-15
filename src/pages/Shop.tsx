import { useState } from "react"
import { Link } from "react-router-dom"
import { products } from "@/data/products"
import ModelViewer from "@/components/3d/ModelViewer"
import { useCartStore } from "@/store/cartStore"
import { useWishlistStore } from "@/store/wishlistStore"

const categories = ["All", "Tops", "Bottoms", "Outerwear", "Dresses"]
const genders = ["All", "Male", "Female"]
const sortOptions = ["Featured", "Price: Low to High", "Price: High to Low", "New Arrivals"]
const sizes = ["XS", "S", "M", "L", "XL"]
const ITEMS_PER_PAGE = 12

export default function Shop() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [activeGender, setActiveGender] = useState("All")
  const [activeSort, setActiveSort] = useState("Featured")
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedSizes, setSelectedSizes] = useState<Record<number, string>>({})
  const [addedId, setAddedId] = useState<number | null>(null)
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)

  const addItem = useCartStore((state) => state.addItem)
  const { toggleItem, isWishlisted } = useWishlistStore()

  const filtered = products
    .filter((p) => {
      const matchCategory = activeCategory === "All" || p.category === activeCategory
      const matchGender = activeGender === "All" || p.gender === activeGender
      return matchCategory && matchGender
    })
    .sort((a, b) => {
      if (activeSort === "Price: Low to High") return a.price - b.price
      if (activeSort === "Price: High to Low") return b.price - a.price
      return 0
    })

  const visible = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length

  const handleAddToCart = (product: typeof products[0]) => {
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
  }

  const handleClearFilters = () => {
    setActiveCategory("All")
    setActiveGender("All")
    setVisibleCount(ITEMS_PER_PAGE)
  }

  return (
    <div className="min-h-screen bg-[#FAF5EF] text-[#333333]">

      {/* Page Header */}
      <div className="border-b border-[#E0E0E0] bg-white px-4 md:px-8 py-10 md:py-16">
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-[10px] md:text-xs tracking-[0.4em] text-[#AAAAAA] uppercase mb-2">
              {filtered.length} Products
            </p>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-[#333333]">Shop</h1>
          </div>
          <div className="hidden md:flex gap-2 mb-2">
            <button className="border border-[#E0E0E0] p-2 text-[#888888] hover:text-[#7EC8E3] hover:border-[#7EC8E3] transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="3" width="7" height="7"/>
                <rect x="14" y="3" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/>
              </svg>
            </button>
            <button className="border border-[#E0E0E0] p-2 text-[#888888] hover:text-[#7EC8E3] hover:border-[#7EC8E3] transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Gender Tabs */}
        <div className="flex gap-1 mb-4 md:mb-6 overflow-x-auto pb-1">
          {genders.map((g) => (
            <button
              key={g}
              onClick={() => {
                setActiveGender(g)
                setVisibleCount(ITEMS_PER_PAGE)
              }}
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

        {/* Category + Sort */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center gap-2 text-[10px] tracking-widest uppercase border border-[#E0E0E0] px-4 py-2 text-[#888888] hover:border-[#333333] hover:text-[#333333] transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="6" x2="20" y2="6"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
              <line x1="11" y1="18" x2="13" y2="18"/>
            </svg>
            Filters
            {activeCategory !== "All" && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#7EC8E3]" />
            )}
          </button>

          <div className="hidden md:flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat)
                  setVisibleCount(ITEMS_PER_PAGE)
                }}
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

          <select
            value={activeSort}
            onChange={(e) => {
              setActiveSort(e.target.value)
              setVisibleCount(ITEMS_PER_PAGE)
            }}
            className="bg-white border border-[#E0E0E0] text-[#888888] text-[10px] md:text-xs tracking-widest uppercase px-3 md:px-4 py-1.5 outline-none hover:border-[#333333] cursor-pointer ml-auto"
          >
            {sortOptions.map((s) => (
              <option key={s} value={s} className="bg-white text-[#333333]">{s}</option>
            ))}
          </select>
        </div>

        {/* Mobile filter drawer */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${showFilters ? "max-h-48 mt-4" : "max-h-0"}`}>
          <p className="text-[10px] tracking-widest uppercase text-[#AAAAAA] mb-2">Category</p>
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat)
                  setShowFilters(false)
                  setVisibleCount(ITEMS_PER_PAGE)
                }}
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
        </div>
      </div>

      {/* Active filters */}
      {(activeCategory !== "All" || activeGender !== "All") && (
        <div className="flex items-center gap-3 px-4 md:px-8 py-3 border-b border-[#E0E0E0] bg-[#F4F4F4] overflow-x-auto">
          <span className="text-[10px] tracking-widest text-[#AAAAAA] uppercase shrink-0">Active:</span>
          {activeCategory !== "All" && (
            <button
              onClick={() => { setActiveCategory("All"); setVisibleCount(ITEMS_PER_PAGE) }}
              className="shrink-0 flex items-center gap-1.5 text-[10px] tracking-widest uppercase text-[#7EC8E3] border border-[#7EC8E3]/40 px-2 py-1 hover:border-[#7EC8E3] transition-colors"
            >
              {activeCategory} <span>✕</span>
            </button>
          )}
          {activeGender !== "All" && (
            <button
              onClick={() => { setActiveGender("All"); setVisibleCount(ITEMS_PER_PAGE) }}
              className="shrink-0 flex items-center gap-1.5 text-[10px] tracking-widest uppercase text-[#7EC8E3] border border-[#7EC8E3]/40 px-2 py-1 hover:border-[#7EC8E3] transition-colors"
            >
              {activeGender} <span>✕</span>
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

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-40 text-[#AAAAAA] px-6 text-center">
          <div className="w-16 h-16 border border-[#E0E0E0] flex items-center justify-center mb-6">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </div>
          <p className="text-xl tracking-widest uppercase mb-3 text-[#333333]">No products found</p>
          <p className="text-sm text-[#AAAAAA] mb-8">Try a different filter combination</p>
          <button
            onClick={handleClearFilters}
            className="text-xs tracking-widest uppercase border border-[#DDD5C7] px-8 py-3 text-[#888888] hover:text-[#333333] hover:border-[#333333] transition-colors bg-white"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-3 md:px-8 py-6 md:py-12 gap-4 md:gap-6">
        {visible.map((product) => (
          <div
            key={product.id}
            className="group"
            onMouseEnter={() => setHoveredId(product.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* Card */}
            <div className="aspect-[3/4] bg-white mb-3 overflow-hidden relative border border-[#E0E0E0] group-hover:border-[#7EC8E3] transition-all duration-500">

              {/* Model */}
              <Link to={`/product/${product.id}`} className="block w-full h-full">
                <div className={`w-full h-full transition-all duration-700 ${hoveredId === product.id ? "scale-105" : "scale-100"}`}>
                  <ModelViewer
                    type={product.type}
                    color={product.color}
                    secondaryColor={product.secondaryColor}
                    animate={hoveredId === product.id}
                  />
                </div>
              </Link>

              {/* Badges top left */}
              <div className="absolute top-2 left-2 z-10 pointer-events-none flex flex-col gap-1">
                <span className="text-[8px] md:text-[9px] tracking-widest bg-[#7EC8E3] text-white px-2 py-0.5 font-medium block">
                  {product.tag}
                </span>
                {product.tag === "Limited" && (
                  <span className="text-[8px] tracking-widest bg-[#FF6B6B]/10 text-[#FF6B6B] px-2 py-0.5 block border border-[#FF6B6B]/30">
                    Low Stock
                  </span>
                )}
              </div>

              {/* Top right: gender + wishlist */}
              <div className="absolute top-2 right-2 z-10 flex flex-col gap-1 items-end">
                <span className="text-[8px] md:text-[9px] tracking-widest border border-[#E0E0E0] text-[#888888] px-2 py-0.5 bg-white/80">
                  {product.gender}
                </span>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    toggleItem(product.id)
                  }}
                  className={`w-7 h-7 flex items-center justify-center bg-white/90 border transition-all duration-200 ${
                    isWishlisted(product.id)
                      ? "border-[#FF6B6B] bg-[#FFF0F0]"
                      : "border-[#E0E0E0] hover:border-[#FF6B6B] hover:bg-[#FFF0F0]"
                  }`}
                  title={isWishlisted(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill={isWishlisted(product.id) ? "#FF6B6B" : "none"}
                    stroke={isWishlisted(product.id) ? "#FF6B6B" : "#888888"}
                    strokeWidth="1.5"
                    className="transition-all duration-200"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </button>
              </div>

              {/* Size selector on hover desktop */}
              <div className={`hidden md:flex absolute bottom-12 left-0 right-0 justify-center gap-1 px-2 transition-all duration-300 z-10 ${hoveredId === product.id ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={(e) => {
                      e.preventDefault()
                      setSelectedSizes((prev) => ({ ...prev, [product.id]: s }))
                    }}
                    className={`w-8 h-8 text-[9px] tracking-wider transition-all duration-150 border ${
                      (selectedSizes[product.id] || "M") === s
                        ? "bg-[#333333] text-white border-[#333333]"
                        : "bg-white text-[#888888] border-[#E0E0E0] hover:border-[#333333] hover:text-[#333333]"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Quick Add desktop */}
              <button
                onClick={() => handleAddToCart(product)}
                className={`hidden md:block absolute bottom-0 left-0 right-0 text-[10px] tracking-widest uppercase py-3 text-center transition-all duration-300 z-10 ${
                  addedId === product.id
                    ? "bg-[#A8E6CF] text-[#333333] opacity-100 translate-y-0"
                    : hoveredId === product.id
                    ? "bg-[#333333] text-white opacity-100 translate-y-0 hover:bg-[#7EC8E3]"
                    : "bg-[#333333] text-white opacity-0 translate-y-4"
                }`}
              >
                {addedId === product.id
                  ? "✓ Added to Cart"
                  : `Add to Cart — ${selectedSizes[product.id] || "M"}`}
              </button>
            </div>

            {/* Info */}
            <Link to={`/product/${product.id}`} className="block mb-2">
              <div className="flex justify-between items-start mb-1">
                <p className="text-xs md:text-sm tracking-wide group-hover:text-[#7EC8E3] transition-colors duration-200 leading-tight pr-2 font-medium text-[#333333]">
                  {product.name}
                </p>
                <p className="text-xs md:text-sm text-[#444444] shrink-0 font-medium">${product.price}</p>
              </div>
              <p className="text-[10px] md:text-xs text-[#AAAAAA] mb-1">
                {product.category} · {product.gender}
              </p>
              <p className="text-[10px] text-[#BBBBBB] leading-relaxed hidden md:block">
                {product.description}
              </p>
            </Link>

            {/* Color swatches */}
            <div className="flex gap-1.5 items-center mb-2">
              <div
                className="w-4 h-4 rounded-full ring-2 ring-[#7EC8E3] ring-offset-1 ring-offset-[#FAF5EF] border border-[#E0E0E0] cursor-pointer"
                style={{ background: product.color }}
              />
              <div
                className="w-4 h-4 rounded-full border border-[#E0E0E0] opacity-60 hover:opacity-100 hover:ring-1 hover:ring-[#7EC8E3] cursor-pointer transition-all"
                style={{ background: product.secondaryColor }}
              />
              <span className="text-[9px] text-[#BBBBBB] ml-1 tracking-widest uppercase">2 colors</span>
            </div>

            {/* Mobile size + add */}
            <div className="md:hidden space-y-2">
              <div className="flex gap-1">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSizes((prev) => ({ ...prev, [product.id]: s }))}
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
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    toggleItem(product.id)
                  }}
                  className={`w-10 border flex items-center justify-center py-2.5 transition-all ${
                    isWishlisted(product.id)
                      ? "border-[#FF6B6B] bg-[#FFF0F0]"
                      : "border-[#E0E0E0] bg-white hover:border-[#FF6B6B]"
                  }`}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill={isWishlisted(product.id) ? "#FF6B6B" : "none"}
                    stroke={isWishlisted(product.id) ? "#FF6B6B" : "#888888"}
                    strokeWidth="1.5"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </button>
                <button
                  onClick={() => handleAddToCart(product)}
                  className={`flex-1 text-[10px] tracking-widest uppercase py-2.5 transition-all duration-300 font-medium border ${
                    addedId === product.id
                      ? "bg-[#A8E6CF] text-[#333333] border-[#A8E6CF]"
                      : "bg-white text-[#888888] border-[#E0E0E0] hover:border-[#333333] hover:text-[#333333] active:bg-[#333333] active:text-white"
                  }`}
                >
                  {addedId === product.id ? "✓ Added!" : "Add to Cart"}
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Progress + Load More */}
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
              View New Arrivals →
            </Link>
          </div>
        )}
      </div>

    </div>
  )
}