interface ModelViewerProps {
  type?: "hoodie" | "dress" | "jacket" | "pants" | "coat" | "shorts" | "tee" | "skirt"
  color?: string
  secondaryColor?: string
  animate?: boolean
}

function HoodieSVG({ color, sec, animate }: { color: string; sec: string; animate: boolean }) {
  return (
    <svg viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full drop-shadow-2xl">
      <defs>
        <linearGradient id="hBody" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#000" stopOpacity="0.35"/>
          <stop offset="40%" stopColor="#000" stopOpacity="0"/>
          <stop offset="100%" stopColor="#000" stopOpacity="0.2"/>
        </linearGradient>
        <linearGradient id="hTop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.12"/>
          <stop offset="100%" stopColor="#000" stopOpacity="0.1"/>
        </linearGradient>
        <linearGradient id="hSleeve" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#000" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="#000" stopOpacity="0.05"/>
        </linearGradient>
        <filter id="shadow">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodOpacity="0.5"/>
        </filter>
      </defs>

      <style>{`
        @keyframes sway {
          0%, 100% { transform: rotate(0deg) translateY(0px); }
          25% { transform: rotate(0.8deg) translateY(-2px); }
          75% { transform: rotate(-0.8deg) translateY(2px); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes fabric {
          0%, 100% { d: path("M110 460 Q200 455 290 460 Q200 462 110 460Z"); }
          50% { d: path("M110 460 Q200 465 290 460 Q200 458 110 460Z"); }
        }
        .hoodie-group {
          transform-origin: 200px 250px;
          animation: ${animate ? "sway 3s ease-in-out infinite" : "float 6s ease-in-out infinite"};
        }
      `}</style>

      <g className="hoodie-group" filter="url(#shadow)">
        {/* Shadow on ground */}
        <ellipse cx="200" cy="488" rx="95" ry="10" fill="rgba(0,0,0,0.4)"/>

        {/* LEFT SLEEVE */}
        <path d="M112 178 C95 188 62 202 44 220 C30 235 28 268 32 295 C35 315 42 330 55 335 C68 340 82 332 90 320 C96 310 98 295 100 278 C103 258 108 238 115 220 Z"
          fill={color} stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
        <path d="M112 178 C95 188 62 202 44 220 C30 235 28 268 32 295 C35 315 42 330 55 335 C68 340 82 332 90 320 C96 310 98 295 100 278 C103 258 108 238 115 220 Z"
          fill="url(#hSleeve)"/>
        {/* Left cuff */}
        <path d="M32 288 C28 300 28 318 33 330 C40 342 58 342 70 335 C80 328 88 314 90 300"
          fill={color} stroke="rgba(255,255,255,0.1)" strokeWidth="1.5"/>

        {/* RIGHT SLEEVE */}
        <path d="M288 178 C305 188 338 202 356 220 C370 235 372 268 368 295 C365 315 358 330 345 335 C332 340 318 332 310 320 C304 310 302 295 300 278 C297 258 292 238 285 220 Z"
          fill={color} stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
        <path d="M288 178 C305 188 338 202 356 220 C370 235 372 268 368 295 C365 315 358 330 345 335 C332 340 318 332 310 320 C304 310 302 295 300 278 C297 258 292 238 285 220 Z"
          fill="url(#hSleeve)" style={{transform: "scaleX(-1)", transformOrigin: "200px 0"}}/>
        {/* Right cuff */}
        <path d="M368 288 C372 300 372 318 367 330 C360 342 342 342 330 335 C320 328 312 314 310 300"
          fill={color} stroke="rgba(255,255,255,0.1)" strokeWidth="1.5"/>

        {/* MAIN BODY */}
        <path d="M110 175 C108 200 104 240 102 280 C100 320 100 360 102 400 C104 430 108 455 112 468 L288 468 C292 455 296 430 298 400 C300 360 300 320 298 280 C296 240 292 200 290 175 L260 162 C240 172 220 176 200 176 C180 176 160 172 140 162 Z"
          fill={color} stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
        <path d="M110 175 C108 200 104 240 102 280 C100 320 100 360 102 400 C104 430 108 455 112 468 L288 468 C292 455 296 430 298 400 C300 360 300 320 298 280 C296 240 292 200 290 175 L260 162 C240 172 220 176 200 176 C180 176 160 172 140 162 Z"
          fill="url(#hBody)"/>
        {/* Body highlight */}
        <path d="M110 175 C108 200 104 240 102 290 L118 290 C118 245 120 205 122 178 Z"
          fill="rgba(255,255,255,0.06)"/>

        {/* HOOD */}
        <path d="M140 162 C135 140 130 112 132 88 C134 65 148 46 165 38 C178 32 192 30 200 30 C208 30 222 32 235 38 C252 46 266 65 268 88 C270 112 265 140 260 162 C240 172 220 176 200 176 C180 176 160 172 140 162 Z"
          fill={color} stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
        <path d="M140 162 C135 140 130 112 132 88 C134 65 148 46 165 38 C178 32 192 30 200 30 C208 30 222 32 235 38 C252 46 266 65 268 88 C270 112 265 140 260 162 C240 172 220 176 200 176 C180 176 160 172 140 162 Z"
          fill="url(#hTop)"/>
        {/* Hood opening */}
        <path d="M155 155 C158 125 168 100 180 85 C188 75 196 70 200 70 C204 70 212 75 220 85 C232 100 242 125 245 155 C235 162 218 168 200 168 C182 168 165 162 155 155 Z"
          fill="#080808"/>
        {/* Hood inner shadow */}
        <path d="M162 158 C164 134 172 110 182 96 C189 86 196 81 200 81 C204 81 211 86 218 96 C228 110 236 134 238 158"
          fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>

        {/* POCKET */}
        <path d="M130 300 C130 290 135 285 145 284 L255 284 C265 285 270 290 270 300 L270 350 C270 360 265 365 255 366 L145 366 C135 365 130 360 130 350 Z"
          fill="rgba(0,0,0,0.2)" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
        {/* Pocket divider */}
        <line x1="200" y1="284" x2="200" y2="366" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
        {/* Pocket hands cutout */}
        <path d="M138 310 C138 304 142 300 148 300 L190 300" stroke="rgba(0,0,0,0.3)" strokeWidth="2" fill="none"/>
        <path d="M262 310 C262 304 258 300 252 300 L210 300" stroke="rgba(0,0,0,0.3)" strokeWidth="2" fill="none"/>

        {/* DRAWSTRINGS */}
        <path d="M182 162 C180 175 178 192 176 215 C174 232 173 248 174 258"
          stroke={sec} strokeWidth="2" strokeOpacity="0.65" fill="none" strokeDasharray="none"/>
        <path d="M218 162 C220 175 222 192 224 215 C226 232 227 248 226 258"
          stroke={sec} strokeWidth="2" strokeOpacity="0.65" fill="none"/>
        {/* Drawstring tips */}
        <ellipse cx="174" cy="262" rx="4" ry="6" fill={sec} fillOpacity="0.75"/>
        <ellipse cx="226" cy="262" rx="4" ry="6" fill={sec} fillOpacity="0.75"/>

        {/* HEM */}
        <path d="M112 460 Q200 456 288 460 Q200 464 112 460 Z"
          fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5"/>
        <rect x="112" y="462" width="176" height="6" rx="0" fill="rgba(255,255,255,0.04)"/>

        {/* RIBBING bottom */}
        {[468,472,476].map((y,i) => (
          <line key={i} x1="112" y1={y} x2="288" y2={y} stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
        ))}

        {/* SEAM center */}
        <line x1="200" y1="176" x2="200" y2="468" stroke="rgba(0,0,0,0.12)" strokeWidth="1"/>

        {/* ACCENT stripe on sleeves */}
        <path d="M38 268 C36 260 36 252 38 246" stroke={sec} strokeWidth="3" strokeOpacity="0.5" strokeLinecap="round"/>
        <path d="M362 268 C364 260 364 252 362 246" stroke={sec} strokeWidth="3" strokeOpacity="0.5" strokeLinecap="round"/>
      </g>
    </svg>
  )
}

