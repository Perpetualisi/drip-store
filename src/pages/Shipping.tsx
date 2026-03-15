export default function Shipping() {
  return (
    <div className="min-h-screen bg-[#FAF5EF] text-[#333333]">
      <div className="border-b border-[#E0E0E0] bg-white px-4 md:px-8 py-10 md:py-16">
        <p className="text-[10px] tracking-[0.4em] text-[#AAAAAA] uppercase mb-2">Delivery Info</p>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">Shipping</h1>
      </div>

      <div className="max-w-3xl mx-auto px-4 md:px-8 py-12 md:py-20 space-y-12">

        {/* Shipping options */}
        <div>
          <h2 className="text-xl font-bold tracking-tight mb-6">Shipping Options</h2>
          <div className="space-y-3">
            {[
              { method: "Standard",  time: "5–7 business days",  price: "Free over $100 / $5.99" },
              { method: "Express",   time: "2–3 business days",  price: "$12.99" },
              { method: "Overnight", time: "Next business day",  price: "$24.99" },
              { method: "International", time: "7–14 business days", price: "From $19.99" },
            ].map((s) => (
              <div key={s.method} className="flex justify-between items-center bg-white border border-[#E0E0E0] px-6 py-4">
                <div>
                  <p className="text-sm font-medium text-[#333333]">{s.method}</p>
                  <p className="text-xs text-[#AAAAAA] mt-0.5">{s.time}</p>
                </div>
                <p className="text-sm text-[#7EC8E3] font-medium">{s.price}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h2 className="text-xl font-bold tracking-tight mb-6">Frequently Asked</h2>
          <div className="space-y-4">
            {[
              { q: "When will my order ship?", a: "Orders placed before 2pm EST ship the same business day. Orders after 2pm ship the next business day." },
              { q: "Do you ship internationally?", a: "Yes! We ship to over 50 countries. International orders may be subject to customs fees and import duties." },
              { q: "How do I track my order?", a: "You will receive a tracking number via email once your order ships. You can use this to track your package on our carrier's website." },
              { q: "What if my order is lost?", a: "If your order hasn't arrived within 10 business days of the expected delivery date, please contact us and we'll investigate immediately." },
            ].map((item) => (
              <div key={item.q} className="bg-white border border-[#E0E0E0] px-6 py-5">
                <p className="text-sm font-medium text-[#333333] mb-2">{item.q}</p>
                <p className="text-sm text-[#888888] leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}