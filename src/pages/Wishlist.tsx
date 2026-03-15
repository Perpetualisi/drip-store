import { Link } from "react-router-dom"
import { useWishlistStore } from "@/store/wishlistStore"
import { useCartStore } from "@/store/cartStore"
import { products } from "@/data/products"
import ModelViewer from "@/components/3d/ModelViewer"
import { useState } from "react"

export default function Wishlist() {
  const { items, toggleItem } = useWishlistStore()
  const addItem = useCartStore((state) => state.addItem)
  const [addedId, setAddedId] = useState<number | null>(null)

  const wishlisted = products.filter((p) => items.includes(p.id))

  const handleAddToCart = (product: typeof products[0]) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      color: product.color,
      secondaryColor: product.secondaryColor,
      type: product.type,
      gender: product.gender,
      quantity: 1,
      size: "M",
    })
    setAddedId(product.id)
    setTimeout(() => setAddedId(null), 1500)
  }

  return (
    <div className="min-h-screen bg-[#FAF5EF] text-[#333333]">

      {/* Header */}
      <div className="border-b border-[#E0E0E0] bg-white px-4 md:px-8 py-10 md:py-16">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] tracking-[0.4em] text-[#AAAAAA] uppercase mb-2">Saved Items</p>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-[#333333]">Wishlist</h1>
          </div>
          <div className="hidden md:flex flex-col items-center justify-center w-20 h-20 border border-[#E0E0E0] bg-[#FAF5EF]">
            <p className="text-2xl font-bold text-[#333333]">{wishlisted.length}</p>
            <p className="text-[8px] tracking-widest uppercase text-[#AAAAAA]">Saved</p>
          </div>
        </div>
      </div>

      {/* Empty state */}
      {wishlisted.length === 0 && (
        <div className="flex flex-col items-center justify-center py-40 px-6 text-center">
          <div className="w-20 h-20 border border-[#E0E0E0] bg-white flex items-center justify-center mb-6">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#CCCCCC" strokeWidth="1">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </div>
          <p className="text-xl tracking-widest uppercase mb-3 text-[#333333]">Your wishlist is empty</p>
          <p className="text-sm text-[#AAAAAA] mb-8 max-w-sm">
            Save your favourite pieces by tapping the heart icon on any product.
          </p>
          <Link
            to="/shop"
            className="px-10 py-4 bg-[#333333] text-white text-xs tracking-widest uppercase hover:bg-[#7EC8E3] transition-colors duration-300"
          >
            Browse Products
          </Link>
        </div>
      )}

      {/* Grid */}
      {wishlisted.length > 0 && (
        <div className="px-4 md:px-8 py-8 md:py-12">

          {/* Actions bar */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-[10px] tracking-widest uppercase text-[#AAAAAA]">
              {wishlisted.length} saved item{wishlisted.length !== 1 ? "s" : ""}
            </p>
            <button
              onClick={() => wishlisted.forEach((p) => handleAddToCart(p))}
              className="text-[10px] tracking-widest uppercase border border-[#E0E0E0] px-4 py-2 text-[#888888] hover:border-[#333333] hover:text-[#333333] transition-colors bg-white"
            >
              Add All to Cart
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {wishlisted.map((product) => (
              <div key={product.id} className="group">

                <div className="aspect-[3/4] bg-white mb-3 overflow-hidden relative border border-[#E0E0E0] group-hover:border-[#7EC8E3] transition-all duration-500">

                  <Link to={`/product/${product.id}`} className="block w-full h-full">
                    <div className="w-full h-full group-hover:scale-105 transition-transform duration-700">
                      <ModelViewer
                        type={product.type}
                        color={product.color}
                        secondaryColor={product.secondaryColor}
                        animate={false}
                      />
                    </div>
                  </Link>

                  {/* Remove from wishlist */}
                  <button
                    onClick={() => toggleItem(product.id)}
                    className="absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center bg-white border border-[#E0E0E0] hover:border-[#FF6B6B] hover:bg-[#FFF0F0] transition-all"
                    title="Remove from wishlist"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="#FF6B6B" stroke="#FF6B6B" strokeWidth="1.5">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                  </button>

                  {/* Tag */}
                  <div className="absolute top-2 left-2 z-10 pointer-events-none">
                    <span className="text-[8px] tracking-widest bg-[#7EC8E3] text-white px-2 py-0.5">
                      {product.tag}
                    </span>
                  </div>

                  {/* Add to cart */}
                  <button
                    onClick={() => handleAddToCart(product)}
                    className={`absolute bottom-0 left-0 right-0 text-[10px] tracking-widest uppercase py-3 text-center transition-all duration-300 z-10 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 ${
                      addedId === product.id
                        ? "bg-[#A8E6CF] text-[#333333]"
                        : "bg-[#333333] text-white hover:bg-[#7EC8E3]"
                    }`}
                  >
                    {addedId === product.id ? "✓ Added!" : "Add to Cart"}
                  </button>
                </div>

                <Link to={`/product/${product.id}`} className="block mb-2">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-xs md:text-sm tracking-wide group-hover:text-[#7EC8E3] transition-colors leading-tight pr-2 font-medium text-[#333333]">
                      {product.name}
                    </p>
                    <p className="text-xs md:text-sm text-[#444444] shrink-0 font-medium">${product.price}</p>
                  </div>
                  <p className="text-[10px] text-[#AAAAAA]">{product.category} · {product.gender}</p>
                </Link>

                <button
                  onClick={() => handleAddToCart(product)}
                  className={`w-full text-[10px] tracking-widest uppercase py-2.5 border transition-all duration-300 font-medium ${
                    addedId === product.id
                      ? "bg-[#A8E6CF] text-[#333333] border-[#A8E6CF]"
                      : "bg-white text-[#888888] border-[#E0E0E0] hover:border-[#333333] hover:text-[#333333]"
                  }`}
                >
                  {addedId === product.id ? "✓ Added to Cart" : "Add to Cart"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}