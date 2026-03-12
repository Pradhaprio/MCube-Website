import { Link } from 'react-router-dom';
import { RatingStars } from '../shared/RatingStars';
import { useWishlist } from '../../context/WishlistContext';
import { resolveMediaUrl } from '../../lib/media';

function priceText(item) {
  if (item.itemType === 'service') {
    return item.price ? `Starts at Rs.${item.price}` : 'Contact for pricing';
  }
  return `Rs.${item.discountPrice || item.price}`;
}

export function ProductCard({ item }) {
  const { ids, toggleWishlist } = useWishlist();
  const isWishlisted = ids.includes(item.id);

  return (
    <article className="glass-card overflow-hidden">
      <Link to={`/item/${item.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={resolveMediaUrl(item.thumbnailUrl || item.images?.[0])}
            alt={item.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 hover:scale-105"
            onError={(event) => {
              event.currentTarget.src = '/icon-512.svg';
            }}
          />
          <div className="absolute left-3 top-3 flex gap-2">
            {item.featured && <span className="rounded-full bg-brand-700 px-3 py-1 text-xs font-semibold text-white">Featured</span>}
            {item.stockStatus === 'low_stock' && <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white">Low stock</span>}
            {item.itemType === 'service' && <span className="rounded-full bg-slate-900/80 px-3 py-1 text-xs font-semibold text-white">Service</span>}
          </div>
        </div>
      </Link>
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{item.itemType}</p>
            <Link to={`/item/${item.slug}`} className="mt-1 block font-display text-lg font-semibold">
              {item.title}
            </Link>
          </div>
          <button
            type="button"
            onClick={() => toggleWishlist(item.id)}
            className="rounded-full border border-slate-200 p-2 dark:border-slate-700"
            aria-label="Toggle wishlist"
          >
            {isWishlisted ? 'Saved' : 'Save'}
          </button>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-300">{item.shortDescription}</p>
        <RatingStars value={item.averageRating || 0} totalReviews={item.totalReviews || 0} />
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold text-brand-800 dark:text-brand-200">{priceText(item)}</p>
            {item.discountPrice && item.itemType !== 'service' && (
              <p className="text-sm text-slate-400 line-through">Rs.{item.price}</p>
            )}
          </div>
          <Link to={`/item/${item.slug}`} className="btn-secondary px-4 py-2">
            View
          </Link>
        </div>
      </div>
    </article>
  );
}
