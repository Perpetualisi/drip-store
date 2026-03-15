import { useState } from "react"
import { Link } from "react-router-dom"
import { useCartStore } from "@/store/cartStore"
import ModelViewer from "@/components/3d/ModelViewer"
import type { ProductType } from "@/data/products"

export default function Checkout() {
  const { items, total, clearCart } = useCartStore()
  const [step, setStep] = useState<"details" | "payment" | "success">("details")
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "",
    address: "", city: "", zip: "", country: "",
    card: "", expiry: "", cvv: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  if (step === "success") {
    return (
      <div className="min-h-screen bg-[#FAF5EF] text-[#333333] flex flex-col items-center justify-center px-6 text-center">
        <div className="w-16 h-16 border border-[#A8E6CF] rounded-full flex items-center justify-center mb-8 bg-white">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#A8E6CF" strokeWidth="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <p className="text-[10px] tracking-[0.4em] text-[#AAAAAA] uppercase mb-3">Order Confirmed</p>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4 text-[#333333]">Thank You</h1>
        <p className="text-[#888888] text-sm mb-2">Your order has been placed successfully.</p>
        <p className="text-[#BBBBBB] text-xs mb-10">A confirmation has been sent to {form.email}</p>
        <Link
          to="/shop"
          onClick={clearCart}
          className="px-8 py-3 bg-[#333333] text-white text-xs tracking-widest uppercase hover:bg-[#7EC8E3] transition-colors duration-300"
        >
          Continue Shopping
        </Link>
      </div>
    )
  }

  const inputClass = "w-full bg-white border border-[#E0E0E0] text-[#333333] text-sm px-4 py-3 outline-none focus:border-[#7EC8E3] transition-colors placeholder-[#CCCCCC]"
  const labelClass = "text-[10px] tracking-widest uppercase text-[#AAAAAA] block mb-2"

  return (
    <div className="min-h-screen bg-[#FAF5EF] text-[#333333]">

      <div className="border-b border-[#E0E0E0] bg-white px-4 md:px-8 py-6 flex items-center justify-between">
        <Link to="/cart" className="text-[10px] tracking-widest uppercase text-[#AAAAAA] hover:text-[#333333] transition-colors">
          ← Back to Cart
        </Link>
        <Link to="/" className="text-lg font-bold tracking-[0.3em] uppercase text-[#333333]">
          Drip<span className="text-[#7EC8E3]">.</span>
        </Link>
        <div className="w-20" />
      </div>

      {/* Steps */}
      <div className="flex items-center justify-center gap-4 px-4 py-6 border-b border-[#E0E0E0] bg-white">
        {["Details", "Payment"].map((s, i) => (
          <div key={s} className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
                (step === "details" && i === 0) || (step === "payment" && i === 1)
                  ? "bg-[#333333] text-white"
                  : step === "payment" && i === 0
                  ? "bg-[#A8E6CF] text-[#333333]"
                  : "border border-[#E0E0E0] text-[#AAAAAA]"
              }`}>
                {step === "payment" && i === 0 ? "✓" : i + 1}
              </div>
              <span className={`text-[10px] tracking-widest uppercase ${
                (step === "details" && i === 0) || (step === "payment" && i === 1)
                  ? "text-[#333333]"
                  : "text-[#AAAAAA]"
              }`}>
                {s}
              </span>
            </div>
            {i === 0 && <div className="w-12 h-px bg-[#E0E0E0]" />}
          </div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-12 px-4 md:px-8 py-8 md:py-12">

        {/* Form */}
        <div>
          {step === "details" && (
            <div>
              <h2 className="text-xl font-bold tracking-tight mb-8 text-[#333333]">Shipping Details</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>First Name</label>
                    <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="John" className={inputClass}/>
                  </div>
                  <div>
                    <label className={labelClass}>Last Name</label>
                    <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Doe" className={inputClass}/>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Email</label>
                  <input name="email" value={form.email} onChange={handleChange} placeholder="john@email.com" type="email" className={inputClass}/>
                </div>
                <div>
                  <label className={labelClass}>Address</label>
                  <input name="address" value={form.address} onChange={handleChange} placeholder="123 Street Name" className={inputClass}/>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>ZIP</label>
                    <input name="zip" value={form.zip} onChange={handleChange} placeholder="10001" className={inputClass}/>
                  </div>
                  <div className="col-span-2">
                    <label className={labelClass}>City</label>
                    <input name="city" value={form.city} onChange={handleChange} placeholder="New York" className={inputClass}/>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Country</label>
                  <input name="country" value={form.country} onChange={handleChange} placeholder="United States" className={inputClass}/>
                </div>
                <button
                  onClick={() => setStep("payment")}
                  className="w-full bg-[#333333] text-white text-xs tracking-widest uppercase py-4 hover:bg-[#7EC8E3] transition-colors duration-300 mt-4"
                >
                  Continue to Payment →
                </button>
              </div>
            </div>
          )}

          {step === "payment" && (
            <div>
              <h2 className="text-xl font-bold tracking-tight mb-8 text-[#333333]">Payment</h2>
              <div className="space-y-4">
                <div className="flex gap-3 mb-6">
                  {["Visa", "Mastercard", "Amex", "PayPal"].map((card) => (
                    <div key={card} className="border border-[#E0E0E0] bg-white px-3 py-2 text-[10px] tracking-widest text-[#888888] uppercase">
                      {card}
                    </div>
                  ))}
                </div>
                <div>
                  <label className={labelClass}>Card Number</label>
                  <input name="card" value={form.card} onChange={handleChange} placeholder="1234 5678 9012 3456" className={inputClass}/>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Expiry</label>
                    <input name="expiry" value={form.expiry} onChange={handleChange} placeholder="MM / YY" className={inputClass}/>
                  </div>
                  <div>
                    <label className={labelClass}>CVV</label>
                    <input name="cvv" value={form.cvv} onChange={handleChange} placeholder="123" className={inputClass}/>
                  </div>
                </div>
                <div className="border border-[#E0E0E0] bg-white p-4 mt-2">
                  <div className="flex justify-between text-xs text-[#888888] mb-2">
                    <span>Subtotal</span><span>${total()}</span>
                  </div>
                  <div className="flex justify-between text-xs text-[#888888] mb-3">
                    <span>Shipping</span><span className="text-[#A8E6CF]">Free</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold border-t border-[#E0E0E0] pt-3">
                    <span>Total</span><span>${total()}</span>
                  </div>
                </div>
                <button
                  onClick={() => setStep("success")}
                  className="w-full bg-[#333333] text-white text-xs tracking-widest uppercase py-4 hover:bg-[#7EC8E3] transition-colors duration-300"
                >
                  Place Order — ${total()}
                </button>
                <button
                  onClick={() => setStep("details")}
                  className="w-full border border-[#E0E0E0] text-[#888888] text-xs tracking-widest uppercase py-3 hover:border-[#333333] hover:text-[#333333] transition-colors bg-white"
                >
                  ← Back to Details
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:border-l lg:border-[#E0E0E0] lg:pl-12 mt-10 lg:mt-0">
          <h2 className="text-sm tracking-widest uppercase text-[#AAAAAA] mb-6">Order Summary</h2>
          <div className="space-y-4 mb-6">
            {items.map((item) => (
              <div key={`${item.id}-${item.size}`} className="flex gap-4 pb-4 border-b border-[#F4F4F4]">
                <div className="w-16 h-20 bg-[#FAF5EF] shrink-0 border border-[#E0E0E0]">
                  <ModelViewer
                    type={item.type as ProductType}
                    color={item.color}
                    secondaryColor={item.secondaryColor}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="text-sm tracking-wide text-[#333333]">{item.name}</p>
                    <p className="text-sm text-[#888888]">${item.price * item.quantity}</p>
                  </div>
                  <p className="text-xs text-[#AAAAAA] mt-1">Size: {item.size} · Qty: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
          {items.length === 0 && (
            <p className="text-sm text-[#AAAAAA] py-8 text-center">No items in cart</p>
          )}
          <div className="space-y-2 pt-2 bg-white border border-[#E0E0E0] p-4">
            <div className="flex justify-between text-xs text-[#888888]">
              <span>Subtotal</span><span>${total()}</span>
            </div>
            <div className="flex justify-between text-xs text-[#888888]">
              <span>Shipping</span><span className="text-[#A8E6CF]">Free</span>
            </div>
            <div className="flex justify-between text-sm font-bold border-t border-[#E0E0E0] pt-3 mt-3 text-[#333333]">
              <span>Total</span><span>${total()}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}