function DressSVG({ color, sec, animate }: { color: string; sec: string; animate: boolean }) {
  return (
    <svg viewBox="0 0 400 520" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl">
      <defs>
        <linearGradient id="dBody" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#000" stopOpacity="0.3"/>
          <stop offset="50%" stopColor="#fff" stopOpacity="0.04"/>
          <stop offset="100%" stopColor="#000" stopOpacity="0.2"/>
        </linearGradient>
        <linearGradient id="dSkirt" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#000" stopOpacity="0.1"/>
          <stop offset="100%" stopColor="#000" stopOpacity="0.3"/>
        </linearGradient>
        <filter id="dshadow">
          <feDropShadow dx="0" dy="10" stdDeviation="14" floodOpacity="0.45"/>
        </filter>
      </defs>
      <style>{`
        @keyframes dressSway {
          0%, 100% { transform: rotate(0deg); }
          30% { transform: rotate(0.6deg); }
          70% { transform: rotate(-0.6deg); }
        }
        @keyframes skirtWave {
          0%, 100% { transform: skewX(0deg) translateY(0); }
          40% { transform: skewX(0.8deg) translateY(-3px); }
          80% { transform: skewX(-0.5deg) translateY(2px); }
        }
        .dress-group {
          transform-origin: 200px 260px;
          animation: ${animate ? "dressSway 2.5s ease-in-out infinite" : "dressSway 7s ease-in-out infinite"};
        }
        .skirt-part {
          transform-origin: 200px 280px;
          animation: ${animate ? "skirtWave 2.5s ease-in-out infinite" : "skirtWave 7s ease-in-out infinite"};
        }
      `}</style>

      <g className="dress-group" filter="url(#dshadow)">
        <ellipse cx="200" cy="508" rx="110" ry="10" fill="rgba(0,0,0,0.35)"/>

        {/* BODICE */}
        <path d="M145 120 C140 130 136 150 134 170 C132 190 132 210 134 230 C136 248 140 262 146 272 L254 272 C260 262 264 248 266 230 C268 210 268 190 266 170 C264 150 260 130 255 120 L240 112 C228 118 214 122 200 122 C186 122 172 118 160 112 Z"
          fill={color} stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>
        <path d="M145 120 C140 130 136 150 134 170 C132 190 132 210 134 230 C136 248 140 262 146 272 L254 272 C260 262 264 248 266 230 C268 210 268 190 266 170 C264 150 260 130 255 120 L240 112 C228 118 214 122 200 122 C186 122 172 118 160 112 Z"
          fill="url(#dBody)"/>

        {/* NECKLINE */}
        <path d="M160 112 C168 96 182 86 200 84 C218 86 232 96 240 112"
          fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
        <path d="M164 114 C172 100 184 91 200 89 C216 91 228 100 236 114"
          fill={color} stroke="rgba(255,255,255,0.08)" strokeWidth="0.5"/>

        {/* LEFT STRAP */}
        <path d="M160 112 C158 100 158 85 160 72 C162 62 166 55 170 52 L178 50 C182 52 184 58 184 68 C184 80 182 96 180 112"
          fill={color} stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>
        <path d="M160 112 C158 100 158 85 160 72 C162 62 166 55 170 52 L178 50 C182 52 184 58 184 68 C184 80 182 96 180 112"
          fill="url(#dBody)"/>

        {/* RIGHT STRAP */}
        <path d="M240 112 C242 100 242 85 240 72 C238 62 234 55 230 52 L222 50 C218 52 216 58 216 68 C216 80 218 96 220 112"
          fill={color} stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>
        <path d="M240 112 C242 100 242 85 240 72 C238 62 234 55 230 52 L222 50 C218 52 216 58 216 68 C216 80 218 96 220 112"
          fill="url(#dBody)"/>

        {/* WAIST SEAM */}
        <path d="M134 268 Q200 274 266 268" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" fill="none"/>
        <path d="M136 272 Q200 278 264 272" stroke={sec} strokeWidth="1" strokeOpacity="0.35" fill="none"/>

        {/* SKIRT */}
        <g className="skirt-part">
          <path d="M146 272 C138 300 125 340 112 380 C98 422 82 460 68 496 L332 496 C318 460 302 422 288 380 C275 340 262 300 254 272 Z"
            fill={color} stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
          <path d="M146 272 C138 300 125 340 112 380 C98 422 82 460 68 496 L332 496 C318 460 302 422 288 380 C275 340 262 300 254 272 Z"
            fill="url(#dSkirt)"/>

          {/* Skirt folds */}
          <path d="M200 272 C196 320 192 370 188 420 C186 450 185 475 186 496"
            stroke="rgba(0,0,0,0.2)" strokeWidth="2" fill="none"/>
          <path d="M200 272 C204 320 208 370 212 420 C214 450 215 475 214 496"
            stroke="rgba(0,0,0,0.2)" strokeWidth="2" fill="none"/>
          <path d="M168 276 C160 324 150 374 140 420 C134 450 130 474 130 496"
            stroke="rgba(0,0,0,0.12)" strokeWidth="1.5" fill="none"/>
          <path d="M232 276 C240 324 250 374 260 420 C266 450 270 474 270 496"
            stroke="rgba(0,0,0,0.12)" strokeWidth="1.5" fill="none"/>

          {/* Skirt highlight */}
          <path d="M146 272 C140 305 130 348 118 392 L130 396 C142 352 152 308 157 275 Z"
            fill="rgba(255,255,255,0.05)"/>

          {/* HEM */}
          <path d="M68 492 Q200 486 332 492 Q200 498 68 492 Z"
            fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>
          {/* Hem accent */}
          <path d="M70 496 Q200 490 330 496" stroke={sec} strokeWidth="1.5" strokeOpacity="0.3" fill="none"/>
        </g>

        {/* Bodice highlight */}
        <path d="M145 125 C140 145 136 168 134 195 L148 195 C148 170 150 148 154 128 Z"
          fill="rgba(255,255,255,0.07)"/>

        {/* Waist bow */}
        <path d="M185 272 C188 265 196 262 200 264 C204 262 212 265 215 272"
          stroke={sec} strokeWidth="2" strokeOpacity="0.6" fill="none" strokeLinecap="round"/>
        <circle cx="200" cy="272" r="3" fill={sec} fillOpacity="0.6"/>
      </g>
    </svg>
  )
}

