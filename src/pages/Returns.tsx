export default function Returns() {
  return (
    <div className="min-h-screen bg-[#FAF5EF] text-[#333333]">
      <div className="border-b border-[#E0E0E0] bg-white px-4 md:px-8 py-10 md:py-16">
        <p className="text-[10px] tracking-[0.4em] text-[#AAAAAA] uppercase mb-2">Easy Returns</p>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">Returns</h1>
      </div>

      <div className="max-w-3xl mx-auto px-4 md:px-8 py-12 md:py-20 space-y-12">

        {/* Policy */}
        <div className="bg-[#E8F8FC] border border-[#7EC8E3]/30 px-6 py-5">
          <p className="text-sm text-[#333333] font-medium mb-1">30-Day Free Returns</p>
          <p className="text-sm text-[#888888] leading-relaxed">
            We offer free returns within 30 days of delivery. Items must be unworn, unwashed, and in original packaging with tags attached.
          </p>
        </div>

        {/* Steps */}
        <div>
          <h2 className="text-xl font-bold tracking-tight mb-6">How to Return</h2>
          <div className="space-y-3">
            {[
              { step: "01", title: "Start your return",   desc: "Log into your account and select the item(s) you wish to return." },
              { step: "02", title: "Print your label",    desc: "We'll email you a prepaid return shipping label within 24 hours." },
              { step: "03", title: "Pack and ship",       desc: "Pack the item securely in its original packaging and drop it off at any carrier location." },
              { step: "04", title: "Get your refund",     desc: "Once we receive and inspect the item, your refund will be processed within 3–5 business days." },
            ].map((s) => (
              <div key={s.step} className="flex gap-5 bg-white border border-[#E0E0E0] px-6 py-5">
                <span className="text-2xl font-bold text-[#E0E0E0] shrink-0">{s.step}</span>
                <div>
                  <p className="text-sm font-medium text-[#333333] mb-1">{s.title}</p>
                  <p className="text-sm text-[#888888]">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Non-returnable */}
        <div>
          <h2 className="text-xl font-bold tracking-tight mb-4">Non-Returnable Items</h2>
          <div className="bg-white border border-[#E0E0E0] px-6 py-5 space-y-2">
            {[
              "Items worn, washed or damaged",
              "Items without original tags",
              "Sale items marked as final sale",
              "Gift cards",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-[#888888]">
                <span className="w-1 h-1 rounded-full bg-[#FF6B6B]" />
                {item}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}