import { useCartStore } from "@/store/cartStore"
import { useNavigate } from "react-router-dom"
import ModelViewer from "@/components/3d/ModelViewer"
import type { ProductType } from "@/data/products"

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total, count } = useCartStore()
  const navigate = useNavigate()

  const handleCheckout = () => {
    closeCart()
    navigate("/checkout")
  }

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/20 z-40 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={closeCart}
      />
      <div className={`fixed top-0 right-0 h-full w-full md:w-[420px] bg-white border-l border-[#E0E0E0] z-50 flex flex-col transition-transform duration-500 ${isOpen ? "translate-x-0" : "translate-x-full"}`}>

        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E0E0E0]">
          <div>
            <h2 className="text-sm tracking-widest uppercase text-[#333333] font-medium">Your Cart</h2>
            <p className="text-xs text-[#AAAAAA] mt-0.5">{count()} items</p>
          </div>
          <button onClick={closeCart} className="text-[#AAAAAA] hover:text-[#333333] transition-colors text-xl">✕</button>
        </div>

        {items.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-[#AAAAAA] gap-3">
            <div className="w-16 h-16 border border-[#E0E0E0] flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
            </div>
            <p className="text-sm tracking-widest uppercase text-[#333333]">Your cart is empty</p>
            <p className="text-xs text-[#AAAAAA]">Add some pieces to get started</p>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {items.map((item) => (
            <div key={`${item.id}-${item.size}`} className="flex gap-4 border-b border-[#F4F4F4] pb-6">
              <div className="w-20 h-24 bg-[#FAF5EF] shrink-0 border border-[#E0E0E0]">
                <ModelViewer
                  type={item.type as ProductType}
                  color={item.color}
                  secondaryColor={item.secondaryColor}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <p className="text-sm tracking-wide text-[#333333] truncate pr-2 font-medium">{item.name}</p>
                  <p className="text-sm text-[#444444] shrink-0 font-medium">${item.price}</p>
                </div>
                <p className="text-xs text-[#AAAAAA] mb-3">Size: {item.size} · {item.gender}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center border border-[#E0E0E0]">
                    <button onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                      className="px-3 py-1 text-[#888888] hover:text-[#333333] transition-colors text-sm">−</button>
                    <span className="px-3 py-1 text-xs text-[#333333] border-x border-[#E0E0E0]">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                      className="px-3 py-1 text-[#888888] hover:text-[#333333] transition-colors text-sm">+</button>
                  </div>
                  <button onClick={() => removeItem(item.id, item.size)}
                    className="text-xs text-[#AAAAAA] hover:text-[#FF6B6B] transition-colors tracking-widest uppercase">
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div className="border-t border-[#E0E0E0] px-6 py-6 space-y-4 bg-[#FAF5EF]">
            <div className="flex justify-between items-center">
              <span className="text-xs tracking-widest text-[#888888] uppercase">Total</span>
              <span className="text-xl font-bold text-[#333333]">${total()}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-[#333333] text-white text-xs tracking-widest uppercase py-4 hover:bg-[#7EC8E3] transition-colors duration-300"
            >
              Checkout
            </button>
            <button
              onClick={closeCart}
              className="w-full border border-[#DDD5C7] text-[#888888] text-xs tracking-widest uppercase py-3 hover:border-[#333333] hover:text-[#333333] transition-colors bg-white"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  )
}