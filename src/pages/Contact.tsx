import { useState } from "react"

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" })
  const [sent, setSent] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = () => {
    setSent(true)
    setTimeout(() => setSent(false), 3000)
  }

  return (
    <div className="min-h-screen bg-[#FAF5EF] text-[#333333]">

      {/* Header */}
      <div className="border-b border-[#E0E0E0] bg-white px-4 md:px-8 py-10 md:py-16">
        <p className="text-[10px] tracking-[0.4em] text-[#AAAAAA] uppercase mb-2">Get in Touch</p>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">Contact</h1>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 px-4 md:px-8 py-12 md:py-20">

        {/* Left — Info */}
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-6">We'd love to hear from you</h2>
          <p className="text-[#888888] text-sm leading-relaxed mb-10">
            Whether you have a question about sizing, an order, or just want to say hello — our team is here to help.
          </p>

          <div className="space-y-6">
            {[
              { label: "Email", value: "hello@dripstore.com", icon: "✉" },
              { label: "Phone", value: "+1 (555) 000-0000", icon: "📞" },
              { label: "Hours", value: "Mon–Fri, 9am–6pm EST", icon: "🕐" },
              { label: "Location", value: "New York, NY 10001", icon: "📍" },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-4 pb-6 border-b border-[#E0E0E0]">
                <span className="text-lg mt-0.5">{item.icon}</span>
                <div>
                  <p className="text-[9px] tracking-widest uppercase text-[#AAAAAA] mb-1">{item.label}</p>
                  <p className="text-sm text-[#333333]">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Social links */}
          <div className="mt-10">
            <p className="text-[9px] tracking-widest uppercase text-[#AAAAAA] mb-4">Follow Us</p>
            <div className="flex gap-3">
              {["Instagram", "Twitter", "TikTok"].map((s) => (
                <button key={s}
                  className="border border-[#E0E0E0] px-4 py-2 text-[10px] tracking-widest uppercase text-[#888888] hover:border-[#7EC8E3] hover:text-[#7EC8E3] transition-colors bg-white">
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Form */}
        <div className="bg-white border border-[#E0E0E0] p-8">
          <h2 className="text-lg font-bold tracking-tight mb-6 text-[#333333]">Send a Message</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] tracking-widest uppercase text-[#AAAAAA] block mb-2">Name</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Your name"
                  className="w-full bg-[#FAF5EF] border border-[#E0E0E0] text-[#333333] text-sm px-4 py-3 outline-none focus:border-[#7EC8E3] transition-colors placeholder-[#CCCCCC]"/>
              </div>
              <div>
                <label className="text-[10px] tracking-widest uppercase text-[#AAAAAA] block mb-2">Email</label>
                <input name="email" value={form.email} onChange={handleChange} placeholder="your@email.com"
                  className="w-full bg-[#FAF5EF] border border-[#E0E0E0] text-[#333333] text-sm px-4 py-3 outline-none focus:border-[#7EC8E3] transition-colors placeholder-[#CCCCCC]"/>
              </div>
            </div>
            <div>
              <label className="text-[10px] tracking-widest uppercase text-[#AAAAAA] block mb-2">Subject</label>
              <input name="subject" value={form.subject} onChange={handleChange} placeholder="Order issue, sizing question..."
                className="w-full bg-[#FAF5EF] border border-[#E0E0E0] text-[#333333] text-sm px-4 py-3 outline-none focus:border-[#7EC8E3] transition-colors placeholder-[#CCCCCC]"/>
            </div>
            <div>
              <label className="text-[10px] tracking-widest uppercase text-[#AAAAAA] block mb-2">Message</label>
              <textarea name="message" value={form.message} onChange={handleChange} placeholder="How can we help?" rows={5}
                className="w-full bg-[#FAF5EF] border border-[#E0E0E0] text-[#333333] text-sm px-4 py-3 outline-none focus:border-[#7EC8E3] transition-colors placeholder-[#CCCCCC] resize-none"/>
            </div>
            <button
              onClick={handleSubmit}
              className={`w-full py-4 text-xs tracking-widest uppercase font-medium transition-all duration-300 ${
                sent ? "bg-[#A8E6CF] text-[#333333]" : "bg-[#333333] text-white hover:bg-[#7EC8E3]"
              }`}
            >
              {sent ? "✓ Message Sent!" : "Send Message"}
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}