function JacketSVG({ color, sec, animate }: { color: string; sec: string; animate: boolean }) {
  return (
    <svg viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl">
      <defs>
        <linearGradient id="jBody" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#000" stopOpacity="0.35"/>
          <stop offset="45%" stopColor="#fff" stopOpacity="0.04"/>
          <stop offset="100%" stopColor="#000" stopOpacity="0.25"/>
        </linearGradient>
        <linearGradient id="jLapel" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.1"/>
          <stop offset="100%" stopColor="#000" stopOpacity="0.15"/>
        </linearGradient>
        <filter id="jshadow">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodOpacity="0.5"/>
        </filter>
      </defs>
      <style>{`
        @keyframes jacketFloat {
          0%,100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-6px) rotate(0.3deg); }
        }
        .jacket-group {
          transform-origin: 200px 250px;
          animation: ${animate ? "jacketFloat 2s ease-in-out infinite" : "jacketFloat 5s ease-in-out infinite"};
        }
      `}</style>

      <g className="jacket-group" filter="url(#jshadow)">
        <ellipse cx="200" cy="486" rx="100" ry="10" fill="rgba(0,0,0,0.4)"/>

        {/* LEFT SLEEVE */}
        <path d="M118 182 C100 196 70 214 50 236 C34 254 30 282 34 308 C37 328 46 344 60 350 C74 356 90 346 98 332 C105 320 108 302 110 282 C113 258 116 232 122 210 Z"
          fill={color} stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
        <path d="M118 182 C100 196 70 214 50 236 C34 254 30 282 34 308 C37 328 46 344 60 350 C74 356 90 346 98 332 C105 320 108 302 110 282 C113 258 116 232 122 210 Z"
          fill="url(#jBody)"/>
        {/* Left cuff ribbing */}
        {[336,342,348].map((y,i) => (
          <path key={i} d={`M34 ${y+i*2} C50 ${y+i*2-2} 70 ${y+i*2+2} 88 ${y+i*2}`}
            stroke="rgba(255,255,255,0.06)" strokeWidth="1" fill="none"/>
        ))}

        {/* RIGHT SLEEVE */}
        <path d="M282 182 C300 196 330 214 350 236 C366 254 370 282 366 308 C363 328 354 344 340 350 C326 356 310 346 302 332 C295 320 292 302 290 282 C287 258 284 232 278 210 Z"
          fill={color} stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
        <path d="M282 282 C285 258 284 232 278 210"
          fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
        {[336,342,348].map((y,i) => (
          <path key={i} d={`M366 ${y+i*2} C350 ${y+i*2-2} 330 ${y+i*2+2} 312 ${y+i*2}`}
            stroke="rgba(255,255,255,0.06)" strokeWidth="1" fill="none"/>
        ))}

        {/* LEFT PANEL */}
        <path d="M118 182 C115 210 112 248 110 286 C108 322 108 360 110 396 C112 422 116 448 120 468 L200 468 L200 168 L170 158 Z"
          fill={color} stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
        <path d="M118 182 C115 210 112 248 110 286 C108 322 108 360 110 396 C112 422 116 448 120 468 L200 468 L200 168 L170 158 Z"
          fill="url(#jBody)"/>

        {/* RIGHT PANEL */}
        <path d="M282 182 C285 210 288 248 290 286 C292 322 292 360 290 396 C288 422 284 448 280 468 L200 468 L200 168 L230 158 Z"
          fill={color} stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>

        {/* LEFT LAPEL */}
        <path d="M170 158 C162 145 148 122 138 98 C134 88 133 80 136 74 C140 68 148 68 155 72 C164 78 172 90 178 105 L200 168 Z"
          fill={color} stroke="rgba(255,255,255,0.09)" strokeWidth="1"/>
        <path d="M170 158 C162 145 148 122 138 98 C134 88 133 80 136 74 C140 68 148 68 155 72 C164 78 172 90 178 105 L200 168 Z"
          fill="url(#jLapel)"/>

        {/* RIGHT LAPEL */}
        <path d="M230 158 C238 145 252 122 262 98 C266 88 267 80 264 74 C260 68 252 68 245 72 C236 78 228 90 222 105 L200 168 Z"
          fill={color} stroke="rgba(255,255,255,0.09)" strokeWidth="1"/>
        <path d="M230 158 C238 145 252 122 262 98 C266 88 267 80 264 74 C260 68 252 68 245 72 C236 78 228 90 222 105 L200 168 Z"
          fill="url(#jLapel)"/>

        {/* COLLAR */}
        <path d="M155 72 C165 60 180 52 200 50 C220 52 235 60 245 72 C236 78 222 86 210 94 C206 96 203 98 200 98 C197 98 194 96 190 94 C178 86 164 78 155 72 Z"
          fill={color} stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>

        {/* ZIPPER */}
        <line x1="200" y1="168" x2="200" y2="468" stroke={sec} strokeWidth="2" strokeOpacity="0.4"/>
        {Array.from({length:18}).map((_,i) => (
          <rect key={i} x="196" y={175+i*16} width="8" height="5" rx="1"
            fill={sec} fillOpacity="0.35"/>
        ))}

        {/* LEFT POCKET */}
        <path d="M118 282 L168 282 L168 328 L118 328 Z"
          fill="rgba(0,0,0,0.2)" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
        <path d="M118 282 L168 282 L168 290 L118 290 Z" fill="rgba(0,0,0,0.15)"/>
        {/* Pocket button */}
        <circle cx="143" cy="286" r="3" fill={sec} fillOpacity="0.6"/>

        {/* RIGHT POCKET */}
        <path d="M232 282 L282 282 L282 328 L232 328 Z"
          fill="rgba(0,0,0,0.2)" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
        <path d="M232 282 L282 282 L282 290 L232 290 Z" fill="rgba(0,0,0,0.15)"/>
        <circle cx="257" cy="286" r="3" fill={sec} fillOpacity="0.6"/>

        {/* Lapel buttons */}
        <circle cx="186" cy="192" r="5" fill={sec} fillOpacity="0.7" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5"/>
        <circle cx="186" cy="192" r="2" fill="rgba(0,0,0,0.4)"/>
        <circle cx="214" cy="192" r="5" fill={sec} fillOpacity="0.7" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5"/>
        <circle cx="214" cy="192" r="2" fill="rgba(0,0,0,0.4)"/>

        {/* HEM */}
        <rect x="110" y="462" width="180" height="6" rx="0" fill="rgba(255,255,255,0.04)"/>
      </g>
    </svg>
  )
}

