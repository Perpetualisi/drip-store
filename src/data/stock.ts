// Seeded stock levels — consistent per product
function seededRandom(seed: number) {
  const x = Math.sin(seed * 127.1) * 43758.5453
  return x - Math.floor(x)
}

export type StockLevel = "in_stock" | "low_stock" | "very_low" | "last_one" | "sold_out"

export interface ProductStock {
  productId: number
  quantity: number
  level: StockLevel
  label: string
  urgent: boolean
}

export function getProductStock(productId: number): ProductStock {
  const raw = seededRandom(productId * 31)
  
  // Distribution: 15% sold out, 10% last one, 20% very low, 25% low, 30% in stock
  let quantity: number
  let level: StockLevel
  
  if (raw < 0.08) {
    quantity = 0
    level = "sold_out"
  } else if (raw < 0.16) {
    quantity = 1
    level = "last_one"
  } else if (raw < 0.36) {
    quantity = Math.floor(seededRandom(productId * 17) * 4) + 2  // 2-5
    level = "very_low"
  } else if (raw < 0.62) {
    quantity = Math.floor(seededRandom(productId * 23) * 8) + 6  // 6-13
    level = "low_stock"
  } else {
    quantity = Math.floor(seededRandom(productId * 41) * 30) + 14 // 14-43
    level = "in_stock"
  }

  const label =
    level === "sold_out"  ? "Sold Out" :
    level === "last_one"  ? "Last One!" :
    level === "very_low"  ? `Only ${quantity} left!` :
    level === "low_stock" ? `${quantity} in stock` :
                            "In Stock"

  const urgent = level === "last_one" || level === "very_low" || level === "sold_out"

  return { productId, quantity, level, label, urgent }
}

export function getViewerCount(productId: number): number {
  // Seeded "people viewing" count — between 3 and 24
  return Math.floor(seededRandom(productId * 53 + Date.now() / 300000) * 21) + 3
}