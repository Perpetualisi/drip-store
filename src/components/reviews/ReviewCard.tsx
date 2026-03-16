import type { Review } from "@/data/reviews"
import StarRating from "./StarRating"

interface ReviewCardProps {
  review: Review
  compact?: boolean
}

export default function ReviewCard({ review, compact = false }: ReviewCardProps) {
  const fitColors = {
    "Runs Small": "text-[#7EC8E3] bg-[#E8F8FC]",
    "True to Size": "text-[#A8E6CF] bg-[#F0FAF5]",
    "Runs Large": "text-[#C5A3FF] bg-[#F5F0FF]",
  }

  return (
    <div className={`bg-white border border-[#E0E0E0] ${compact ? "p-3" : "p-5"}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-[#333333] flex items-center justify-center shrink-0">
            <span className="text-[10px] font-bold text-white tracking-wide">{review.avatar}</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-semibold text-[#333333]">{review.name}</p>
              {review.verified && (
                <div className="flex items-center gap-0.5 bg-[#F0FAF5] px-1.5 py-0.5 rounded-full">
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#A8E6CF" strokeWidth="2.5">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                  <span className="text-[8px] tracking-widest uppercase text-[#A8E6CF] font-medium">Verified</span>
                </div>
              )}
            </div>
            <p className="text-[9px] text-[#AAAAAA] tracking-wide">{review.date}</p>
          </div>
        </div>
        <StarRating rating={review.rating} size={11}/>
      </div>

      {/* Title */}
      <p className="text-xs font-semibold text-[#333333] mb-1.5">{review.title}</p>

      {/* Body */}
      {!compact && (
        <p className="text-xs text-[#888888] leading-relaxed mb-3">{review.body}</p>
      )}

      {/* Tags */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[9px] tracking-widest uppercase border border-[#E0E0E0] text-[#888888] px-2 py-0.5">
          Size {review.size}
        </span>
        <span className={`text-[9px] tracking-widest uppercase px-2 py-0.5 ${fitColors[review.fit]}`}>
          {review.fit}
        </span>
        {!compact && (
          <span className="text-[9px] text-[#AAAAAA] ml-auto">
            👍 {review.helpful} found helpful
          </span>
        )}
      </div>
    </div>
  )
}