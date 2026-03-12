import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export function ReviewsPage() {
  const { token } = useAuth();
  const { pushToast } = useToast();
  const [reviews, setReviews] = useState([]);

  const load = () => api.get('/reviews').then((data) => setReviews(data.reviews));

  useEffect(() => {
    load();
  }, []);

  const updateReview = async (review) => {
    await api.put(`/reviews/${review.id}`, { isPublished: !review.isPublished }, token);
    pushToast({ message: 'Review updated.', tone: 'success' });
    load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="section-title">Manage reviews</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">Publish or hide reviews shown on public product and service pages.</p>
      </div>
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="glass-card flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-semibold">{review.title || review.reviewerName}</p>
              <p className="text-sm text-slate-500 dark:text-slate-300">{review.comment}</p>
            </div>
            <button type="button" onClick={() => updateReview(review)} className="btn-secondary">
              {review.isPublished ? 'Hide' : 'Publish'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