function PantsSVG({ color, sec, animate }: { color: string; sec: string; animate: boolean }) {
  return (
    <svg viewBox="0 0 400 520" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl">
      <defs>
        <linearGradient id="pBody" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#000" stopOpacity="0.3"/>
          <stop offset="50%" stopColor="#fff" stopOpacity="0.04"/>
          <stop offset="100%" stopColor="#000" stopOpacity="0.2"/>
        </linearGradient>
        <filter id="pshadow">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodOpacity="0.45"/>
        </filter>
      </defs>
      <style>{`
        @keyframes pantsFloat {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .pants-group {
          animation: ${animate ? "pantsFloat 1.8s ease-in-out infinite" : "pantsFloat 5s ease-in-out infinite"};
        }
      `}</style>

      <g className="pants-group" filter="url(#pshadow)">
        <ellipse cx="200" cy="510" rx="95" ry="8" fill="rgba(0,0,0,0.35)"/>

        {/* WAISTBAND */}
        <path d="M108 52 L292 52 L296 90 L104 90 Z"
          fill={color} stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
        <path d="M108 52 L292 52 L296 90 L104 90 Z" fill="url(#pBody)"/>
        {/* Waistband detail lines */}
        <line x1="106" y1="62" x2="294" y2="62" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
        <line x1="105" y1="70" x2="295" y2="70" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
        <line x1="104" y1="78" x2="296" y2="78" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>

        {/* Belt loops */}
        {[118,148,175,200,225,252,282].map((x,i) => (
          <rect key={i} x={x-4} y="48" width="8" height="18" rx="1"
            fill="rgba(0,0,0,0.4)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5"/>
        ))}

        {/* Waist button + fly */}
        <circle cx="200" cy="71" r="6" fill={sec} fillOpacity="0.75" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5"/>
        <circle cx="200" cy="71" r="2.5" fill="rgba(0,0,0,0.4)"/>
        <path d="M200 80 L200 108" stroke={sec} strokeWidth="2" strokeOpacity="0.5"/>
        {Array.from({length:5}).map((_,i) => (
          <line key={i} x1="197" y1={83+i*5} x2="203" y2={83+i*5}
            stroke={sec} strokeWidth="1" strokeOpacity="0.35"/>
        ))}

        {/* LEFT POCKET */}
        <path d="M114 95 C116 95 128 108 130 128 C131 140 126 148 118 146 L106 140 Z"
          fill="rgba(0,0,0,0.22)" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
        {/* Right pocket */}
        <path d="M286 95 C284 95 272 108 270 128 C269 140 274 148 282 146 L294 140 Z"
          fill="rgba(0,0,0,0.22)" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>

        {/* LEFT LEG */}
        <path d="M104 88 C100 140 96 200 94 260 C92 310 92 358 94 400 C96 428 100 456 104 476 C106 490 110 500 114 504 L198 504 C200 490 200 440 200 380 C200 310 200 240 200 186 L104 88 Z"
          fill={color} stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
        <path d="M104 88 C100 140 96 200 94 260 C92 310 92 358 94 400 C96 428 100 456 104 476 C106 490 110 500 114 504 L198 504 C200 490 200 440 200 380 C200 310 200 240 200 186 L104 88 Z"
          fill="url(#pBody)"/>

        {/* RIGHT LEG */}
        <path d="M296 88 C300 140 304 200 306 260 C308 310 308 358 306 400 C304 428 300 456 296 476 C294 490 290 500 286 504 L202 504 C200 490 200 440 200 380 C200 310 200 240 200 186 L296 88 Z"
          fill={color} stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>

        {/* Leg crease left */}
        <path d="M152 92 C148 160 145 230 144 300 C143 360 144 420 146 480"
          stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" fill="none"/>
        {/* Leg crease right */}
        <path d="M248 92 C252 160 255 230 256 300 C257 360 256 420 254 480"
          stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" fill="none"/>

        {/* Left highlight */}
        <path d="M104 90 C100 145 96 205 94 268 L108 268 C109 210 112 150 116 94 Z"
          fill="rgba(255,255,255,0.05)"/>

        {/* CUFFS */}
        <path d="M104 494 C104 490 108 488 114 488 L196 488 C199 488 200 490 200 494 L200 504 L114 504 Z"
          fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>
        <path d="M296 494 C296 490 292 488 286 488 L204 488 C201 488 200 490 200 494 L200 504 L286 504 Z"
          fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>
        {/* Cuff stitching */}
        <line x1="106" y1="498" x2="198" y2="498" stroke={sec} strokeWidth="1" strokeOpacity="0.25" strokeDasharray="4 3"/>
        <line x1="202" y1="498" x2="294" y2="498" stroke={sec} strokeWidth="1" strokeOpacity="0.25" strokeDasharray="4 3"/>
      </g>
    </svg>
  )
}

