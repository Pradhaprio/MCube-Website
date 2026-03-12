import { useEffect, useMemo, useState } from 'react';
import { resolveMediaUrl } from '../../lib/media';

const emptyItem = {
  itemType: 'mobile',
  title: '',
  slug: '',
  shortDescription: '',
  fullDescription: '',
  price: '',
  discountPrice: '',
  currency: 'INR',
  categoryId: '',
  subcategoryId: '',
  tags: '',
  stockQuantity: '',
  stockStatus: 'in_stock',
  featured: false,
  pinned: false,
  images: [],
  thumbnailUrl: '',
  specs: '',
  serviceDurationMinutes: '',
  serviceMode: 'in_store',
  warrantyDays: '',
  appointmentRequired: false
};

function toFormValue(initialValue) {
  return {
    ...emptyItem,
    ...initialValue,
    tags: Array.isArray(initialValue?.tags) ? initialValue.tags.join(', ') : '',
    specs: Array.isArray(initialValue?.specs) ? initialValue.specs.join(', ') : '',
    serviceDurationMinutes: initialValue?.serviceDetails?.serviceDurationMinutes ?? '',
    serviceMode: initialValue?.serviceDetails?.serviceMode || emptyItem.serviceMode,
    warrantyDays: initialValue?.serviceDetails?.warrantyDays ?? '',
    appointmentRequired: initialValue?.serviceDetails?.appointmentRequired ?? false
  };
}

export function ItemForm({ categories = [], initialValue, onSubmit, onUploadImages, loading }) {
  const [form, setForm] = useState(() => toFormValue(initialValue));

  const topCategories = categories.filter((category) => !category.parentId);
  useEffect(() => {
    if (!initialValue) return;
    setForm(toFormValue(initialValue));
  }, [initialValue]);

  const subcategories = useMemo(
    () => categories.filter((category) => category.parentId === form.categoryId),
    [categories, form.categoryId]
  );

  const submit = () => {
    onSubmit({
      ...form,
      tags: form.tags.split(',').map((entry) => entry.trim()).filter(Boolean),
      specs: form.specs.split(',').map((entry) => entry.trim()).filter(Boolean),
      serviceDetails:
        form.itemType === 'service'
          ? {
              serviceDurationMinutes: Number(form.serviceDurationMinutes || 0),
              serviceMode: form.serviceMode,
              warrantyDays: Number(form.warrantyDays || 0),
              appointmentRequired: form.appointmentRequired
            }
          : undefined
    });
  };

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length || !onUploadImages) return;
    const urls = await onUploadImages(files);
    setForm((current) => ({
      ...current,
      images: [...current.images, ...urls],
      thumbnailUrl: current.thumbnailUrl || urls[0] || ''
    }));
  };

  return (
    <div className="glass-card p-5">
      <div className="grid gap-4 md:grid-cols-2">
        <select value={form.itemType} onChange={(e) => setForm((c) => ({ ...c, itemType: e.target.value }))} className="field">
          <option value="mobile">Mobile</option>
          <option value="accessory">Accessory</option>
          <option value="service">Service</option>
        </select>
        <input value={form.title} onChange={(e) => setForm((c) => ({ ...c, title: e.target.value }))} className="field" placeholder="Title" />
        <input value={form.slug} onChange={(e) => setForm((c) => ({ ...c, slug: e.target.value }))} className="field" placeholder="Slug" />
        <select value={form.categoryId} onChange={(e) => setForm((c) => ({ ...c, categoryId: e.target.value }))} className="field">
          <option value="">Select category</option>
          {topCategories.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
        <select value={form.subcategoryId} onChange={(e) => setForm((c) => ({ ...c, subcategoryId: e.target.value }))} className="field">
          <option value="">Select subcategory</option>
          {subcategories.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
        <input value={form.price} onChange={(e) => setForm((c) => ({ ...c, price: e.target.value }))} className="field" placeholder="Price" />
        <input value={form.discountPrice} onChange={(e) => setForm((c) => ({ ...c, discountPrice: e.target.value }))} className="field" placeholder="Discount price" />
        <input value={form.stockQuantity} onChange={(e) => setForm((c) => ({ ...c, stockQuantity: e.target.value }))} className="field" placeholder="Stock quantity" />
        <select value={form.stockStatus} onChange={(e) => setForm((c) => ({ ...c, stockStatus: e.target.value }))} className="field">
          <option value="in_stock">In stock</option>
          <option value="low_stock">Low stock</option>
          <option value="out_of_stock">Out of stock</option>
          <option value="service_available">Service available</option>
        </select>
      </div>
      <div className="mt-4 grid gap-4">
        <div className="rounded-3xl border border-dashed border-slate-300 p-4 dark:border-slate-700">
          <label className="btn-secondary cursor-pointer">
            Upload images
            <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileUpload} />
          </label>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {form.images.map((image) => (
              <img key={image} src={resolveMediaUrl(image)} alt="" className="h-24 w-full rounded-2xl object-cover" />
            ))}
          </div>
        </div>
        <input value={form.tags} onChange={(e) => setForm((c) => ({ ...c, tags: e.target.value }))} className="field" placeholder="Tags comma separated" />
        <input value={form.specs} onChange={(e) => setForm((c) => ({ ...c, specs: e.target.value }))} className="field" placeholder="Specs comma separated" />
        <input value={form.thumbnailUrl} onChange={(e) => setForm((c) => ({ ...c, thumbnailUrl: e.target.value }))} className="field" placeholder="Thumbnail URL" />
        <textarea value={form.shortDescription} onChange={(e) => setForm((c) => ({ ...c, shortDescription: e.target.value }))} className="textarea" placeholder="Short description" />
        <textarea value={form.fullDescription} onChange={(e) => setForm((c) => ({ ...c, fullDescription: e.target.value }))} className="textarea" placeholder="Full description" />
      </div>
      {form.itemType === 'service' && (
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <input value={form.serviceDurationMinutes} onChange={(e) => setForm((c) => ({ ...c, serviceDurationMinutes: e.target.value }))} className="field" placeholder="Duration minutes" />
          <input value={form.warrantyDays} onChange={(e) => setForm((c) => ({ ...c, warrantyDays: e.target.value }))} className="field" placeholder="Warranty days" />
          <select value={form.serviceMode} onChange={(e) => setForm((c) => ({ ...c, serviceMode: e.target.value }))} className="field">
            <option value="in_store">In store</option>
            <option value="pickup">Pickup</option>
            <option value="onsite">On site</option>
          </select>
        </div>
      )}
      <div className="mt-4 flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.featured} onChange={(e) => setForm((c) => ({ ...c, featured: e.target.checked }))} />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.pinned} onChange={(e) => setForm((c) => ({ ...c, pinned: e.target.checked }))} />
          Pinned
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.appointmentRequired} onChange={(e) => setForm((c) => ({ ...c, appointmentRequired: e.target.checked }))} />
          Appointment required
        </label>
      </div>
      <div className="mt-6">
        <button type="button" onClick={submit} className="btn-primary" disabled={loading}>
          {loading ? 'Saving...' : 'Save item'}
        </button>
      </div>
    </div>
  );
}
