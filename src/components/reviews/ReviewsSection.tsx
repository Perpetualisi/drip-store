import { useState } from "react"
import { getProductReviews, getProductRating, getFitBreakdown } from "@/data/reviews"
import StarRating from "./StarRating"
import ReviewCard from "./ReviewCard"

interface ReviewsSectionProps {
  productId: number
}

export default function ReviewsSection({ productId }: ReviewsSectionProps) {
  const reviews = getProductReviews(productId)
  const { average, count } = getProductRating(productId)
  const fitBreakdown = getFitBreakdown(productId)
  const [showAll, setShowAll] = useState(false)
  const [filterRating, setFilterRating] = useState<number | null>(null)
  const [sortBy, setSortBy] = useState<"recent" | "helpful" | "highest" | "lowest">("recent")

  const filtered = reviews
    .filter((r) => filterRating === null || r.rating === filterRating)
    .sort((a, b) => {
      if (sortBy === "helpful") return b.helpful - a.helpful
      if (sortBy === "highest") return b.rating - a.rating
      if (sortBy === "lowest") return a.rating - b.rating
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })

  const visible = showAll ? filtered : filtered.slice(0, 3)

  const ratingBreakdown = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    pct: Math.round((reviews.filter((r) => r.rating === star).length / count) * 100),
  }))

  const fitTotal = Object.values(fitBreakdown).reduce((a, b) => a + b, 0)
  const dominantFit = Object.entries(fitBreakdown).sort((a, b) => b[1] - a[1])[0]?.[0]

  if (count === 0) return null

  return (
    <div className="mt-8 pt-8 border-t border-[#E0E0E0]">

      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#AAAAAA] mb-1">Customer Feedback</p>
          <h3 className="text-2xl font-bold tracking-tighter text-[#333333]">Reviews</h3>
        </div>
        <div className="flex flex-col items-end">
          <StarRating rating={average} size={16} showNumber={true} count={count}/>
          <p className="text-[9px] tracking-widest uppercase text-[#AAAAAA] mt-1">
            Based on {count} review{count !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Summary grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

        {/* Rating breakdown */}
        <div className="bg-white border border-[#E0E0E0] p-4">
          <p className="text-[9px] tracking-widest uppercase text-[#AAAAAA] mb-3">Rating Breakdown</p>
          <div className="space-y-2">
            {ratingBreakdown.map(({ star, count: c, pct }) => (
              <button
                key={star}
                onClick={() => setFilterRating(filterRating === star ? null : star)}
                className={`w-full flex items-center gap-2 group transition-all ${filterRating === star ? "opacity-100" : "opacity-80 hover:opacity-100"}`}
              >
                <span className="text-[10px] text-[#888888] w-4 shrink-0">{star}</span>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" strokeWidth="1.5">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <div className="flex-1 h-1.5 bg-[#F4F4F4] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${filterRating === star ? "bg-[#F59E0B]" : "bg-[#F59E0B]/60"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-[9px] text-[#AAAAAA] w-6 text-right shrink-0">{c}</span>
              </button>
            ))}
          </div>
          {filterRating && (
            <button
              onClick={() => setFilterRating(null)}
              className="mt-3 text-[9px] tracking-widest uppercase text-[#7EC8E3] hover:underline"
            >
              Clear filter
            </button>
          )}
        </div>

        {/* Fit breakdown */}
        <div className="bg-white border border-[#E0E0E0] p-4">
          <p className="text-[9px] tracking-widest uppercase text-[#AAAAAA] mb-3">Fit Feedback</p>
          <div className="space-y-3">
            {Object.entries(fitBreakdown).map(([fit, n]) => {
              const pct = fitTotal > 0 ? Math.round((n / fitTotal) * 100) : 0
              const colors = {
                "Runs Small": "bg-[#7EC8E3]",
                "True to Size": "bg-[#A8E6CF]",
                "Runs Large": "bg-[#C5A3FF]",
              }
              return (
                <div key={fit}>
                  <div className="flex justify-between mb-1">
                    <span className="text-[9px] tracking-widest uppercase text-[#888888]">{fit}</span>
                    <span className="text-[9px] text-[#AAAAAA]">{pct}%</span>
                  </div>
                  <div className="h-1.5 bg-[#F4F4F4] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${colors[fit as keyof typeof colors]}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-3 pt-3 border-t border-[#F4F4F4]">
            <p className="text-[9px] text-[#888888]">
              Most customers say it <span className="font-semibold text-[#333333]">{dominantFit?.toLowerCase()}</span>
            </p>
          </div>
        </div>

        {/* Overall score */}
        <div className="bg-[#333333] text-white p-4 flex flex-col items-center justify-center text-center">
          <p className="text-[9px] tracking-[0.4em] uppercase text-[#AAAAAA] mb-2">Overall Score</p>
          <p className="text-6xl font-black tracking-tighter text-white mb-1">{average}</p>
          <StarRating rating={average} size={14}/>
          <p className="text-[9px] tracking-widest uppercase text-[#AAAAAA] mt-2">
            {count} verified review{count !== 1 ? "s" : ""}
          </p>
          <div className="mt-3 pt-3 border-t border-[#555555] w-full">
            <p className="text-[9px] text-[#AAAAAA]">
              {Math.round(reviews.filter(r => r.rating >= 4).length / count * 100)}% recommend this
            </p>
          </div>
        </div>
      </div>

      {/* Sort bar */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-[10px] tracking-widest uppercase text-[#AAAAAA]">
          {filtered.length} review{filtered.length !== 1 ? "s" : ""}
          {filterRating && ` — ${filterRating} star`}
        </p>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="bg-white border border-[#E0E0E0] text-[#888888] text-[10px] tracking-widest uppercase px-3 py-1.5 outline-none hover:border-[#333333] cursor-pointer"
        >
          <option value="recent">Most Recent</option>
          <option value="helpful">Most Helpful</option>
          <option value="highest">Highest Rated</option>
          <option value="lowest">Lowest Rated</option>
        </select>
      </div>

      {/* Review cards */}
      <div className="space-y-3 mb-4">
        {visible.map((review) => (
          <ReviewCard key={review.id} review={review}/>
        ))}
      </div>

      {/* Load more */}
      {filtered.length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full py-3 border border-[#E0E0E0] text-[10px] tracking-widest uppercase text-[#888888] hover:border-[#333333] hover:text-[#333333] transition-all bg-white"
        >
          {showAll ? "Show Less" : `Show All ${filtered.length} Reviews`}
        </button>
      )}
    </div>
  )
}