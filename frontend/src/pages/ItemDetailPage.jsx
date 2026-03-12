import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api/client';
import { ProductCard } from '../components/catalog/ProductCard';
import { ProductGallery } from '../components/catalog/ProductGallery';
import { ReviewCard } from '../components/catalog/ReviewCard';
import { StickyActionBar } from '../components/catalog/StickyActionBar';
import { InterestSheet } from '../components/forms/InterestSheet';
import { RatingStars } from '../components/shared/RatingStars';
import { useToast } from '../context/ToastContext';
import { getRecentlyViewed, getSessionId, rememberViewedItem } from '../lib/session';

export function ItemDetailPage({ profile }) {
  const { slug } = useParams();
  const { pushToast } = useToast();
  const [data, setData] = useState(null);
  const [sheetMode, setSheetMode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [reviewSort, setReviewSort] = useState('latest');

  useEffect(() => {
    api.get(`/catalog/${slug}`).then((payload) => {
      setData(payload);
      rememberViewedItem(payload.item);
      api.post('/analytics/events', {
        sessionId: getSessionId(),
        eventType: 'product_view',
        viewedCatalogItemId: payload.item.id,
        pagePath: `/item/${payload.item.slug}`,
        sourcePage: `/item/${payload.item.slug}`
      }).catch(() => undefined);
    });
  }, [slug]);

  const sortedReviews = useMemo(() => {
    if (!data) return [];
    return [...data.reviews].sort((a, b) =>
      reviewSort === 'rating' ? b.rating - a.rating : new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [data, reviewSort]);

  if (!data) {
    return <div className="container-shell py-20 text-center text-sm text-slate-500">Loading item...</div>;
  }

  const { item, related } = data;
  const recentlyViewed = getRecentlyViewed().filter((entry) => entry.id !== item.id).slice(0, 4);
  const whatsappText = encodeURIComponent(`Hi, I am interested in ${item.title}. Please share more details.`);
  const shareItem = async () => {
    const shareData = {
      title: item.title,
      text: `Check out ${item.title} at M-Cube Mobile`,
      url: window.location.href
    };
    if (navigator.share) {
      await navigator.share(shareData);
      return;
    }
    await navigator.clipboard.writeText(window.location.href);
    pushToast({ message: 'Link copied.', tone: 'success' });
  };

  const trackIntent = async (eventType, ctaClicked) => {
    await api.post('/analytics/events', {
      sessionId: getSessionId(),
      eventType,
      viewedCatalogItemId: item.id,
      pagePath: `/item/${item.slug}`,
      sourcePage: `/item/${item.slug}`,
      ctaClicked
    });
  };

  const handleLeadSubmit = async (payload) => {
    setSubmitting(true);
    try {
      await api.post('/leads', { ...payload, sessionId: getSessionId() });
      pushToast({ message: 'Your request has been sent.', tone: 'success' });
      await api.post('/analytics/events', {
        sessionId: getSessionId(),
        eventType: 'enquiry_success',
        viewedCatalogItemId: item.id,
        pagePath: `/item/${item.slug}`,
        sourcePage: `/item/${item.slug}`,
        ctaClicked: payload.contactMethodPreference
      });
      setSheetMode('');
    } catch (error) {
      pushToast({ message: error.message, tone: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="container-shell py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr]">
          <ProductGallery images={item.images} title={item.title} />
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              {item.featured && <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-800 dark:bg-brand-900/40 dark:text-brand-200">Featured</span>}
              {item.stockStatus === 'low_stock' && <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">Low stock</span>}
              {item.stockStatus === 'out_of_stock' && <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-800">Out of stock</span>}
              {item.itemType === 'service' && <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">Service</span>}
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">{item.itemType}</p>
              <h1 className="mt-2 font-display text-4xl font-semibold">{item.title}</h1>
            </div>
            <RatingStars value={item.averageRating} totalReviews={item.totalReviews} />
            <div className="rounded-3xl bg-slate-100 p-5 dark:bg-slate-900">
              <p className="text-3xl font-semibold text-brand-800 dark:text-brand-200">
                {item.itemType === 'service' ? `Starts at Rs.${item.price || '0'}` : `Rs.${item.discountPrice || item.price}`}
              </p>
              {item.discountPrice && item.itemType !== 'service' && (
                <p className="mt-1 text-sm text-slate-400 line-through">Rs.{item.price}</p>
              )}
            </div>
            <button type="button" onClick={shareItem} className="btn-secondary">
              Share item
            </button>
            <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">{item.fullDescription}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {item.specs?.map((spec) => (
                <div key={spec} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm dark:border-slate-800">
                  {spec}
                </div>
              ))}
            </div>
            {item.serviceDetails && (
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-brand-50 p-4 text-sm dark:bg-brand-950/30">
                  Duration: {item.serviceDetails.serviceDurationMinutes} mins
                </div>
                <div className="rounded-2xl bg-brand-50 p-4 text-sm dark:bg-brand-950/30">
                  Mode: {item.serviceDetails.serviceMode}
                </div>
                <div className="rounded-2xl bg-brand-50 p-4 text-sm dark:bg-brand-950/30">
                  Warranty: {item.serviceDetails.warrantyDays} days
                </div>
              </div>
            )}
          </div>
        </div>

        <section className="mt-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="glass-card p-6">
            <h2 className="section-title">Privacy-safe interest actions</h2>
            <div className="mt-5 space-y-4 text-sm text-slate-600 dark:text-slate-300">
              <p>WhatsApp and Call open direct actions without sending your phone number to the site.</p>
              <p>Callback and Enquiry ask for your phone number only inside a visible form with consent.</p>
              <p>The exact item that triggered your request is stored with the lead so the shop owner knows what you asked about.</p>
            </div>
          </div>
          <div className="glass-card p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="section-title">Reviews</h2>
              <select value={reviewSort} onChange={(e) => setReviewSort(e.target.value)} className="field h-10 w-40">
                <option value="latest">Latest</option>
                <option value="rating">Top rated</option>
              </select>
            </div>
            <div className="space-y-4">
              {sortedReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="section-title">Related items</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {related.map((relatedItem) => (
              <ProductCard key={relatedItem.id} item={relatedItem} />
            ))}
          </div>
        </section>

        {recentlyViewed.length > 0 && (
          <section className="mt-12">
            <h2 className="section-title">Recently viewed</h2>
            <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {recentlyViewed.map((recent) => (
                <ProductCard key={recent.id} item={recent} />
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="fixed bottom-40 right-4 z-30 flex flex-col gap-3 lg:bottom-24">
        <a
          href={`https://wa.me/${profile?.whatsappNumber || ''}?text=${whatsappText}`}
          target="_blank"
          rel="noreferrer"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-2xl text-white shadow-lift"
          onClick={() => trackIntent('whatsapp_intent', 'whatsapp')}
        >
          WA
        </a>
        <button type="button" onClick={() => setSheetMode('callback')} className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-500 text-xl text-white shadow-lift">
          CB
        </button>
      </div>

      <StickyActionBar
        onCallback={() => setSheetMode('callback')}
        onEnquiry={() => setSheetMode('enquiry')}
        onWhatsapp={async () => {
          await trackIntent('whatsapp_intent', 'whatsapp').catch(() => undefined);
          window.open(`https://wa.me/${profile?.whatsappNumber || ''}?text=${whatsappText}`, '_blank', 'noopener,noreferrer');
        }}
        onCall={async () => {
          await trackIntent('call_intent', 'call').catch(() => undefined);
          window.location.href = `tel:${profile?.phone || ''}`;
        }}
      />

      <InterestSheet
        open={Boolean(sheetMode)}
        mode={sheetMode}
        item={item}
        onClose={() => setSheetMode('')}
        onSubmit={handleLeadSubmit}
        loading={submitting}
      />
    </>
  );
}
