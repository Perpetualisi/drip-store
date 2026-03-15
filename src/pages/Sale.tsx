import { useState } from "react"
import { Link } from "react-router-dom"
import { products } from "@/data/products"
import ModelViewer from "@/components/3d/ModelViewer"
import { useCartStore } from "@/store/cartStore"

const saleProducts = products.filter((_, i) => i % 3 === 0)

export default function Sale() {
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const addItem = useCartStore((state) => state.addItem)

  return (
    <div className="min-h-screen bg-[#FAF5EF] text-[#333333]">

      {/* Header */}
      <div className="border-b border-[#E0E0E0] bg-white px-4 md:px-8 py-10 md:py-16">
        <p className="text-[10px] tracking-[0.4em] text-[#AAAAAA] uppercase mb-2">Limited Time</p>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">Sale</h1>
        <p className="text-[#888888] text-sm mt-3">Up to 40% off selected styles</p>
      </div>

      {/* Banner */}
      <div className="bg-[#FF6B6B]/10 border-b border-[#FF6B6B]/20 px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B6B] animate-pulse" />
          <p className="text-[10px] md:text-xs tracking-widest uppercase text-[#FF6B6B]">
            Sale ends soon — {saleProducts.length} items on sale
          </p>
        </div>
        <p className="text-[10px] text-[#AAAAAA] tracking-widest uppercase hidden md:block">
          Free shipping on sale orders over $80
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-3 md:px-8 py-6 md:py-12 gap-4 md:gap-6">
        {saleProducts.map((product) => {
          const salePrice = Math.round(product.price * 0.7)
          return (
            <div
              key={product.id}
              className="group"
              onMouseEnter={() => setHoveredId(product.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="aspect-[3/4] bg-white mb-3 overflow-hidden relative border border-[#E0E0E0] group-hover:border-[#FF6B6B] transition-all duration-500">
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
                <span className="absolute top-2 left-2 text-[8px] tracking-widest bg-[#FF6B6B] text-white px-2 py-0.5 z-10 pointer-events-none">
                  30% OFF
                </span>
                <button
                  onClick={() => addItem({
                    id: product.id, name: product.name,
                    price: salePrice, color: product.color,
                    secondaryColor: product.secondaryColor,
                    type: product.type, gender: product.gender,
                    quantity: 1, size: "M",
                  })}
                  className={`hidden md:block absolute bottom-0 left-0 right-0 bg-[#333333] text-white text-[10px] tracking-widest uppercase py-3 text-center transition-all duration-300 z-10 hover:bg-[#FF6B6B] ${
                    hoveredId === product.id ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                >
                  Quick Add — Size M
                </button>
              </div>
              <Link to={`/product/${product.id}`} className="block">
                <p className="text-xs md:text-sm tracking-wide group-hover:text-[#FF6B6B] transition-colors leading-tight mb-1 text-[#333333]">
                  {product.name}
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-[#FF6B6B]">${salePrice}</p>
                  <p className="text-xs text-[#CCCCCC] line-through">${product.price}</p>
                </div>
              </Link>
              <button
                onClick={() => addItem({
                  id: product.id, name: product.name,
                  price: salePrice, color: product.color,
                  secondaryColor: product.secondaryColor,
                  type: product.type, gender: product.gender,
                  quantity: 1, size: "M",
                })}
                className="md:hidden w-full mt-2 border border-[#E0E0E0] text-[10px] tracking-widest uppercase py-2 text-[#888888] hover:border-[#FF6B6B] hover:text-[#FF6B6B] transition-all bg-white"
              >
                Add to Cart
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}