function CoatSVG({ color, sec, animate }: { color: string; sec: string; animate: boolean }) {
  return (
    <svg viewBox="0 0 400 560" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl">
      <defs>
        <linearGradient id="cBody" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#000" stopOpacity="0.35"/>
          <stop offset="45%" stopColor="#fff" stopOpacity="0.05"/>
          <stop offset="100%" stopColor="#000" stopOpacity="0.25"/>
        </linearGradient>
        <filter id="cshadow">
          <feDropShadow dx="0" dy="10" stdDeviation="14" floodOpacity="0.5"/>
        </filter>
      </defs>
      <style>{`
        @keyframes coatSway {
          0%,100% { transform: rotate(0deg) translateY(0); }
          35% { transform: rotate(0.5deg) translateY(-4px); }
          75% { transform: rotate(-0.4deg) translateY(3px); }
        }
        .coat-group {
          transform-origin: 200px 280px;
          animation: ${animate ? "coatSway 2.8s ease-in-out infinite" : "coatSway 8s ease-in-out infinite"};
        }
      `}</style>

      <g className="coat-group" filter="url(#cshadow)">
        <ellipse cx="200" cy="548" rx="110" ry="10" fill="rgba(0,0,0,0.4)"/>

        {/* LEFT SLEEVE - long */}
        <path d="M120 185 C100 200 68 220 48 245 C30 268 26 300 30 330 C34 355 44 372 58 378 C74 384 92 372 100 356 C108 342 110 320 112 296 C115 268 118 238 124 212 Z"
          fill={color} stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
        <path d="M120 185 C100 200 68 220 48 245 C30 268 26 300 30 330 C34 355 44 372 58 378 C74 384 92 372 100 356 C108 342 110 320 112 296 C115 268 118 238 124 212 Z"
          fill="url(#cBody)"/>
        {[358,364,370,376].map((y,i) => (
          <path key={i} d={`M30 ${y} C48 ${y-2} 68 ${y+2} 86 ${y}`} stroke="rgba(255,255,255,0.05)" strokeWidth="1" fill="none"/>
        ))}

        {/* RIGHT SLEEVE - long */}
        <path d="M280 185 C300 200 332 220 352 245 C370 268 374 300 370 330 C366 355 356 372 342 378 C326 384 308 372 300 356 C292 342 290 320 288 296 C285 268 282 238 276 212 Z"
          fill={color} stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
        {[358,364,370,376].map((y,i) => (
          <path key={i} d={`M370 ${y} C352 ${y-2} 332 ${y+2} 314 ${y}`} stroke="rgba(255,255,255,0.05)" strokeWidth="1" fill="none"/>
        ))}

        {/* LEFT PANEL */}
        <path d="M120 185 C116 220 112 265 110 308 C108 350 108 392 110 432 C112 462 116 492 120 520 L200 520 L200 172 L168 160 Z"
          fill={color} stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
        <path d="M120 185 C116 220 112 265 110 308 C108 350 108 392 110 432 C112 462 116 492 120 520 L200 520 L200 172 L168 160 Z"
          fill="url(#cBody)"/>

        {/* RIGHT PANEL */}
        <path d="M280 185 C284 220 288 265 290 308 C292 350 292 392 290 432 C288 462 284 492 280 520 L200 520 L200 172 L232 160 Z"
          fill={color} stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>

        {/* LEFT LAPEL - wide */}
        <path d="M168 160 C158 145 142 118 130 90 C124 76 122 65 126 58 C130 51 140 50 150 55 C162 62 172 78 180 98 L200 172 Z"
          fill={color} stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
        <path d="M168 160 C158 145 142 118 130 90 C124 76 122 65 126 58 C130 51 140 50 150 55 C162 62 172 78 180 98 L200 172 Z"
          fill="rgba(255,255,255,0.05)"/>

        {/* RIGHT LAPEL */}
        <path d="M232 160 C242 145 258 118 270 90 C276 76 278 65 274 58 C270 51 260 50 250 55 C238 62 228 78 220 98 L200 172 Z"
          fill={color} stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
        <path d="M232 160 C242 145 258 118 270 90 C276 76 278 65 274 58 C270 51 260 50 250 55 C238 62 228 78 220 98 L200 172 Z"
          fill="rgba(255,255,255,0.05)"/>

        {/* COLLAR */}
        <path d="M150 55 C162 44 180 38 200 36 C220 38 238 44 250 55 C238 62 222 70 208 76 C205 77 202 78 200 78 C198 78 195 77 192 76 C178 70 162 62 150 55 Z"
          fill={color} stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>

        {/* BUTTONS */}
        {[195,235,275,315,355,395,435,475].map((y,i) => (
          <g key={i}>
            <circle cx="200" cy={y} r="7" fill={sec} fillOpacity="0.72" stroke="rgba(255,255,255,0.18)" strokeWidth="0.5"/>
            <circle cx="200" cy={y} r="3" fill="rgba(0,0,0,0.35)"/>
            <line x1="197" y1={y} x2="203" y2={y} stroke="rgba(255,255,255,0.2)" strokeWidth="0.5"/>
            <line x1="200" y1={y-3} x2="200" y2={y+3} stroke="rgba(255,255,255,0.2)" strokeWidth="0.5"/>
          </g>
        ))}

        {/* LEFT POCKET with flap */}
        <path d="M116 300 L170 300 L170 348 L116 348 Z"
          fill="rgba(0,0,0,0.2)" stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>
        <path d="M114 298 L172 298 L172 310 L114 310 Z"
          fill={color} stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
        <circle cx="143" cy="304" r="4" fill={sec} fillOpacity="0.6"/>

        {/* RIGHT POCKET with flap */}
        <path d="M230 300 L284 300 L284 348 L230 348 Z"
          fill="rgba(0,0,0,0.2)" stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>
        <path d="M228 298 L286 298 L286 310 L228 310 Z"
          fill={color} stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
        <circle cx="257" cy="304" r="4" fill={sec} fillOpacity="0.6"/>

        {/* Chest pocket */}
        <path d="M174 210 L196 210 L196 234 L174 234 Z"
          fill="rgba(0,0,0,0.18)" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>

        {/* BELT */}
        <path d="M110 258 L290 258 L290 272 L110 272 Z"
          fill="rgba(0,0,0,0.25)" stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>
        <rect x="193" y="258" width="14" height="14" rx="1"
          fill={sec} fillOpacity="0.6" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5"/>

        {/* HEM */}
        <rect x="110" y="514" width="180" height="6" rx="0" fill="rgba(255,255,255,0.04)"/>
        <path d="M112 520 Q200 516 288 520" stroke={sec} strokeWidth="1" strokeOpacity="0.2" fill="none"/>
      </g>
    </svg>
  )
}

