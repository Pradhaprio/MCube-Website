import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';
import { ProductCard } from '../components/catalog/ProductCard';
import { EmptyState } from '../components/shared/EmptyState';
import { LoadingCard } from '../components/shared/LoadingCard';
import { SearchBar } from '../components/shared/SearchBar';

export function CatalogPage({ itemType, title }) {
  const [data, setData] = useState({ items: [], categories: [] });
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('featured');
  const [price, setPrice] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const categoryQuery = selectedCategory ? `&category=${selectedCategory}` : '';
    api.get(`/catalog?itemType=${itemType}&sort=${sort}&q=${encodeURIComponent(query)}${categoryQuery}`).then(setData).finally(() => setLoading(false));
  }, [itemType, sort, query, selectedCategory]);

  const filteredItems = useMemo(() => {
    if (price === 'all') return data.items;
    const [min, max] = price.split('-').map(Number);
    return data.items.filter((item) => {
      const current = item.discountPrice || item.price || 0;
      return current >= min && current <= max;
    });
  }, [data.items, price]);

  return (
    <div className="container-shell py-8">
      <div className="glass-card mb-6 p-5">
        <div className="grid gap-4 md:grid-cols-[1.4fr_0.8fr_0.8fr]">
          <SearchBar value={query} onChange={setQuery} placeholder={`Search ${title.toLowerCase()}...`} />
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="field">
            <option value="featured">Featured first</option>
            <option value="newest">Newest</option>
            <option value="price_asc">Price low to high</option>
            <option value="price_desc">Price high to low</option>
            <option value="rating">Top rated</option>
          </select>
          <select value={price} onChange={(e) => setPrice(e.target.value)} className="field">
            <option value="all">All prices</option>
            <option value="0-1000">Under Rs.1000</option>
            <option value="1000-5000">Rs.1000 - Rs.5000</option>
            <option value="5000-20000">Rs.5000 - Rs.20000</option>
            <option value="20000-100000">Rs.20000+</option>
          </select>
        </div>
      </div>
      <div className="mb-5">
        <h1 className="section-title">{title}</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">
          Browse {title.toLowerCase()} without login and enquire only when you want the shop to contact you.
        </p>
        <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setSelectedCategory('')}
            className={`rounded-full px-4 py-2 text-sm font-medium ${selectedCategory ? 'bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-300' : 'bg-brand-100 text-brand-800 dark:bg-brand-900/40 dark:text-brand-200'}`}
          >
            All
          </button>
          {data.categories
            .filter((category) => category.parentId && data.items.some((item) => item.subcategoryId === category.id || item.categoryId === category.id))
            .map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setSelectedCategory(category.id)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium ${selectedCategory === category.id ? 'bg-brand-100 text-brand-800 dark:bg-brand-900/40 dark:text-brand-200' : 'bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-300'}`}
              >
                {category.name}
              </button>
            ))}
        </div>
      </div>
      {loading ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }).map((_, index) => <LoadingCard key={index} />)}</div>
      ) : filteredItems.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredItems.map((item) => <ProductCard key={item.id} item={item} />)}
        </div>
      ) : (
        <EmptyState title={`No ${title.toLowerCase()} matched`} description="Try a different search or price range." />
      )}
    </div>
  );
}
