export interface Review {
  id: number
  productId: number
  name: string
  avatar: string
  rating: number
  date: string
  title: string
  body: string
  size: string
  fit: "Runs Small" | "True to Size" | "Runs Large"
  verified: boolean
  helpful: number
}

const firstNames = ["Amara", "Zoe", "Lila", "Sofia", "Maya", "Jade", "Nia", "Chloe", "Ava", "Luna", "Kai", "Mia", "Isla", "Nova", "Aria", "Sage", "Ivy", "Zara", "Elle", "Nora"]
const lastInitials = ["A.", "B.", "C.", "D.", "E.", "F.", "G.", "H.", "J.", "K.", "L.", "M.", "N.", "O.", "P.", "R.", "S.", "T.", "W.", "Y."]
const fits: Review["fit"][] = ["Runs Small", "True to Size", "Runs Large"]
const sizes = ["XS", "S", "M", "L", "XL"]

const reviewBodies = [
  "Absolutely obsessed with this piece! The quality is incredible and it looks even better in person. I've gotten so many compliments already.",
  "The fabric feels so premium — soft yet structured. Fits perfectly and the color is exactly as shown. Will definitely be ordering more.",
  "I was a bit nervous ordering online but this exceeded all my expectations. The material quality is top notch and the fit is perfect.",
  "This is my third purchase from Drip and they never disappoint. The attention to detail on this piece is amazing.",
  "Stunning quality for the price. The stitching is immaculate and the color hasn't faded after multiple washes.",
  "Delivered fast and packaged beautifully. The item itself is gorgeous — looks exactly like the 3D preview which is amazing!",
  "Perfect for both casual and dressed up occasions. I love how versatile this is. The color is rich and vibrant.",
  "I bought this as a gift and the recipient absolutely loved it. The quality feels very high-end and premium.",
  "The fit is chef's kiss! I usually struggle to find clothes that fit my body type but this is perfect.",
  "Worth every penny. The fabric has a beautiful drape and the construction is really solid. Very happy.",
  "Exceeded my expectations in every way. The 3D preview feature helped me pick the right color — genius idea!",
  "I wear this almost every day. It washes beautifully and hasn't lost its shape at all. Love it!",
  "The color is so rich and the material feels luxurious. I get compliments every time I wear it.",
  "Sizing was spot on — went with my usual size based on the guide and it fits perfectly.",
  "Really impressed with the build quality. The seams are clean and the fabric feels expensive.",
]

const reviewTitles = [
  "Absolutely love this!", "Better than expected!", "Premium quality 🔥",
  "My new favorite piece", "Worth every penny", "Stunning quality",
  "Perfect fit!", "Love the color", "Amazing piece", "Super impressed",
  "10/10 would recommend", "Obsessed with this", "Great purchase",
  "Exceeded expectations", "Love love love",
]

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

function generateReviewsForProduct(productId: number): Review[] {
  const count = 3 + Math.floor(seededRandom(productId * 7) * 4) // 3-6 reviews
  const reviews: Review[] = []

  for (let i = 0; i < count; i++) {
    const seed = productId * 100 + i * 13
    const nameIdx = Math.floor(seededRandom(seed) * firstNames.length)
    const lastIdx = Math.floor(seededRandom(seed + 1) * lastInitials.length)
    const ratingRaw = seededRandom(seed + 2)
    const rating = ratingRaw > 0.15 ? 5 : ratingRaw > 0.05 ? 4 : 3
    const bodyIdx = Math.floor(seededRandom(seed + 3) * reviewBodies.length)
    const titleIdx = Math.floor(seededRandom(seed + 4) * reviewTitles.length)
    const fitIdx = Math.floor(seededRandom(seed + 5) * fits.length)
    const sizeIdx = Math.floor(seededRandom(seed + 6) * sizes.length)
    const helpful = Math.floor(seededRandom(seed + 7) * 48)
    const daysAgo = Math.floor(seededRandom(seed + 8) * 180) + 1
    const date = new Date(Date.now() - daysAgo * 86400000)
    const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    const verified = seededRandom(seed + 9) > 0.15

    reviews.push({
      id: productId * 1000 + i,
      productId,
      name: `${firstNames[nameIdx]} ${lastInitials[lastIdx]}`,
      avatar: firstNames[nameIdx].charAt(0) + lastInitials[lastIdx].charAt(0),
      rating,
      date: dateStr,
      title: reviewTitles[titleIdx],
      body: reviewBodies[bodyIdx],
      size: sizes[sizeIdx],
      fit: fits[fitIdx],
      verified,
      helpful,
    })
  }

  return reviews
}

// Generate reviews for all 40 products
export const allReviews: Review[] = Array.from({ length: 40 }, (_, i) =>
  generateReviewsForProduct(i + 1)
).flat()

export function getProductReviews(productId: number): Review[] {
  return allReviews.filter((r) => r.productId === productId)
}

export function getProductRating(productId: number): { average: number; count: number } {
  const reviews = getProductReviews(productId)
  if (reviews.length === 0) return { average: 0, count: 0 }
  const average = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  return { average: Math.round(average * 10) / 10, count: reviews.length }
}

export function getFitBreakdown(productId: number): Record<string, number> {
  const reviews = getProductReviews(productId)
  const breakdown: Record<string, number> = {
    "Runs Small": 0,
    "True to Size": 0,
    "Runs Large": 0,
  }
  reviews.forEach((r) => breakdown[r.fit]++)
  return breakdown
}