function TeeSVG({ color, sec, animate }: { color: string; sec: string; animate: boolean }) {
  return (
    <svg viewBox="0 0 400 440" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl">
      <defs>
        <linearGradient id="tBody" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#000" stopOpacity="0.3"/>
          <stop offset="45%" stopColor="#fff" stopOpacity="0.05"/>
          <stop offset="100%" stopColor="#000" stopOpacity="0.2"/>
        </linearGradient>
        <filter id="tshadow">
          <feDropShadow dx="0" dy="8" stdDeviation="10" floodOpacity="0.45"/>
        </filter>
      </defs>
      <style>{`
        @keyframes teeFloat {
          0%,100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-7px) rotate(0.2deg); }
        }
        .tee-group {
          transform-origin: 200px 220px;
          animation: ${animate ? "teeFloat 2s ease-in-out infinite" : "teeFloat 5s ease-in-out infinite"};
        }
      `}</style>

      <g className="tee-group" filter="url(#tshadow)">
        <ellipse cx="200" cy="428" rx="88" ry="9" fill="rgba(0,0,0,0.38)"/>

        {/* LEFT SLEEVE */}
        <path d="M120 142 C100 152 72 166 54 184 C40 198 36 218 40 238 C43 252 52 260 64 258 C76 256 86 244 92 228 C98 214 102 196 108 178 Z"
          fill={color} stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
        <path d="M120 142 C100 152 72 166 54 184 C40 198 36 218 40 238 C43 252 52 260 64 258 C76 256 86 244 92 228 C98 214 102 196 108 178 Z"
          fill="url(#tBody)"/>
        {/* Left sleeve hem */}
        <path d="M40 232 C52 236 68 238 84 234" stroke="rgba(255,255,255,0.07)" strokeWidth="1.5" fill="none"/>

        {/* RIGHT SLEEVE */}
        <path d="M280 142 C300 152 328 166 346 184 C360 198 364 218 360 238 C357 252 348 260 336 258 C324 256 314 244 308 228 C302 214 298 196 292 178 Z"
          fill={color} stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
        <path d="M360 232 C348 236 332 238 316 234" stroke="rgba(255,255,255,0.07)" strokeWidth="1.5" fill="none"/>

        {/* BODY */}
        <path d="M118 138 C115 168 112 208 110 248 C108 285 108 320 110 355 C112 378 116 400 120 416 L280 416 C284 400 288 378 290 355 C292 320 292 285 290 248 C288 208 285 168 282 138 C262 148 232 155 200 155 C168 155 138 148 118 138 Z"
          fill={color} stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
        <path d="M118 138 C115 168 112 208 110 248 C108 285 108 320 110 355 C112 378 116 400 120 416 L280 416 C284 400 288 378 290 355 C292 320 292 285 290 248 C288 208 285 168 282 138 C262 148 232 155 200 155 C168 155 138 148 118 138 Z"
          fill="url(#tBody)"/>

        {/* NECKLINE - crew */}
        <path d="M118 138 C126 124 140 112 160 106 C173 102 186 100 200 100 C214 100 227 102 240 106 C260 112 274 124 282 138 C262 148 232 155 200 155 C168 155 138 148 118 138 Z"
          fill={color} stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
        {/* Neck rib */}
        <path d="M136 134 C148 124 162 116 178 112 C186 110 193 109 200 109 C207 109 214 110 222 112 C238 116 252 124 264 134"
          stroke="rgba(255,255,255,0.07)" strokeWidth="1" fill="none"/>
        <path d="M138 138 C150 128 164 120 180 116 C187 114 194 113 200 113 C206 113 213 114 220 116 C236 120 250 128 262 138"
          stroke="rgba(255,255,255,0.05)" strokeWidth="1" fill="none"/>

        {/* Body highlight */}
        <path d="M118 142 C115 172 112 212 110 255 L124 255 C124 215 126 176 128 146 Z"
          fill="rgba(255,255,255,0.06)"/>

        {/* Graphic/logo area */}
        <rect x="172" y="220" width="56" height="56" rx="4"
          fill="rgba(0,0,0,0.15)" stroke={sec} strokeWidth="1" strokeOpacity="0.2"/>
        <line x1="172" y1="248" x2="228" y2="248" stroke={sec} strokeWidth="1" strokeOpacity="0.2"/>
        <line x1="200" y1="220" x2="200" y2="276" stroke={sec} strokeWidth="1" strokeOpacity="0.15"/>

        {/* Side seams */}
        <line x1="110" y1="155" x2="110" y2="416" stroke="rgba(0,0,0,0.1)" strokeWidth="1"/>
        <line x1="290" y1="155" x2="290" y2="416" stroke="rgba(0,0,0,0.1)" strokeWidth="1"/>

        {/* HEM */}
        <rect x="110" y="410" width="170" height="6" rx="0" fill="rgba(255,255,255,0.04)"/>
        <path d="M112 416 Q200 412 288 416" stroke="rgba(255,255,255,0.06)" strokeWidth="1" fill="none"/>
      </g>
    </svg>
  )
}

