import React, { useRef, useEffect, useState } from "react"

interface ModelViewerProps {
  type?: "hoodie" | "dress" | "jacket" | "pants" | "coat" | "shorts" | "tee" | "skirt"
  color?: string
  secondaryColor?: string
  animate?: boolean
}

const BASE_STYLES = `
  @keyframes float {
    0%,100% { transform: translateY(0px) rotate(0deg); }
    33% { transform: translateY(-14px) rotate(0.8deg); }
    66% { transform: translateY(-7px) rotate(-0.6deg); }
  }
  @keyframes floatSlow {
    0%,100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-10px) rotate(0.3deg); }
  }
  @keyframes sway {
    0%,100% { transform: rotate(0deg) translateY(0px); }
    30% { transform: rotate(1.4deg) translateY(-12px); }
    70% { transform: rotate(-1deg) translateY(-6px); }
  }
  @keyframes shadowPulse {
    0%,100% { transform: translateX(-50%) scaleX(1); opacity: 0.22; }
    50% { transform: translateX(-50%) scaleX(0.82); opacity: 0.1; }
  }
  @keyframes shimmer {
    0% { left: -100%; }
    100% { left: 200%; }
  }
  @keyframes sheenMove {
    0% { opacity: 0; transform: translateX(-120%) rotate(25deg); }
    40% { opacity: 0.12; }
    100% { opacity: 0; transform: translateX(120%) rotate(25deg); }
  }
  @keyframes collarLift {
    0%,100% { transform: rotate(0deg); }
    50% { transform: rotate(0.8deg) translateY(-1px); }
  }
  @keyframes sleeveWave {
    0%,100% { transform: rotate(0deg); }
    40% { transform: rotate(1.2deg); }
    80% { transform: rotate(-0.8deg); }
  }
  @keyframes hemFlutter {
    0%,100% { transform: scaleX(1) skewX(0deg); }
    40% { transform: scaleX(1.012) skewX(1.2deg); }
    80% { transform: scaleX(0.994) skewX(-0.8deg); }
  }
  @keyframes pocketBulge {
    0%,100% { transform: scaleY(1); }
    50% { transform: scaleY(1.03); }
  }
  @keyframes twinkle {
    0%,100% { opacity: 0.7; transform: scale(1); }
    50% { opacity: 0.2; transform: scale(0.5); }
  }
`

function Shadow() {
  return (
    <div style={{
      position: "absolute",
      bottom: "2%",
      left: "50%",
      transform: "translateX(-50%)",
      width: "55%",
      height: "14px",
      background: "radial-gradient(ellipse, rgba(0,0,0,0.28) 0%, transparent 72%)",
      borderRadius: "50%",
      animation: "shadowPulse 3s ease-in-out infinite",
    }}/>
  )
}

function ShimmerOverlay() {
  return (
    <div style={{
      position: "absolute",
      top: 0, left: 0, right: 0, bottom: 0,
      overflow: "hidden",
      borderRadius: "inherit",
      pointerEvents: "none",
      zIndex: 10,
    }}>
      <div style={{
        position: "absolute",
        top: "-20%",
        width: "40%",
        height: "140%",
        background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)",
        animation: "sheenMove 4s ease-in-out infinite",
        animationDelay: "1.5s",
      }}/>
    </div>
  )
}

