import { useState } from "react"
import { Link } from "react-router-dom"
import { products } from "@/data/products"
import ModelViewer from "@/components/3d/ModelViewer"

const collections = [
  {
    id: 1,
    name: "Shadow Series",
    description: "All-black everything. Minimal, dark, powerful. Built for those who speak through silence.",
    gender: "Male",
    count: 8,
    color: "#1a1a1a",
    accent: "#c8a96e",
    tag: "Bestselling",
    pieces: ["hoodie", "jacket", "pants", "tee"],
    bg: "bg-[#F4F4F4]",
  },
  {
    id: 2,
    name: "Gold Rush",
    description: "Warm tones, rich textures, statement pieces. Luxury redefined for the everyday.",
    gender: "Unisex",
    count: 6,
    color: "#C19A6B",
    accent: "#8B6914",
    tag: "New Season",
    pieces: ["coat", "dress", "jacket"],
    bg: "bg-[#FFF8F0]",
  },
  {
    id: 3,
    name: "Blanc",
    description: "Clean whites, creams and off-whites. A pure aesthetic for the effortlessly refined.",
    gender: "Female",
    count: 7,
    color: "#F5F0E8",
    accent: "#888888",
    tag: "Limited",
    pieces: ["dress", "skirt", "coat"],
    bg: "bg-[#FAFAFA]",
  },
  {
    id: 4,
    name: "Deep Ocean",
    description: "Navy, cobalt and indigo — depth in every piece. Built for the bold and the brooding.",
    gender: "Male",
    count: 5,
    color: "#1B3A6B",
    accent: "#4a7abf",
    tag: "Exclusive",
    pieces: ["jacket", "pants", "hoodie"],
    bg: "bg-[#F0F4FA]",
  },
  {
    id: 5,
    name: "Terra",
    description: "Earthy tones inspired by nature and raw materials. Grounded beauty in every stitch.",
    gender: "Female",
    count: 6,
    color: "#C4622D",
    accent: "#8B3A1A",
    tag: "New Season",
    pieces: ["dress", "skirt", "coat"],
    bg: "bg-[#FFF5F0]",
  },
  {
    id: 6,
    name: "Void",
    description: "Structured outerwear for the modern wardrobe. Architectural silhouettes that command attention.",
    gender: "Unisex",
    count: 9,
    color: "#2c2c2c",
    accent: "#7EC8E3",
    tag: "Bestselling",
    pieces: ["coat", "jacket", "hoodie"],
    bg: "bg-[#F4F4F4]",
  },
]

const tagColors: Record<string, string> = {
  "Bestselling": "bg-[#7EC8E3] text-white",
  "New Season":  "bg-[#A8E6CF] text-[#333333]",
  "Limited":     "bg-[#FF6B6B] text-white",
  "Exclusive":   "bg-[#C5A3FF] text-white",
}