function ShortsSVG({ color, sec, animate }: { color: string; sec: string; animate: boolean }) {
  return (
    <svg viewBox="0 0 400 360" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl">
      <defs>
        <linearGradient id="sBody" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#000" stopOpacity="0.3"/>
          <stop offset="50%" stopColor="#fff" stopOpacity="0.04"/>
          <stop offset="100%" stopColor="#000" stopOpacity="0.2"/>
        </linearGradient>
        <filter id="sshadow">
          <feDropShadow dx="0" dy="8" stdDeviation="10" floodOpacity="0.4"/>
        </filter>
      </defs>
      <style>{`
        @keyframes shortsFloat {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .shorts-group {
          animation: ${animate ? "shortsFloat 1.8s ease-in-out infinite" : "shortsFloat 5s ease-in-out infinite"};
        }
      `}</style>

      <g className="shorts-group" filter="url(#sshadow)">
        <ellipse cx="200" cy="350" rx="92" ry="8" fill="rgba(0,0,0,0.35)"/>

        {/* WAISTBAND */}
        <path d="M110 40 L290 40 L294 82 L106 82 Z"
          fill={color} stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
        {[50,60,70].map((y,i) => (
          <line key={i} x1="108" y1={y} x2="292" y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
        ))}
        {/* Belt loops */}
        {[120,152,178,200,222,248,280].map((x,i) => (
          <rect key={i} x={x-4} y="36" width="8" height="18" rx="1"
            fill="rgba(0,0,0,0.4)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5"/>
        ))}
        <circle cx="200" cy="62" r="6" fill={sec} fillOpacity="0.75" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5"/>
        <circle cx="200" cy="62" r="2.5" fill="rgba(0,0,0,0.4)"/>

        {/* LEFT LEG */}
        <path d="M106 80 C102 115 98 155 96 190 C94 218 94 244 96 264 C98 280 104 292 112 298 L196 298 C198 280 198 250 198 212 C198 178 198 138 200 96 L106 80 Z"
          fill={color} stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
        <path d="M106 80 C102 115 98 155 96 190 C94 218 94 244 96 264 C98 280 104 292 112 298 L196 298 C198 280 198 250 198 212 C198 178 198 138 200 96 L106 80 Z"
          fill="url(#sBody)"/>

        {/* RIGHT LEG */}
        <path d="M294 80 C298 115 302 155 304 190 C306 218 306 244 304 264 C302 280 296 292 288 298 L204 298 C202 280 202 250 202 212 C202 178 202 138 200 96 L294 80 Z"
          fill={color} stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>

        {/* Left pocket */}
        <path d="M112 86 C114 86 126 100 124 118 C123 130 118 136 110 134 L100 128 Z"
          fill="rgba(0,0,0,0.22)" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
        {/* Right pocket */}
        <path d="M288 86 C286 86 274 100 276 118 C277 130 282 136 290 134 L300 128 Z"
          fill="rgba(0,0,0,0.22)" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>

        {/* Leg crease */}
        <path d="M152 84 C148 130 146 180 146 224" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" fill="none"/>
        <path d="M248 84 C252 130 254 180 254 224" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" fill="none"/>

        {/* CUFFS */}
        <path d="M96 284 L196 284 L196 298 L108 298 Z" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>
        <path d="M304 284 L204 284 L204 298 L292 298 Z" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>
        <line x1="98" y1="291" x2="194" y2="291" stroke={sec} strokeWidth="1" strokeOpacity="0.25" strokeDasharray="4 3"/>
        <line x1="302" y1="291" x2="206" y2="291" stroke={sec} strokeWidth="1" strokeOpacity="0.25" strokeDasharray="4 3"/>

        {/* Side stripe */}
        <line x1="96" y1="82" x2="96" y2="284" stroke={sec} strokeWidth="3" strokeOpacity="0.3"/>
        <line x1="304" y1="82" x2="304" y2="284" stroke={sec} strokeWidth="3" strokeOpacity="0.3"/>
      </g>
    </svg>
  )
}

