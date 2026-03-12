export function RatingStars({ value = 0, totalReviews = 0 }) {
  return (
    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-300">
      <div className="flex items-center gap-1 text-amber-400">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star}>{star <= Math.round(value) ? '*' : '-'}</span>
        ))}
      </div>
      <span>{value.toFixed ? value.toFixed(1) : value}</span>
      <span>({totalReviews})</span>
    </div>
  );
}