export default function Collections() {
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  // Get 2 sample products per collection matching the color style
  const getSampleProducts = (col: typeof collections[0]) => {
    return products
      .filter((p) =>
        col.gender === "Unisex"
          ? true
          : p.gender === col.gender
      )
      .slice(0, 3)
  }

  return (
    <div className="min-h-screen bg-[#FAF5EF] text-[#333333]">

      {/* Header */}
      <div className="border-b border-[#E0E0E0] bg-white px-4 md:px-8 py-10 md:py-16">
        <p className="text-[10px] md:text-xs tracking-[0.4em] text-[#AAAAAA] uppercase mb-2">
          Curated Edits
        </p>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-[#333333]">Collections</h1>
        <p className="text-sm text-[#888888] mt-3 max-w-md">
          Carefully curated edits designed around a singular aesthetic vision. Find your signature style.
        </p>
      </div>

      {/* Stats bar */}
      <div className="bg-white border-b border-[#E0E0E0] px-4 md:px-8 py-4">
        <div className="flex items-center gap-8 overflow-x-auto">
          {[
            { label: "Collections", value: collections.length },
            { label: "Total Pieces", value: collections.reduce((a, c) => a + c.count, 0) },
            { label: "New This Season", value: 12 },
            { label: "Limited Drops", value: 3 },
          ].map((stat) => (
            <div key={stat.label} className="shrink-0 text-center">
              <p className="text-xl md:text-2xl font-bold text-[#333333]">{stat.value}</p>
              <p className="text-[9px] tracking-widest uppercase text-[#AAAAAA]">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Collections Grid */}
      <div className="px-3 md:px-8 py-8 md:py-12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {collections.map((col) => {
          const samples = getSampleProducts(col)
          const isHovered = hoveredId === col.id

          return (
            <div
              key={col.id}
              className={`group border border-[#E0E0E0] overflow-hidden transition-all duration-500 ${
                isHovered ? "border-[#7EC8E3] shadow-lg shadow-[#7EC8E3]/10" : ""
              } ${col.bg}`}
              onMouseEnter={() => setHoveredId(col.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Top section — mini product previews */}
              <div className="relative h-48 md:h-56 overflow-hidden border-b border-[#E0E0E0]">
                {/* Color wash background */}
                <div
                  className="absolute inset-0 opacity-10 transition-opacity duration-500 group-hover:opacity-20"
                  style={{ background: `radial-gradient(circle at 50% 80%, ${col.color}, transparent 70%)` }}
                />

                {/* Mini product grid */}
                <div className="absolute inset-0 flex items-center justify-center gap-2 px-4">
                  {samples.slice(0, 3).map((p, i) => (
                    <div
                      key={p.id}
                      className={`transition-all duration-500 ${
                        isHovered
                          ? "scale-110 opacity-100"
                          : i === 1 ? "scale-100 opacity-100" : "scale-95 opacity-70"
                      }`}
                      style={{ transitionDelay: `${i * 60}ms`, width: "30%", aspectRatio: "3/4" }}
                    >
                      <ModelViewer
                        type={p.type}
                        color={col.color}
                        secondaryColor={col.accent}
                        animate={isHovered}
                      />
                    </div>
                  ))}
                </div>

                {/* Tag badge */}
                <div className="absolute top-3 left-3">
                  <span className={`text-[9px] tracking-widest uppercase px-2 py-1 font-medium ${tagColors[col.tag] || "bg-[#333333] text-white"}`}>
                    {col.tag}
                  </span>
                </div>

                {/* Gender badge */}
                <div className="absolute top-3 right-3">
                  <span className="text-[9px] tracking-widest uppercase border border-[#E0E0E0] text-[#888888] px-2 py-1 bg-white/80">
                    {col.gender}
                  </span>
                </div>
              </div>

              {/* Bottom section — info */}
              <div className="p-5 md:p-6">
                {/* Color swatch row */}
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                    style={{ background: col.color }}
                  />
                  <div
                    className="w-5 h-5 rounded-full border border-[#E0E0E0] opacity-60"
                    style={{ background: col.accent }}
                  />
                  <div className="w-5 h-5 rounded-full bg-[#E0E0E0] opacity-40" />
                  <span className="text-[9px] tracking-widest uppercase text-[#AAAAAA] ml-1">
                    {col.count} pieces
                  </span>
                </div>

                <p className="text-[10px] tracking-[0.3em] text-[#AAAAAA] uppercase mb-1">
                  {col.gender}
                </p>
                <h2 className={`text-xl md:text-2xl font-bold tracking-tight mb-2 transition-colors duration-300 ${
                  isHovered ? "text-[#7EC8E3]" : "text-[#333333]"
                }`}>
                  {col.name}
                </h2>
                <p className="text-xs text-[#888888] leading-relaxed mb-5">
                  {col.description}
                </p>

                {/* Piece types */}
                <div className="flex gap-1.5 flex-wrap mb-5">
                  {col.pieces.map((piece) => (
                    <span key={piece}
                      className="text-[9px] tracking-widest uppercase border border-[#E0E0E0] text-[#888888] px-2 py-1 bg-white capitalize">
                      {piece}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <Link
                  to="/shop"
                  className={`flex items-center justify-between w-full border px-4 py-3 text-xs tracking-widest uppercase transition-all duration-300 ${
                    isHovered
                      ? "bg-[#333333] text-white border-[#333333]"
                      : "bg-white text-[#888888] border-[#E0E0E0] hover:border-[#333333] hover:text-[#333333]"
                  }`}
                >
                  <span>Explore Collection</span>
                  <span className={`transition-transform duration-300 ${isHovered ? "translate-x-1" : ""}`}>→</span>
                </Link>
              </div>
            </div>
          )
        })}
      </div>

      {/* Bottom CTA */}
      <div className="border-t border-[#E0E0E0] bg-white px-4 md:px-8 py-16 md:py-20 text-center">
        <p className="text-[10px] tracking-[0.4em] text-[#AAAAAA] uppercase mb-4">Can't decide?</p>
        <h2 className="text-2xl md:text-4xl font-bold tracking-tighter text-[#333333] mb-4">
          Browse everything
        </h2>
        <p className="text-sm text-[#888888] mb-8 max-w-sm mx-auto">
          Explore all 40 pieces across every collection and find what speaks to you.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/shop"
            className="px-10 py-4 bg-[#333333] text-white text-xs tracking-widest uppercase hover:bg-[#7EC8E3] transition-colors duration-300"
          >
            Shop All
          </Link>
          <Link
            to="/new-arrivals"
            className="px-10 py-4 border border-[#DDD5C7] text-[#333333] text-xs tracking-widest uppercase hover:border-[#333333] transition-colors duration-300"
          >
            New Arrivals
          </Link>
        </div>
      </div>

    </div>
  )
}