function SkirtSVG({ color, sec, animate }: { color: string; sec: string; animate: boolean }) {
  return (
    <svg viewBox="0 0 400 460" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl">
      <defs>
        <linearGradient id="skBody" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#000" stopOpacity="0.25"/>
          <stop offset="50%" stopColor="#fff" stopOpacity="0.05"/>
          <stop offset="100%" stopColor="#000" stopOpacity="0.3"/>
        </linearGradient>
        <filter id="skshadow">
          <feDropShadow dx="0" dy="10" stdDeviation="12" floodOpacity="0.45"/>
        </filter>
      </defs>
      <style>{`
        @keyframes skirtSway {
          0%,100% { transform: rotate(0deg) skewX(0deg); }
          30% { transform: rotate(0.7deg) skewX(0.3deg); }
          70% { transform: rotate(-0.6deg) skewX(-0.2deg); }
        }
        @keyframes hemWave {
          0%,100% { transform: scaleX(1) translateY(0); }
          50% { transform: scaleX(1.008) translateY(-4px); }
        }
        .skirt-group {
          transform-origin: 200px 230px;
          animation: ${animate ? "skirtSway 2.2s ease-in-out infinite" : "skirtSway 6s ease-in-out infinite"};
        }
        .hem-group {
          transform-origin: 200px 440px;
          animation: ${animate ? "hemWave 2.2s ease-in-out infinite" : "hemWave 6s ease-in-out infinite"};
        }
      `}</style>

      <g className="skirt-group" filter="url(#skshadow)">
        <ellipse cx="200" cy="450" rx="115" ry="10" fill="rgba(0,0,0,0.38)"/>

        {/* WAISTBAND */}
        <path d="M138 38 L262 38 L266 72 L134 72 Z"
          fill={color} stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
        <line x1="136" y1="48" x2="264" y2="48" stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>
        <line x1="135" y1="58" x2="265" y2="58" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
        <circle cx="200" cy="55" r="5" fill={sec} fillOpacity="0.7"/>
        <line x1="200" y1="60" x2="200" y2="74" stroke={sec} strokeWidth="1.5" strokeOpacity="0.5"/>

        {/* SKIRT BODY */}
        <path d="M134 70 C120 110 102 160 86 210 C68 265 52 318 40 368 C32 400 28 424 30 440 L370 440 C372 424 368 400 360 368 C348 318 332 265 314 210 C298 160 280 110 266 70 Z"
          fill={color} stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
        <path d="M134 70 C120 110 102 160 86 210 C68 265 52 318 40 368 C32 400 28 424 30 440 L370 440 C372 424 368 400 360 368 C348 318 332 265 314 210 C298 160 280 110 266 70 Z"
          fill="url(#skBody)"/>

        {/* Skirt folds / pleats */}
        <path d="M200 72 C196 130 190 200 184 268 C180 320 178 374 180 428"
          stroke="rgba(0,0,0,0.18)" strokeWidth="2" fill="none"/>
        <path d="M200 72 C204 130 210 200 216 268 C220 320 222 374 220 428"
          stroke="rgba(0,0,0,0.18)" strokeWidth="2" fill="none"/>
        <path d="M168 74 C158 132 146 202 136 270 C128 324 124 376 124 428"
          stroke="rgba(0,0,0,0.12)" strokeWidth="1.5" fill="none"/>
        <path d="M232 74 C242 132 254 202 264 270 C272 324 276 376 276 428"
          stroke="rgba(0,0,0,0.12)" strokeWidth="1.5" fill="none"/>
        <path d="M148 72 C134 134 118 206 104 276 C92 334 84 386 82 432"
          stroke="rgba(0,0,0,0.08)" strokeWidth="1" fill="none"/>
        <path d="M252 72 C266 134 282 206 296 276 C308 334 316 386 318 432"
          stroke="rgba(0,0,0,0.08)" strokeWidth="1" fill="none"/>

        {/* Highlight */}
        <path d="M134 74 C122 116 106 168 90 220 L106 224 C122 172 138 120 148 78 Z"
          fill="rgba(255,255,255,0.07)"/>

        {/* HEM group */}
        <g className="hem-group">
          <path d="M30 436 Q200 428 370 436 Q200 444 30 436 Z"
            fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5"/>
          <path d="M32 440 Q200 432 368 440" stroke={sec} strokeWidth="1.5" strokeOpacity="0.35" fill="none"/>
          {/* Hem detail */}
          <path d="M32 444 Q200 436 368 444" stroke={sec} strokeWidth="0.8" strokeOpacity="0.15" fill="none"/>
        </g>

        {/* Side zip hint */}
        <path d="M266 70 L268 180" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" strokeDasharray="3 3"/>
      </g>
    </svg>
  )
}

export default function ModelViewer({
  type = "hoodie",
  color = "#1a1a1a",
  secondaryColor = "#c8a96e",
  animate = false
}: ModelViewerProps) {
  const props = { color, sec: secondaryColor, animate }

  const svgMap = {
    hoodie:  <HoodieSVG  {...props} />,
    dress:   <DressSVG   {...props} />,
    jacket:  <JacketSVG  {...props} />,
    pants:   <PantsSVG   {...props} />,
    coat:    <CoatSVG    {...props} />,
    shorts:  <ShortsSVG  {...props} />,
    tee:     <TeeSVG     {...props} />,
    skirt:   <SkirtSVG   {...props} />,
  }

  return (
    <div className="w-full h-full flex items-center justify-center p-3">
      {svgMap[type]}
    </div>
  )
}