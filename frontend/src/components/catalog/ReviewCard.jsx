import { RatingStars } from '../shared/RatingStars';

export function ReviewCard({ review }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h4 className="font-display text-lg font-semibold">{review.title || review.reviewerName}</h4>
          <p className="text-sm text-slate-500 dark:text-slate-300">{review.reviewerName}</p>
        </div>
        <RatingStars value={review.rating} totalReviews={1} />
      </div>
      <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">{review.comment}</p>
    </article>
  );
}
