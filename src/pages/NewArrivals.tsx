import { useState } from "react"
import { Link } from "react-router-dom"
import { products } from "@/data/products"
import ModelViewer from "@/components/3d/ModelViewer"
import { useCartStore } from "@/store/cartStore"

const newProducts = products.filter((p) => p.tag === "New")
const sizes = ["XS", "S", "M", "L", "XL"]

export default function NewArrivals() {
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [activeGender, setActiveGender] = useState("All")
  const [selectedSizes, setSelectedSizes] = useState<Record<number, string>>({})
  const [addedId, setAddedId] = useState<number | null>(null)
  const [wishlist, setWishlist] = useState<number[]>([])
  const addItem = useCartStore((state) => state.addItem)

  const filtered = newProducts.filter(
    (p) => activeGender === "All" || p.gender === activeGender
  )

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

  const toggleWishlist = (id: number, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  return (
    <div className="min-h-screen bg-[#FAF5EF] text-[#333333]">

      {/* Header */}
      <div className="border-b border-[#E0E0E0] bg-white px-4 md:px-8 py-10 md:py-16">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] md:text-xs tracking-[0.4em] text-[#AAAAAA] uppercase mb-2">
              Just Dropped
            </p>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-[#333333] mb-3">
              New Arrivals
            </h1>
            <p className="text-sm text-[#888888] max-w-md">
              The latest additions to our collection. Fresh drops every week — be the first to wear them.
            </p>
          </div>
          {/* Drop count badge */}
          <div className="shrink-0 hidden md:flex flex-col items-center justify-center w-20 h-20 border border-[#E0E0E0] bg-[#FAF5EF]">
            <p className="text-2xl font-bold text-[#333333]">{filtered.length}</p>
            <p className="text-[8px] tracking-widest uppercase text-[#AAAAAA]">New Pieces</p>
          </div>
        </div>

        {/* Gender filter */}
        <div className="flex gap-1 mt-6">
          {["All", "Male", "Female"].map((g) => (
            <button
              key={g}
              onClick={() => setActiveGender(g)}
              className={`px-5 md:px-7 py-2.5 text-[10px] md:text-xs tracking-widest uppercase transition-all duration-200 ${
                activeGender === g
                  ? "bg-[#333333] text-white font-medium"
                  : "text-[#888888] hover:text-[#333333] border border-[#E0E0E0] hover:border-[#333333]"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Drop banner */}
      <div className="bg-[#E8F8FC] border-b border-[#7EC8E3]/30 px-4 md:px-8 py-3.5 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-[#7EC8E3] animate-pulse" />
          <p className="text-[10px] md:text-xs tracking-widest uppercase text-[#7EC8E3] font-medium">
            Latest Drop — {filtered.length} new pieces
          </p>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-[10px] text-[#888888] tracking-widest uppercase hidden md:block">
            Free shipping on all new arrivals
          </p>
          <span className="text-[9px] tracking-widest uppercase border border-[#A8E6CF] text-[#333333] px-2 py-1 bg-[#A8E6CF]/20">
            New weekly
          </span>
        </div>
      </div>

      {/* Featured hero — first new product */}
      {filtered.length > 0 && (
        <div className="px-4 md:px-8 py-8 border-b border-[#E0E0E0]">
          <p className="text-[10px] tracking-widest uppercase text-[#AAAAAA] mb-4">Featured Drop</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white border border-[#E0E0E0] overflow-hidden">
            {/* Model */}
            <div className="relative bg-[#FAF5EF] flex items-center justify-center min-h-[280px] md:min-h-[360px] border-b md:border-b-0 md:border-r border-[#E0E0E0]">
              <div
                className="absolute inset-0 opacity-10"
                style={{ background: `radial-gradient(circle at center, ${filtered[0].color}, transparent 70%)` }}
              />
              <div className="w-full h-full max-w-xs mx-auto p-8">
                <ModelViewer
                  type={filtered[0].type}
                  color={filtered[0].color}
                  secondaryColor={filtered[0].secondaryColor}
                  animate={true}
                />
              </div>
              <span className="absolute top-3 left-3 text-[9px] tracking-widest bg-[#333333] text-white px-2 py-1 uppercase">
                Just Dropped
              </span>
            </div>
            {/* Info */}
            <div className="p-6 md:p-8 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[9px] tracking-widest bg-[#7EC8E3] text-white px-2 py-1 uppercase">New</span>
                <span className="text-[9px] tracking-widest text-[#AAAAAA] uppercase">{filtered[0].category} · {filtered[0].gender}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#333333] mb-2">
                {filtered[0].name}
              </h2>
              <p className="text-sm text-[#888888] leading-relaxed mb-4">
                {filtered[0].description}. The newest addition to our collection, crafted with exceptional attention to detail.
              </p>
              <p className="text-2xl font-bold text-[#333333] mb-6">${filtered[0].price}</p>
              <div className="flex gap-2 mb-4">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSizes((prev) => ({ ...prev, [filtered[0].id]: s }))}
                    className={`w-10 h-10 text-xs tracking-wider border transition-all ${
                      (selectedSizes[filtered[0].id] || "M") === s
                        ? "bg-[#333333] text-white border-[#333333]"
                        : "bg-white text-[#888888] border-[#E0E0E0] hover:border-[#333333]"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleAddToCart(filtered[0])}
                  className={`flex-1 py-3.5 text-xs tracking-widest uppercase font-medium transition-all duration-300 ${
                    addedId === filtered[0].id
                      ? "bg-[#A8E6CF] text-[#333333]"
                      : "bg-[#333333] text-white hover:bg-[#7EC8E3]"
                  }`}
                >
                  {addedId === filtered[0].id ? "✓ Added!" : "Add to Cart"}
                </button>
                <Link
                  to={`/product/${filtered[0].id}`}
                  className="px-5 py-3.5 border border-[#E0E0E0] text-xs tracking-widest uppercase text-[#888888] hover:border-[#333333] hover:text-[#333333] transition-all"
                >
                  Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* All new arrivals grid */}
      <div className="px-4 md:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-[10px] tracking-widest uppercase text-[#AAAAAA]">
            All New — {filtered.length} pieces
          </p>
          <div className="flex gap-2 text-[9px] tracking-widest uppercase text-[#AAAAAA]">
            <span>Sort by: Latest</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filtered.map((product) => (
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

                {/* Badges */}
                <div className="absolute top-2 left-2 z-10 pointer-events-none flex flex-col gap-1">
                  <span className="text-[8px] tracking-widest bg-[#333333] text-white px-2 py-0.5 font-medium">
                    NEW
                  </span>
                  <span className="text-[8px] tracking-widest bg-[#7EC8E3] text-white px-2 py-0.5">
                    {product.category}
                  </span>
                </div>

                {/* Gender + wishlist */}
                <div className="absolute top-2 right-2 z-10 flex flex-col gap-1 items-end">
                  <span className="text-[8px] tracking-widest border border-[#E0E0E0] text-[#888888] px-2 py-0.5 bg-white/80">
                    {product.gender}
                  </span>
                  <button
                    onClick={(e) => toggleWishlist(product.id, e)}
                    className="w-7 h-7 flex items-center justify-center bg-white/80 border border-[#E0E0E0] hover:border-[#FF6B6B] transition-colors"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24"
                      fill={wishlist.includes(product.id) ? "#FF6B6B" : "none"}
                      stroke={wishlist.includes(product.id) ? "#FF6B6B" : "#888888"}
                      strokeWidth="1.5">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                  </button>
                </div>

                {/* Size selector on hover — desktop */}
                <div className={`hidden md:flex absolute bottom-12 left-0 right-0 justify-center gap-1 px-2 transition-all duration-300 z-10 ${hoveredId === product.id ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
                  {sizes.map((s) => (
                    <button
                      key={s}
                      onClick={(e) => {
                        e.preventDefault()
                        setSelectedSizes((prev) => ({ ...prev, [product.id]: s }))
                      }}
                      className={`w-8 h-8 text-[9px] tracking-wider border transition-all duration-150 ${
                        (selectedSizes[product.id] || "M") === s
                          ? "bg-[#333333] text-white border-[#333333]"
                          : "bg-white text-[#888888] border-[#E0E0E0] hover:border-[#333333] hover:text-[#333333]"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                {/* Quick Add — desktop */}
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
                  <p className="text-xs md:text-sm tracking-wide group-hover:text-[#7EC8E3] transition-colors leading-tight pr-2 font-medium text-[#333333]">
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
                <div className="w-3.5 h-3.5 rounded-full border border-[#E0E0E0] ring-1 ring-[#7EC8E3] ring-offset-1"
                  style={{ background: product.color }} />
                <div className="w-3.5 h-3.5 rounded-full border border-[#E0E0E0] opacity-60"
                  style={{ background: product.secondaryColor }} />
                <span className="text-[9px] text-[#BBBBBB] ml-1 tracking-widest uppercase">2 colors</span>
              </div>

              {/* Mobile size + add */}
              <div className="md:hidden space-y-2">
                <div className="flex gap-1">
                  {sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSizes((prev) => ({ ...prev, [product.id]: s }))}
                      className={`flex-1 py-1.5 text-[9px] tracking-wider border transition-all ${
                        (selectedSizes[product.id] || "M") === s
                          ? "bg-[#333333] text-white border-[#333333]"
                          : "bg-white text-[#888888] border-[#E0E0E0]"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => handleAddToCart(product)}
                  className={`w-full text-[10px] tracking-widest uppercase py-2.5 font-medium border transition-all duration-300 ${
                    addedId === product.id
                      ? "bg-[#A8E6CF] text-[#333333] border-[#A8E6CF]"
                      : "bg-white text-[#888888] border-[#E0E0E0] hover:border-[#333333] hover:text-[#333333]"
                  }`}
                >
                  {addedId === product.id ? "✓ Added!" : "Add to Cart"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="border-t border-[#E0E0E0] bg-white px-4 md:px-8 py-12 md:py-16">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-[10px] tracking-[0.4em] text-[#AAAAAA] uppercase mb-3">Never Miss a Drop</p>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tighter text-[#333333] mb-3">
            Stay in the loop
          </h2>
          <p className="text-sm text-[#888888] mb-6">
            New arrivals drop every week. Be the first to know.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 bg-[#FAF5EF] border border-[#E0E0E0] text-[#333333] text-sm px-4 py-3 outline-none focus:border-[#7EC8E3] transition-colors placeholder-[#CCCCCC]"
            />
            <button className="px-6 py-3 bg-[#333333] text-white text-xs tracking-widest uppercase hover:bg-[#7EC8E3] transition-colors duration-300 whitespace-nowrap">
              Notify Me
            </button>
          </div>
          <p className="text-[10px] text-[#CCCCCC] mt-3">No spam. Unsubscribe anytime.</p>
        </div>
      </div>

    </div>
  )
}