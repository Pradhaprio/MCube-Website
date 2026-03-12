import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { ProductCard } from '../components/catalog/ProductCard';
import { LoadingCard } from '../components/shared/LoadingCard';

export function HomePage({ profile }) {
  const [catalog, setCatalog] = useState({ featured: [], trending: [], items: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/catalog').then(setCatalog).finally(() => setLoading(false));
  }, []);

  const services = catalog.items.filter((item) => item.itemType === 'service').slice(0, 3);

  return (
    <div>
      <section className="container-shell pt-6">
        <div className="overflow-hidden rounded-[2rem] bg-hero p-6 text-white shadow-lift md:p-10">
          <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/70">M-Cube Mobile</p>
              <h1 className="mt-4 font-display text-4xl font-semibold leading-tight md:text-6xl">
                Mobiles, accessories, and service support in one local store.
              </h1>
              <p className="mt-5 max-w-xl text-sm text-white/80 md:text-base">
                Browse without login, compare products on mobile, and share your number only when you want a callback or enquiry.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/mobiles" className="rounded-2xl bg-white px-5 py-3 font-semibold text-brand-900">Buy Mobiles</Link>
                <Link to="/accessories" className="rounded-2xl border border-white/30 px-5 py-3 font-semibold text-white">Shop Accessories</Link>
                <Link to="/services" className="rounded-2xl border border-white/30 px-5 py-3 font-semibold text-white">Book Service</Link>
              </div>
            </div>
            <div className="grid gap-4">
              {[
                ['Shop status', profile?.isOpen ? 'Open now' : 'Closed now'],
                ['Phone', profile?.phone || '+91 98765 43210'],
                ['WhatsApp', profile?.whatsappNumber || '919876543210']
              ].map(([label, value]) => (
                <div key={label} className="rounded-3xl bg-white/12 p-5 backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/60">{label}</p>
                  <p className="mt-2 font-display text-2xl font-semibold">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell py-8">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ['Mobile sales', 'Latest models, budget phones, and top-rated 5G options.'],
            ['Accessories', 'Original chargers, cases, audio gear, and daily-use add-ons.'],
            ['All kinds of service', 'Screen, battery, software, diagnostics, and repair support.']
          ].map(([title, text]) => (
            <div key={title} className="glass-card p-6">
              <h2 className="font-display text-2xl font-semibold">{title}</h2>
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-300">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-shell py-8">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="section-title">Featured picks</h2>
          <Link to="/mobiles" className="text-sm font-semibold text-brand-700">Browse all</Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {loading ? Array.from({ length: 3 }).map((_, index) => <LoadingCard key={index} />) : catalog.featured.map((item) => <ProductCard key={item.id} item={item} />)}
        </div>
      </section>

      <section className="container-shell py-8">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="section-title">Popular services</h2>
          <Link to="/services" className="text-sm font-semibold text-brand-700">View services</Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {services.map((item) => <ProductCard key={item.id} item={item} />)}
        </div>
      </section>

      <section className="container-shell py-8">
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="glass-card p-6">
            <h2 className="section-title">Frequently asked</h2>
            <div className="mt-5 space-y-4">
              {[
                ['Can I browse without login?', 'Yes. Visitors can browse all pages without creating an account.'],
                ['When is my phone number collected?', 'Only when you submit a visible callback or enquiry form with consent.'],
                ['Do you handle all types of mobile service?', 'Yes. Screen, battery, software, charging, and diagnostics are supported.']
              ].map(([question, answer]) => (
                <div key={question} className="rounded-2xl bg-slate-100 p-4 dark:bg-slate-900">
                  <h3 className="font-semibold">{question}</h3>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">{answer}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="glass-card p-6">
            <h2 className="section-title">Why locals choose us</h2>
            <div className="mt-5 space-y-4 text-sm text-slate-500 dark:text-slate-300">
              <p>Transparent enquiry flow with clear consent before any phone call back.</p>
              <p>Mobile-first browsing with WhatsApp, call, and callback actions placed within thumb reach.</p>
              <p>One store for mobile purchase, genuine accessories, and all common repair needs.</p>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-brand-50 p-4 dark:bg-brand-950/30">
                <p className="font-display text-2xl font-semibold text-brand-800 dark:text-brand-200">4.7/5</p>
                <p className="mt-1 text-sm">Average rating across products and services</p>
              </div>
              <div className="rounded-2xl bg-accent-50 p-4 dark:bg-accent-950/30">
                <p className="font-display text-2xl font-semibold text-accent-800 dark:text-accent-200">Same day</p>
                <p className="mt-1 text-sm">Support available for common service jobs</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell py-8">
        <h2 className="section-title">Customer voices</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {[
            'Bought my phone and accessories in one visit. The staff explained the differences clearly.',
            'Screen replacement was quick and the callback came only after I submitted the form myself.',
            'Good local option for chargers, neckbands, and software clean-up support.'
          ].map((quote) => (
            <div key={quote} className="glass-card p-5 text-sm text-slate-600 dark:text-slate-300">
              {quote}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