function SVGWrapper({
  children,
  viewBox,
  animClass,
  animate,
}: {
  children: React.ReactNode
  viewBox: string
  animClass: "float" | "sway" | "floatSlow"
  animate: boolean
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const parent = el.closest("[data-model-root]") as HTMLElement | null
    if (!parent) return

    const handleMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = (e.clientX - cx) / (rect.width / 2)
      const dy = (e.clientY - cy) / (rect.height / 2)
      setTilt({ x: dy * -6, y: dx * 6 })
    }
    const handleLeave = () => setTilt({ x: 0, y: 0 })

    parent.addEventListener("mousemove", handleMove)
    parent.addEventListener("mouseleave", handleLeave)
    return () => {
      parent.removeEventListener("mousemove", handleMove)
      parent.removeEventListener("mouseleave", handleLeave)
    }
  }, [])

  const anim = animate ? animClass : "floatSlow"

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "74%",
        maxWidth: "228px",
        animation: `${anim} ${anim === "sway" ? "2.4s" : "2.2s"} ease-in-out infinite`,
        transform: `perspective(600px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: "transform 0.15s ease-out",
        willChange: "transform",
      }}
    >
      <ShimmerOverlay/>
      <svg
        viewBox={viewBox}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: "100%",
          height: "auto",
          display: "block",
          filter: "drop-shadow(0 18px 36px rgba(0,0,0,0.22)) drop-shadow(0 4px 8px rgba(0,0,0,0.12))",
        }}
      >
        <defs>
          <filter id="fabricTexture" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.72 0.68" numOctaves="4" seed="2" result="noise"/>
            <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise"/>
            <feBlend in="SourceGraphic" in2="grayNoise" mode="overlay" result="blend"/>
            <feComposite in="blend" in2="SourceGraphic" operator="in"/>
          </filter>
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feComposite in="SourceGraphic" in2="blur" operator="over"/>
          </filter>
          <filter id="deepShadow">
            <feDropShadow dx="2" dy="4" stdDeviation="4" floodOpacity="0.18"/>
          </filter>
          <filter id="fabricFine" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="turbulence" baseFrequency="0.9 0.85" numOctaves="2" seed="5" result="noise"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.04 0" in="noise" result="tintedNoise"/>
            <feComposite in="tintedNoise" in2="SourceGraphic" operator="in" result="masked"/>
            <feBlend in="SourceGraphic" in2="masked" mode="overlay"/>
          </filter>
        </defs>
        {children}
      </svg>
    </div>
  )
}

function HoodieFlat({ c, s, animate }: { c: string; s: string; animate: boolean }) {
  return (
    <div data-model-root style={{ width: "100%", height: "100%", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <style>{BASE_STYLES}</style>
      <Shadow/>
      <SVGWrapper viewBox="0 0 200 245" animClass="float" animate={animate}>
        {/* LEFT SLEEVE */}
        <g style={{ transformOrigin: "66px 120px", animation: animate ? "sleeveWave 2.2s ease-in-out infinite" : "none" }}>
          <path d="M52 90 C34 96 16 108 8 126 C2 140 4 160 12 172 C20 182 34 186 46 180 C56 174 62 160 64 144 C66 128 66 108 66 92Z" fill={c} filter="url(#fabricFine)"/>
          <path d="M52 90 C36 98 20 112 10 130 C4 144 4 158 10 170" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="3.5" strokeLinecap="round"/>
          <path d="M32 130 C28 146 28 162 32 174" fill="none" stroke="rgba(0,0,0,0.09)" strokeWidth="3" strokeLinecap="round"/>
          <path d="M8 164 C8 174 12 182 20 186 C30 190 44 186 52 178 C58 170 62 158 60 148" fill={s}/>
          <path d="M10 172 C22 168 38 172 54 166" fill="none" stroke="rgba(255,255,255,0.32)" strokeWidth="2" strokeLinecap="round"/>
        </g>
        {/* RIGHT SLEEVE */}
        <g style={{ transformOrigin: "134px 120px", animation: animate ? "sleeveWave 2.2s ease-in-out infinite 0.2s" : "none" }}>
          <path d="M148 90 C166 96 184 108 192 126 C198 140 196 160 188 172 C180 182 166 186 154 180 C144 174 138 160 136 144 C134 128 134 108 134 92Z" fill={c} filter="url(#fabricFine)"/>
          <path d="M148 90 C164 98 180 112 190 130 C196 144 196 158 190 170" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="3.5" strokeLinecap="round"/>
          <path d="M168 130 C172 146 172 162 168 174" fill="none" stroke="rgba(0,0,0,0.09)" strokeWidth="3" strokeLinecap="round"/>
          <path d="M192 164 C192 174 188 182 180 186 C170 190 156 186 148 178 C142 170 138 158 140 148" fill={s}/>
          <path d="M190 172 C178 168 162 172 146 166" fill="none" stroke="rgba(255,255,255,0.32)" strokeWidth="2" strokeLinecap="round"/>
        </g>
        {/* BODY */}
        <rect x="52" y="86" width="96" height="151" rx="18" fill={c} filter="url(#fabricFine)"/>
        <path d="M62 102 C60 124 60 152 62 180" fill="none" stroke="rgba(255,255,255,0.17)" strokeWidth="5" strokeLinecap="round"/>
        <path d="M138 102 C140 124 140 152 138 180" fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth="3.5" strokeLinecap="round"/>
        <path d="M100 90 C100 120 100 158 100 230" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="2"/>
        {/* HOOD */}
        <g style={{ transformOrigin: "100px 60px", animation: animate ? "collarLift 2.2s ease-in-out infinite" : "none" }}>
          <path d="M68 90 C64 64 68 42 78 26 C86 13 96 6 100 5 C104 6 114 13 122 26 C132 42 136 64 132 90 L120 88 L100 84 L80 88Z" fill={c} filter="url(#fabricFine)"/>
          <path d="M72 86 C70 64 72 44 80 28 C86 16 93 8 99 6" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3" strokeLinecap="round"/>
          <path d="M128 86 C130 64 128 44 122 28" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="2" strokeLinecap="round"/>
          <ellipse cx="100" cy="80" rx="22" ry="16" fill="#1a1a1a"/>
          <ellipse cx="100" cy="80" rx="18" ry="12" fill="#111"/>
          <ellipse cx="100" cy="78" rx="16" ry="9" fill="#0d0d0d"/>
          <circle cx="92" cy="77" r="3.2" fill="rgba(255,255,255,0.75)"/>
          <circle cx="108" cy="77" r="3.2" fill="rgba(255,255,255,0.75)"/>
          <circle cx="92.8" cy="76.4" r="1.4" fill="#1a1a1a"/>
          <circle cx="108.8" cy="76.4" r="1.4" fill="#1a1a1a"/>
          <circle cx="93.4" cy="75.8" r="0.6" fill="white" opacity="0.8"/>
          <circle cx="109.4" cy="75.8" r="0.6" fill="white" opacity="0.8"/>
          <path d="M94 83 C97 87 103 87 106 83" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" strokeLinecap="round"/>
          <ellipse cx="87" cy="83" rx="5" ry="3.5" fill="#FF9999" opacity="0.45"/>
          <ellipse cx="113" cy="83" rx="5" ry="3.5" fill="#FF9999" opacity="0.45"/>
        </g>
        {/* POCKET */}
        <g style={{ transformOrigin: "100px 174px", animation: animate ? "pocketBulge 2.2s ease-in-out infinite" : "none" }}>
          <rect x="66" y="154" width="68" height="46" rx="14" fill={s} opacity="0.88"/>
          <rect x="66" y="154" width="68" height="46" rx="14" fill="rgba(0,0,0,0.06)" filter="url(#fabricFine)"/>
          <line x1="100" y1="158" x2="100" y2="196" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M70 168 C70 162 74 158 80 158 L92 158" stroke="rgba(0,0,0,0.18)" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <path d="M130 168 C130 162 126 158 120 158 L108 158" stroke="rgba(0,0,0,0.18)" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <path d="M70 178 C76 175 84 176 90 178" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeLinecap="round"/>
        </g>
        {/* DRAWSTRINGS */}
        <path d="M88 88 C86 100 84 114 84 126" fill="none" stroke={s} strokeWidth="2.5" strokeLinecap="round" opacity="0.85"/>
        <path d="M112 88 C114 100 116 114 116 126" fill="none" stroke={s} strokeWidth="2.5" strokeLinecap="round" opacity="0.85"/>
        <circle cx="84" cy="130" r="4.5" fill={s} stroke="rgba(0,0,0,0.15)" strokeWidth="1"/>
        <circle cx="84" cy="130" r="2" fill="rgba(255,255,255,0.35)"/>
        <circle cx="116" cy="130" r="4.5" fill={s} stroke="rgba(0,0,0,0.15)" strokeWidth="1"/>
        <circle cx="116" cy="130" r="2" fill="rgba(255,255,255,0.35)"/>
        {/* HEM */}
        <rect x="52" y="228" width="96" height="10" rx="5" fill={s} opacity="0.75"/>
        <path d="M56 233 C72 229 128 233 144 229" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round"/>
        <text style={{ animation: "twinkle 2.5s ease-in-out infinite" }} x="38" y="118" fontSize="10" fill={s} opacity="0.7">✦</text>
        <text style={{ animation: "twinkle 2.5s ease-in-out infinite 0.6s" }} x="154" y="114" fontSize="8" fill={s} opacity="0.7">✦</text>
      </SVGWrapper>
    </div>
  )
}

function DressFlat({ c, s, animate }: { c: string; s: string; animate: boolean }) {
  return (
    <div data-model-root style={{ width: "100%", height: "100%", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <style>{BASE_STYLES}</style>
      <Shadow/>
      <SVGWrapper viewBox="0 0 200 275" animClass="sway" animate={animate}>
        {/* BODICE */}
        <path d="M62 72 C58 92 55 116 54 138 C53 156 54 170 56 180 L144 180 C146 170 147 156 146 138 C145 116 142 92 138 72 L124 62 L100 66 L76 62Z" fill={c} filter="url(#fabricFine)"/>
        <path d="M62 78 C60 98 58 122 57 148" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="4" strokeLinecap="round"/>
        <path d="M138 78 C140 98 142 122 143 148" fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth="3" strokeLinecap="round"/>
        {/* STRAPS */}
        <g style={{ transformOrigin: "87px 35px", animation: animate ? "collarLift 2.4s ease-in-out infinite" : "none" }}>
          <path d="M76 62 C74 50 74 38 76 28 C78 20 82 14 88 10 L96 8 C100 10 102 17 102 27 C102 38 100 50 98 62Z" fill={c} filter="url(#fabricFine)"/>
          <path d="M78 58 C76 48 76 36 78 26 C80 18 84 12 88 10" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2.5" strokeLinecap="round"/>
        </g>
        <g style={{ transformOrigin: "113px 35px", animation: animate ? "collarLift 2.4s ease-in-out infinite 0.1s" : "none" }}>
          <path d="M124 62 C126 50 126 38 124 28 C122 20 118 14 112 10 L104 8 C100 10 98 17 98 27 C98 38 100 50 102 62Z" fill={c} filter="url(#fabricFine)"/>
          <path d="M122 58 C124 48 124 36 122 26" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2.5" strokeLinecap="round"/>
        </g>
        {/* NECKLINE */}
        <path d="M88 10 C92 5 96 3 100 3 C104 3 108 5 112 10" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="2" strokeLinecap="round"/>
        {/* WAIST RIBBON */}
        <rect x="52" y="174" width="96" height="12" rx="6" fill={s}/>
        <path d="M56 180 C72 176 128 180 144 176" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M86 180 C80 173 72 171 76 177 C78 181 90 179 100 179 C110 179 122 181 124 177 C128 171 120 173 114 180" fill={s} stroke="rgba(0,0,0,0.12)" strokeWidth="1"/>
        <circle cx="100" cy="180" r="5.5" fill="white" opacity="0.38"/>
        <circle cx="100" cy="180" r="2.5" fill={s}/>
        {/* SKIRT */}
        <g style={{ transformOrigin: "100px 228px", animation: animate ? "hemFlutter 2.4s ease-in-out infinite" : "none" }}>
          <path d="M56 180 C48 210 36 248 22 268 L178 268 C164 248 152 210 144 180Z" fill={c} filter="url(#fabricFine)"/>
          <path d="M56 186 C50 216 40 254 28 268" fill="none" stroke="rgba(255,255,255,0.17)" strokeWidth="4.5" strokeLinecap="round"/>
          <path d="M144 186 C150 216 160 254 172 268" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="3.5" strokeLinecap="round"/>
          <path d="M100 182 C98 212 96 246 96 264" fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth="2.5"/>
          <path d="M78 184 C72 214 66 248 64 264" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="2"/>
          <path d="M122 184 C128 214 134 248 136 264" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="2"/>
          {[[80,220],[106,234],[130,218],[72,248],[120,252],[96,260]].map(([x,y],i) => (
            <circle key={i} cx={x} cy={y} r="5" fill={s} opacity="0.4"/>
          ))}
          <path d="M22 262 C38 256 54 266 70 260 C86 254 102 266 118 260 C134 254 150 266 166 260 C172 257 177 262 178 263" fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M22 268 C38 262 54 272 70 266 C86 260 102 272 118 266 C134 260 150 272 166 266 C172 263 177 268 178 269" fill={s} opacity="0.5"/>
        </g>
        {/* HEART */}
        <path d="M94 144 C92 139 85 139 85 145 C85 149 94 157 100 160 C106 157 115 149 115 145 C115 139 108 139 106 144 C104 141 102 139 100 139 C98 139 96 141 94 144Z" fill={s} opacity="0.75" style={{ animation: "twinkle 2s ease-in-out infinite" }}/>
        <ellipse cx="68" cy="148" rx="9" ry="6" fill="#FF9999" opacity="0.32"/>
        <ellipse cx="132" cy="148" rx="9" ry="6" fill="#FF9999" opacity="0.32"/>
        <text style={{ animation: "twinkle 2.8s ease-in-out infinite" }} x="42" y="118" fontSize="11" fill={s} opacity="0.65">✦</text>
        <text style={{ animation: "twinkle 2.8s ease-in-out infinite 0.7s" }} x="150" y="112" fontSize="8" fill={s} opacity="0.65">✦</text>
      </SVGWrapper>
    </div>
  )
}

function JacketFlat({ c, s, animate }: { c: string; s: string; animate: boolean }) {
  return (
    <div data-model-root style={{ width: "100%", height: "100%", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <style>{BASE_STYLES}</style>
      <Shadow/>
      <SVGWrapper viewBox="0 0 210 255" animClass="float" animate={animate}>
        {/* LEFT SLEEVE */}
        <g style={{ transformOrigin: "72px 150px", animation: animate ? "sleeveWave 2s ease-in-out infinite" : "none" }}>
          <path d="M56 94 C36 102 16 116 6 138 C-2 156 0 178 10 192 C18 204 34 210 48 204 C60 198 68 182 70 164 C72 146 72 120 72 98Z" fill={c} filter="url(#fabricFine)"/>
          <path d="M56 94 C38 104 20 120 8 142 C0 158 0 174 8 188" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3.5" strokeLinecap="round"/>
          <path d="M30 134 C24 152 22 170 26 186" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="3" strokeLinecap="round"/>
          <path d="M2 184 C0 196 4 208 14 214 C26 220 44 216 54 206 C62 196 66 182 62 172" fill={s}/>
          <path d="M4 194 C18 190 38 194 56 188" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="2" strokeLinecap="round"/>
          <path d="M6 204 C20 200 38 204 54 198" fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="1.5" strokeLinecap="round"/>
        </g>
        {/* RIGHT SLEEVE */}
        <g style={{ transformOrigin: "138px 150px", animation: animate ? "sleeveWave 2s ease-in-out infinite 0.2s" : "none" }}>
          <path d="M154 94 C174 102 194 116 204 138 C212 156 210 178 200 192 C192 204 176 210 162 204 C150 198 142 182 140 164 C138 146 138 120 138 98Z" fill={c} filter="url(#fabricFine)"/>
          <path d="M154 94 C172 104 190 120 202 142 C210 158 210 174 202 188" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3.5" strokeLinecap="round"/>
          <path d="M180 134 C186 152 188 170 184 186" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="3" strokeLinecap="round"/>
          <path d="M208 184 C210 196 206 208 196 214 C184 220 166 216 156 206 C148 196 144 182 148 172" fill={s}/>
          <path d="M206 194 C192 190 172 194 154 188" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="2" strokeLinecap="round"/>
        </g>
        {/* BODY */}
        <path d="M56 94 C54 122 50 158 48 192 C46 218 46 232 48 240 L107 240 L107 84 L82 76Z" fill={c} filter="url(#fabricFine)"/>
        <path d="M154 94 C156 122 160 158 162 192 C164 218 164 232 162 240 L103 240 L103 84 L128 76Z" fill={c} filter="url(#fabricFine)"/>
        <path d="M62 108 C60 132 58 164 58 198" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="4.5" strokeLinecap="round"/>
        <path d="M148 108 C150 132 152 164 152 198" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="3.5" strokeLinecap="round"/>
        {/* LAPELS */}
        <g style={{ transformOrigin: "82px 30px", animation: animate ? "collarLift 2s ease-in-out infinite" : "none" }}>
          <path d="M82 76 C74 58 62 36 54 16 C50 6 50 -2 56 -6 C62 -10 72 -8 80 0 C88 8 96 24 100 46 L105 84Z" fill={c} stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" filter="url(#fabricFine)"/>
          <path d="M80 72 C72 56 62 36 56 18 C52 8 52 0 56 -4" fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="2.5" strokeLinecap="round"/>
        </g>
        <g style={{ transformOrigin: "128px 30px", animation: animate ? "collarLift 2s ease-in-out infinite 0.1s" : "none" }}>
          <path d="M128 76 C136 58 148 36 156 16 C160 6 160 -2 154 -6 C148 -10 138 -8 130 0 C122 8 114 24 110 46 L105 84Z" fill={c} stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" filter="url(#fabricFine)"/>
        </g>
        {/* COLLAR */}
        <path d="M56 -6 C70 -16 86 -20 105 -21 C124 -20 140 -16 154 -6 C140 2 124 8 114 10 C110 11 108 12 105 12 C102 12 100 11 96 10 C86 8 70 2 56 -6Z" fill={c} stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"/>
        <path d="M60 -4 C74 -12 88 -16 105 -17" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="2" strokeLinecap="round"/>
        {/* ZIPPER */}
        <rect x="102" y="84" width="6" height="156" rx="3" fill={s} opacity="0.65"/>
        {Array.from({length: 9}).map((_,i) => (
          <g key={i}>
            <rect x="100" y={90+i*16} width="10" height="7" rx="3.5" fill={s} opacity="0.85"/>
            <rect x="101" y={91+i*16} width="8" height="5" rx="2.5" fill="rgba(255,255,255,0.2)"/>
          </g>
        ))}
        <path d="M99 84 L111 84 L113 98 L97 98Z" fill={s}/>
        <circle cx="105" cy="90" r="3.5" fill="rgba(255,255,255,0.55)"/>
        {/* POCKETS */}
        <rect x="54" y="162" width="40" height="30" rx="10" fill={s} opacity="0.78"/>
        <path d="M58 174 C60 166 66 162 74 162" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round"/>
        <rect x="116" y="162" width="40" height="30" rx="10" fill={s} opacity="0.78"/>
        <path d="M120 174 C122 166 128 162 136 162" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round"/>
        {/* BUTTONS */}
        {[102,120,138].map((y,i) => (
          <g key={i}>
            <circle cx="96" cy={y} r="5.5" fill={s} stroke="rgba(0,0,0,0.15)" strokeWidth="1"/>
            <circle cx="96" cy={y} r="2.2" fill="rgba(0,0,0,0.2)"/>
            <circle cx="94.8" cy={y-1.5} r="1" fill="rgba(255,255,255,0.55)"/>
            <circle cx="114" cy={y} r="5.5" fill={s} stroke="rgba(0,0,0,0.15)" strokeWidth="1"/>
            <circle cx="114" cy={y} r="2.2" fill="rgba(0,0,0,0.2)"/>
            <circle cx="112.8" cy={y-1.5} r="1" fill="rgba(255,255,255,0.55)"/>
          </g>
        ))}
        {/* HEM */}
        <rect x="48" y="232" width="114" height="10" rx="5" fill={s} opacity="0.65"/>
        <path d="M52 237 C80 233 130 237 158 233" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" strokeLinecap="round"/>
        <ellipse cx="64" cy="158" rx="10" ry="7" fill="#FF9999" opacity="0.24"/>
        <ellipse cx="146" cy="158" rx="10" ry="7" fill="#FF9999" opacity="0.24"/>
      </SVGWrapper>
    </div>
  )
}

function PantsFlat({ c, s, animate }: { c: string; s: string; animate: boolean }) {
  return (
    <div data-model-root style={{ width: "100%", height: "100%", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <style>{BASE_STYLES}</style>
      <Shadow/>
      <SVGWrapper viewBox="0 0 200 285" animClass="float" animate={animate}>
        {/* WAISTBAND */}
        <path d="M44 18 C44 10 50 4 58 4 L142 4 C150 4 156 10 156 18 L156 46 L44 46Z" fill={s}/>
        <path d="M48 28 C80 24 120 24 152 28" fill="none" stroke="rgba(255,255,255,0.42)" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M48 38 C80 34 120 34 152 38" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeLinecap="round"/>
        {[60,84,100,116,140].map((x,i) => (
          <rect key={i} x={x-4} y="0" width="8" height="16" rx="3" fill={c} stroke="rgba(0,0,0,0.12)" strokeWidth="1"/>
        ))}
        <circle cx="100" cy="26" r="7.5" fill={c} stroke="rgba(0,0,0,0.18)" strokeWidth="1.5"/>
        <circle cx="100" cy="26" r="3.8" fill={s}/>
        <circle cx="98.5" cy="24.5" r="1.4" fill="rgba(255,255,255,0.55)"/>
        <path d="M100 35 L100 53" stroke="rgba(0,0,0,0.18)" strokeWidth="2" strokeLinecap="round"/>
        {[39,45,51].map((y,i) => (
          <line key={i} x1="97" y1={y} x2="103" y2={y} stroke={s} strokeWidth="1.2" strokeOpacity="0.45"/>
        ))}
        <path d="M50 48 C52 48 64 62 62 78 C61 90 54 96 46 94 L32 86Z" fill={s} opacity="0.68"/>
        <path d="M52 50 C54 52 62 64 60 78" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M150 48 C148 48 136 62 138 78 C139 90 146 96 154 94 L168 86Z" fill={s} opacity="0.68"/>
        {/* LEFT LEG */}
        <path d="M44 44 C40 88 36 140 34 184 C32 218 32 244 34 262 C36 272 40 278 48 278 L98 278 L100 230 C100 180 100 120 100 72 L44 44Z" fill={c} filter="url(#fabricFine)"/>
        <path d="M44 50 C40 94 37 148 36 196" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="5" strokeLinecap="round"/>
        <path d="M74 46 C72 100 70 162 70 218" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="2.5"/>
        <path d="M98 74 C97 130 97 190 98 240" fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth="1.5"/>
        <rect x="34" y="264" width="66" height="14" rx="7" fill={s} opacity="0.82"/>
        <path d="M38 271 C58 267 78 271 98 267" fill="none" stroke="rgba(255,255,255,0.32)" strokeWidth="1.5" strokeLinecap="round"/>
        {/* RIGHT LEG */}
        <path d="M156 44 C160 88 164 140 166 184 C168 218 168 244 166 262 C164 272 160 278 152 278 L102 278 L100 230 C100 180 100 120 100 72 L156 44Z" fill={c} filter="url(#fabricFine)"/>
        <path d="M156 50 C160 94 163 148 164 196" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="4.5" strokeLinecap="round"/>
        <path d="M126 46 C128 100 130 162 130 218" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="2.5"/>
        <rect x="100" y="264" width="66" height="14" rx="7" fill={s} opacity="0.82"/>
        <path d="M104 271 C124 267 144 271 164 267" fill="none" stroke="rgba(255,255,255,0.32)" strokeWidth="1.5" strokeLinecap="round"/>
        <rect x="114" y="76" width="36" height="28" rx="7" fill={s} opacity="0.38"/>
        <text x="120" y="95" fontSize="14" fill="white" opacity="0.65">♡</text>
        <ellipse cx="52" cy="180" rx="10" ry="7" fill="#FF9999" opacity="0.2"/>
        <ellipse cx="148" cy="180" rx="10" ry="7" fill="#FF9999" opacity="0.2"/>
      </SVGWrapper>
    </div>
  )
}

function CoatFlat({ c, s, animate }: { c: string; s: string; animate: boolean }) {
  return (
    <div data-model-root style={{ width: "100%", height: "100%", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <style>{BASE_STYLES}</style>
      <Shadow/>
      <SVGWrapper viewBox="0 0 210 315" animClass="sway" animate={animate}>
        {/* LEFT SLEEVE */}
        <g style={{ transformOrigin: "74px 180px", animation: animate ? "sleeveWave 2.5s ease-in-out infinite" : "none" }}>
          <path d="M58 100 C36 110 14 126 4 152 C-4 172 -2 198 8 216 C16 230 32 238 48 232 C62 226 70 208 72 188 C74 168 74 138 74 106Z" fill={c} filter="url(#fabricFine)"/>
          <path d="M58 100 C38 112 18 130 6 156 C-2 174 -2 196 6 212" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="3.5" strokeLinecap="round"/>
          <path d="M28 144 C22 164 20 186 22 206" fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth="3" strokeLinecap="round"/>
          <path d="M0 208 C-2 224 2 240 14 248 C28 256 50 252 62 240 C72 228 76 212 72 200" fill={s}/>
          <path d="M2 220 C20 214 44 220 64 212" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M4 232 C20 226 44 232 62 224" fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="1.8" strokeLinecap="round"/>
        </g>
        {/* RIGHT SLEEVE */}
        <g style={{ transformOrigin: "136px 180px", animation: animate ? "sleeveWave 2.5s ease-in-out infinite 0.2s" : "none" }}>
          <path d="M152 100 C174 110 196 126 206 152 C214 172 212 198 202 216 C194 230 178 238 162 232 C148 226 140 208 138 188 C136 168 136 138 136 106Z" fill={c} filter="url(#fabricFine)"/>
          <path d="M152 100 C172 112 192 130 204 156 C212 174 212 196 204 212" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="3.5" strokeLinecap="round"/>
          <path d="M182 144 C188 164 190 186 188 206" fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth="3" strokeLinecap="round"/>
          <path d="M210 208 C212 224 208 240 196 248 C182 256 160 252 148 240 C138 228 134 212 138 200" fill={s}/>
          <path d="M208 220 C190 214 166 220 146 212" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M206 232 C190 226 166 232 148 224" fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="1.8" strokeLinecap="round"/>
        </g>
        {/* BODY PANELS */}
        <path d="M58 100 C56 132 52 172 50 210 C48 244 48 272 50 292 C52 304 56 308 60 308 L107 308 L107 80 L84 70Z" fill={c} filter="url(#fabricFine)"/>
        <path d="M152 100 C154 132 158 172 160 210 C162 244 162 272 160 292 C158 304 154 308 150 308 L103 308 L103 80 L126 70Z" fill={c} filter="url(#fabricFine)"/>
        <path d="M66 116 C64 146 62 184 62 222" fill="none" stroke="rgba(255,255,255,0.13)" strokeWidth="5" strokeLinecap="round"/>
        <path d="M144 116 C146 146 148 184 148 222" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="4" strokeLinecap="round"/>
        {/* LAPELS */}
        <g style={{ transformOrigin: "84px 25px", animation: animate ? "collarLift 2.5s ease-in-out infinite" : "none" }}>
          <path d="M84 70 C76 50 64 26 54 4 C50 -6 50 -14 56 -18 C62 -22 72 -20 82 -10 C90 0 98 18 103 40 L107 80Z" fill={c} stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" filter="url(#fabricFine)"/>
          <path d="M82 66 C74 48 64 26 56 6 C52 -4 52 -12 56 -16" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2.5" strokeLinecap="round"/>
        </g>
        <g style={{ transformOrigin: "126px 25px", animation: animate ? "collarLift 2.5s ease-in-out infinite 0.1s" : "none" }}>
          <path d="M126 70 C134 50 146 26 156 4 C160 -6 160 -14 154 -18 C148 -22 138 -20 128 -10 C120 0 112 18 107 40 L103 80Z" fill={c} stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" filter="url(#fabricFine)"/>
        </g>
        {/* COLLAR */}
        <path d="M56 -18 C72 -28 88 -32 105 -33 C122 -32 138 -28 154 -18 C138 -8 122 -2 112 1 C110 2 108 3 105 3 C102 3 100 2 98 1 C88 -2 72 -8 56 -18Z" fill={c} stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"/>
        <path d="M60 -16 C74 -24 88 -28 105 -29" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="2" strokeLinecap="round"/>
        {/* BELT */}
        <rect x="50" y="148" width="110" height="16" rx="8" fill={s} opacity="0.78"/>
        <path d="M54 156 C80 152 130 156 156 152" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" strokeLinecap="round"/>
        <rect x="98" y="146" width="14" height="20" rx="4" fill={c} stroke="rgba(0,0,0,0.18)" strokeWidth="1.5"/>
        <rect x="101" y="149" width="8" height="14" rx="2" fill={s} opacity="0.85"/>
        <circle cx="105" cy="156" r="2.5" fill="rgba(255,255,255,0.4)"/>
        {/* BUTTONS */}
        {[100,130,160,190,222,260].map((y,i) => (
          <g key={i}>
            <circle cx="105" cy={y} r="7.5" fill={s} stroke="rgba(0,0,0,0.12)" strokeWidth="1"/>
            <circle cx="105" cy={y} r="3.2" fill="rgba(0,0,0,0.18)"/>
            <circle cx="103" cy={y-2} r="1.6" fill="rgba(255,255,255,0.55)"/>
          </g>
        ))}
        {/* POCKETS */}
        <rect x="56" y="188" width="42" height="38" rx="10" fill={s} opacity="0.72"/>
        <path d="M54 188 C54 178 60 174 68 174 L90 174 C98 174 104 178 104 188" fill={s} stroke="rgba(0,0,0,0.12)" strokeWidth="1.5" strokeLinejoin="round" opacity="0.72"/>
        <circle cx="79" cy="193" r="4.5" fill={c} stroke="rgba(0,0,0,0.12)" strokeWidth="1"/>
        <circle cx="79" cy="193" r="2" fill="rgba(255,255,255,0.4)"/>
        <path d="M60 204 C62 196 68 192 76 192" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" strokeLinecap="round"/>
        <rect x="112" y="188" width="42" height="38" rx="10" fill={s} opacity="0.72"/>
        <path d="M110 188 C110 178 116 174 124 174 L146 174 C154 174 160 178 160 188" fill={s} stroke="rgba(0,0,0,0.12)" strokeWidth="1.5" strokeLinejoin="round" opacity="0.72"/>
        <circle cx="131" cy="193" r="4.5" fill={c} stroke="rgba(0,0,0,0.12)" strokeWidth="1"/>
        <circle cx="131" cy="193" r="2" fill="rgba(255,255,255,0.4)"/>
        {/* HEM */}
        <rect x="50" y="298" width="110" height="12" rx="6" fill={s} opacity="0.65"/>
        <path d="M54 304 C80 300 130 304 156 300" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" strokeLinecap="round"/>
        <ellipse cx="66" cy="202" rx="12" ry="8" fill="#FF9999" opacity="0.22"/>
        <ellipse cx="144" cy="202" rx="12" ry="8" fill="#FF9999" opacity="0.22"/>
        <text style={{ animation: "twinkle 3s ease-in-out infinite" }} x="44" y="140" fontSize="10" fill={s} opacity="0.6">✦</text>
        <text style={{ animation: "twinkle 3s ease-in-out infinite 0.8s" }} x="158" y="136" fontSize="8" fill={s} opacity="0.6">✦</text>
      </SVGWrapper>
    </div>
  )
}

function TeeFlat({ c, s, animate }: { c: string; s: string; animate: boolean }) {
  return (
    <div data-model-root style={{ width: "100%", height: "100%", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <style>{BASE_STYLES}</style>
      <Shadow/>
      <SVGWrapper viewBox="0 0 200 225" animClass="float" animate={animate}>
        {/* LEFT SLEEVE */}
        <g style={{ transformOrigin: "66px 130px", animation: animate ? "sleeveWave 1.9s ease-in-out infinite" : "none" }}>
          <path d="M58 70 C38 78 18 92 6 112 C-4 128 -2 150 8 164 C16 174 30 178 44 172 C56 166 62 152 64 136 C66 120 66 98 66 74Z" fill={c} filter="url(#fabricFine)"/>
          <path d="M58 70 C40 80 22 96 8 116 C0 130 0 148 6 162" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3.5" strokeLinecap="round"/>
          <path d="M28 108 C22 124 20 140 22 154" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M2 156 C0 168 4 178 14 184 C26 190 44 186 52 176 C60 166 62 152 58 142" fill={s}/>
          <path d="M4 166 C18 162 36 166 52 160" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="1.8" strokeLinecap="round"/>
        </g>
        {/* RIGHT SLEEVE */}
        <g style={{ transformOrigin: "134px 130px", animation: animate ? "sleeveWave 1.9s ease-in-out infinite 0.2s" : "none" }}>
          <path d="M142 70 C162 78 182 92 194 112 C204 128 202 150 192 164 C184 174 170 178 156 172 C144 166 138 152 136 136 C134 120 134 98 134 74Z" fill={c} filter="url(#fabricFine)"/>
          <path d="M142 70 C160 80 178 96 192 116 C200 130 200 148 194 162" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3.5" strokeLinecap="round"/>
          <path d="M172 108 C178 124 180 140 178 154" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M198 156 C200 168 196 178 186 184 C174 190 156 186 148 176 C140 166 138 152 142 142" fill={s}/>
          <path d="M196 166 C182 162 164 166 148 160" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="1.8" strokeLinecap="round"/>
        </g>
        {/* BODY */}
        <rect x="52" y="64" width="96" height="152" rx="22" fill={c} filter="url(#fabricFine)"/>
        <path d="M62 80 C60 102 60 130 62 162" fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="5" strokeLinecap="round"/>
        <path d="M138 80 C140 102 140 130 138 162" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="3.5" strokeLinecap="round"/>
        <path d="M100 68 C100 100 100 140 100 208" fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="2"/>
        {/* NECKLINE */}
        <path d="M52 64 C62 47 76 36 92 31 C96 30 98 29 100 29 C102 29 104 30 108 31 C124 36 138 47 148 64 C128 74 114 78 100 78 C86 78 72 74 52 64Z" fill={c} stroke="rgba(255,255,255,0.16)" strokeWidth="1.5" filter="url(#fabricFine)"/>
        <path d="M58 64 C68 52 80 44 94 39 C97 38 99 37 100 37" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="2.5" strokeLinecap="round"/>
        {/* GRAPHIC */}
        <g style={{ transformOrigin: "100px 132px", animation: animate ? "pocketBulge 1.9s ease-in-out infinite" : "none" }}>
          <rect x="76" y="108" width="48" height="48" rx="12" fill="rgba(255,255,255,0.1)" stroke={s} strokeWidth="1.5" strokeOpacity="0.55"/>
          <circle cx="100" cy="132" r="14" fill="none" stroke={s} strokeWidth="1.5" strokeOpacity="0.6"/>
          <circle cx="100" cy="132" r="7" fill={s} opacity="0.35"/>
          <line x1="86" y1="118" x2="114" y2="146" stroke={s} strokeWidth="1" strokeOpacity="0.22"/>
          <line x1="114" y1="118" x2="86" y2="146" stroke={s} strokeWidth="1" strokeOpacity="0.22"/>
          <circle cx="100" cy="132" r="3" fill={s} opacity="0.6"/>
        </g>
        <line x1="52" y1="80" x2="52" y2="212" stroke="rgba(0,0,0,0.07)" strokeWidth="1.5"/>
        <line x1="148" y1="80" x2="148" y2="212" stroke="rgba(0,0,0,0.07)" strokeWidth="1.5"/>
        <rect x="52" y="206" width="96" height="10" rx="5" fill={s} opacity="0.72"/>
        <path d="M56 211 C80 207 120 211 144 207" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round"/>
        <ellipse cx="64" cy="154" rx="9" ry="6" fill="#FF9999" opacity="0.26"/>
        <ellipse cx="136" cy="154" rx="9" ry="6" fill="#FF9999" opacity="0.26"/>
        <text style={{ animation: "twinkle 2.5s ease-in-out infinite" }} x="38" y="106" fontSize="10" fill={s} opacity="0.65">✦</text>
        <text style={{ animation: "twinkle 2.5s ease-in-out infinite 0.6s" }} x="152" y="100" fontSize="8" fill={s} opacity="0.65">✦</text>
      </SVGWrapper>
    </div>
  )
}

function ShortsFlat({ c, s, animate }: { c: string; s: string; animate: boolean }) {
  return (
    <div data-model-root style={{ width: "100%", height: "100%", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <style>{BASE_STYLES}</style>
      <Shadow/>
      <SVGWrapper viewBox="0 0 200 215" animClass="float" animate={animate}>
        {/* WAISTBAND */}
        <path d="M38 16 C38 8 44 2 52 2 L148 2 C156 2 162 8 162 16 L162 44 L38 44Z" fill={s}/>
        <path d="M42 26 C76 22 124 22 158 26" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M42 36 C76 32 124 32 158 36" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeLinecap="round"/>
        {[56,80,100,120,144].map((x,i) => (
          <rect key={i} x={x-4} y="0" width="8" height="14" rx="3" fill={c} stroke="rgba(0,0,0,0.12)" strokeWidth="1"/>
        ))}
        <circle cx="100" cy="24" r="7.5" fill={c} stroke="rgba(0,0,0,0.18)" strokeWidth="1.5"/>
        <circle cx="100" cy="24" r="3.8" fill={s}/>
        <circle cx="98.5" cy="22.5" r="1.4" fill="rgba(255,255,255,0.55)"/>
        <path d="M46 46 C48 46 60 60 58 76 C57 88 50 94 42 92 L28 84Z" fill={s} opacity="0.7"/>
        <path d="M154 46 C152 46 140 60 142 76 C143 88 150 94 158 92 L172 84Z" fill={s} opacity="0.7"/>
        {/* LEFT LEG */}
        <path d="M38 42 C34 76 30 112 28 140 C26 160 26 178 28 190 C30 198 36 204 44 204 L98 204 L100 172 C100 140 100 100 100 64 L38 42Z" fill={c} filter="url(#fabricFine)"/>
        <path d="M38 48 C34 82 31 118 30 152" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="5" strokeLinecap="round"/>
        <path d="M72 44 C70 80 68 124 68 162" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="2.5"/>
        <rect x="28" y="192" width="72" height="14" rx="7" fill={s} opacity="0.82"/>
        <path d="M32 199 C52 195 72 199 98 195" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeLinecap="round"/>
        {/* RIGHT LEG */}
        <path d="M162 42 C166 76 170 112 172 140 C174 160 174 178 172 190 C170 198 164 204 156 204 L102 204 L100 172 C100 140 100 100 100 64 L162 42Z" fill={c} filter="url(#fabricFine)"/>
        <path d="M162 48 C166 82 169 118 170 152" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="5" strokeLinecap="round"/>
        <path d="M128 44 C130 80 132 124 132 162" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="2.5"/>
        <rect x="100" y="192" width="72" height="14" rx="7" fill={s} opacity="0.82"/>
        <path d="M104 199 C124 195 144 199 170 195" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeLinecap="round"/>
        <rect x="28" y="44" width="8" height="148" rx="4" fill={s} opacity="0.58"/>
        <rect x="164" y="44" width="8" height="148" rx="4" fill={s} opacity="0.58"/>
        <rect x="114" y="86" width="34" height="26" rx="8" fill={s} opacity="0.52"/>
        <text x="120" y="104" fontSize="14" fill="white" opacity="0.78">♡</text>
        <ellipse cx="44" cy="146" rx="10" ry="7" fill="#FF9999" opacity="0.22"/>
        <ellipse cx="156" cy="146" rx="10" ry="7" fill="#FF9999" opacity="0.22"/>
      </SVGWrapper>
    </div>
  )
}

function SkirtFlat({ c, s, animate }: { c: string; s: string; animate: boolean }) {
  return (
    <div data-model-root style={{ width: "100%", height: "100%", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <style>{BASE_STYLES}</style>
      <Shadow/>
      <SVGWrapper viewBox="0 0 210 295" animClass="sway" animate={animate}>
        {/* WAISTBAND */}
        <g style={{ transformOrigin: "105px 26px", animation: animate ? "collarLift 2.2s ease-in-out infinite" : "none" }}>
          <path d="M72 20 C72 11 78 5 87 5 L123 5 C132 5 138 11 138 20 L138 48 L72 48Z" fill={s}/>
          <path d="M76 30 C96 26 114 26 134 30" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M76 40 C96 36 114 36 134 40" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M88 22 C82 14 74 12 78 20 C80 24 92 22 105 22 C118 22 130 24 132 20 C136 12 128 14 122 22" fill={c} stroke="rgba(0,0,0,0.1)" strokeWidth="1"/>
          <circle cx="105" cy="22" r="6" fill="white" opacity="0.32"/>
          <circle cx="105" cy="22" r="3" fill={s}/>
        </g>
        {/* SKIRT */}
        <g style={{ transformOrigin: "105px 180px", animation: animate ? "hemFlutter 2.2s ease-in-out infinite" : "none" }}>
          <path d="M72 46 C58 84 40 134 20 186 C6 222 -2 252 -4 272 L214 272 C212 252 204 222 190 186 C170 134 152 84 138 46Z" fill={c} filter="url(#fabricFine)"/>
          <path d="M72 52 C60 92 44 144 26 198" fill="none" stroke="rgba(255,255,255,0.17)" strokeWidth="5" strokeLinecap="round"/>
          <path d="M138 52 C150 92 166 144 184 198" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="4" strokeLinecap="round"/>
          <path d="M105 50 C102 100 98 158 96 214 C94 244 94 260 96 270" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="2.5"/>
          <path d="M88 52 C82 102 74 160 68 212 C64 244 62 262 62 270" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="2"/>
          <path d="M122 52 C128 102 136 160 142 212 C146 244 148 262 148 270" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="2"/>
          <path d="M70 60 C60 110 48 168 36 220 C28 252 22 268 20 272" fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="1.5"/>
          <path d="M140 60 C150 110 162 168 174 220 C182 252 188 268 190 272" fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="1.5"/>
          {[
            [82,116],[110,128],[136,112],[68,160],[118,172],[148,156],
            [58,204],[104,210],[152,198],[42,244],[100,248],[158,238]
          ].map(([x,y],i) => (
            <circle key={i} cx={x} cy={y} r="5.5" fill={s} opacity={0.3+((i%3)*0.07)}/>
          ))}
          <text style={{ animation: "twinkle 2.8s ease-in-out infinite" }} x="56" y="152" fontSize="16" fill={s} fillOpacity="0.45">♡</text>
          <text style={{ animation: "twinkle 2.8s ease-in-out infinite 0.6s" }} x="144" y="148" fontSize="12" fill={s} fillOpacity="0.45">♡</text>
          <text style={{ animation: "twinkle 2.8s ease-in-out infinite 1.1s" }} x="94" y="238" fontSize="10" fill={s} fillOpacity="0.4">♡</text>
          <path d="M-4 266 C16 258 36 270 56 262 C76 254 96 268 116 260 C136 252 156 268 176 260 C194 252 208 264 214 265" fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M-4 272 C16 264 36 276 56 268 C76 260 96 274 116 266 C136 258 156 274 176 266 C194 258 208 270 214 271" fill={s} opacity="0.52" strokeLinecap="round"/>
        </g>
        <ellipse cx="72" cy="198" rx="13" ry="9" fill="#FF9999" opacity="0.2"/>
        <ellipse cx="138" cy="194" rx="13" ry="9" fill="#FF9999" opacity="0.2"/>
        <text style={{ animation: "twinkle 3s ease-in-out infinite" }} x="44" y="128" fontSize="12" fill={s} opacity="0.6">✦</text>
        <text style={{ animation: "twinkle 3s ease-in-out infinite 0.8s" }} x="156" y="122" fontSize="9" fill={s} opacity="0.6">✦</text>
      </SVGWrapper>
    </div>
  )
}

export default function ModelViewer({
  type = "hoodie",
  color = "#1a1a1a",
  secondaryColor = "#c8a96e",
  animate = false
}: ModelViewerProps) {
  const props = { c: color, s: secondaryColor, animate }

  const map: Record<string, React.ReactElement> = {
    hoodie: <HoodieFlat {...props}/>,
    dress:  <DressFlat  {...props}/>,
    jacket: <JacketFlat {...props}/>,
    pants:  <PantsFlat  {...props}/>,
    coat:   <CoatFlat   {...props}/>,
    shorts: <ShortsFlat {...props}/>,
    tee:    <TeeFlat    {...props}/>,
    skirt:  <SkirtFlat  {...props}/>,
  }

  return (
    <div style={{
      width: "100%",
      height: "100%",
      minHeight: "160px",
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      {map[type] ?? map["hoodie"]}
    </div>
  )
}
