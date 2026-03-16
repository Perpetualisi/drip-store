import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { products } from "@/data/products"
import ModelViewer from "@/components/3d/ModelViewer"
import StarRating from "@/components/reviews/StarRating"
import { getProductRating } from "@/data/reviews"

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredFeatured, setHoveredFeatured] = useState<number | null>(null)
  const [countdown, setCountdown] = useState({ h: 5, m: 47, s: 23 })
  const heroRef = useRef<HTMLDivElement>(null)

  const heroProducts = products.slice(0, 3)
  const featured = products.filter((p) => p.tag === "Bestseller").slice(0, 6)
  const newArrivals = products.filter((p) => p.tag === "New").slice(0, 4)
  const topRated = [...products].sort((a, b) => getProductRating(b.id).average - getProductRating(a.id).average).slice(0, 3)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroProducts.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 16,
        y: (e.clientY / window.innerHeight - 0.5) * 16,
      })
    }
    window.addEventListener("mousemove", handleMouse)
    return () => window.removeEventListener("mousemove", handleMouse)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 }
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 }
        if (prev.h > 0) return { h: prev.h - 1, m: 59, s: 59 }
        return { h: 23, m: 59, s: 59 }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const pad = (n: number) => String(n).padStart(2, "0")

  return (
    <main className="bg-[#FAF5EF] text-[#333333] overflow-x-hidden">

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative flex flex-col lg:flex-row overflow-hidden" style={{ minHeight: "100svh" }}>

        {/* Background grid */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <svg className="absolute inset-0 w-full h-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#333" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)"/>
          </svg>
          <div
            className="absolute top-10 right-10 w-80 h-80 rounded-full opacity-8 pointer-events-none hidden lg:block"
            style={{
              background: "radial-gradient(circle, #7EC8E3 0%, transparent 70%)",
              transform: `translate(${mousePos.x * 0.4}px, ${mousePos.y * 0.4}px)`,
              transition: "transform 0.3s ease-out",
            }}
          />
          <div
            className="absolute bottom-20 left-20 w-48 h-48 rounded-full opacity-5 pointer-events-none hidden lg:block"
            style={{
              background: "radial-gradient(circle, #C5A3FF 0%, transparent 70%)",
              transform: `translate(${mousePos.x * -0.2}px, ${mousePos.y * -0.2}px)`,
              transition: "transform 0.3s ease-out",
            }}
          />
        </div>

        {/* ── 3D Viewer ── */}
        <div className="order-1 lg:order-2 relative w-full lg:w-1/2 bg-white border-b lg:border-b-0 lg:border-l border-[#E0E0E0] overflow-hidden"
          style={{ minHeight: "clamp(300px, 60vw, 80vh)" }}>

          <div
            className="absolute inset-0 pointer-events-none transition-all duration-1000"
            style={{ background: `radial-gradient(ellipse at 50% 60%, ${heroProducts[currentSlide]?.color || "#7EC8E3"}22, transparent 65%)` }}
          />

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="rounded-full border border-[#E0E0E0] opacity-40"
              style={{ width: "clamp(140px, 40vw, 360px)", height: "clamp(140px, 40vw, 360px)" }}/>
            <div className="absolute rounded-full border border-[#7EC8E3] opacity-20"
              style={{ width: "clamp(100px, 28vw, 260px)", height: "clamp(100px, 28vw, 260px)" }}/>
          </div>

          <div
            className="absolute inset-0 flex items-center justify-center z-10"
            style={{
              paddingBottom: "clamp(60px, 16vw, 120px)",
              paddingTop: "clamp(12px, 3vw, 32px)",
              transform: `translate(${mousePos.x * 0.06}px, ${mousePos.y * 0.06}px)`,
              transition: "transform 0.4s ease-out",
            }}
          >
            <div style={{ width: "clamp(140px, 42vw, 340px)", height: "clamp(180px, 54vw, 440px)" }}>
              <ModelViewer
                type={heroProducts[currentSlide]?.type || "hoodie"}
                color={heroProducts[currentSlide]?.color || "#1a1a1a"}
                secondaryColor={heroProducts[currentSlide]?.secondaryColor || "#c8a96e"}
                animate={true}
              />
            </div>
          </div>

          {/* Tag + rating */}
          <div className="absolute top-3 right-3 z-20 flex flex-col items-end gap-1.5">
            <span className="text-[8px] md:text-[9px] tracking-widest bg-[#7EC8E3] text-white px-2 py-1 uppercase font-medium">
              {heroProducts[currentSlide]?.tag}
            </span>
            {(() => {
              const { average, count } = getProductRating(heroProducts[currentSlide]?.id ?? 1)
              return count > 0 ? (
                <div className="bg-white/95 border border-[#E0E0E0] px-2 py-1 flex items-center gap-1">
                  <StarRating rating={average} size={9}/>
                  <span className="text-[8px] text-[#888888]">({count})</span>
                </div>
              ) : null
            })()}
          </div>

          {/* Slide nav */}
          <div className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2">
            <button
              onClick={() => setCurrentSlide((prev) => (prev - 1 + heroProducts.length) % heroProducts.length)}
              className="w-7 h-7 bg-white/80 border border-[#E0E0E0] flex items-center justify-center hover:border-[#7EC8E3] hover:text-[#7EC8E3] transition-colors text-[#888888]"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % heroProducts.length)}
              className="w-7 h-7 bg-white/80 border border-[#E0E0E0] flex items-center justify-center hover:border-[#7EC8E3] hover:text-[#7EC8E3] transition-colors text-[#888888]"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>

          {/* Product card */}
          <div className="absolute bottom-0 left-0 right-0 z-20 p-3 md:p-5">
            <div className="bg-white/95 border border-[#E0E0E0] p-3 md:p-4" style={{ backdropFilter: "blur(8px)" }}>
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[#333333] truncate">{heroProducts[currentSlide]?.name}</p>
                  <p className="text-[9px] text-[#AAAAAA] mt-0.5 truncate">
                    {heroProducts[currentSlide]?.category} · {heroProducts[currentSlide]?.gender}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-[#333333]">${heroProducts[currentSlide]?.price}</p>
                  <Link to={`/product/${heroProducts[currentSlide]?.id}`} className="text-[9px] tracking-widest uppercase text-[#7EC8E3] hover:underline">
                    View
                  </Link>
                </div>
              </div>
              <div className="flex items-center gap-1.5 mt-2.5">
                {heroProducts.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`transition-all duration-300 rounded-full ${
                      i === currentSlide ? "w-5 h-1.5 bg-[#7EC8E3]" : "w-1.5 h-1.5 bg-[#E0E0E0] hover:bg-[#AAAAAA]"
                    }`}
                  />
                ))}
                <span className="text-[9px] text-[#CCCCCC] ml-auto">{currentSlide + 1}/{heroProducts.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Text content ── */}
        <div
          className={`order-2 lg:order-1 w-full lg:w-1/2 flex flex-col justify-center px-5 sm:px-8 md:px-10 lg:px-14 xl:px-16 py-8 md:py-12 lg:py-0 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {/* Brand mark */}
          <div className="flex items-center gap-3 mb-5 md:mb-7">
            <div style={{ width: "clamp(36px, 6vw, 56px)", height: "clamp(36px, 6vw, 56px)" }} className="shrink-0">
              <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%", filter: "drop-shadow(0 4px 8px rgba(126,200,227,0.3))" }}>
                <defs>
                  <linearGradient id="bf" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#c8e8f4"/>
                    <stop offset="100%" stopColor="#7EC8E3"/>
                  </linearGradient>
                  <linearGradient id="bt" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#7EC8E3"/>
                    <stop offset="100%" stopColor="#4ab0d4"/>
                  </linearGradient>
                  <linearGradient id="bs" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3a9abf"/>
                    <stop offset="100%" stopColor="#1d7a9a"/>
                  </linearGradient>
                  <linearGradient id="ba" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FF6B6B"/>
                    <stop offset="100%" stopColor="#ff4444"/>
                  </linearGradient>
                </defs>
                <path d="M14 26 L14 56 L42 66 L42 36 Z" fill="url(#bf)"/>
                <path d="M14 26 L42 36 L64 22 L36 12 Z" fill="url(#bt)"/>
                <path d="M42 36 L64 22 L64 52 L42 66 Z" fill="url(#bs)"/>
                <path d="M50 8 L50 20 L60 24 L60 12 Z" fill="url(#ba)" opacity="0.85"/>
                <path d="M50 8 L60 12 L68 8 L58 4 Z" fill="#FF8E8E" opacity="0.85"/>
                <path d="M60 12 L68 8 L68 20 L60 24 Z" fill="#cc3333" opacity="0.85"/>
                <line x1="14" y1="26" x2="42" y2="36" stroke="white" strokeWidth="0.5" opacity="0.5"/>
                <line x1="42" y1="36" x2="42" y2="66" stroke="white" strokeWidth="0.5" opacity="0.3"/>
              </svg>
            </div>
            <div>
              <p className="text-[9px] tracking-[0.5em] uppercase text-[#7EC8E3] font-semibold">Premium</p>
              <p className="text-[9px] tracking-[0.28em] uppercase text-[#AAAAAA]">3D Fashion House</p>
            </div>
          </div>

          <p className="text-[9px] tracking-[0.5em] text-[#AAAAAA] uppercase mb-2 md:mb-3">New Collection 2026</p>

          <h1 className="font-black tracking-tighter text-[#333333] leading-none mb-4 md:mb-5" style={{ fontSize: "clamp(52px, 10vw, 112px)" }}>
            DRIP<span className="text-[#7EC8E3]">.</span>
          </h1>

          <p className="text-[#888888] leading-relaxed mb-5 md:mb-7 max-w-xs md:max-w-sm" style={{ fontSize: "clamp(13px, 1.5vw, 16px)" }}>
            The world's first premium 3D clothing store. Explore every thread in full dimension before you buy.
          </p>

          {/* Stats */}
          <div className="flex gap-5 md:gap-8 mb-5 md:mb-8 pb-5 md:pb-8 border-b border-[#E0E0E0]">
            {[
              { value: "40+", label: "Pieces",      color: "#7EC8E3" },
              { value: "3D",  label: "Preview",     color: "#A8E6CF" },
              { value: "2",   label: "Collections", color: "#C5A3FF" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-bold" style={{ fontSize: "clamp(18px, 3vw, 26px)", color: stat.color }}>{stat.value}</p>
                <p className="text-[8px] md:text-[9px] tracking-widest uppercase text-[#AAAAAA]">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-2 md:gap-3 mb-5 md:mb-8">
            <Link to="/shop" className="px-6 md:px-8 py-3 md:py-3.5 bg-[#333333] text-white text-[10px] tracking-widest uppercase hover:bg-[#7EC8E3] transition-all duration-300 text-center font-medium">
              Shop Collection
            </Link>
            <Link to="/collections" className="px-6 md:px-8 py-3 md:py-3.5 border border-[#DDD5C7] text-[#333333] text-[10px] tracking-widest uppercase hover:border-[#7EC8E3] hover:text-[#7EC8E3] transition-all duration-300 text-center">
              View Collections
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-3 md:gap-4">
            {[
              { icon: "🚚", text: "Free shipping $100+" },
              { icon: "↩",  text: "30-day returns" },
              { icon: "◈",  text: "3D preview" },
            ].map((b) => (
              <div key={b.text} className="flex items-center gap-1.5">
                <span className="text-xs">{b.icon}</span>
                <span className="text-[9px] tracking-wide text-[#AAAAAA] uppercase">{b.text}</span>
              </div>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3 mt-8 text-[#CCCCCC]">
            <div className="w-6 h-px bg-[#CCCCCC]"/>
            <span className="text-[9px] tracking-widest uppercase">Scroll to explore</span>
            <div className="w-px h-4 bg-[#E0E0E0] animate-pulse"/>
          </div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div className="border-y border-[#E0E0E0] bg-white py-3 overflow-hidden whitespace-nowrap">
        <p className="text-[9px] tracking-[0.32em] text-[#888888] animate-marquee inline-block">
          NEW SEASON DROP &nbsp;·&nbsp; FREE WORLDWIDE SHIPPING &nbsp;·&nbsp; LIMITED EDITION PIECES &nbsp;·&nbsp;
          EXPLORE IN 3D &nbsp;·&nbsp; MALE &amp; FEMALE COLLECTIONS &nbsp;·&nbsp; PREMIUM QUALITY &nbsp;·&nbsp;
          NEW SEASON DROP &nbsp;·&nbsp; FREE WORLDWIDE SHIPPING &nbsp;·&nbsp; LIMITED EDITION &nbsp;·&nbsp; EXPLORE IN 3D &nbsp;·&nbsp;
        </p>
      </div>

      {/* ── FLASH SALE BANNER ── */}
      <div className="bg-[#333333] text-white px-4 md:px-8 py-4 md:py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B6B] animate-pulse"/>
          <div>
            <p className="text-[9px] tracking-[0.4em] uppercase text-[#AAAAAA]">Limited Time</p>
            <p className="text-xs md:text-sm font-bold tracking-tight">Flash Sale — Up to 40% off selected items</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Countdown */}
          <div className="flex items-center gap-1">
            {[
              { val: pad(countdown.h), label: "HRS" },
              { val: pad(countdown.m), label: "MIN" },
              { val: pad(countdown.s), label: "SEC" },
            ].map((t, i) => (
              <div key={t.label} className="flex items-center gap-1">
                {i > 0 && <span className="text-[#555555] text-sm font-bold">:</span>}
                <div className="flex flex-col items-center bg-[#444444] px-2 py-1 min-w-[36px]">
                  <span className="text-sm md:text-base font-black text-white tabular-nums">{t.val}</span>
                  <span className="text-[7px] tracking-widest text-[#888888]">{t.label}</span>
                </div>
              </div>
            ))}
          </div>
          <Link to="/sale" className="px-4 py-2 bg-[#FF6B6B] text-white text-[9px] tracking-widest uppercase hover:bg-[#ff4444] transition-colors font-medium whitespace-nowrap">
            Shop Sale
          </Link>
        </div>
      </div>

      {/* ── FEATURED / BESTSELLERS ── */}
      <section className="px-4 md:px-8 py-10 md:py-20 bg-[#FAF5EF]">
        <div className="flex items-end justify-between mb-6 md:mb-12">
          <div>
            <p className="text-[9px] tracking-[0.4em] text-[#AAAAAA] uppercase mb-1">Curated for you</p>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tighter text-[#333333]">Bestsellers</h2>
          </div>
          <Link to="/shop" className="text-[9px] tracking-widest text-[#888888] hover:text-[#7EC8E3] transition-colors uppercase flex items-center gap-1.5">
            View All
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-4">
          {featured.map((product, i) => {
            const { average, count } = getProductRating(product.id)
            return (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className={`group ${(i === 0 || i === 3) ? "col-span-2" : ""}`}
                onMouseEnter={() => setHoveredFeatured(product.id)}
                onMouseLeave={() => setHoveredFeatured(null)}
              >
                <div className={`bg-white border border-[#E0E0E0] group-hover:border-[#7EC8E3] transition-all duration-500 overflow-hidden relative ${
                  (i === 0 || i === 3) ? "aspect-[2/1] md:aspect-[5/3]" : "aspect-[3/4]"
                }`}>
                  <div className="w-full h-full group-hover:scale-105 transition-transform duration-700">
                    <ModelViewer
                      type={product.type}
                      color={product.color}
                      secondaryColor={product.secondaryColor}
                      animate={hoveredFeatured === product.id}
                    />
                  </div>
                  <span className="absolute top-1.5 left-1.5 text-[7px] tracking-widest bg-[#7EC8E3] text-white px-1.5 py-0.5 z-10">
                    {product.tag}
                  </span>
                  {/* Hover overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white/95 to-transparent p-2 md:p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-[9px] md:text-[10px] font-medium text-[#333333] truncate">{product.name}</p>
                    <div className="flex items-center justify-between mt-0.5">
                      <p className="text-[9px] text-[#7EC8E3]">${product.price}</p>
                      {count > 0 && <StarRating rating={average} size={8}/>}
                    </div>
                  </div>
                </div>
                <div className="mt-1.5 px-0.5">
                  <p className="text-[9px] md:text-[10px] text-[#333333] group-hover:text-[#7EC8E3] transition-colors truncate font-medium">{product.name}</p>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className="text-[9px] text-[#AAAAAA]">${product.price}</p>
                    {count > 0 && <StarRating rating={average} size={8}/>}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ── TOP RATED ── */}
      <section className="px-4 md:px-8 py-10 md:py-16 bg-white border-t border-[#E0E0E0]">
        <div className="flex items-end justify-between mb-6 md:mb-10">
          <div>
            <p className="text-[9px] tracking-[0.4em] text-[#AAAAAA] uppercase mb-1">Community Picks</p>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tighter text-[#333333]">Top Rated</h2>
          </div>
          <Link to="/shop" className="text-[9px] tracking-widest text-[#888888] hover:text-[#7EC8E3] transition-colors uppercase flex items-center gap-1.5">
            View All
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {topRated.map((product, i) => {
            const { average, count } = getProductRating(product.id)
            return (
              <Link key={product.id} to={`/product/${product.id}`} className="group flex gap-4 bg-[#FAF5EF] border border-[#E0E0E0] group-hover:border-[#7EC8E3] transition-all duration-300 p-3">
                {/* Rank */}
                <div className="shrink-0 w-8 h-8 flex items-center justify-center font-black text-lg" style={{ color: i === 0 ? "#F59E0B" : i === 1 ? "#9CA3AF" : "#CD7C3E" }}>
                  #{i + 1}
                </div>
                {/* Mini model */}
                <div className="w-16 h-20 shrink-0 bg-white border border-[#E0E0E0] overflow-hidden">
                  <ModelViewer type={product.type} color={product.color} secondaryColor={product.secondaryColor} animate={false}/>
                </div>
                {/* Info */}
                <div className="flex flex-col justify-center min-w-0">
                  <p className="text-xs font-semibold text-[#333333] group-hover:text-[#7EC8E3] transition-colors truncate">{product.name}</p>
                  <p className="text-[9px] text-[#AAAAAA] mb-1.5">{product.category} · {product.gender}</p>
                  <StarRating rating={average} size={11} showNumber={true} count={count}/>
                  <p className="text-xs font-bold text-[#333333] mt-1">${product.price}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ── GENDER SPLIT ── */}
      <section className="border-t border-[#E0E0E0]">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {[
            {
              to: "/shop", label: "Men", bg: "bg-[#F4F4F4]", hoverColor: "#7EC8E3",
              desc: "Hoodies, jackets, pants and more.",
              svgPaths: [
                { d: "M100 160 L100 320 L220 360 L220 200 Z", fill: "#7EC8E3" },
                { d: "M100 160 L220 200 L300 140 L180 100 Z", fill: "#7EC8E3", opacity: "0.8" },
                { d: "M220 200 L300 140 L300 300 L220 360 Z", fill: "#3a9abf", opacity: "0.9" },
              ],
              borderClass: "border-b md:border-b-0 md:border-r border-[#E0E0E0]",
              gradFrom: "#F4F4F4",
            },
            {
              to: "/shop", label: "Women", bg: "bg-[#FFF8F0]", hoverColor: "#FF6B6B",
              desc: "Dresses, coats, skirts and more.",
              svgPaths: [
                { d: "M80 140 L80 340 L220 380 L220 180 Z", fill: "#FF6B6B", opacity: "0.6" },
                { d: "M80 140 L220 180 L320 120 L180 80 Z", fill: "#FF6B6B", opacity: "0.5" },
                { d: "M220 180 L320 120 L320 320 L220 380 Z", fill: "#cc3333", opacity: "0.6" },
              ],
              borderClass: "",
              gradFrom: "#FFF8F0",
            },
          ].map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className={`group relative overflow-hidden flex items-end p-6 md:p-10 lg:p-14 ${item.bg} ${item.borderClass}`}
              style={{ minHeight: "clamp(240px, 40vw, 500px)" }}
            >
              <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none">
                <svg viewBox="0 0 400 400" style={{ width: "clamp(160px, 45vw, 380px)", height: "clamp(160px, 45vw, 380px)" }}>
                  {item.svgPaths.map((p, pi) => (
                    <path key={pi} d={p.d} fill={p.fill} opacity={p.opacity ?? "1"}/>
                  ))}
                </svg>
              </div>
              <div className="absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(to top, ${item.gradFrom}ee, ${item.gradFrom}22, transparent)` }}/>
              <div className="relative z-10">
                <p className="text-[9px] tracking-[0.4em] text-[#888888] uppercase mb-1.5">Explore</p>
                <h3
                  className="font-bold tracking-tighter text-[#333333] mb-2 md:mb-3 transition-colors duration-300"
                  style={{ fontSize: "clamp(28px, 5vw, 56px)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = item.hoverColor)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#333333")}
                >
                  {item.label}
                </h3>
                <p className="text-xs text-[#888888] mb-3 md:mb-5 hidden sm:block max-w-xs">{item.desc}</p>
                <span className="inline-flex items-center gap-2 text-[9px] tracking-widest uppercase border-b pb-0.5 transition-all duration-300 text-[#333333] border-[#333333]">
                  Shop {item.label}
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── NEW ARRIVALS ── */}
      <section className="px-4 md:px-8 py-10 md:py-20 bg-[#FAF5EF] border-t border-[#E0E0E0]">
        <div className="flex items-end justify-between mb-4 md:mb-8">
          <div>
            <p className="text-[9px] tracking-[0.4em] text-[#AAAAAA] uppercase mb-1">Just Dropped</p>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tighter text-[#333333]">New Arrivals</h2>
          </div>
          <Link to="/new-arrivals" className="text-[9px] tracking-widest text-[#888888] hover:text-[#7EC8E3] transition-colors uppercase flex items-center gap-1.5">
            View All
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </Link>
        </div>

        <div className="bg-[#E8F8FC] border border-[#7EC8E3]/30 px-3 py-2.5 mb-5 md:mb-8 flex items-center gap-2.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#7EC8E3] animate-pulse shrink-0"/>
          <p className="text-[9px] tracking-widest uppercase text-[#7EC8E3] font-medium">
            {newArrivals.length} new pieces just dropped — limited quantities
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
          {newArrivals.map((product) => {
            const { average, count } = getProductRating(product.id)
            return (
              <Link key={product.id} to={`/product/${product.id}`} className="group">
                <div className="bg-white border border-[#E0E0E0] group-hover:border-[#7EC8E3] transition-all duration-500 overflow-hidden relative mb-2" style={{ aspectRatio: "3/4" }}>
                  <div className="w-full h-full group-hover:scale-105 transition-transform duration-700">
                    <ModelViewer type={product.type} color={product.color} secondaryColor={product.secondaryColor} animate={false}/>
                  </div>
                  <div className="absolute top-2 left-2 pointer-events-none flex flex-col gap-1">
                    <span className="text-[7px] tracking-widest bg-[#333333] text-white px-1.5 py-0.5">NEW</span>
                  </div>
                  <span className="absolute top-2 right-2 text-[7px] tracking-widest border border-[#E0E0E0] text-[#888888] px-1.5 py-0.5 bg-white/80">
                    {product.gender}
                  </span>
                </div>
                <p className="text-[9px] md:text-[10px] font-semibold text-[#333333] group-hover:text-[#7EC8E3] transition-colors truncate mb-0.5">
                  {product.name}
                </p>
                <div className="flex items-center justify-between mb-0.5">
                  <p className="text-[9px] text-[#888888]">${product.price}</p>
                  <div className="flex gap-1">
                    <div className="w-2.5 h-2.5 rounded-full border border-[#E0E0E0]" style={{ background: product.color }}/>
                    <div className="w-2.5 h-2.5 rounded-full border border-[#E0E0E0] opacity-50" style={{ background: product.secondaryColor }}/>
                  </div>
                </div>
                {count > 0 && <StarRating rating={average} size={9} showNumber={true} count={count}/>}
              </Link>
            )
          })}
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="px-4 md:px-8 py-10 md:py-16 border-t border-[#E0E0E0] bg-white">
        <div className="mb-6 md:mb-10">
          <p className="text-[9px] tracking-[0.4em] text-[#AAAAAA] uppercase mb-1">Browse</p>
          <h2 className="text-2xl md:text-4xl font-bold tracking-tighter text-[#333333]">Shop by Category</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
          {[
            { name: "Tops",      bg: "#E8F8FC", accent: "#7EC8E3",  count: "8 styles",  link: "/shop" },
            { name: "Bottoms",   bg: "#FFF0F0", accent: "#FF6B6B",  count: "6 styles",  link: "/shop" },
            { name: "Outerwear", bg: "#F0FAF5", accent: "#A8E6CF",  count: "10 styles", link: "/shop" },
            { name: "Dresses",   bg: "#F5F0FF", accent: "#C5A3FF",  count: "8 styles",  link: "/shop" },
          ].map((cat) => (
            <Link
              key={cat.name}
              to={cat.link}
              className="group relative overflow-hidden border border-[#E0E0E0] hover:shadow-sm transition-all duration-300 flex flex-col items-start justify-end p-3 md:p-5"
              style={{ aspectRatio: "1/1", background: cat.bg }}
            >
              <div className="absolute top-2 right-2 md:top-3 md:right-3 opacity-15 group-hover:opacity-35 transition-opacity duration-300">
                <svg viewBox="0 0 60 60" style={{ width: "clamp(28px, 6vw, 48px)", height: "clamp(28px, 6vw, 48px)" }}>
                  <path d="M8 18 L8 44 L30 52 L30 26 Z" fill={cat.accent}/>
                  <path d="M8 18 L30 26 L46 16 L24 8 Z" fill={cat.accent} opacity="0.8"/>
                  <path d="M30 26 L46 16 L46 42 L30 52 Z" fill={cat.accent} opacity="0.6"/>
                </svg>
              </div>
              <p className="text-[8px] tracking-widest uppercase mb-0.5 font-medium" style={{ color: cat.accent }}>{cat.count}</p>
              <p className="text-xs md:text-sm font-bold tracking-tight text-[#333333] group-hover:translate-x-0.5 transition-transform duration-300">{cat.name}</p>
              <p className="text-[8px] tracking-widest uppercase text-[#AAAAAA] mt-0.5">Shop</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section className="border-t border-[#E0E0E0] bg-[#FAF5EF] px-5 md:px-12 py-12 md:py-20">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-[9px] tracking-[0.5em] uppercase text-[#7EC8E3] mb-3">Stay in the loop</p>
          <h2 className="text-2xl md:text-4xl font-bold tracking-tighter text-[#333333] mb-3">
            Get early access to drops
          </h2>
          <p className="text-[#888888] text-sm mb-6 max-w-sm mx-auto">
            Join 12,000+ style lovers. Be first to know about new arrivals, exclusive offers and limited drops.
          </p>
          <NewsletterForm/>
          <p className="text-[9px] text-[#CCCCCC] mt-3 tracking-wide">No spam. Unsubscribe anytime.</p>
        </div>
      </section>

      {/* ── 3D EXPERIENCE CALLOUT ── */}
      <section className="border-t border-[#E0E0E0] bg-[#2a2a2a] text-white px-5 md:px-12 py-12 md:py-24 overflow-hidden relative">
        <div className="absolute right-0 top-0 opacity-8 pointer-events-none">
          <svg viewBox="0 0 400 400" style={{ width: "clamp(120px, 30vw, 360px)", height: "clamp(120px, 30vw, 360px)" }}>
            <path d="M100 100 L100 300 L260 360 L260 160 Z" fill="#7EC8E3"/>
            <path d="M100 100 L260 160 L360 80 L200 20 Z" fill="#7EC8E3" opacity="0.6"/>
            <path d="M260 160 L360 80 L360 280 L260 360 Z" fill="#4ab0d4" opacity="0.8"/>
          </svg>
        </div>
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <div className="flex justify-center mb-5 md:mb-8">
            <svg viewBox="0 0 120 120" style={{ width: "clamp(52px, 8vw, 88px)", height: "clamp(52px, 8vw, 88px)", filter: "drop-shadow(0 8px 20px rgba(126,200,227,0.4))" }}>
              <defs>
                <linearGradient id="xcf" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#c8e8f4"/>
                  <stop offset="100%" stopColor="#7EC8E3"/>
                </linearGradient>
                <linearGradient id="xct" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#7EC8E3"/>
                  <stop offset="100%" stopColor="#4ab0d4"/>
                </linearGradient>
                <linearGradient id="xcs" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#2d7a99"/>
                  <stop offset="100%" stopColor="#1a5a74"/>
                </linearGradient>
              </defs>
              <path d="M24 40 L24 84 L64 100 L64 56 Z" fill="url(#xcf)"/>
              <path d="M24 40 L64 56 L92 36 L52 20 Z" fill="url(#xct)"/>
              <path d="M64 56 L92 36 L92 80 L64 100 Z" fill="url(#xcs)"/>
              <line x1="24" y1="40" x2="64" y2="56" stroke="white" strokeWidth="0.6" opacity="0.3"/>
            </svg>
          </div>
          <p className="text-[9px] tracking-[0.5em] uppercase text-[#7EC8E3] mb-3">Why Drip.</p>
          <h2 className="font-bold tracking-tighter mb-4 leading-tight" style={{ fontSize: "clamp(22px, 4vw, 48px)" }}>
            See it in 3D before you wear it.
          </h2>
          <p className="text-[#999999] leading-relaxed mb-8 max-w-md mx-auto" style={{ fontSize: "clamp(12px, 1.5vw, 15px)" }}>
            Every piece rendered in full 3D. Rotate, inspect and explore before you decide.
          </p>
          <div className="grid grid-cols-3 gap-3 md:gap-8 mb-8 md:mb-10">
            {[
              { icon: "◈", label: "360° View",    sub: "Rotate every piece" },
              { icon: "◉", label: "True Colors",  sub: "See exact shades" },
              { icon: "◎", label: "Real Texture", sub: "Feel the fabric" },
            ].map((f) => (
              <div key={f.label} className="text-center">
                <p className="text-lg md:text-2xl text-[#7EC8E3] mb-1">{f.icon}</p>
                <p className="text-[8px] md:text-[10px] font-medium tracking-widest uppercase text-white mb-0.5">{f.label}</p>
                <p className="text-[8px] text-[#777777] hidden sm:block">{f.sub}</p>
              </div>
            ))}
          </div>
          <Link to="/shop" className="inline-block px-7 md:px-10 py-3 md:py-4 bg-[#7EC8E3] text-white text-[10px] tracking-widest uppercase hover:bg-white hover:text-[#333333] transition-all duration-300 font-medium">
            Explore in 3D
          </Link>
        </div>
      </section>

      {/* ── BRAND STATEMENT ── */}
      <section className="px-5 py-14 md:py-28 text-center border-t border-[#E0E0E0] bg-[#FAF5EF] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <svg className="w-full opacity-[0.022]" viewBox="0 0 600 160">
            <text x="50%" y="75%" dominantBaseline="middle" textAnchor="middle" fontSize="150" fontWeight="900" fill="#333333" fontFamily="system-ui">DRIP</text>
          </svg>
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="text-[9px] tracking-[0.5em] text-[#AAAAAA] uppercase mb-4">Our Philosophy</p>
          <h2 className="font-black tracking-tighter text-[#333333] mb-5 leading-tight" style={{ fontSize: "clamp(28px, 6vw, 72px)" }}>
            Wear what others<br/>can only imagine.
          </h2>
          <p className="text-[#888888] max-w-xs mx-auto mb-8 leading-relaxed" style={{ fontSize: "clamp(12px, 1.4vw, 15px)" }}>
            Premium materials, meticulous craft, and a completely new way to shop.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/shop" className="px-8 md:px-10 py-3 md:py-4 bg-[#333333] text-white text-[10px] tracking-widest uppercase hover:bg-[#7EC8E3] transition-colors duration-300 font-medium">
              Shop Now
            </Link>
            <Link to="/collections" className="px-8 md:px-10 py-3 md:py-4 border border-[#DDD5C7] text-[#333333] text-[10px] tracking-widest uppercase hover:border-[#333333] transition-colors duration-300">
              Our Collections
            </Link>
          </div>
        </div>
      </section>

    </main>
  )
}

// Newsletter form component
function NewsletterForm() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setSubmitted(true)
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-2 py-4">
        <div className="w-10 h-10 bg-[#A8E6CF] flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
        </div>
        <p className="text-sm font-semibold text-[#333333]">You're on the list!</p>
        <p className="text-[9px] tracking-widest uppercase text-[#AAAAAA]">Watch your inbox for early access</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        className="flex-1 border border-[#E0E0E0] bg-white px-4 py-3 text-sm text-[#333333] outline-none focus:border-[#7EC8E3] transition-colors placeholder-[#CCCCCC]"
      />
      <button
        type="submit"
        className="px-6 py-3 bg-[#333333] text-white text-[10px] tracking-widest uppercase hover:bg-[#7EC8E3] transition-colors duration-300 font-medium whitespace-nowrap"
      >
        Join Now
      </button>
    </form>
  )
}