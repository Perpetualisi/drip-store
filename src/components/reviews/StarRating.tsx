interface StarRatingProps {
  rating: number
  size?: number
  showNumber?: boolean
  count?: number
}

export default function StarRating({ rating, size = 12, showNumber = false, count }: StarRatingProps) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={star <= Math.round(rating) ? "#F59E0B" : "none"}
            stroke={star <= Math.round(rating) ? "#F59E0B" : "#D1D5DB"}
            strokeWidth="1.5"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        ))}
      </div>
      {showNumber && (
        <span className="text-[10px] text-[#888888] tracking-wide">
          {rating.toFixed(1)} {count !== undefined && `(${count})`}
        </span>
      )}
    </div>
  )
}